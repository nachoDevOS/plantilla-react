import { ConfirmDialog } from '@/components/admin/common/confirm-dialog';
import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { SimpleSelect } from '@/components/admin/common/simple-select';
import { StatCard, StatGrid } from '@/components/admin/common/stat-card';
import { ALL, TableToolbar } from '@/components/admin/common/table-toolbar';
import { ToneBadge } from '@/components/admin/common/tone-badge';
import { type ExampleProduct, money, moneyRound, type ProductFilters, type ProductStats } from '@/components/admin/examples/data';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import InputError from '@/components/shared/input-error';
import { Pagination } from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFilters } from '@/hooks/use-filters';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type Paginated } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { AlertTriangle, Boxes, Eye, LoaderCircle, Package, PackageX, Pencil, Plus, RotateCcw, Trash2, Wallet } from 'lucide-react';
import { FormEventHandler, useEffect, useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Productos  (ruta /admin/examples/products)
 * Datos: app/Http/Controllers/Admin/ExampleController.php → products()
 *
 * Funciona como un módulo real:
 *   - PAGINACIÓN DEL LADO DEL SERVIDOR: la tabla recibe solo la página pedida (?page=2&per_page=25).
 *   - Buscador y filtros viajan en la URL; Laravel filtra y devuelve el resultado.
 *   - Crear / editar / eliminar llaman a rutas de Laravel, que validan y responden con un mensaje.
 *     (Los cambios se guardan en tu sesión, no en la base de datos: "Restaurar datos" los deshace.)
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/products' },
    { title: 'Productos', href: '/admin/examples/products' },
];

const levelBadge = {
    out: { tone: 'red', label: 'Sin stock' },
    low: { tone: 'amber', label: 'Stock bajo' },
    ok: { tone: 'green', label: 'Disponible' },
} as const;

interface Props {
    products: Paginated<ExampleProduct>;
    filters: ProductFilters;
    categories: string[];
    stats: ProductStats;
}

export default function ExampleProducts({ products, filters, categories, stats }: Props) {
    const applyFilters = useFilters('admin.examples.products', filters);
    const categoryOptions = categories.map((c) => ({ id: c, name: c }));

    const [viewing, setViewing] = useState<ExampleProduct | null>(null);
    const [editing, setEditing] = useState<ExampleProduct | 'new' | null>(null);
    const [deleting, setDeleting] = useState<ExampleProduct | null>(null);

    // Clic en una tarjeta de indicador: filtra por ese estado (otro clic lo quita)
    const toggleLevel = (level: 'low' | 'out') => applyFilters({ level: filters.level === level ? ALL : level });

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Package}
                    title="Productos"
                    description={`${stats.total} productos en el catálogo · precios en Bs`}
                    actions={
                        <>
                            <Button variant="outline" onClick={() => router.post(route('admin.examples.products.reset'))}>
                                <RotateCcw /> Restaurar datos
                            </Button>
                            <Button className="btn-brand" onClick={() => setEditing('new')}>
                                <Plus /> Nuevo producto
                            </Button>
                        </>
                    }
                />

                <ExampleNotice />

                <StatGrid>
                    <StatCard icon={Boxes} label="Productos" value={stats.total} hint={`${categories.length} categorías`} />
                    <StatCard icon={Wallet} label="Valor del inventario" value={moneyRound(stats.stock_value)} hint="Stock × costo" tone="green" />
                    <StatCard
                        icon={AlertTriangle}
                        label="Stock bajo"
                        value={stats.low}
                        hint={filters.level === 'low' ? 'Filtrando · clic para quitar' : 'Clic para ver cuáles'}
                        tone="amber"
                        colorValue
                        onClick={() => toggleLevel('low')}
                    />
                    <StatCard
                        icon={PackageX}
                        label="Sin stock"
                        value={stats.out}
                        hint={filters.level === 'out' ? 'Filtrando · clic para quitar' : 'Clic para ver cuáles'}
                        tone="red"
                        colorValue
                        onClick={() => toggleLevel('out')}
                    />
                </StatGrid>

                <div className="surface overflow-hidden rounded-xl">
                    <TableToolbar
                        perPage={Number(filters.per_page ?? 10)}
                        onPerPageChange={(n) => applyFilters({ per_page: String(n) })}
                        search={filters.search ?? ''}
                        onSearch={(search) => applyFilters({ search })}
                        searchPlaceholder="Nombre, código o marca…"
                    >
                        <SimpleSelect
                            className="w-48"
                            options={categoryOptions}
                            value={filters.category}
                            onChange={(category) => applyFilters({ category })}
                            allLabel="Todas las categorías"
                        />
                        <SimpleSelect
                            className="w-40"
                            options={Object.entries(levelBadge).map(([id, { label }]) => ({ id, name: label }))}
                            value={filters.level}
                            onChange={(level) => applyFilters({ level })}
                            allLabel="Todo el stock"
                        />
                    </TableToolbar>

                    <DataTable
                        head={
                            <>
                                <Th>Producto</Th>
                                <Th>Categoría</Th>
                                <Th align="right">Precio</Th>
                                <Th align="right">Stock</Th>
                                <Th>Estado</Th>
                                <Th className="hidden lg:table-cell">Actualizado</Th>
                                <Th align="right">Acciones</Th>
                            </>
                        }
                    >
                        {products.data.map((product) => {
                            const level = levelBadge[product.level];
                            return (
                                <tr key={product.id} className={cn(product.status === 'inactive' && 'opacity-60')}>
                                    <Td>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-muted-foreground text-xs">
                                            {product.code} · {product.brand}
                                        </p>
                                    </Td>
                                    <Td>
                                        <ToneBadge>{product.category}</ToneBadge>
                                    </Td>
                                    <Td align="right" className="font-medium">
                                        {money(product.price)}
                                    </Td>
                                    <Td align="right">
                                        {product.stock}
                                        <span className="text-muted-foreground text-xs"> / mín. {product.min_stock}</span>
                                    </Td>
                                    <Td>
                                        {product.status === 'inactive' ? (
                                            <ToneBadge dot>Inactivo</ToneBadge>
                                        ) : (
                                            <ToneBadge tone={level.tone} dot>
                                                {level.label}
                                            </ToneBadge>
                                        )}
                                    </Td>
                                    <Td className="text-muted-foreground hidden lg:table-cell">{formatDay(product.updated_at)}</Td>
                                    <Td>
                                        <RowActions>
                                            <ActionButton icon={Eye} label="Ver" tone="success" onClick={() => setViewing(product)} />
                                            <ActionButton icon={Pencil} label="Editar" onClick={() => setEditing(product)} />
                                            <ActionButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => setDeleting(product)} />
                                        </RowActions>
                                    </Td>
                                </tr>
                            );
                        })}
                        {products.data.length === 0 && <EmptyRow colSpan={7} text="No hay productos con esos filtros." />}
                    </DataTable>

                    <Pagination paginator={products} itemName="productos" />
                </div>
            </div>

            <ProductDetailDialog product={viewing} onClose={() => setViewing(null)} />
            <ProductFormDialog product={editing} categories={categoryOptions} onClose={() => setEditing(null)} />

            <ConfirmDialog
                open={deleting !== null}
                onClose={() => setDeleting(null)}
                title="¿Eliminar producto?"
                description={
                    <>
                        Se quitará <span className="text-foreground font-medium">{deleting?.name}</span> del catálogo.
                    </>
                }
                confirmLabel="Eliminar"
                destructive
                onConfirm={(done) =>
                    deleting && router.delete(route('admin.examples.products.destroy', deleting.id), { preserveScroll: true, onFinish: done })
                }
            />
        </AdminLayout>
    );
}

