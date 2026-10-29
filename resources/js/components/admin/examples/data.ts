/*
 * DATOS DE EJEMPLO (escritos a mano) para las páginas de "Ejemplos" del menú.
 * Sirven para ver cómo queda cada pantalla antes de tener base de datos.
 * Cuando hagas el módulo real, estos datos los manda Laravel desde un controlador (props de Inertia)
 * y este archivo se puede borrar junto con pages/admin/examples/.
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

export interface ExampleProduct {
    id: number;
    code: string;
    name: string;
    category: string;
    brand: string;
    price: number;
    cost: number;
    stock: number;
    minStock: number;
    status: ProductStatus;
    updatedAt: string;
}

export const productCategories = ['Bebidas', 'Abarrotes', 'Limpieza', 'Lácteos', 'Panadería', 'Snacks'];

export const products: ExampleProduct[] = [
    {
        id: 1,
        code: 'BEB-001',
        name: 'Agua mineral 2 L',
        category: 'Bebidas',
        brand: 'Vital',
        price: 8,
        cost: 5.2,
        stock: 140,
        minStock: 40,
        status: 'active',
        updatedAt: '2026-10-28',
    },
    {
        id: 2,
        code: 'BEB-002',
        name: 'Gaseosa cola 3 L',
        category: 'Bebidas',
        brand: 'Coca-Cola',
        price: 16.5,
        cost: 12,
        stock: 62,
        minStock: 30,
        status: 'active',
        updatedAt: '2026-10-27',
    },
    {
        id: 3,
        code: 'BEB-003',
        name: 'Jugo de durazno 1 L',
        category: 'Bebidas',
        brand: 'Del Valle',
        price: 11,
        cost: 7.8,
        stock: 18,
        minStock: 25,
        status: 'active',
        updatedAt: '2026-10-25',
    },
    {
        id: 4,
        code: 'ABA-001',
        name: 'Arroz grano de oro 5 kg',
        category: 'Abarrotes',
        brand: 'Caisy',
        price: 45,
        cost: 36,
        stock: 35,
        minStock: 15,
        status: 'active',
        updatedAt: '2026-10-28',
    },
    {
        id: 5,
        code: 'ABA-002',
        name: 'Aceite vegetal 900 ml',
        category: 'Abarrotes',
        brand: 'Fino',
        price: 14.5,
        cost: 11.2,
        stock: 0,
        minStock: 20,
        status: 'active',
        updatedAt: '2026-10-20',
    },
    {
        id: 6,
        code: 'ABA-003',
        name: 'Azúcar morena 1 kg',
        category: 'Abarrotes',
        brand: 'Guabirá',
        price: 7.5,
        cost: 5.9,
        stock: 88,
        minStock: 30,
        status: 'active',
        updatedAt: '2026-10-26',
    },
    {
        id: 7,
        code: 'ABA-004',
        name: 'Fideo tallarín 400 g',
        category: 'Abarrotes',
        brand: 'Lazzaroni',
        price: 6,
        cost: 4.1,
        stock: 120,
        minStock: 40,
        status: 'active',
        updatedAt: '2026-10-22',
    },
    {
        id: 8,
        code: 'LIM-001',
        name: 'Detergente en polvo 1 kg',
        category: 'Limpieza',
        brand: 'Omo',
        price: 22,
        cost: 16.5,
        stock: 9,
        minStock: 12,
        status: 'active',
        updatedAt: '2026-10-24',
    },
    {
        id: 9,
        code: 'LIM-002',
        name: 'Lavandina 2 L',
        category: 'Limpieza',
        brand: 'Sapolio',
        price: 9.5,
        cost: 6.3,
        stock: 46,
        minStock: 15,
        status: 'active',
        updatedAt: '2026-10-19',
    },
    {
        id: 10,
        code: 'LIM-003',
        name: 'Papel higiénico x4',
        category: 'Limpieza',
        brand: 'Scott',
        price: 12,
        cost: 8.4,
        stock: 75,
        minStock: 25,
        status: 'inactive',
        updatedAt: '2026-09-30',
    },
    {
        id: 11,
        code: 'LAC-001',
        name: 'Leche entera 1 L',
        category: 'Lácteos',
        brand: 'PIL',
        price: 7,
        cost: 5.4,
        stock: 54,
        minStock: 40,
        status: 'active',
        updatedAt: '2026-10-29',
    },
    {
        id: 12,
        code: 'LAC-002',
        name: 'Yogurt frutilla 1 L',
        category: 'Lácteos',
        brand: 'PIL',
        price: 13,
        cost: 9.6,
        stock: 22,
        minStock: 20,
        status: 'active',
        updatedAt: '2026-10-28',
    },
    {
        id: 13,
        code: 'LAC-003',
        name: 'Queso menonita 500 g',
        category: 'Lácteos',
        brand: 'La Estancia',
        price: 28,
        cost: 21,
        stock: 4,
        minStock: 10,
        status: 'active',
        updatedAt: '2026-10-27',
    },
    {
        id: 14,
        code: 'PAN-001',
        name: 'Pan molde integral',
        category: 'Panadería',
        brand: 'Bimbo',
        price: 15,
        cost: 10.8,
        stock: 30,
        minStock: 12,
        status: 'active',
        updatedAt: '2026-10-29',
    },
    {
        id: 15,
        code: 'PAN-002',
        name: 'Galletas de agua 200 g',
        category: 'Panadería',
        brand: 'Mabel',
        price: 4.5,
        cost: 3,
        stock: 160,
        minStock: 50,
        status: 'active',
        updatedAt: '2026-10-23',
    },
    {
        id: 16,
        code: 'SNK-001',
        name: 'Papas fritas 150 g',
        category: 'Snacks',
        brand: 'Pringles',
        price: 18,
        cost: 13.2,
        stock: 40,
        minStock: 20,
        status: 'active',
        updatedAt: '2026-10-21',
    },
    {
        id: 17,
        code: 'SNK-002',
        name: 'Maní salado 100 g',
        category: 'Snacks',
        brand: 'Karinto',
        price: 5,
        cost: 3.2,
        stock: 0,
        minStock: 30,
        status: 'inactive',
        updatedAt: '2026-10-02',
    },
    {
        id: 18,
        code: 'SNK-003',
        name: 'Chocolate con leche 80 g',
        category: 'Snacks',
        brand: 'Para Ti',
        price: 9,
        cost: 6.1,
        stock: 68,
        minStock: 25,
        status: 'active',
        updatedAt: '2026-10-26',
    },
];

/** Estado del stock según la cantidad y el mínimo del producto. */
export function stockLevel(product: ExampleProduct): 'out' | 'low' | 'ok' {
    if (product.stock === 0) return 'out';
    if (product.stock < product.minStock) return 'low';
    return 'ok';
}

