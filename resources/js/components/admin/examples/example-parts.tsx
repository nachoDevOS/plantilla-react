/**
 * PIEZAS de las páginas de ejemplo (pages/admin/examples/).
 *
 * ExampleNotice: aviso de "datos de ejemplo" arriba de cada página.
 */
import { cn } from '@/lib/utils';
import { FlaskConical } from 'lucide-react';

/** source: archivo donde están escritos los datos de la página. */
export function ExampleNotice({ source = 'app/Support/ExampleData.php', className }: { source?: string; className?: string }) {
    return (
        <div
            className={cn(
                'flex items-start gap-3 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-[13px] text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
                className,
            )}
        >
            <FlaskConical className="mt-0.5 size-4 shrink-0" />
            <p>
                <span className="font-semibold">Datos de ejemplo.</span> Están escritos a mano en{' '}
                <code className="rounded bg-amber-100 px-1 py-0.5 text-xs dark:bg-amber-500/20">{source}</code> y no se guardan en la base de datos.
            </p>
        </div>
    );
}
