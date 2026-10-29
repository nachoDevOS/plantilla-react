import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { StatCard, StatGrid } from '@/components/admin/common/stat-card';
import { TableToolbar } from '@/components/admin/common/table-toolbar';
import { type BadgeTone, ToneBadge } from '@/components/admin/common/tone-badge';
import { Panel, PanelHeader } from '@/components/admin/dashboard/panel';
import {
    activity,
    dailySales,
    type ExampleSale,
    money,
    moneyRound,
    paymentBreakdown,
    type SaleFilters,
    type SaleStats,
    type SaleStatus,
    saleStatusLabels,
} from '@/components/admin/examples/data';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useFilters } from '@/hooks/use-filters';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDate } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, BarChart3, CalendarDays, CreditCard, Eye, Printer, Receipt, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';
import { useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Ventas  (ruta /admin/examples/sales)
 * Datos de la tabla: app/Http/Controllers/Admin/ExampleController.php → sales()
 * Indicadores, gráfico de barras hecho solo con CSS, métodos de pago, últimas ventas con filtro por estado
 * (PAGINACIÓN DEL LADO DEL SERVIDOR), detalle de cada venta en una ventana y línea de tiempo de actividad.
 * El gráfico, los métodos de pago y la actividad salen de components/admin/examples/data.ts.
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/sales' },
    { title: 'Ventas', href: '/admin/examples/sales' },
];

const statusTone: Record<SaleStatus, BadgeTone> = { paid: 'green', pending: 'amber', cancelled: 'red' };

const tabs: { id: SaleStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'Todas' },
    { id: 'paid', label: 'Pagadas' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'cancelled', label: 'Anuladas' },
];

