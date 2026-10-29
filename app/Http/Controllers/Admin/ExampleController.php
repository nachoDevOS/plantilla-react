<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Support\ExampleData;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

/**
 * PÁGINAS DE EJEMPLO del menú "Ejemplos" (pages/admin/examples/).
 *
 * Funcionan igual que un módulo real —filtros en la URL, PAGINACIÓN DEL LADO DEL SERVIDOR, validación en Laravel
 * y mensajes de éxito— pero los datos salen de App\Support\ExampleData en vez de la base de datos.
 * Los productos se pueden crear, editar y eliminar: los cambios se guardan en la SESIÓN de quien los hace
 * (no tocan la base de datos) y "Restaurar datos" vuelve a la lista original.
 *
 * En un módulo real: cambia la colección por una consulta Eloquent y $this->paginateCollection(...) por ->paginate(...).
 */
class ExampleController extends Controller
{
    /** Clave de la sesión donde vive la copia editable de los productos. */
    private const SESSION_PRODUCTS = 'examples.products';

    /**
     * GET /admin/examples/products — Catálogo con buscador, filtros (categoría, stock) y paginación.
     */
    public function products(Request $request): Response
    {
        $filters = $request->only(['search', 'category', 'level', 'per_page']);
        $all = collect($this->storedProducts($request))->map(fn (array $product) => $product + ['level' => $this->stockLevel($product)]);
        $search = mb_strtolower(trim((string) ($filters['search'] ?? '')));

        $filtered = $all
            ->when($filters['category'] ?? null, fn (Collection $items, string $category) => $items->where('category', $category))
            ->when($filters['level'] ?? null, fn (Collection $items, string $level) => $items->where('level', $level))
            ->when($search !== '', fn (Collection $items) => $items->filter(
                fn (array $product) => str_contains(mb_strtolower("{$product['name']} {$product['code']} {$product['brand']}"), $search)
            ))
            ->values();

        return Inertia::render('admin/examples/products', [
            'products' => $this->paginateCollection($filtered, $request),
            'filters' => $filters,
            'categories' => ExampleData::PRODUCT_CATEGORIES,
            // Los indicadores se calculan sobre TODO el catálogo, no solo sobre la página visible
            'stats' => [
                'total' => $all->count(),
                'stock_value' => round($all->sum(fn (array $product) => $product['stock'] * $product['cost']), 2),
                'low' => $all->where('level', 'low')->count(),
                'out' => $all->where('level', 'out')->count(),
            ],
        ]);
    }

    /**
     * POST /admin/examples/products — Crea un producto (en la sesión).
     */
    public function storeProduct(Request $request): RedirectResponse
    {
        $data = $this->validateProduct($request);
        $products = $this->storedProducts($request);

        // El nuevo va primero para que se vea arriba de la tabla
        array_unshift($products, $data + [
            'id' => (int) collect($products)->max('id') + 1,
            'cost' => round($data['price'] * 0.7, 2),
            'min_stock' => 10,
            'status' => 'active',
            'updated_at' => today()->toDateString(),
        ]);
        $request->session()->put(self::SESSION_PRODUCTS, $products);

        return back()->with('success', "Producto {$data['name']} creado.");
    }

    /**
     * PUT /admin/examples/products/{id} — Actualiza un producto (en la sesión).
     */
    public function updateProduct(Request $request, int $id): RedirectResponse
    {
        $products = $this->storedProducts($request);
        $index = $this->findProductIndex($products, $id);
        $data = $this->validateProduct($request, $id);

        $products[$index] = array_merge($products[$index], $data, ['updated_at' => today()->toDateString()]);
        $request->session()->put(self::SESSION_PRODUCTS, $products);

        return back()->with('success', "Producto {$data['name']} actualizado.");
    }

    /**
     * DELETE /admin/examples/products/{id} — Quita un producto de la lista (en la sesión).
     */
    public function destroyProduct(Request $request, int $id): RedirectResponse
    {
        $products = $this->storedProducts($request);
        $index = $this->findProductIndex($products, $id);
        $name = $products[$index]['name'];

        array_splice($products, $index, 1);
        $request->session()->put(self::SESSION_PRODUCTS, $products);

        return back()->with('success', "Producto {$name} eliminado.");
    }

    /**
     * POST /admin/examples/products/reset — Vuelve a los productos originales.
     */
    public function resetProducts(Request $request): RedirectResponse
    {
        $request->session()->forget(self::SESSION_PRODUCTS);

        return to_route('admin.examples.products')->with('success', 'Se restauraron los productos de ejemplo.');
    }

