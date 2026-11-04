/**
 * Pieza de Clientes: campo de foto. Se puede arrastrar una imagen, elegirla del equipo o tomarla con la cámara.
 * Solo prepara el archivo: al guardar, Laravel lo pasa a StorageController::store_image.
 * La cámara necesita https o localhost: si el navegador no la permite, se avisa y lo demás sigue funcionando.
 */
import InputError from '@/components/shared/input-error';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Camera, ImagePlus, LoaderCircle, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

/** Mismo tope que CustomerRequest (max:3072). */
const MAX_BYTES = 3 * 1024 * 1024;

interface CustomerPhotoFieldProps {
    /** Foto que ya tiene el cliente (null si no tiene o si la quitaron) */
    currentUrl: string | null;
    file: File | null;
    onChange: (file: File | null) => void;
    onRemoveCurrent: () => void;
    error?: string;
}

export function CustomerPhotoField({ currentUrl, file, onChange, onRemoveCurrent, error }: CustomerPhotoFieldProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [camera, setCamera] = useState(false);
    const [localError, setLocalError] = useState<string>();

    // Vista previa del archivo elegido. La URL temporal se libera al cambiar de archivo
    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const pick = (candidate: File | undefined) => {
        if (!candidate) return;
        if (!candidate.type.startsWith('image/')) {
            setLocalError('Elige una imagen (JPG, PNG, WEBP…).');
            return;
        }
        if (candidate.size > MAX_BYTES) {
            setLocalError('La foto no puede pasar de 3 MB.');
            return;
        }
        setLocalError(undefined);
        onChange(candidate);
    };

    const shown = preview ?? currentUrl;

    if (camera) {
        return (
            <CameraCapture
                onCancel={() => setCamera(false)}
                onCapture={(photo) => {
                    setCamera(false);
                    pick(photo);
                }}
                onError={(message) => {
                    setCamera(false);
                    setLocalError(message);
                }}
            />
        );
    }

    return (
        <div className="grid gap-2">
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    pick(e.dataTransfer.files[0]);
                }}
                className={cn(
                    'group bg-muted/40 relative aspect-square overflow-hidden rounded-xl border-2 border-dashed transition-colors',
                    dragging ? 'border-primary bg-primary/5' : 'border-border',
                    shown && !dragging && 'border-solid',
                )}
            >
                {shown ? (
                    <img src={shown} alt="Foto del cliente" className="size-full object-cover" />
                ) : (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="text-muted-foreground hover:text-primary flex size-full flex-col items-center justify-center gap-2 p-4 text-center transition-colors"
                    >
                        <ImagePlus className="size-8" />
                        <span className="text-sm font-medium">{dragging ? 'Suelta la imagen aquí' : 'Arrastra la foto o haz clic'}</span>
                        <span className="text-xs">JPG, PNG o WEBP · hasta 3 MB</span>
                    </button>
                )}
                {shown && (
                    <button
                        type="button"
                        aria-label="Quitar foto"
                        onClick={() => {
                            if (file) onChange(null);
                            else onRemoveCurrent();
                        }}
                        className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-red-600"
                    >
                        <Trash2 className="size-4" />
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
                    <Upload /> {shown ? 'Cambiar' : 'Subir'}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setCamera(true)}>
                    <Camera /> Cámara
                </Button>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                tabIndex={-1}
                aria-label="Elegir foto"
                onChange={(e) => {
                    pick(e.target.files?.[0]);
                    // Permite volver a elegir el mismo archivo después de quitarlo
                    e.target.value = '';
                }}
            />
            <InputError message={localError ?? error} />
        </div>
    );
}

interface CameraCaptureProps {
    onCapture: (photo: File | undefined) => void;
    onCancel: () => void;
    onError: (message: string) => void;
}

/** Vista de la cámara: enciende al abrir y se apaga siempre al salir. */
function CameraCapture({ onCapture, onCancel, onError }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let stream: MediaStream | undefined;
        let cancelled = false;

        navigator.mediaDevices
            ?.getUserMedia({ video: { facingMode: 'user', width: { ideal: 1280 } }, audio: false })
            .then((media) => {
                if (cancelled) {
                    media.getTracks().forEach((track) => track.stop());
                    return;
                }
                stream = media;
                if (videoRef.current) videoRef.current.srcObject = media;
            })
            .catch(() => onError('No se pudo usar la cámara. Revisa el permiso del navegador o sube una imagen.'));

        if (!navigator.mediaDevices) {
            onError('Este navegador no permite usar la cámara aquí. Necesita https o localhost.');
        }

        return () => {
            cancelled = true;
            stream?.getTracks().forEach((track) => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Recorta el centro del video en cuadrado, como se ve en pantalla
    const capture = () => {
        const video = videoRef.current;
        if (!video) return;
        const side = Math.min(video.videoWidth, video.videoHeight);
        const canvas = document.createElement('canvas');
        canvas.width = side;
        canvas.height = side;
        canvas.getContext('2d')?.drawImage(video, (video.videoWidth - side) / 2, (video.videoHeight - side) / 2, side, side, 0, 0, side, side);
        canvas.toBlob((blob) => onCapture(blob ? new File([blob], 'foto-cliente.jpg', { type: 'image/jpeg' }) : undefined), 'image/jpeg', 0.92);
    };

    return (
        <div className="grid gap-2">
            <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
                <video ref={videoRef} autoPlay playsInline muted onCanPlay={() => setReady(true)} className="size-full -scale-x-100 object-cover" />
                {!ready && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/80">
                        <LoaderCircle className="size-6 animate-spin" />
                    </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onCancel}>
                    <X /> Cancelar
                </Button>
                <Button type="button" size="sm" className="btn-brand" disabled={!ready} onClick={capture}>
                    <Camera /> Tomar foto
                </Button>
            </div>
        </div>
    );
}