/* ----------------------------------------------------------------------------------------------
 | CLIENTES
 ---------------------------------------------------------------------------------------------- */

export type CustomerSegment = 'vip' | 'frecuente' | 'nuevo' | 'empresa';

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
    lastPurchase: string;
}

export const segmentLabels: Record<CustomerSegment, string> = {
    vip: 'VIP',
    frecuente: 'Frecuente',
    nuevo: 'Nuevo',
    empresa: 'Empresa',
};

export const customers: ExampleCustomer[] = [
    {
        id: 1,
        name: 'María Fernanda Rojas',
        document: '6234512',
        email: 'maria.rojas@correo.com',
        phone: '71234567',
        city: 'Trinidad',
        segment: 'vip',
        orders: 48,
        spent: 9820.5,
        lastPurchase: '2026-10-28',
    },
    {
        id: 2,
        name: 'Comercial El Puerto SRL',
        document: '1023456021',
        email: 'compras@elpuerto.bo',
        phone: '33456789',
        city: 'Santa Cruz',
        segment: 'empresa',
        orders: 31,
        spent: 24150,
        lastPurchase: '2026-10-27',
    },
    {
        id: 3,
        name: 'José Luis Vargas',
        document: '5123987',
        email: 'jlvargas@correo.com',
        phone: '76543210',
        city: 'Trinidad',
        segment: 'frecuente',
        orders: 22,
        spent: 3410.75,
        lastPurchase: '2026-10-26',
    },
    {
        id: 4,
        name: 'Ana Cecilia Montaño',
        document: '7345120',
        email: 'ana.montano@correo.com',
        phone: '72109876',
        city: 'Riberalta',
        segment: 'nuevo',
        orders: 2,
        spent: 185,
        lastPurchase: '2026-10-25',
    },
    {
        id: 5,
        name: 'Distribuidora Mamoré',
        document: '2034567012',
        email: 'ventas@mamore.bo',
        phone: '34621100',
        city: 'Guayaramerín',
        segment: 'empresa',
        orders: 19,
        spent: 18760.4,
        lastPurchase: '2026-10-22',
    },
    {
        id: 6,
        name: 'Carlos Eduardo Suárez',
        document: '4987321',
        email: 'csuarez@correo.com',
        phone: '78812345',
        city: 'La Paz',
        segment: 'frecuente',
        orders: 15,
        spent: 2245.3,
        lastPurchase: '2026-10-20',
    },
    {
        id: 7,
        name: 'Lucía Pereira Gómez',
        document: '8123456',
        email: 'lucia.pereira@correo.com',
        phone: '69087654',
        city: 'Cochabamba',
        segment: 'vip',
        orders: 39,
        spent: 7650,
        lastPurchase: '2026-10-29',
    },
    {
        id: 8,
        name: 'Roberto Antelo',
        document: '3456789',
        email: 'rantelo@correo.com',
        phone: '77001122',
        city: 'Trinidad',
        segment: 'nuevo',
        orders: 1,
        spent: 64.5,
        lastPurchase: '2026-10-18',
    },
    {
        id: 9,
        name: 'Patricia Melgar',
        document: '6789012',
        email: 'pmelgar@correo.com',
        phone: '73334455',
        city: 'San Borja',
        segment: 'frecuente',
        orders: 12,
        spent: 1980,
        lastPurchase: '2026-10-15',
    },
];

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
}

