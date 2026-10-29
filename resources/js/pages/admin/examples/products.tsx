import { ConfirmDialog } from '@/components/admin/common/confirm-dialog';
import { DataTable, EmptyRow, Td, Th } from '@/components/admin/common/data-table';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { SimpleSelect } from '@/components/admin/common/simple-select';
import { StatCard, StatGrid } from '@/components/admin/common/stat-card';
import { ALL, TableToolbar } from '@/components/admin/common/table-toolbar';
import { ToneBadge } from '@/components/admin/common/tone-badge';
import { type ExampleProduct, products as initialProducts, money, moneyRound, productCategories, stockLevel } from '@/components/admin/examples/data';
import { ExampleNotice, LocalPager } from '@/components/admin/examples/example-parts';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { formatDay } from '@/lib/format';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { AlertTriangle, Boxes, Download, Eye, Package, PackageX, Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import { FormEventHandler, useMemo, useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Productos  (ruta /admin/examples/products)
 * Catálogo con indicadores, buscador, filtro por categoría, paginación y acciones por fila (ver, editar, eliminar).
 * Todo funciona en el navegador con los datos de components/admin/examples/data.ts.
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

type FormState = Pick<ExampleProduct, 'code' | 'name' | 'category' | 'brand'> & { price: string; stock: string };

const emptyForm: FormState = { code: '', name: '', category: productCategories[0], brand: '', price: '', stock: '' };

export default function ExampleProducts() {
    const [items, setItems] = useState<ExampleProduct[]>(initialProducts);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<string>(ALL);
    const [level, setLevel] = useState<string>(ALL);
    const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);

    const [viewing, setViewing] = useState<ExampleProduct | null>(null);
    const [editing, setEditing] = useState<ExampleProduct | 'new' | null>(null);
    const [deleting, setDeleting] = useState<ExampleProduct | null>(null);

    const filtered = useMemo(() => {
        const term = search.toLowerCase();
        return items.filter(
            (p) =>
                (category === ALL || p.category === category) &&
                (level === ALL || stockLevel(p) === level) &&
                (!term || `${p.name} ${p.code} ${p.brand}`.toLowerCase().includes(term)),
        );
    }, [items, search, category, level]);

    const visible = filtered.slice((page - 1) * perPage, page * perPage);

    const stockValue = items.reduce((sum, p) => sum + p.stock * p.cost, 0);
    const lowCount = items.filter((p) => stockLevel(p) === 'low').length;
    const outCount = items.filter((p) => stockLevel(p) === 'out').length;

    const applyFilter = (change: () => void) => {
        change();
        setPage(1);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Productos (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Package}
                    title="Productos"
                    description={`${items.length} productos en el catálogo · precios en Bs`}
                    actions={
                        <>
                            <Button variant="outline">
                                <Download /> Exportar
                            </Button>
                            <Button className="btn-brand" onClick={() => setEditing('new')}>
                                <Plus /> Nuevo producto
                            </Button>
                        </>
                    }
                />

                <ExampleNotice />

                <StatGrid>
                    <StatCard icon={Boxes} label="Productos" value={items.length} hint={`${productCategories.length} categorías`} />
                    <StatCard icon={Wallet} label="Valor del inventario" value={moneyRound(stockValue)} hint="Stock × costo" tone="green" />
                    <StatCard
                        icon={AlertTriangle}
                        label="Stock bajo"
                        value={lowCount}
                        hint="Por debajo del mínimo"
                        tone="amber"
                        colorValue
                        onClick={() => applyFilter(() => setLevel(level === 'low' ? ALL : 'low'))}
                    />
                    <StatCard
                        icon={PackageX}
                        label="Sin stock"
                        value={outCount}
                        hint="Reponer cuanto antes"
                        tone="red"
                        colorValue
                        onClick={() => applyFilter(() => setLevel(level === 'out' ? ALL : 'out'))}
                    />
                </StatGrid>

                <div className="surface overflow-hidden rounded-xl">
                    <TableToolbar
                        perPage={perPage}
                        onPerPageChange={(n) => applyFilter(() => setPerPage(n))}
                        search={search}
                        onSearch={(value) => applyFilter(() => setSearch(value))}
                        searchPlaceholder="Nombre, código o marca…"
                    >
                        <SimpleSelect
                            className="w-48"
                            options={productCategories.map((c) => ({ id: c, name: c }))}
                            value={category}
                            onChange={(value) => applyFilter(() => setCategory(value))}
                            allLabel="Todas las categorías"
                        />
                        <SimpleSelect
                            className="w-40"
                            options={Object.entries(levelBadge).map(([id, { label }]) => ({ id, name: label }))}
                            value={level}
                            onChange={(value) => applyFilter(() => setLevel(value))}
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
                        {visible.map((product) => {
                            const level = levelBadge[stockLevel(product)];
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
                                        <span className="text-muted-foreground text-xs"> / mín. {product.minStock}</span>
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
                                    <Td className="text-muted-foreground hidden lg:table-cell">{formatDay(product.updatedAt)}</Td>
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
                        {visible.length === 0 && <EmptyRow colSpan={7} text="No hay productos con esos filtros." />}
                    </DataTable>

                    <LocalPager page={page} perPage={perPage} total={filtered.length} onPageChange={setPage} itemName="productos" />
                </div>
            </div>

            <ProductDetailDialog product={viewing} onClose={() => setViewing(null)} />

            <ProductFormDialog
                product={editing}
                onClose={() => setEditing(null)}
                onSave={(saved) => {
                    setItems((list) => (list.some((p) => p.id === saved.id) ? list.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...list]));
                    setEditing(null);
                }}
            />

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
                onConfirm={(done) => {
                    setItems((list) => list.filter((p) => p.id !== deleting?.id));
                    done();
                }}
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
                                ['Stock mínimo', `${product.minStock} unidades`],
                                ['Última actualización', formatDay(product.updatedAt)],
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
    onClose: () => void;
    onSave: (product: ExampleProduct) => void;
}

function ProductFormDialog({ product, onClose, onSave }: ProductFormDialogProps) {
    const isNew = product === 'new';
    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
    const [openedFor, setOpenedFor] = useState<ExampleProduct | 'new' | null>(null);

    // Al abrir la ventana se cargan los datos del producto (o el formulario vacío si es nuevo)
    if (product !== openedFor) {
        setOpenedFor(product);
        setErrors({});
        setForm(
            product && product !== 'new'
                ? { ...product, price: String(product.price), stock: String(product.stock) }
                : { ...emptyForm, code: `NUE-${String(Date.now()).slice(-3)}` },
        );
    }

    const set = (key: keyof FormState, value: string) => setForm((f) => ({ ...f, [key]: value }));

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const found: typeof errors = {};
        if (!form.name.trim()) found.name = 'El nombre es obligatorio.';
        if (!(Number(form.price) > 0)) found.price = 'Ingresa un precio mayor a 0.';
        if (form.stock === '' || Number(form.stock) < 0) found.stock = 'El stock no puede ser negativo.';
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        const base = product && product !== 'new' ? product : null;
        onSave({
            id: base?.id ?? Date.now(),
            code: form.code,
            name: form.name.trim(),
            category: form.category,
            brand: form.brand.trim() || 'Sin marca',
            price: Number(form.price),
            cost: base?.cost ?? Number(form.price) * 0.7,
            stock: Number(form.stock),
            minStock: base?.minStock ?? 10,
            status: base?.status ?? 'active',
            updatedAt: new Date().toISOString().slice(0, 10),
        });
    };

    return (
        <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg">
                <form onSubmit={submit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle>{isNew ? 'Nuevo producto' : 'Editar producto'}</DialogTitle>
                        <DialogDescription>Los campos con * son obligatorios.</DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Nombre *" error={errors.name} className="sm:col-span-2">
                            <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: Leche entera 1 L" autoFocus />
                        </Field>
                        <Field label="Código">
                            <Input value={form.code} onChange={(e) => set('code', e.target.value)} />
                        </Field>
                        <Field label="Marca">
                            <Input value={form.brand} onChange={(e) => set('brand', e.target.value)} placeholder="Ej: PIL" />
                        </Field>
                        <Field label="Categoría">
                            <SimpleSelect
                                className="h-10"
                                options={productCategories.map((c) => ({ id: c, name: c }))}
                                value={form.category}
                                onChange={(value) => set('category', value)}
                            />
                        </Field>
                        <Field label="Precio (Bs) *" error={errors.price}>
                            <Input type="number" step="0.01" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} />
                        </Field>
                        <Field label="Stock *" error={errors.stock}>
                            <Input type="number" min="0" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
                        </Field>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="btn-brand">
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
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}
