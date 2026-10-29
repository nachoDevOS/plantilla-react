/*
 * DATOS Y TIPOS de las páginas de "Ejemplos" del menú.
 *
 * Productos, ventas y clientes vienen del SERVIDOR (app/Support/ExampleData.php → ExampleController),
 * paginados y filtrados allá, igual que un módulo real. Aquí quedan sus tipos y los datos de los gráficos,
 * del tablero de tareas y de la actividad, que no son listas paginadas.
 * Cuando hagas tus módulos reales, este archivo se puede borrar junto con pages/admin/examples/.
 */

/** Moneda de los ejemplos. */
export const CURRENCY = 'Bs';

/** Monto con 2 decimales y moneda: money(12.5) → "Bs 12,50". */
export function money(value: number, withCurrency = true): string {
    const amount = value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return withCurrency ? `${CURRENCY} ${amount}` : amount;
}

/** Monto redondeado, sin decimales, para indicadores grandes: moneyRound(30020.4) → "Bs 30.020". */
export function moneyRound(value: number): string {
    return `${CURRENCY} ${Math.round(value).toLocaleString('es-BO')}`;
}

/* ----------------------------------------------------------------------------------------------
 | PRODUCTOS
 ---------------------------------------------------------------------------------------------- */

export type ProductStatus = 'active' | 'inactive';
export type StockLevel = 'out' | 'low' | 'ok';

/** Una fila de productos tal como la manda ExampleController::products(). */
export interface ExampleProduct {
    id: number;
    code: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    cost: number;
    stock: number;
    min_stock: number;
    status: ProductStatus;
    updated_at: string;
    level: StockLevel;
}

export interface ProductFilters {
    search?: string;
    category?: string;
    level?: string;
    per_page?: string;
}

export interface ProductStats {
    total: number;
    stock_value: number;
    low: number;
    out: number;
}

/* ----------------------------------------------------------------------------------------------
 | CLIENTES
 ---------------------------------------------------------------------------------------------- */

export type CustomerSegment = 'vip' | 'frecuente' | 'nuevo' | 'empresa';

/** Una fila de clientes tal como la manda ExampleController::customers(). */
export interface ExampleCustomer {
    id: number;
    name: string;
    document: string;
    email: string;
    phone: string;
    city: string;
    segment: CustomerSegment;
    orders: number;
    spent: number;
    last_purchase: string;
}

export interface CustomerFilters {
    search?: string;
    segment?: string;
    per_page?: string;
}

export const segmentLabels: Record<CustomerSegment, string> = {
    vip: 'VIP',
    frecuente: 'Frecuente',
    nuevo: 'Nuevo',
    empresa: 'Empresa',
};

/* ----------------------------------------------------------------------------------------------
 | VENTAS
 ---------------------------------------------------------------------------------------------- */

export type SaleStatus = 'paid' | 'pending' | 'cancelled';
export type PaymentMethod = 'Efectivo' | 'QR' | 'Tarjeta' | 'Transferencia';

export interface ExampleSaleItem {
    product: string;
    quantity: number;
    price: number;
}

export interface ExampleSale {
    id: number;
    number: string;
    customer: string;
    seller: string;
    date: string;
    method: PaymentMethod;
    status: SaleStatus;
    items: ExampleSaleItem[];
    total: number;
}

export interface SaleFilters {
    search?: string;
    status?: string;
    per_page?: string;
}

export interface SaleStats {
    today: number;
    average: number;
    paid_count: number;
    pending: number;
}

export const saleStatusLabels: Record<SaleStatus, string> = { paid: 'Pagada', pending: 'Pendiente', cancelled: 'Anulada' };

/** Ventas de los últimos 14 días (para el gráfico de barras). */
export const dailySales: { day: string; total: number }[] = [
    { day: '16 oct', total: 1820 },
    { day: '17 oct', total: 2140 },
    { day: '18 oct', total: 1310 },
    { day: '19 oct', total: 960 },
    { day: '20 oct', total: 2480 },
    { day: '21 oct', total: 2215 },
    { day: '22 oct', total: 2790 },
    { day: '23 oct', total: 1990 },
    { day: '24 oct', total: 3120 },
    { day: '25 oct', total: 1640 },
    { day: '26 oct', total: 1150 },
    { day: '27 oct', total: 2960 },
    { day: '28 oct', total: 3380 },
    { day: '29 oct', total: 2045 },
];

/** Cómo pagaron este mes (para la barra de métodos de pago). */
export const paymentBreakdown: { method: PaymentMethod; total: number; color: string }[] = [
    { method: 'Efectivo', total: 14250, color: 'var(--chart-1)' },
    { method: 'QR', total: 9870, color: 'var(--chart-3)' },
    { method: 'Tarjeta', total: 5320, color: 'var(--chart-4)' },
    { method: 'Transferencia', total: 4110, color: 'var(--chart-5)' },
];

