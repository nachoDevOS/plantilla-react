<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use App\Support\ExampleData;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Pruebas de: páginas de ejemplo del menú "Ejemplos" (datos de App\Support\ExampleData, sin base de datos).
 * Correr solo estas: php artisan test --filter=ExamplePagesTest
 */
class ExamplePagesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @return array<string, array{string}>
     */
    public static function examplePages(): array
    {
        return [
            'productos' => ['products'],
            'ventas' => ['sales'],
            'clientes' => ['customers'],
            'tareas' => ['tasks'],
            'formulario' => ['form'],
            'componentes' => ['components'],
        ];
    }

    #[DataProvider('examplePages')]
    public function test_authenticated_users_can_open_example_pages(string $page)
    {
        $this->actingAs(User::factory()->create())
            ->get("/admin/examples/{$page}")
            ->assertOk()
            ->assertInertia(fn (Assert $inertia) => $inertia->component("admin/examples/{$page}"));
    }

    #[DataProvider('examplePages')]
    public function test_guests_are_redirected_to_the_login_page(string $page)
    {
        $this->get("/admin/examples/{$page}")->assertRedirect('/login');
    }

    public function test_example_lists_are_paginated_on_the_server()
    {
        $this->actingAs(User::factory()->create());
        $products = count(ExampleData::products());

        $this->get('/admin/examples/products?per_page=10&page=3')
            ->assertInertia(fn (Assert $page) => $page
                ->where('products.total', $products)
                ->where('products.current_page', 3)
                ->has('products.data', $products - 20)
                ->where('stats.total', $products));

        $this->get('/admin/examples/sales?per_page=10')
            ->assertInertia(fn (Assert $page) => $page->has('sales.data', 10)->where('sales.total', count(ExampleData::sales())));

        $this->get('/admin/examples/customers?per_page=15')
            ->assertInertia(fn (Assert $page) => $page->has('customers.data', 15)->where('customers.last_page', 2));
    }

    public function test_example_lists_are_filtered_on_the_server()
    {
        $this->actingAs(User::factory()->create());

        $this->get('/admin/examples/products?category=Lácteos')
            ->assertInertia(fn (Assert $page) => $page->where('products.total', 4)->where('filters.category', 'Lácteos'));

        $this->get('/admin/examples/products?level=out')
            ->assertInertia(fn (Assert $page) => $page->where('products.total', 3)->where('products.data.0.level', 'out'));

        $this->get('/admin/examples/products?search=pil')
            ->assertInertia(fn (Assert $page) => $page->where('products.total', 3));

        $this->get('/admin/examples/sales?status=pending')
            ->assertInertia(fn (Assert $page) => $page->where('sales.total', 3)->where('statusCounts.pending', 3));

        $this->get('/admin/examples/customers?segment=empresa')
            ->assertInertia(fn (Assert $page) => $page->where('customers.total', 4));
    }

    public function test_example_products_can_be_created_edited_deleted_and_restored()
    {
        $this->actingAs(User::factory()->create());
        $original = count(ExampleData::products());

        $this->post('/admin/examples/products', ['code' => 'NUE-001', 'name' => 'Café molido 250 g', 'category' => 'Abarrotes', 'price' => 25, 'stock' => 30])
            ->assertSessionHas('success');

        $this->get('/admin/examples/products')
            ->assertInertia(fn (Assert $page) => $page->where('stats.total', $original + 1)->where('products.data.0.name', 'Café molido 250 g'));

        $this->put('/admin/examples/products/1', ['code' => 'BEB-001', 'name' => 'Agua mineral 3 L', 'category' => 'Bebidas', 'price' => 10, 'stock' => 5])
            ->assertSessionHas('success');
        $this->delete('/admin/examples/products/2')->assertSessionHas('success');

        $this->get('/admin/examples/products?search=agua')
            ->assertInertia(fn (Assert $page) => $page->where('products.data.0.name', 'Agua mineral 3 L')->where('products.data.0.stock', 5));
        $this->get('/admin/examples/products')->assertInertia(fn (Assert $page) => $page->where('stats.total', $original));

        $this->post('/admin/examples/products/reset')->assertRedirect('/admin/examples/products');
        $this->get('/admin/examples/products?search=agua')
            ->assertInertia(fn (Assert $page) => $page->where('products.data.0.name', 'Agua mineral 2 L'));
    }

    public function test_example_products_are_validated_by_laravel()
    {
        $this->actingAs(User::factory()->create());

        $this->post('/admin/examples/products', ['code' => 'BEB-001', 'name' => '', 'category' => 'Juguetes', 'price' => 0, 'stock' => -1])
            ->assertSessionHasErrors(['code', 'name', 'category', 'price', 'stock']);

        $this->put('/admin/examples/products/9999', ['code' => 'X-1', 'name' => 'X', 'category' => 'Bebidas', 'price' => 1, 'stock' => 1])
            ->assertNotFound();
    }
}
