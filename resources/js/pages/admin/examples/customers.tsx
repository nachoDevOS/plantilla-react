import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { type BadgeTone, ToneBadge } from '@/components/admin/common/tone-badge';
import { UserAvatar } from '@/components/admin/common/user-badges';
import { type CustomerSegment, customers, money, segmentLabels } from '@/components/admin/examples/data';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { LayoutGrid, List, Mail, MapPin, Pencil, Phone, Search, ShoppingBag, UserPlus, Users } from 'lucide-react';
import { useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Clientes  (ruta /admin/examples/customers)
 * Dos vistas del mismo listado (tarjetas o tabla), filtro por segmento con "chips" y buscador instantáneo.
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/customers' },
    { title: 'Clientes', href: '/admin/examples/customers' },
];

const segmentTone: Record<CustomerSegment, BadgeTone> = { vip: 'violet', frecuente: 'blue', nuevo: 'green', empresa: 'amber' };

export default function ExampleCustomers() {
    const [view, setView] = useState<'cards' | 'table'>('cards');
    const [segment, setSegment] = useState<CustomerSegment | 'all'>('all');
    const [search, setSearch] = useState('');

    const term = search.toLowerCase();
    const visible = customers.filter(
        (c) => (segment === 'all' || c.segment === segment) && (!term || `${c.name} ${c.document} ${c.email} ${c.city}`.toLowerCase().includes(term)),
    );

    const countBy = (s: CustomerSegment) => customers.filter((c) => c.segment === s).length;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Users}
                    title="Clientes"
                    description={`${customers.length} clientes registrados`}
                    actions={
                        <Button className="btn-brand">
                            <UserPlus /> Nuevo cliente
                        </Button>
                    }
                />

                <ExampleNotice />

                {/* Barra: chips de segmento, buscador y cambio de vista */}
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-2">
                        <Chip active={segment === 'all'} onClick={() => setSegment('all')} count={customers.length}>
                            Todos
                        </Chip>
                        {(Object.keys(segmentLabels) as CustomerSegment[]).map((s) => (
                            <Chip key={s} active={segment === s} onClick={() => setSegment(s)} count={countBy(s)}>
                                {segmentLabels[s]}
                            </Chip>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full lg:w-72">
                            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Nombre, CI, correo o ciudad…"
                                className="h-9 pl-9"
                            />
                        </div>
                        <div className="bg-muted flex shrink-0 rounded-lg p-0.5">
                            <ViewButton active={view === 'cards'} onClick={() => setView('cards')} label="Ver como tarjetas">
                                <LayoutGrid />
                            </ViewButton>
                            <ViewButton active={view === 'table'} onClick={() => setView('table')} label="Ver como tabla">
                                <List />
                            </ViewButton>
                        </div>
                    </div>
                </div>

                {view === 'cards' ? (
                    visible.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {visible.map((c) => (
                                <div key={c.id} className="surface hover:border-primary/40 flex flex-col rounded-xl p-5 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <UserAvatar name={c.name} className="size-11 text-sm" />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold" title={c.name}>
                                                {c.name}
                                            </p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <ToneBadge tone={segmentTone[c.segment]}>{segmentLabels[c.segment]}</ToneBadge>
                                                <span className="text-muted-foreground truncate text-xs">CI/NIT {c.document}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="text-muted-foreground mt-4 space-y-1.5 text-[13px]">
                                        <li className="flex items-center gap-2 truncate">
                                            <Mail className="size-3.5 shrink-0" /> {c.email}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Phone className="size-3.5 shrink-0" /> {c.phone}
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <MapPin className="size-3.5 shrink-0" /> {c.city}
                                        </li>
                                    </ul>

                                    <div className="mt-4 grid grid-cols-2 gap-2 border-t pt-4">
                                        <div>
                                            <p className="text-muted-foreground text-xs">Compras</p>
                                            <p className="num font-semibold">{c.orders}</p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground text-xs">Total gastado</p>
                                            <p className="num font-semibold">{money(c.spent)}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button variant="ver" size="sm" className="flex-1">
                                            <ShoppingBag /> Ver compras
                                        </Button>
                                        <Button variant="editar" size="sm" className="flex-1">
                                            <Pencil /> Editar
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="surface text-muted-foreground rounded-xl py-16 text-center text-sm">No hay clientes con esos filtros.</div>
                    )
                ) : (
                    <div className="surface overflow-hidden rounded-xl">
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
                            {visible.map((c) => (
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
                                    <Td className="text-muted-foreground hidden lg:table-cell">{formatDay(c.lastPurchase)}</Td>
                                    <Td>
                                        <RowActions>
                                            <ActionButton icon={ShoppingBag} label="Ver compras" tone="success" onClick={() => undefined} />
                                            <ActionButton icon={Pencil} label="Editar" onClick={() => undefined} />
                                        </RowActions>
                                    </Td>
                                </tr>
                            ))}
                            {visible.length === 0 && <EmptyRow colSpan={8} text="No hay clientes con esos filtros." />}
                        </DataTable>
                    </div>
                )}
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

function ViewButton({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className={cn(
                'flex size-8 items-center justify-center rounded-md transition-colors [&_svg]:size-4',
                active ? 'bg-card text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground',
            )}
        >
            {children}
        </button>
    );
}
