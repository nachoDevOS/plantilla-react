/**
 * MAPA DE GOOGLE con un pin.
 *   <GoogleMap apiKey={key} position={{ lat, lng }} />                  → solo para ver
 *   <GoogleMap apiKey={key} position={...} onPick={(lat, lng) => …} />  → clic en el mapa o arrastrar el pin
 * Sin posición se abre en DEFAULT_CENTER, sin pin.
 */
import { GOOGLE_MAPS_AUTH_FAILURE, loadGoogleMaps } from '@/lib/google-maps';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

/** Centro inicial cuando todavía no hay ubicación: Trinidad, Beni. */
const DEFAULT_CENTER = { lat: -14.8333, lng: -64.9 };

export interface MapPosition {
    lat: number;
    lng: number;
}

interface GoogleMapProps {
    apiKey: string;
    position: MapPosition | null;
    onPick?: (lat: number, lng: number) => void;
    className?: string;
}

export function GoogleMap({ apiKey, position, onPick, className }: GoogleMapProps) {
    const element = useRef<HTMLDivElement>(null);
    const map = useRef<google.maps.Map | null>(null);
    const marker = useRef<google.maps.Marker | null>(null);
    const [failure, setFailure] = useState<string>();

    // El mapa se crea una vez: estos dos guardan los valores de ahora para usarlos dentro de sus eventos
    const pick = useRef(onPick);
    pick.current = onPick;
    const initial = useRef(position);

    const editable = onPick !== undefined;

    useEffect(() => {
        let cancelled = false;
        const onAuthFailure = () => setFailure('Google rechazó la API key. Revisa GOOGLE_MAPS_API_KEY y sus restricciones.');
        window.addEventListener(GOOGLE_MAPS_AUTH_FAILURE, onAuthFailure);

        loadGoogleMaps(apiKey)
            .then(async () => {
                const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
                const { Marker } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;
                if (cancelled || !element.current) return;

                map.current = new Map(element.current, {
                    center: initial.current ?? DEFAULT_CENTER,
                    zoom: initial.current ? 16 : 13,
                    streetViewControl: false,
                    fullscreenControl: false,
                });
                marker.current = new Marker({ map: map.current, position: initial.current, draggable: editable });

                if (editable) {
                    const choose = (event: google.maps.MapMouseEvent) => {
                        if (event.latLng) pick.current?.(event.latLng.lat(), event.latLng.lng());
                    };
                    map.current.addListener('click', choose);
                    marker.current.addListener('dragend', choose);
                }
            })
            .catch(() => setFailure('No se pudo cargar Google Maps. Revisa tu conexión.'));

        return () => {
            cancelled = true;
            window.removeEventListener(GOOGLE_MAPS_AUTH_FAILURE, onAuthFailure);
            marker.current?.setMap(null);
            marker.current = null;
            map.current = null;
        };
    }, [apiKey, editable]);

    // Pin siguiendo la posición (ej: al escribir las coordenadas a mano)
    const lat = position?.lat;
    const lng = position?.lng;
    useEffect(() => {
        initial.current = lat !== undefined && lng !== undefined ? { lat, lng } : null;
        marker.current?.setPosition(initial.current);
        if (initial.current) map.current?.panTo(initial.current);
    }, [lat, lng]);

    if (failure) {
        return (
            <div className={cn('bg-muted text-muted-foreground flex items-center justify-center rounded-lg p-4 text-center text-sm', className)}>
                {failure}
            </div>
        );
    }

    return <div ref={element} className={cn('bg-muted rounded-lg', className)} />;
}
