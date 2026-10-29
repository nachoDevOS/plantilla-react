<?php

namespace App\Support;

/**
 * DATOS DE EJEMPLO (escritos a mano) para las páginas del menú "Ejemplos".
 *
 * Hacen de "tabla de base de datos" mientras no exista el módulo real: ExampleController los filtra
 * y los pagina en el servidor igual que haría una consulta con ->paginate().
 * Cuando hagas el módulo real, borra esta clase junto con ExampleController y pages/admin/examples/.
 */
class ExampleData
{
    /** @var list<string> */
    public const PRODUCT_CATEGORIES = ['Bebidas', 'Abarrotes', 'Limpieza', 'Lácteos', 'Panadería', 'Snacks'];

    /** @var array<string, string> */
    public const CUSTOMER_SEGMENTS = ['vip' => 'VIP', 'frecuente' => 'Frecuente', 'nuevo' => 'Nuevo', 'empresa' => 'Empresa'];

    /** @var array<string, string> */
    public const SALE_STATUSES = ['paid' => 'Pagada', 'pending' => 'Pendiente', 'cancelled' => 'Anulada'];

    /**
     * @return list<array{id: int, code: string, name: string, category: string, brand: string, price: float, cost: float, stock: int, min_stock: int, status: string, updated_at: string}>
     */
    public static function products(): array
    {
        $rows = [
            ['BEB-001', 'Agua mineral 2 L', 'Bebidas', 'Vital', 8, 5.2, 140, 40, 'active', '2026-10-28'],
            ['BEB-002', 'Gaseosa cola 3 L', 'Bebidas', 'Coca-Cola', 16.5, 12, 62, 30, 'active', '2026-10-27'],
            ['BEB-003', 'Jugo de durazno 1 L', 'Bebidas', 'Del Valle', 11, 7.8, 18, 25, 'active', '2026-10-25'],
            ['BEB-004', 'Té frío limón 500 ml', 'Bebidas', 'Lipton', 6.5, 4.4, 90, 30, 'active', '2026-10-24'],
            ['ABA-001', 'Arroz grano de oro 5 kg', 'Abarrotes', 'Caisy', 45, 36, 35, 15, 'active', '2026-10-28'],
            ['ABA-002', 'Aceite vegetal 900 ml', 'Abarrotes', 'Fino', 14.5, 11.2, 0, 20, 'active', '2026-10-20'],
            ['ABA-003', 'Azúcar morena 1 kg', 'Abarrotes', 'Guabirá', 7.5, 5.9, 88, 30, 'active', '2026-10-26'],
            ['ABA-004', 'Fideo tallarín 400 g', 'Abarrotes', 'Lazzaroni', 6, 4.1, 120, 40, 'active', '2026-10-22'],
            ['ABA-005', 'Harina de trigo 1 kg', 'Abarrotes', 'Famosa', 8.5, 6.2, 12, 20, 'active', '2026-10-21'],
            ['LIM-001', 'Detergente en polvo 1 kg', 'Limpieza', 'Omo', 22, 16.5, 9, 12, 'active', '2026-10-24'],
            ['LIM-002', 'Lavandina 2 L', 'Limpieza', 'Sapolio', 9.5, 6.3, 46, 15, 'active', '2026-10-19'],
            ['LIM-003', 'Papel higiénico x4', 'Limpieza', 'Scott', 12, 8.4, 75, 25, 'inactive', '2026-09-30'],
            ['LIM-004', 'Jabón de tocador x3', 'Limpieza', 'Lux', 10, 7, 58, 20, 'active', '2026-10-18'],
            ['LAC-001', 'Leche entera 1 L', 'Lácteos', 'PIL', 7, 5.4, 54, 40, 'active', '2026-10-29'],
            ['LAC-002', 'Yogurt frutilla 1 L', 'Lácteos', 'PIL', 13, 9.6, 22, 20, 'active', '2026-10-28'],
            ['LAC-003', 'Queso menonita 500 g', 'Lácteos', 'La Estancia', 28, 21, 4, 10, 'active', '2026-10-27'],
            ['LAC-004', 'Mantequilla 200 g', 'Lácteos', 'PIL', 12.5, 9, 31, 15, 'active', '2026-10-23'],
            ['PAN-001', 'Pan molde integral', 'Panadería', 'Bimbo', 15, 10.8, 30, 12, 'active', '2026-10-29'],
            ['PAN-002', 'Galletas de agua 200 g', 'Panadería', 'Mabel', 4.5, 3, 160, 50, 'active', '2026-10-23'],
            ['PAN-003', 'Bizcochos de anís 300 g', 'Panadería', 'Arcor', 9, 6.5, 0, 15, 'active', '2026-10-17'],
            ['SNK-001', 'Papas fritas 150 g', 'Snacks', 'Pringles', 18, 13.2, 40, 20, 'active', '2026-10-21'],
            ['SNK-002', 'Maní salado 100 g', 'Snacks', 'Karinto', 5, 3.2, 0, 30, 'inactive', '2026-10-02'],
            ['SNK-003', 'Chocolate con leche 80 g', 'Snacks', 'Para Ti', 9, 6.1, 68, 25, 'active', '2026-10-26'],
            ['SNK-004', 'Caramelos surtidos 500 g', 'Snacks', 'Arcor', 14, 10, 27, 15, 'active', '2026-10-20'],
        ];

        return array_map(fn (array $row, int $i) => [
            'id' => $i + 1,
            'code' => $row[0],
            'name' => $row[1],
            'category' => $row[2],
            'brand' => $row[3],
            'price' => (float) $row[4],
            'cost' => (float) $row[5],
            'stock' => $row[6],
            'min_stock' => $row[7],
            'status' => $row[8],
            'updated_at' => $row[9],
        ], $rows, array_keys($rows));
    }

