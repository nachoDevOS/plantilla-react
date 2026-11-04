import { ConfirmDialog } from '@/components/admin/common/confirm-dialog';
import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { PhoneText, type PhoneCountry } from '@/components/admin/common/phone-input';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { SimpleSelect } from '@/components/admin/common/simple-select';
import { TableToolbar } from '@/components/admin/common/table-toolbar';
import { StatusBadge } from '@/components/admin/common/user-badges';
import { CustomerAvatar } from '@/components/admin/customers/customer-avatar';
import { CustomerDetailDialog } from '@/components/admin/customers/customer-detail-dialog';
import { CustomerFormDialog } from '@/components/admin/customers/customer-form-dialog';
import { CustomerRowDetail } from '@/components/admin/customers/customer-row-detail';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { useCan } from '@/hooks/use-can';
import { useFilters } from '@/hooks/use-filters';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatPublicCode } from '@/lib/format';
import { useStorageUrl } from '@/lib/storage';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Paginated } from '@/types';
import { type Customer, type CustomerFilters, type Labels } from '@/types/admin/customers';
import { Head, router } from '@inertiajs/react';
import { ChevronRight, Contact, Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Fragment, useState } from 'react';

/*
 * PÁGINA: Clientes  (ruta /admin/customers, permiso clientes.ver)
 * Los datos (props) los envía app/Http/Controllers/Admin/CustomerController.php -> index()
 * Las piezas visuales están en components/admin/customers/.
 */

/** Columnas de la tabla: el desplegable y la fila vacía ocupan todas. */
const COLUMNS = 6;

