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