    /**
     * @return list<array{id: int, name: string, document: string, email: string, phone: string, city: string, segment: string, orders: int, spent: float, last_purchase: string}>
     */
    public static function customers(): array
    {
        $rows = [
            ['María Fernanda Rojas', '6234512', 'maria.rojas@correo.com', '71234567', 'Trinidad', 'vip', 48, 9820.5, '2026-10-28'],
            ['Comercial El Puerto SRL', '1023456021', 'compras@elpuerto.bo', '33456789', 'Santa Cruz', 'empresa', 31, 24150, '2026-10-27'],
            ['José Luis Vargas', '5123987', 'jlvargas@correo.com', '76543210', 'Trinidad', 'frecuente', 22, 3410.75, '2026-10-26'],
            ['Ana Cecilia Montaño', '7345120', 'ana.montano@correo.com', '72109876', 'Riberalta', 'nuevo', 2, 185, '2026-10-25'],
            ['Distribuidora Mamoré', '2034567012', 'ventas@mamore.bo', '34621100', 'Guayaramerín', 'empresa', 19, 18760.4, '2026-10-22'],
            ['Carlos Eduardo Suárez', '4987321', 'csuarez@correo.com', '78812345', 'La Paz', 'frecuente', 15, 2245.3, '2026-10-20'],
            ['Lucía Pereira Gómez', '8123456', 'lucia.pereira@correo.com', '69087654', 'Cochabamba', 'vip', 39, 7650, '2026-10-29'],
            ['Roberto Antelo', '3456789', 'rantelo@correo.com', '77001122', 'Trinidad', 'nuevo', 1, 64.5, '2026-10-18'],
            ['Patricia Melgar', '6789012', 'pmelgar@correo.com', '73334455', 'San Borja', 'frecuente', 12, 1980, '2026-10-15'],
            ['Hotel Mamoré Palace', '3021456019', 'compras@mamorepalace.bo', '34627788', 'Trinidad', 'empresa', 27, 15320, '2026-10-28'],
            ['Daniela Justiniano', '7012345', 'djustiniano@correo.com', '70112233', 'Santa Cruz', 'vip', 33, 6890.25, '2026-10-27'],
            ['Fernando Egüez', '5567890', 'feguez@correo.com', '75567788', 'Trinidad', 'frecuente', 9, 1210, '2026-10-24'],
            ['Gabriela Parada', '6678901', 'gparada@correo.com', '71998877', 'Riberalta', 'nuevo', 3, 240.5, '2026-10-23'],
            ['Restaurante El Tropero', '4012345017', 'pedidos@eltropero.bo', '34629900', 'Trinidad', 'empresa', 22, 11450, '2026-10-26'],
            ['Miguel Ángel Cuéllar', '4456123', 'macuellar@correo.com', '76665544', 'San Ignacio', 'frecuente', 14, 1875.6, '2026-10-21'],
            ['Valeria Rivero', '8234567', 'vrivero@correo.com', '69912345', 'Trinidad', 'nuevo', 1, 98, '2026-10-29'],
        ];

        return array_map(fn (array $row, int $i) => [
            'id' => $i + 1,
            'name' => $row[0],
            'document' => $row[1],
            'email' => $row[2],
            'phone' => $row[3],
            'city' => $row[4],
            'segment' => $row[5],
            'orders' => $row[6],
            'spent' => (float) $row[7],
            'last_purchase' => $row[8],
        ], $rows, array_keys($rows));
    }