const activityDot = { blue: 'bg-blue-500', green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-rose-500' } as const;

interface Props {
    sales: Paginated<ExampleSale>;
    filters: SaleFilters;
    /** Cuántas ventas hay en cada estado (para las pestañas) */
    statusCounts: Record<SaleStatus, number>;
    stats: SaleStats;
}

export default function ExampleSales({ sales, filters, statusCounts, stats }: Props) {
    const [viewing, setViewing] = useState<ExampleSale | null>(null);
    const applyFilters = useFilters('admin.examples.sales', filters);
    const tab = (filters.status as SaleStatus | undefined) ?? 'all';
    const allCount = Object.values(statusCounts).reduce((sum, n) => sum + n, 0);
    const periodTotal = dailySales.reduce((sum, d) => sum + d.total, 0);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Ventas (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={ShoppingCart}
                    title="Ventas"
                    description="Resumen de los últimos 14 días"
                    actions={
                        <>
                            <Button variant="outline">
                                <CalendarDays /> 16 oct – 29 oct
                            </Button>
                            <Button className="btn-brand">
                                <Receipt /> Nueva venta
                            </Button>
                        </>
                    }
                />

                <ExampleNotice />

                <StatGrid>
                    <StatCard icon={Wallet} label="Vendido hoy" value={money(stats.today)} hint="Solo ventas pagadas" tone="green" colorValue />
                    <StatCard icon={TrendingUp} label="Últimos 14 días" value={moneyRound(periodTotal)} hint="+12 % que el periodo anterior" />
                    <StatCard
                        icon={Receipt}
                        label="Ticket promedio"
                        value={money(stats.average)}
                        hint={`${stats.paid_count} ventas pagadas`}
                        tone="violet"
                    />
                    <StatCard
                        icon={CreditCard}
                        label="Por cobrar"
                        value={moneyRound(stats.pending)}
                        hint="Ventas pendientes"
                        tone="amber"
                        colorValue
                    />
                </StatGrid>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Panel className="lg:col-span-2">
                        <PanelHeader icon={BarChart3} title="Ventas por día" description="Total cobrado cada día, en Bs" />
                        <DailyBars />
                    </Panel>

                    <Panel>
                        <PanelHeader icon={CreditCard} title="Métodos de pago" description="Este mes" />
                        <PaymentMethods />
                    </Panel>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Panel className="overflow-hidden lg:col-span-2">
                        <PanelHeader
                            icon={Receipt}
                            title="Últimas ventas"
                            description={`${sales.total} de ${allCount} ventas`}
                            aside={
                                <div className="bg-muted flex rounded-lg p-0.5">
                                    {tabs.map((t) => (
                                        <button
                                            key={t.id}
                                            type="button"
                                            onClick={() => applyFilters({ status: t.id })}
                                            className={cn(
                                                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                                                tab === t.id ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
                                            )}
                                        >
                                            {t.label}
                                            <span className="num text-muted-foreground ml-1 text-[11px]">
                                                {t.id === 'all' ? allCount : statusCounts[t.id]}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            }
                        />
                        <TableToolbar
                            perPage={Number(filters.per_page ?? 10)}
                            onPerPageChange={(n) => applyFilters({ per_page: String(n) })}
                            search={filters.search ?? ''}
                            onSearch={(search) => applyFilters({ search })}
                            searchPlaceholder="N°, cliente o vendedor…"
                        />
                        <DataTable
                            head={
                                <>
                                    <Th>N°</Th>
                                    <Th>Cliente</Th>
                                    <Th className="hidden md:table-cell">Pago</Th>
                                    <Th>Estado</Th>
                                    <Th align="right">Total</Th>
                                    <Th align="right" />
                                </>
                            }
                        >
                            {sales.data.map((sale) => (
                                <tr key={sale.id}>
                                    <Td>
                                        <p className="num font-medium">{sale.number}</p>
                                        <p className="text-muted-foreground text-xs whitespace-nowrap">
                                            {formatDate(sale.date, { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </Td>
                                    <Td>
                                        <p className="font-medium">{sale.customer}</p>
                                        <p className="text-muted-foreground text-xs">Vendió {sale.seller}</p>
                                    </Td>
                                    <Td className="hidden md:table-cell">{sale.method}</Td>
                                    <Td>
                                        <ToneBadge tone={statusTone[sale.status]} dot>
                                            {saleStatusLabels[sale.status]}
                                        </ToneBadge>
                                    </Td>
                                    <Td
                                        align="right"
                                        className={cn('font-semibold', sale.status === 'cancelled' && 'text-muted-foreground line-through')}
                                    >
                                        {money(sale.total)}
                                    </Td>
                                    <Td>
                                        <RowActions>
                                            <ActionButton icon={Eye} label="Ver detalle" tone="success" onClick={() => setViewing(sale)} />
                                        </RowActions>
                                    </Td>
                                </tr>
                            ))}
                            {sales.data.length === 0 && <EmptyRow colSpan={6} text="No hay ventas con esos filtros." />}
                        </DataTable>
                        <Pagination paginator={sales} itemName="ventas" />
                    </Panel>

                    <Panel>
                        <PanelHeader icon={Activity} title="Actividad reciente" />
                        <ol className="space-y-4 p-5">
                            {activity.map((item, i) => (
                                <li key={item.id} className="relative flex gap-3">
                                    {i < activity.length - 1 && <span className="bg-border absolute top-4 left-[5px] h-full w-px" />}
                                    <span
                                        className={cn('ring-card relative mt-1.5 size-[11px] shrink-0 rounded-full ring-4', activityDot[item.tone])}
                                    />
                                    <div className="min-w-0 text-[13px]">
                                        <p>
                                            <span className="font-semibold">{item.who}</span> {item.what}
                                        </p>
                                        <p className="text-muted-foreground mt-0.5 text-xs">{item.when}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Panel>
                </div>
            </div>

            <SaleDetailDialog sale={viewing} onClose={() => setViewing(null)} />
        </AdminLayout>
    );
}

/** Barras verticales con CSS: la altura de cada una es su porcentaje respecto al día más alto. */
function DailyBars() {
    const max = Math.max(...dailySales.map((d) => d.total));

    return (
        <div className="p-5">
            <div className="flex h-56 items-end gap-1.5 sm:gap-2.5">
                {dailySales.map((d) => (
                    <div key={d.day} className="flex h-full min-w-0 flex-1 items-end">
                        <div
                            className="bg-primary/80 hover:bg-primary w-full rounded-t-md transition-colors"
                            style={{ height: `${(d.total / max) * 100}%` }}
                            title={`${d.day}: ${money(d.total)}`}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-2 flex gap-1.5 sm:gap-2.5">
                {dailySales.map((d) => (
                    <span key={d.day} className="text-muted-foreground flex-1 truncate text-center text-[10px]">
                        {d.day.split(' ')[0]}
                    </span>
                ))}
            </div>
        </div>
    );
}

function PaymentMethods() {
    const total = paymentBreakdown.reduce((sum, p) => sum + p.total, 0);

    return (
        <div className="space-y-5 p-5">
            <div>
                <p className="text-muted-foreground text-xs">Total del mes</p>
                <p className="font-display num text-2xl font-bold">{money(total)}</p>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full">
                {paymentBreakdown.map((p) => (
                    <div key={p.method} style={{ width: `${(p.total / total) * 100}%`, backgroundColor: p.color }} />
                ))}
            </div>
            <ul className="space-y-3 text-[13px]">
                {paymentBreakdown.map((p) => (
                    <li key={p.method} className="flex items-center gap-3">
                        <span className="size-2.5 rounded-sm" style={{ backgroundColor: p.color }} />
                        <span className="flex-1">{p.method}</span>
                        <span className="text-muted-foreground num text-xs">{Math.round((p.total / total) * 100)} %</span>
                        <span className="num w-24 text-right font-medium">{money(p.total)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SaleDetailDialog({ sale, onClose }: { sale: ExampleSale | null; onClose: () => void }) {
    return (
        <Dialog open={sale !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                {sale && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                Venta {sale.number}
                                <ToneBadge tone={statusTone[sale.status]} dot>
                                    {saleStatusLabels[sale.status]}
                                </ToneBadge>
                            </DialogTitle>
                            <DialogDescription>
                                {sale.customer} · {formatDate(sale.date, { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })} ·{' '}
                                {sale.method}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="overflow-hidden rounded-lg border">
                            <DataTable
                                head={
                                    <>
                                        <Th>Producto</Th>
                                        <Th align="right">Cant.</Th>
                                        <Th align="right">Precio</Th>
                                        <Th align="right">Subtotal</Th>
                                    </>
                                }
                            >
                                {sale.items.map((item) => (
                                    <tr key={item.product}>
                                        <Td>{item.product}</Td>
                                        <Td align="right">{item.quantity}</Td>
                                        <Td align="right">{money(item.price)}</Td>
                                        <Td align="right" className="font-medium">
                                            {money(item.quantity * item.price)}
                                        </Td>
                                    </tr>
                                ))}
                            </DataTable>
                            <div className="bg-muted/50 flex items-center justify-between border-t px-4 py-3">
                                <span className="text-[13px] font-medium">Total</span>
                                <span className="font-display num text-lg font-bold">{money(sale.total)}</span>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>
                                Cerrar
                            </Button>
                            <Button className="btn-brand">
                                <Printer /> Imprimir
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