function ProductDetailDialog({ product, onClose }: { product: ExampleProduct | null; onClose: () => void }) {
    const margin = product ? Math.round(((product.price - product.cost) / product.price) * 100) : 0;

    return (
        <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                {product && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{product.name}</DialogTitle>
                            <DialogDescription>
                                {product.code} · {product.brand} · {product.category}
                            </DialogDescription>
                        </DialogHeader>
                        <dl className="grid grid-cols-2 gap-3 text-[13px]">
                            {[
                                ['Precio de venta', money(product.price)],
                                ['Costo', money(product.cost)],
                                ['Margen', `${margin} %`],
                                ['Stock actual', `${product.stock} unidades`],
                                ['Stock mínimo', `${product.min_stock} unidades`],
                                ['Última actualización', formatDay(product.updated_at)],
                            ].map(([label, value]) => (
                                <div key={label} className="bg-muted/50 rounded-lg px-3 py-2">
                                    <dt className="text-muted-foreground text-xs">{label}</dt>
                                    <dd className="num mt-0.5 font-medium">{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>
                                Cerrar
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

interface ProductFormDialogProps {
    product: ExampleProduct | 'new' | null;
    categories: { id: string; name: string }[];
    onClose: () => void;
}

/** Ventana de crear / editar. useForm envía a Laravel y muestra los errores de validación que devuelve. */
function ProductFormDialog({ product, categories, onClose }: ProductFormDialogProps) {
    const isNew = product === 'new';
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: '',
        name: '',
        category: categories[0]?.id ?? '',
        brand: '',
        price: '',
        stock: '',
    });

    // Al abrir la ventana se cargan los datos del producto (o el formulario vacío si es nuevo)
    useEffect(() => {
        clearErrors();
        if (product && product !== 'new') {
            setData({
                code: product.code,
                name: product.name,
                category: product.category,
                brand: product.brand,
                price: String(product.price),
                stock: String(product.stock),
            });
        } else if (product === 'new') {
            reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const options = { preserveScroll: true, onSuccess: () => onClose() };
        if (product === 'new') {
            post(route('admin.examples.products.store'), options);
        } else if (product) {
            put(route('admin.examples.products.update', product.id), options);
        }
    };

    return (
        <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{isNew ? 'Nuevo producto' : 'Editar producto'}</DialogTitle>
                        <DialogDescription>Los campos con * son obligatorios. Laravel valida antes de guardar.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nombre *" error={errors.name} className="sm:col-span-2">
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="Ej: Leche entera 1 L" autoFocus />
                        </Field>
                        <Field label="Código *" error={errors.code}>
                            <Input value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder="Ej: LAC-010" />
                        </Field>
                        <Field label="Marca" error={errors.brand}>
                            <Input value={data.brand} onChange={(e) => setData('brand', e.target.value)} placeholder="Ej: PIL" />
                        </Field>
                        <Field label="Categoría *" error={errors.category}>
                            <SimpleSelect
                                className="h-10"
                                options={categories}
                                value={data.category}
                                onChange={(value) => setData('category', value)}
                            />
                        </Field>
                        <Field label="Precio (Bs) *" error={errors.price}>
                            <Input type="number" step="0.01" min="0" value={data.price} onChange={(e) => setData('price', e.target.value)} />
                        </Field>
                        <Field label="Stock *" error={errors.stock}>
                            <Input type="number" min="0" value={data.stock} onChange={(e) => setData('stock', e.target.value)} />
                        </Field>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-brand" disabled={processing}>
                            {processing && <LoaderCircle className="animate-spin" />}
                            {isNew ? 'Crear producto' : 'Guardar cambios'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('grid content-start gap-1.5', className)}>
            <Label>{label}</Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