    /**
     * GET /admin/examples/sales — Últimas ventas con filtro por estado, buscador y paginación.
     */
    public function sales(Request $request): Response
    {
        $filters = $request->only(['search', 'status', 'per_page']);
        $all = collect(ExampleData::sales());
        $search = mb_strtolower(trim((string) ($filters['search'] ?? '')));
        $paid = $all->where('status', 'paid');
        $lastDay = substr((string) $all->max('date'), 0, 10);

        $filtered = $all
            ->when($filters['status'] ?? null, fn (Collection $items, string $status) => $items->where('status', $status))
            ->when($search !== '', fn (Collection $items) => $items->filter(
                fn (array $sale) => str_contains(mb_strtolower("{$sale['number']} {$sale['customer']} {$sale['seller']}"), $search)
            ))
            ->sortByDesc('date')
            ->values();

        return Inertia::render('admin/examples/sales', [
            'sales' => $this->paginateCollection($filtered, $request),
            'filters' => $filters,
            'statusCounts' => collect(ExampleData::SALE_STATUSES)->map(fn ($label, string $status) => $all->where('status', $status)->count()),
            'stats' => [
                'today' => round($paid->filter(fn (array $sale) => str_starts_with($sale['date'], $lastDay))->sum('total'), 2),
                'average' => round((float) $paid->avg('total'), 2),
                'paid_count' => $paid->count(),
                'pending' => round($all->where('status', 'pending')->sum('total'), 2),
            ],
        ]);
    }

    /**
     * GET /admin/examples/customers — Lista de clientes con buscador, filtro por segmento y paginación.
     */
    public function customers(Request $request): Response
    {
        $filters = $request->only(['search', 'segment', 'per_page']);
        $all = collect(ExampleData::customers());
        $search = mb_strtolower(trim((string) ($filters['search'] ?? '')));

        $filtered = $all
            ->when($filters['segment'] ?? null, fn (Collection $items, string $segment) => $items->where('segment', $segment))
            ->when($search !== '', fn (Collection $items) => $items->filter(
                fn (array $customer) => str_contains(mb_strtolower("{$customer['name']} {$customer['document']} {$customer['email']} {$customer['city']}"), $search)
            ))
            ->sortBy('name', SORT_NATURAL | SORT_FLAG_CASE)
            ->values();

        return Inertia::render('admin/examples/customers', [
            'customers' => $this->paginateCollection($filtered, $request),
            'filters' => $filters,
            'segments' => collect(ExampleData::CUSTOMER_SEGMENTS)->map(fn (string $label, string $segment) => [
                'id' => $segment,
                'name' => $label,
                'count' => $all->where('segment', $segment)->count(),
            ])->values(),
            'total' => $all->count(),
        ]);
    }

    /**
     * Productos de la sesión (o los originales si nunca se editaron).
     *
     * @return list<array<string, mixed>>
     */
    private function storedProducts(Request $request): array
    {
        return $request->session()->get(self::SESSION_PRODUCTS, ExampleData::products());
    }

    /**
     * Posición del producto en la lista; 404 si no existe.
     *
     * @param  list<array<string, mixed>>  $products
     */
    private function findProductIndex(array $products, int $id): int
    {
        $index = collect($products)->search(fn (array $product) => $product['id'] === $id);
        abort_if($index === false, 404);

        return $index;
    }

    /**
     * Validación del formulario de producto (los mensajes salen en español de lang/es).
     *
     * @return array{code: string, name: string, category: string, brand: string, price: float, stock: int}
     */
    private function validateProduct(Request $request, ?int $ignoreId = null): array
    {
        $codes = collect($this->storedProducts($request))->reject(fn (array $product) => $product['id'] === $ignoreId)->pluck('code')->all();

        $data = $request->validate([
            'code' => ['required', 'string', 'max:20', Rule::notIn($codes)],
            'name' => ['required', 'string', 'max:120'],
            'category' => ['required', Rule::in(ExampleData::PRODUCT_CATEGORIES)],
            'brand' => ['nullable', 'string', 'max:60'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:99999'],
            'stock' => ['required', 'integer', 'min:0', 'max:99999'],
        ], [
            'code.not_in' => 'Ya existe un producto con ese código.',
        ], [
            'code' => 'código',
            'name' => 'nombre',
            'category' => 'categoría',
            'brand' => 'marca',
            'price' => 'precio',
            'stock' => 'stock',
        ]);

        return [
            'code' => $data['code'],
            'name' => $data['name'],
            'category' => $data['category'],
            'brand' => ($data['brand'] ?? '') ?: 'Sin marca',
            'price' => (float) $data['price'],
            'stock' => (int) $data['stock'],
        ];
    }

    /**
     * Estado del stock: sin stock, bajo el mínimo o disponible.
     *
     * @param  array<string, mixed>  $product
     */
    private function stockLevel(array $product): string
    {
        return match (true) {
            $product['stock'] === 0 => 'out',
            $product['stock'] < $product['min_stock'] => 'low',
            default => 'ok',
        };
    }
}
