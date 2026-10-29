import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { TableToolbar } from '@/components/admin/common/table-toolbar';
import { type BadgeTone, ToneBadge } from '@/components/admin/common/tone-badge';
import { UserAvatar } from '@/components/admin/common/user-badges';
import { type CustomerFilters, type CustomerSegment, type ExampleCustomer, money, segmentLabels } from '@/components/admin/examples/data';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { useFilters } from '@/hooks/use-filters';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Paginated } from '@/types';
import { Head } from '@inertiajs/react';
import { Pencil, ShoppingBag, UserPlus, Users } from 'lucide-react';

/*
 * PÁGINA DE EJEMPLO: Clientes  (ruta /admin/examples/customers)
 * Datos: app/Http/Controllers/Admin/ExampleController.php → customers()
 * Tabla de lista igual que Usuarios: "Mostrar N registros", filtro, buscador y PAGINACIÓN DEL LADO DEL SERVIDOR.
 * Las pestañas de segmento de arriba también filtran en el servidor.
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/customers' },
    { title: 'Clientes', href: '/admin/examples/customers' },
];

const segmentTone: Record<CustomerSegment, BadgeTone> = { vip: 'violet', frecuente: 'blue', nuevo: 'green', empresa: 'amber' };

interface Props {
    customers: Paginated<ExampleCustomer>;
    filters: CustomerFilters;
    segments: { id: CustomerSegment; name: string; count: number }[];
    total: number;
}

export default function ExampleCustomers({ customers, filters, segments, total }: Props) {
    const applyFilters = useFilters('admin.examples.customers', filters);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Users}
                    title="Clientes"
                    description={`${total} clientes registrados`}
                    actions={
                        <Button className="btn-brand">
                            <UserPlus /> Nuevo cliente
                        </Button>
                    }
                />

                <ExampleNotice />

                {/* Pestañas de segmento: cada una es un filtro del servidor */}
                <div className="flex flex-wrap gap-2">
                    <Chip active={!filters.segment} onClick={() => applyFilters({ segment: undefined })} count={total}>
                        Todos
                    </Chip>
                    {segments.map((s) => (
                        <Chip key={s.id} active={filters.segment === s.id} onClick={() => applyFilters({ segment: s.id })} count={s.count}>
                            {s.name}
                        </Chip>
                    ))}
                </div>

                <div className="surface overflow-hidden rounded-xl">
                    <TableToolbar
                        perPage={Number(filters.per_page ?? 10)}
                        onPerPageChange={(n) => applyFilters({ per_page: String(n) })}
                        search={filters.search ?? ''}
                        onSearch={(search) => applyFilters({ search })}
                        searchPlaceholder="Nombre, CI, correo o ciudad…"
                    />

                    <DataTable
                        head={
                            <>
                                <Th>Cliente</Th>
                                <Th>Segmento</Th>
                                <Th className="hidden md:table-cell">Contacto</Th>
                                <Th className="hidden lg:table-cell">Ciudad</Th>
                                <Th align="right">Compras</Th>
                                <Th align="right">Total gastado</Th>
                                <Th className="hidden lg:table-cell">Última compra</Th>
                                <Th align="right">Acciones</Th>
                            </>
                        }
                    >
                        {customers.data.map((c) => (
                            <tr key={c.id}>
                                <Td>
                                    <div className="flex items-center gap-3">
                                        <UserAvatar name={c.name} />
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{c.name}</p>
                                            <p className="text-muted-foreground text-xs">CI/NIT {c.document}</p>
                                        </div>
                                    </div>
                                </Td>
                                <Td>
                                    <ToneBadge tone={segmentTone[c.segment]}>{segmentLabels[c.segment]}</ToneBadge>
                                </Td>
                                <Td className="hidden md:table-cell">
                                    <p>{c.email}</p>
                                    <p className="text-muted-foreground text-xs">{c.phone}</p>
                                </Td>
                                <Td className="hidden lg:table-cell">{c.city}</Td>
                                <Td align="right">{c.orders}</Td>
                                <Td align="right" className="font-medium">
                                    {money(c.spent)}
                                </Td>
                                <Td className="text-muted-foreground hidden lg:table-cell">{formatDay(c.last_purchase)}</Td>
                                <Td>
                                    <RowActions>
                                        <ActionButton icon={ShoppingBag} label="Ver compras" tone="success" onClick={() => undefined} />
                                        <ActionButton icon={Pencil} label="Editar" onClick={() => undefined} />
                                    </RowActions>
                                </Td>
                            </tr>
                        ))}
                        {customers.data.length === 0 && <EmptyRow colSpan={8} text="No hay clientes con esos filtros." />}
                    </DataTable>

                    <Pagination paginator={customers} itemName="clientes" />
                </div>
            </div>
        </AdminLayout>
    );
}

function Chip({ active, onClick, count, children }: { active: boolean; onClick: () => void; count: number; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex h-8 items-center gap-2 rounded-full border px-3 text-[13px] font-medium transition-colors',
                active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-card text-foreground/80 hover:border-primary/40 hover:text-primary',
            )}
        >
            {children}
            <span className={cn('num rounded-full px-1.5 text-[11px]', active ? 'bg-white/20' : 'bg-muted text-muted-foreground')}>{count}</span>
        </button>
    );
}