export const sales: ExampleSale[] = [
    {
        id: 1,
        number: 'V-00128',
        customer: 'María Fernanda Rojas',
        seller: 'Luis Rojas',
        date: '2026-10-29T10:24:00',
        method: 'QR',
        status: 'paid',
        items: [
            { product: 'Leche entera 1 L', quantity: 6, price: 7 },
            { product: 'Pan molde integral', quantity: 2, price: 15 },
            { product: 'Yogurt frutilla 1 L', quantity: 1, price: 13 },
        ],
    },
    {
        id: 2,
        number: 'V-00127',
        customer: 'Comercial El Puerto SRL',
        seller: 'Luis Rojas',
        date: '2026-10-29T09:02:00',
        method: 'Transferencia',
        status: 'pending',
        items: [
            { product: 'Arroz grano de oro 5 kg', quantity: 10, price: 45 },
            { product: 'Aceite vegetal 900 ml', quantity: 24, price: 14.5 },
        ],
    },
    {
        id: 3,
        number: 'V-00126',
        customer: 'Consumidor final',
        seller: 'Carla Méndez',
        date: '2026-10-28T18:45:00',
        method: 'Efectivo',
        status: 'paid',
        items: [
            { product: 'Gaseosa cola 3 L', quantity: 2, price: 16.5 },
            { product: 'Papas fritas 150 g', quantity: 3, price: 18 },
        ],
    },
    {
        id: 4,
        number: 'V-00125',
        customer: 'José Luis Vargas',
        seller: 'Carla Méndez',
        date: '2026-10-28T16:10:00',
        method: 'Tarjeta',
        status: 'paid',
        items: [
            { product: 'Detergente en polvo 1 kg', quantity: 2, price: 22 },
            { product: 'Lavandina 2 L', quantity: 2, price: 9.5 },
        ],
    },
    {
        id: 5,
        number: 'V-00124',
        customer: 'Lucía Pereira Gómez',
        seller: 'Luis Rojas',
        date: '2026-10-28T11:30:00',
        method: 'QR',
        status: 'cancelled',
        items: [{ product: 'Queso menonita 500 g', quantity: 1, price: 28 }],
    },
    {
        id: 6,
        number: 'V-00123',
        customer: 'Distribuidora Mamoré',
        seller: 'Pedro Suárez',
        date: '2026-10-27T15:05:00',
        method: 'Transferencia',
        status: 'paid',
        items: [
            { product: 'Agua mineral 2 L', quantity: 48, price: 8 },
            { product: 'Galletas de agua 200 g', quantity: 60, price: 4.5 },
        ],
    },
    {
        id: 7,
        number: 'V-00122',
        customer: 'Consumidor final',
        seller: 'Pedro Suárez',
        date: '2026-10-27T12:40:00',
        method: 'Efectivo',
        status: 'paid',
        items: [
            { product: 'Chocolate con leche 80 g', quantity: 4, price: 9 },
            { product: 'Jugo de durazno 1 L', quantity: 2, price: 11 },
        ],
    },
    {
        id: 8,
        number: 'V-00121',
        customer: 'Carlos Eduardo Suárez',
        seller: 'Carla Méndez',
        date: '2026-10-26T17:20:00',
        method: 'Tarjeta',
        status: 'pending',
        items: [
            { product: 'Fideo tallarín 400 g', quantity: 5, price: 6 },
            { product: 'Azúcar morena 1 kg', quantity: 3, price: 7.5 },
        ],
    },
];

export const saleStatusLabels: Record<SaleStatus, string> = { paid: 'Pagada', pending: 'Pendiente', cancelled: 'Anulada' };

/** Total de una venta (suma de cantidad × precio). */
export function saleTotal(sale: ExampleSale): number {
    return sale.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
}

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
