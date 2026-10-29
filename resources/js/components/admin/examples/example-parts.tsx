/**
 * PIEZAS de las páginas de ejemplo (pages/admin/examples/).
 *
 * ExampleNotice: aviso de "datos de ejemplo" arriba de cada página.
 * LocalPager:    paginación en el navegador para listas escritas a mano.
 *                En un módulo real usa <Pagination paginator={...} /> (components/shared/pagination.tsx),
 *                que trabaja con ->paginate() de Laravel.
 */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FlaskConical } from 'lucide-react';

export function ExampleNotice({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
                className,
            )}
        >
            <FlaskConical className="mt-0.5 size-4 shrink-0" />
            <p>
                <span className="font-semibold">Datos de ejemplo.</span> Todo lo que ves en esta página está escrito a mano en{' '}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-500/20">components/admin/examples/data.ts</code>; los cambios
                no se guardan.
            </p>
        </div>
    );
}

interface LocalPagerProps {
    page: number;
    perPage: number;
    total: number;
    onPageChange: (page: number) => void;
    itemName?: string;
}

/** Pie de tabla "Mostrando 1–10 de 18" con anterior / siguiente y números de página. */
export function LocalPager({ page, perPage, total, onPageChange, itemName = 'registros' }: LocalPagerProps) {
    const pages = Math.max(1, Math.ceil(total / perPage));
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t px-4 py-3 sm:flex-row">
            <p className="text-muted-foreground num text-[13px]">
                Mostrando <span className="text-foreground font-medium">{from}</span>–<span className="text-foreground font-medium">{to}</span> de{' '}
                <span className="text-foreground font-medium">{total}</span> {itemName}
            </p>
            <nav className="flex items-center gap-1">
                <Button variant="ghost" size="icon" disabled={page <= 1} onClick={() => onPageChange(page - 1)} aria-label="Página anterior">
                    <ChevronLeft />
                </Button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        type="button"
                        onClick={() => onPageChange(n)}
                        className={cn(
                            'num flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-[13px] transition-colors',
                            n === page
                                ? 'bg-primary text-primary-foreground font-medium'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                    >
                        {n}
                    </button>
                ))}
                <Button variant="ghost" size="icon" disabled={page >= pages} onClick={() => onPageChange(page + 1)} aria-label="Página siguiente">
                    <ChevronRight />
                </Button>
            </nav>
        </div>
    );
}