/* ----------------------------------------------------------------------------------------------
 | TAREAS (tablero)
 ---------------------------------------------------------------------------------------------- */

export type TaskColumn = 'todo' | 'doing' | 'review' | 'done';
export type TaskPriority = 'alta' | 'media' | 'baja';

export interface ExampleTask {
    id: number;
    title: string;
    description: string;
    column: TaskColumn;
    priority: TaskPriority;
    assignee: string;
    due: string;
    tag: string;
    progress?: number;
}

export const taskColumns: { id: TaskColumn; title: string; dot: string }[] = [
    { id: 'todo', title: 'Por hacer', dot: 'bg-zinc-400' },
    { id: 'doing', title: 'En curso', dot: 'bg-sky-500' },
    { id: 'review', title: 'En revisión', dot: 'bg-amber-500' },
    { id: 'done', title: 'Terminado', dot: 'bg-emerald-500' },
];

export const tasks: ExampleTask[] = [
    {
        id: 1,
        title: 'Inventario de fin de mes',
        description: 'Contar el depósito central y cargar las diferencias.',
        column: 'todo',
        priority: 'alta',
        assignee: 'Pedro Suárez',
        due: '2026-10-31',
        tag: 'Inventario',
    },
    {
        id: 2,
        title: 'Actualizar lista de precios',
        description: 'Subir 5 % a lácteos según la nueva tabla del proveedor.',
        column: 'todo',
        priority: 'media',
        assignee: 'Carla Méndez',
        due: '2026-11-03',
        tag: 'Precios',
    },
    {
        id: 3,
        title: 'Capacitar cajero nuevo',
        description: 'Apertura y cierre de caja, ventas con QR.',
        column: 'todo',
        priority: 'baja',
        assignee: 'Luis Rojas',
        due: '2026-11-05',
        tag: 'Personal',
    },
    {
        id: 4,
        title: 'Pedido a Distribuidora Mamoré',
        description: 'Agua, gaseosas y galletas para la semana.',
        column: 'doing',
        priority: 'alta',
        assignee: 'Pedro Suárez',
        due: '2026-10-30',
        tag: 'Compras',
        progress: 60,
    },
    {
        id: 5,
        title: 'Promoción de snacks',
        description: 'Armar combos 2x1 para el fin de semana.',
        column: 'doing',
        priority: 'media',
        assignee: 'Carla Méndez',
        due: '2026-11-01',
        tag: 'Marketing',
        progress: 35,
    },
    {
        id: 6,
        title: 'Revisar cierre de caja del lunes',
        description: 'Diferencia de Bs 12,50 en el turno de la tarde.',
        column: 'review',
        priority: 'alta',
        assignee: 'Administrador',
        due: '2026-10-29',
        tag: 'Caja',
    },
    {
        id: 7,
        title: 'Nuevo proveedor de limpieza',
        description: 'Comparar 3 cotizaciones y elegir una.',
        column: 'review',
        priority: 'baja',
        assignee: 'Luis Rojas',
        due: '2026-11-04',
        tag: 'Compras',
    },
    {
        id: 8,
        title: 'Etiquetas de precios',
        description: 'Imprimir y colocar etiquetas de la góndola 3.',
        column: 'done',
        priority: 'media',
        assignee: 'Pedro Suárez',
        due: '2026-10-27',
        tag: 'Tienda',
    },
    {
        id: 9,
        title: 'Respaldo de la base de datos',
        description: 'Copia semanal en el disco externo.',
        column: 'done',
        priority: 'baja',
        assignee: 'Administrador',
        due: '2026-10-26',
        tag: 'Sistema',
    },
];

export const priorityLabels: Record<TaskPriority, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' };

/* ----------------------------------------------------------------------------------------------
 | ACTIVIDAD RECIENTE (línea de tiempo)
 ---------------------------------------------------------------------------------------------- */

export const activity: { id: number; who: string; what: string; when: string; tone: 'blue' | 'green' | 'amber' | 'red' }[] = [
    { id: 1, who: 'Luis Rojas', what: 'registró la venta V-00128 por Bs 85,00', when: 'hace 12 minutos', tone: 'green' },
    { id: 2, who: 'Carla Méndez', what: 'editó el precio de “Yogurt frutilla 1 L”', when: 'hace 1 hora', tone: 'blue' },
    { id: 3, who: 'Pedro Suárez', what: 'marcó “Aceite vegetal 900 ml” sin stock', when: 'hace 3 horas', tone: 'amber' },
    { id: 4, who: 'Administrador', what: 'anuló la venta V-00124', when: 'ayer', tone: 'red' },
    { id: 5, who: 'Luis Rojas', what: 'registró al cliente “Roberto Antelo”', when: 'hace 2 días', tone: 'blue' },
];
