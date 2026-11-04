/**
 * UBICACIÓN de un formulario: latitud y longitud a mano y mapa de Google, sincronizados entre sí.
 *   <LocationPicker apiKey={key} latitude={data.latitude} longitude={data.longitude}
 *       onChange={(latitude, longitude) => setData({ ...data, latitude, longitude })} />
 * Sin API key sigue funcionando: se ocultan el mapa y solo quedan las coordenadas.
 */
import { GoogleMap, type MapPosition } from '@/components/admin/common/google-map';
import InputError from '@/components/shared/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle, LocateFixed, X } from 'lucide-react';
import { useState } from 'react';

/** Posición para el mapa, o null si falta un dato o está fuera de rango. */
export function toMapPosition(latitude: string | null, longitude: string | null): MapPosition | null {
    if (!latitude || !longitude) return null;
    const lat = Number(latitude);
    const lng = Number(longitude);
    return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}

interface LocationPickerProps {
    apiKey: string | null;
    latitude: string;
    longitude: string;
    onChange: (latitude: string, longitude: string) => void;
    latitudeError?: string;
    longitudeError?: string;
}

export function LocationPicker({ apiKey, latitude, longitude, onChange, latitudeError, longitudeError }: LocationPickerProps) {
    const [locating, setLocating] = useState(false);
    const [locationError, setLocationError] = useState<string>();

    const pick = (lat: number, lng: number) => onChange(lat.toFixed(7), lng.toFixed(7));

    const useMyLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('Este navegador no permite obtener la ubicación.');
            return;
        }
        setLocating(true);
        setLocationError(undefined);
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                setLocating(false);
                pick(coords.latitude, coords.longitude);
            },
            () => {
                setLocating(false);
                setLocationError('No se pudo obtener tu ubicación. Revisa el permiso del navegador.');
            },
            { enableHighAccuracy: true, timeout: 10000 },
        );
    };

    return (
        <div className="grid gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Label>Ubicación en el mapa</Label>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={useMyLocation} disabled={locating}>
                        {locating ? <LoaderCircle className="animate-spin" /> : <LocateFixed />} Mi ubicación
                    </Button>
                    {(latitude || longitude) && (
                        <Button type="button" variant="outline" size="sm" onClick={() => onChange('', '')}>
                            <X /> Quitar
                        </Button>
                    )}
                </div>
            </div>

            {apiKey ? (
                <GoogleMap apiKey={apiKey} position={toMapPosition(latitude, longitude)} onPick={pick} className="h-64 w-full" />
            ) : (
                <p className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                    Mapa no disponible: falta GOOGLE_MAPS_API_KEY en el .env. Puedes escribir las coordenadas.
                </p>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid content-start gap-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                        id="latitude"
                        inputMode="decimal"
                        placeholder="-14.8333000"
                        autoComplete="off"
                        value={latitude}
                        onChange={(e) => onChange(e.target.value, longitude)}
                    />
                    <InputError message={latitudeError} />
                </div>
                <div className="grid content-start gap-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                        id="longitude"
                        inputMode="decimal"
                        placeholder="-64.9000000"
                        autoComplete="off"
                        value={longitude}
                        onChange={(e) => onChange(latitude, e.target.value)}
                    />
                    <InputError message={longitudeError} />
                </div>
            </div>
            <InputError message={locationError} />
        </div>
    );
}