    /**
     * @return list<array{id: int, number: string, customer: string, seller: string, date: string, method: string, status: string, items: list<array{product: string, quantity: int, price: float}>, total: float}>
     */
    public static function sales(): array
    {
        $rows = [
            ['María Fernanda Rojas', 'Luis Rojas', '2026-10-29 10:24', 'QR', 'paid', [['Leche entera 1 L', 6, 7], ['Pan molde integral', 2, 15], ['Yogurt frutilla 1 L', 1, 13]]],
            ['Comercial El Puerto SRL', 'Luis Rojas', '2026-10-29 09:02', 'Transferencia', 'pending', [['Arroz grano de oro 5 kg', 10, 45], ['Aceite vegetal 900 ml', 24, 14.5]]],
            ['Consumidor final', 'Carla Méndez', '2026-10-28 18:45', 'Efectivo', 'paid', [['Gaseosa cola 3 L', 2, 16.5], ['Papas fritas 150 g', 3, 18]]],
            ['José Luis Vargas', 'Carla Méndez', '2026-10-28 16:10', 'Tarjeta', 'paid', [['Detergente en polvo 1 kg', 2, 22], ['Lavandina 2 L', 2, 9.5]]],
            ['Lucía Pereira Gómez', 'Luis Rojas', '2026-10-28 11:30', 'QR', 'cancelled', [['Queso menonita 500 g', 1, 28]]],
            ['Distribuidora Mamoré', 'Pedro Suárez', '2026-10-27 15:05', 'Transferencia', 'paid', [['Agua mineral 2 L', 48, 8], ['Galletas de agua 200 g', 60, 4.5]]],
            ['Consumidor final', 'Pedro Suárez', '2026-10-27 12:40', 'Efectivo', 'paid', [['Chocolate con leche 80 g', 4, 9], ['Jugo de durazno 1 L', 2, 11]]],
            ['Carlos Eduardo Suárez', 'Carla Méndez', '2026-10-26 17:20', 'Tarjeta', 'pending', [['Fideo tallarín 400 g', 5, 6], ['Azúcar morena 1 kg', 3, 7.5]]],
            ['Hotel Mamoré Palace', 'Luis Rojas', '2026-10-26 10:15', 'Transferencia', 'paid', [['Papel higiénico x4', 20, 12], ['Jabón de tocador x3', 15, 10]]],
            ['Consumidor final', 'Carla Méndez', '2026-10-25 19:50', 'Efectivo', 'paid', [['Té frío limón 500 ml', 3, 6.5], ['Maní salado 100 g', 2, 5]]],
            ['Daniela Justiniano', 'Pedro Suárez', '2026-10-25 13:05', 'QR', 'paid', [['Mantequilla 200 g', 2, 12.5], ['Pan molde integral', 1, 15]]],
            ['Restaurante El Tropero', 'Luis Rojas', '2026-10-24 08:40', 'Transferencia', 'pending', [['Aceite vegetal 900 ml', 12, 14.5], ['Harina de trigo 1 kg', 10, 8.5]]],
            ['Consumidor final', 'Carla Méndez', '2026-10-24 17:25', 'Tarjeta', 'cancelled', [['Caramelos surtidos 500 g', 1, 14]]],
            ['Fernando Egüez', 'Pedro Suárez', '2026-10-23 11:10', 'Efectivo', 'paid', [['Leche entera 1 L', 4, 7], ['Bizcochos de anís 300 g', 2, 9]]],
        ];

        return array_map(function (array $row, int $i) {
            $items = array_map(fn (array $item) => ['product' => $item[0], 'quantity' => $item[1], 'price' => (float) $item[2]], $row[5]);

            return [
                'id' => $i + 1,
                'number' => sprintf('V-%05d', 128 - $i),
                'customer' => $row[0],
                'seller' => $row[1],
                'date' => str_replace(' ', 'T', $row[2]).':00',
                'method' => $row[3],
                'status' => $row[4],
                'items' => $items,
                'total' => (float) array_sum(array_map(fn (array $item) => $item['quantity'] * $item['price'], $items)),
            ];
        }, $rows, array_keys($rows));
    }
}
