import { ConfirmDialog } from '@/components/admin/common/confirm-dialog';
import { PageHeader } from '@/components/admin/common/page-header';
import { ActionButton, RowActions } from '@/components/admin/common/row-actions';
import { StatCard, StatGrid } from '@/components/admin/common/stat-card';
import { ToneBadge } from '@/components/admin/common/tone-badge';
import { Panel, PanelHeader } from '@/components/admin/dashboard/panel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AdminLayout from '@/layouts/admin/admin-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import {
    AlertTriangle,
    CheckCircle2,
    Download,
    Eye,
    Info,
    LoaderCircle,
    Palette,
    Pencil,
    Plus,
    Power,
    Search,
    Shapes,
    Sparkles,
    Trash2,
    Type,
    Users,
    Wallet,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Componentes  (ruta /admin/examples/components)
 * Catálogo visual de las piezas del sistema: botones, acciones de tabla, etiquetas, avisos, indicadores,
 * tipografía y colores. Sirve para copiar el código de cada pieza al hacer una pantalla nueva.
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/components' },
    { title: 'Componentes', href: '/admin/examples/components' },
];

const colorTokens = [
    { name: 'primary', className: 'bg-primary' },
    { name: 'secondary', className: 'bg-secondary' },
    { name: 'muted', className: 'bg-muted' },
    { name: 'accent', className: 'bg-accent' },
    { name: 'destructive', className: 'bg-destructive' },
    { name: 'sidebar', className: 'bg-sidebar' },
    { name: 'chart-1', className: 'bg-chart-1' },
    { name: 'chart-2', className: 'bg-chart-2' },
    { name: 'chart-3', className: 'bg-chart-3' },
    { name: 'chart-4', className: 'bg-chart-4' },
    { name: 'chart-5', className: 'bg-chart-5' },
];

const alerts = [
    {
        icon: Info,
        title: 'Información',
        text: 'El cierre de caja se hace al final de cada turno.',
        className: 'border-blue-300/70 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200',
    },
    {
        icon: CheckCircle2,
        title: 'Éxito',
        text: 'Los cambios se guardaron correctamente.',
        className: 'border-emerald-300/70 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
    },
    {
        icon: AlertTriangle,
        title: 'Atención',
        text: 'Hay 3 productos por debajo del stock mínimo.',
        className: 'border-amber-300/70 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
    },
    {
        icon: XCircle,
        title: 'Error',
        text: 'No se pudo conectar con el servidor. Intenta otra vez.',
        className: 'border-rose-300/70 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200',
    },
];

