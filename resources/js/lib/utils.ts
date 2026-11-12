/**
 * Utilidades generales sin diseño.
 */
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Enseña a twMerge el tamaño propio `control` (--spacing-control en app.css) para que `h-8` reemplace a `h-control`. */
const twMerge = extendTailwindMerge({ extend: { theme: { spacing: ['control'] } } });

/**
 * Combina clases de Tailwind sin conflictos.
 * Ej: cn('p-2 text-sm', activo && 'bg-cyan-500', 'p-4')  →  'text-sm bg-cyan-500 p-4'
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