const statusOptions = [
    { id: 'active', name: 'Activos' },
    { id: 'inactive', name: 'Inactivos' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Administración', href: '/admin/customers' },
    { title: 'Clientes', href: '/admin/customers' },
];

interface Props {
    customers: Paginated<Customer>;
    filters: CustomerFilters;
    issuedIn: Labels;
    genders: Labels;
    phoneCountries: PhoneCountry[];
    googleMapsKey: string | null;
}

export default function CustomersIndex({ customers, filters, issuedIn, genders, phoneCountries, googleMapsKey }: Props) {
    const can = useCan();
    const imageUrl = useStorageUrl();
    const applyFilters = useFilters('admin.customers.index', filters);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<Customer | null>(null);
    const [viewing, setViewing] = useState<Customer | null>(null);
    const [deleting, setDeleting] = useState<Customer | null>(null);
    // Filas abiertas: pueden estar varias a la vez
    const [expanded, setExpanded] = useState<Set<string>>(new Set());

    const toggle = (code: string) =>
        setExpanded((current) => {
            const next = new Set(current);
            if (!next.delete(code)) next.add(code);
            return next;
        });

    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };

    const openEdit = (customer: Customer) => {
        setViewing(null);
        setEditing(customer);
        setFormOpen(true);
    };

    const hasFilters = Boolean(filters.search || filters.status);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Clientes" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Contact}
                    title="Clientes"
                    description="Datos personales, CI y foto de cada cliente."
                    actions={
                        can('clientes.crear') && (
                            <Button className="btn-brand" onClick={openCreate}>
                                <UserPlus /> Nuevo cliente
                            </Button>
                        )
                    }
                />

                <div className="surface overflow-hidden rounded-xl">
                    <TableToolbar
                        perPage={Number(filters.per_page ?? 10)}
                        onPerPageChange={(n) => applyFilters({ per_page: String(n) })}
                        search={filters.search ?? ''}
                        onSearch={(search) => applyFilters({ search })}
                        searchPlaceholder="Nombre, CI, teléfono o correo…"
                    >
                        <SimpleSelect
                            className="w-40"
                            options={statusOptions}
                            value={filters.status}
                            onChange={(status) => applyFilters({ status })}
                            allLabel="Todos los estados"
                        />
                    </TableToolbar>

                    <DataTable
                        head={
                            <>
                                <Th className="w-10" />
                                <Th>Cliente</Th>
                                <Th>CI</Th>
                                <Th className="hidden md:table-cell">Contacto</Th>
                                <Th>Estado</Th>
                                <Th align="right">Acciones</Th>
                            </>
                        }
                    >
                        {customers.data.map((customer) => {
                            const isOpen = expanded.has(customer.code);

                            return (
                                <Fragment key={customer.code}>
                                    <tr className={cn(isOpen && 'bg-muted/40')}>
                                        <Td>
                                            <button
                                                type="button"
                                                onClick={() => toggle(customer.code)}
                                                aria-expanded={isOpen}
                                                aria-label={isOpen ? 'Ocultar detalle' : 'Ver detalle'}
                                                className="hover:bg-muted flex size-7 items-center justify-center rounded-md transition-colors"
                                            >
                                                <ChevronRight
                                                    className={cn(
                                                        'text-muted-foreground size-4 transition-transform',
                                                        isOpen && 'text-primary rotate-90',
                                                    )}
                                                />
                                            </button>
                                        </Td>
                                        <Td>
                                            <div className="flex items-center gap-3">
                                                <CustomerAvatar
                                                    name={customer.full_name}
                                                    src={imageUrl(customer.photo_thumb)}
                                                    fullSrc={imageUrl(customer.photo)}
                                                    className="size-10"
                                                />
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium">{customer.full_name}</p>
                                                    <p className="text-muted-foreground font-mono text-[11px] tracking-wide">
                                                        {formatPublicCode(customer.code)}
                                                    </p>
                                                </div>
                                            </div>
                                        </Td>
                                        <Td className="num whitespace-nowrap">{customer.document}</Td>
                                        <Td className="hidden md:table-cell">
                                            <p>
                                                <PhoneText countries={phoneCountries} code={customer.phone_country_code} number={customer.phone} />
                                            </p>
                                            {customer.email && <p className="text-muted-foreground text-xs">{customer.email}</p>}
                                        </Td>
                                        <Td>
                                            <StatusBadge active={customer.is_active} />
                                        </Td>
                                        <Td>
                                            <RowActions>
                                                <ActionButton icon={Eye} label="Ver detalle" onClick={() => setViewing(customer)} />
                                                {can('clientes.editar') && (
                                                    <ActionButton icon={Pencil} label="Editar" tone="warning" onClick={() => openEdit(customer)} />
                                                )}
                                                {can('clientes.eliminar') && (
                                                    <ActionButton
                                                        icon={Trash2}
                                                        label="Eliminar"
                                                        tone="danger"
                                                        onClick={() => setDeleting(customer)}
                                                    />
                                                )}
                                            </RowActions>
                                        </Td>
                                    </tr>
                                    {isOpen && (
                                        <tr className="bg-muted/40 hover:bg-muted/40!">
                                            <td colSpan={COLUMNS} className="px-4 pt-1 pb-4">
                                                <CustomerRowDetail
                                                    customer={customer}
                                                    issuedIn={issuedIn}
                                                    genders={genders}
                                                    phoneCountries={phoneCountries}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            );
                        })}
                        {customers.data.length === 0 && (
                            <EmptyRow
                                colSpan={COLUMNS}
                                text={hasFilters ? 'No hay clientes con esos filtros.' : 'Todavía no hay clientes registrados.'}
                            />
                        )}
                    </DataTable>

                    <Pagination paginator={customers} itemName="clientes" />
                </div>
            </div>

            <CustomerFormDialog
                open={formOpen}
                onClose={() => setFormOpen(false)}
                customer={editing}
                issuedIn={issuedIn}
                genders={genders}
                phoneCountries={phoneCountries}
                googleMapsKey={googleMapsKey}
            />

            <CustomerDetailDialog
                customer={viewing}
                issuedIn={issuedIn}
                genders={genders}
                phoneCountries={phoneCountries}
                googleMapsKey={googleMapsKey}
                onClose={() => setViewing(null)}
                onEdit={can('clientes.editar') ? openEdit : undefined}
            />

            <ConfirmDialog
                open={deleting !== null}
                onClose={() => setDeleting(null)}
                title={`¿Eliminar a ${deleting?.full_name}?`}
                description="Dejará de aparecer en la lista. El registro queda guardado con quién lo eliminó, y su CI no se podrá volver a registrar."
                confirmLabel="Eliminar"
                destructive
                onConfirm={(done) => {
                    if (deleting) {
                        router.delete(route('admin.customers.destroy', deleting.code), { preserveScroll: true, onFinish: done });
                    }
                }}
            />
        </AdminLayout>
    );
}