export default function ExampleComponents() {
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    const fakeLoad = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 1500);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Componentes (ejemplo)" />
            <div className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={Shapes}
                    title="Componentes"
                    description="Las piezas del sistema con su estilo. Copia el código de cada una desde este archivo."
                />

                {/* Botones */}
                <Panel>
                    <PanelHeader icon={Sparkles} title="Botones" description="<Button variant=… size=…> · components/ui/button.tsx" />
                    <div className="space-y-6 p-5">
                        <Row label="Variantes">
                            <Button className="btn-brand">
                                <Plus /> Principal
                            </Button>
                            <Button variant="success">
                                <CheckCircle2 /> Aprobar
                            </Button>
                            <Button variant="destructive">
                                <Trash2 /> Eliminar
                            </Button>
                            <Button variant="outline">
                                <Download /> Exportar
                            </Button>
                            <Button variant="secondary">Secundario</Button>
                            <Button variant="ghost">Fantasma</Button>
                            <Button variant="link">Enlace</Button>
                        </Row>
                        <Row label="Acciones (ver · editar · eliminar)">
                            <Button variant="ver">
                                <Eye /> Ver
                            </Button>
                            <Button variant="editar">
                                <Pencil /> Editar
                            </Button>
                            <Button variant="eliminar">
                                <Trash2 /> Eliminar
                            </Button>
                        </Row>
                        <Row label="Tamaños">
                            <Button size="sm" className="btn-brand">
                                Pequeño
                            </Button>
                            <Button className="btn-brand">Normal</Button>
                            <Button size="lg" className="btn-brand">
                                Grande
                            </Button>
                            <Button size="icon" variant="outline" aria-label="Buscar">
                                <Search />
                            </Button>
                        </Row>
                        <Row label="Estados">
                            <Button className="btn-brand" onClick={fakeLoad} disabled={loading}>
                                {loading ? <LoaderCircle className="animate-spin" /> : <Wallet />} {loading ? 'Guardando…' : 'Clic para cargar'}
                            </Button>
                            <Button disabled>Deshabilitado</Button>
                            <Button variant="outline" onClick={() => setConfirming(true)}>
                                Abrir confirmación
                            </Button>
                        </Row>
                    </div>
                </Panel>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Acciones de tabla */}
                    <Panel>
                        <PanelHeader icon={Pencil} title="Acciones de tabla" description="<ActionButton tone=…> · row-actions.tsx" />
                        <div className="space-y-4 p-5">
                            <RowActions className="justify-start">
                                <ActionButton icon={Eye} label="Ver" tone="success" onClick={() => undefined} />
                                <ActionButton icon={Pencil} label="Editar" onClick={() => undefined} />
                                <ActionButton icon={Power} label="Desactivar" tone="warning" onClick={() => undefined} />
                                <ActionButton icon={Trash2} label="Eliminar" tone="danger" onClick={() => undefined} />
                                <ActionButton
                                    icon={Trash2}
                                    label="Eliminar"
                                    tone="danger"
                                    disabled
                                    disabledReason="No puedes eliminarte a ti mismo"
                                    onClick={() => undefined}
                                />
                            </RowActions>
                            <p className="text-muted-foreground text-xs">
                                Pasa el mouse sobre cada botón para ver su nombre. El último está deshabilitado y explica por qué.
                            </p>
                        </div>
                    </Panel>

                    {/* Etiquetas */}
                    <Panel>
                        <PanelHeader icon={Type} title="Etiquetas" description="<ToneBadge tone=… dot> · tone-badge.tsx" />
                        <div className="space-y-4 p-5">
                            <div className="flex flex-wrap gap-2">
                                <ToneBadge>Neutro</ToneBadge>
                                <ToneBadge tone="blue">Información</ToneBadge>
                                <ToneBadge tone="green">Pagada</ToneBadge>
                                <ToneBadge tone="amber">Pendiente</ToneBadge>
                                <ToneBadge tone="red">Anulada</ToneBadge>
                                <ToneBadge tone="violet">VIP</ToneBadge>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <ToneBadge tone="green" dot>
                                    Activo
                                </ToneBadge>
                                <ToneBadge tone="amber" dot>
                                    Stock bajo
                                </ToneBadge>
                                <ToneBadge tone="red" dot>
                                    Sin stock
                                </ToneBadge>
                                <ToneBadge dot>Inactivo</ToneBadge>
                            </div>
                        </div>
                    </Panel>
                </div>

                {/* Indicadores */}
                <StatGrid>
                    <StatCard icon={Users} label="Tono blue" value="1.248" hint="Normal" />
                    <StatCard icon={Wallet} label="Tono green" value="Bs 8.540" hint="Dinero que entra" tone="green" colorValue />
                    <StatCard icon={AlertTriangle} label="Tono amber" value={12} hint="Requiere atención" tone="amber" colorValue />
                    <StatCard icon={XCircle} label="Tono red" value={3} hint="Problema" tone="red" colorValue />
                </StatGrid>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Avisos */}
                    <Panel>
                        <PanelHeader icon={Info} title="Avisos" description="Mensajes dentro de la página" />
                        <div className="space-y-3 p-5">
                            {alerts.map((alert) => (
                                <div
                                    key={alert.title}
                                    className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-[13px]', alert.className)}
                                >
                                    <alert.icon className="mt-0.5 size-4 shrink-0" />
                                    <p>
                                        <span className="font-semibold">{alert.title}.</span> {alert.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Tipografía */}
                    <Panel>
                        <PanelHeader icon={Type} title="Tipografía" description="Instrument Sans · tamaños del sistema" />
                        <div className="space-y-3 p-5">
                            <p className="font-display text-2xl font-bold">Título de página · 24 px</p>
                            <p className="text-base font-semibold">Título de bloque · 16 px</p>
                            <p className="text-sm font-semibold">Encabezado de panel · 14 px</p>
                            <p className="text-[13px]">Texto de tablas y formularios · 13 px</p>
                            <p className="text-muted-foreground text-xs">Texto de apoyo · 12 px</p>
                            <p className="text-muted-foreground text-[11px] font-semibold tracking-wider uppercase">Cabecera de tabla · 11 px</p>
                            <p className="num font-display text-xl font-bold">Bs 12.345,67 · números alineados</p>
                        </div>
                    </Panel>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Colores */}
                    <Panel>
                        <PanelHeader icon={Palette} title="Colores del tema" description="Variables de resources/css/app.css" />
                        <div className="grid grid-cols-3 gap-3 p-5 sm:grid-cols-4">
                            {colorTokens.map((token) => (
                                <div key={token.name} className="space-y-1.5">
                                    <div className={cn('h-12 rounded-lg border', token.className)} />
                                    <p className="text-muted-foreground font-mono text-[11px]">{token.name}</p>
                                </div>
                            ))}
                        </div>
                    </Panel>

                    {/* Carga y vacío */}
                    <Panel>
                        <PanelHeader icon={LoaderCircle} title="Cargando y vacío" description="Mientras llegan los datos · cuando no hay nada" />
                        <div className="grid gap-5 p-5 sm:grid-cols-2">
                            <div className="space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-6 text-center">
                                <div className="bg-muted flex size-11 items-center justify-center rounded-full">
                                    <Search className="text-muted-foreground size-5" />
                                </div>
                                <p className="text-muted-foreground text-[13px]">Sin resultados.</p>
                                <Button size="sm" variant="outline">
                                    Limpiar filtros
                                </Button>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <ConfirmDialog
                open={confirming}
                onClose={() => setConfirming(false)}
                title="¿Confirmar la acción?"
                description="Así se ve la ventana de confirmación del sistema."
                confirmLabel="Sí, continuar"
                onConfirm={(done) => setTimeout(done, 700)}
            />
        </AdminLayout>
    );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-2 md:grid-cols-[12rem_1fr] md:items-center">
            <p className="text-muted-foreground text-xs font-medium">{label}</p>
            <div className="flex flex-wrap items-center gap-2">{children}</div>
        </div>
    );
}
