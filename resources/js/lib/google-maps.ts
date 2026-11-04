/*
 * CARGA DE GOOGLE MAPS. El script se pide una sola vez y recién cuando se abre un mapa: las páginas sin mapa no lo cargan.
 * La key sale de GOOGLE_MAPS_API_KEY (.env → config/services.php) y llega como prop de la página.
 */

declare global {
    interface Window {
        /** Google la llama cuando terminó de cargar */
        googleMapsReady?: () => void;
        /** Google la llama si rechaza la key */
        gm_authFailure?: () => void;
    }
}

/** Evento que avisa a los mapas abiertos que la key no sirve. */
export const GOOGLE_MAPS_AUTH_FAILURE = 'google-maps-auth-failure';

let loading: Promise<void> | null = null;

export function loadGoogleMaps(apiKey: string): Promise<void> {
    loading ??= new Promise<void>((resolve, reject) => {
        window.gm_authFailure = () => window.dispatchEvent(new Event(GOOGLE_MAPS_AUTH_FAILURE));
        window.googleMapsReady = resolve;

        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly&loading=async&language=es&region=BO&callback=googleMapsReady`;
        script.async = true;
        script.onerror = () => {
            // Permite reintentar al abrir otro mapa (ej: se cortó internet)
            loading = null;
            script.remove();
            reject(new Error('No se pudo cargar Google Maps'));
        };
        document.head.append(script);
    });

    return loading;
}
