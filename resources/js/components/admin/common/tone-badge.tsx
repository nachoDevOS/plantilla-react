/**
 * ETIQUETA DE COLOR para estados y categorías (Pagada, Pendiente, Sin stock, VIP…).
 *
 *   <ToneBadge tone="green">Pagada</ToneBadge>
 *   <ToneBadge tone="red" dot>Sin stock</ToneBadge>
 *
 * tone: slate (neutro) · blue (información) · green (bien / listo) · amber (atención) · red (problema) · violet (destacado)
 * dot: agrega un punto del mismo color a la izquierda.
 */
import { cn } from '@/lib/utils';

export type BadgeTone = 'slate' | 'blue' | 'green' | 'amber' | 'red' | 'violet';

const tones: Record<BadgeTone, { badge: string; dot: string }> = {
    slate: {
        badge: 'bg-slate-100 text-slate-700 ring-slate-600/20 dark:bg-slate-500/15 dark:text-slate-300 dark:ring-slate-400/30',
        dot: 'bg-slate-500',
    },
    blue: { badge: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30', dot: 'bg-blue-500' },
    green: {
        badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/30',
        dot: 'bg-emerald-500',
    },
    amber: {
        badge: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/30',
        dot: 'bg-amber-500',
    },
    red: { badge: 'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-400/30', dot: 'bg-rose-500' },
    violet: {
        badge: 'bg-violet-50 text-violet-700 ring-violet-600/20 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/30',
        dot: 'bg-violet-500',
    },
};

interface ToneBadgeProps {
    tone?: BadgeTone;
    dot?: boolean;
    className?: string;
    children: React.ReactNode;
}

export function ToneBadge({ tone = 'slate', dot, className, children }: ToneBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
                tones[tone].badge,
                className,
            )}
        >
            {dot && <span className={cn('size-1.5 rounded-full', tones[tone].dot)} />}
            {children}
        </span>
    );
}
