<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Pruebas de: páginas de ejemplo del menú "Ejemplos" (datos escritos a mano, sin base de datos).
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
}
