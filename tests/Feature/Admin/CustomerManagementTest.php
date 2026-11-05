<?php

namespace Tests\Feature\Admin;

use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

/**
 * Pruebas del módulo de clientes: registro, CI único, foto, permisos y eliminación lógica.
 * Correr solo estas: php artisan test --filter=CustomerManagementTest
 */
class CustomerManagementTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function validData(array $overrides = []): array
    {
        return $overrides + [
            'first_name' => 'María',
            'second_name' => 'Elena',
            'first_last_name' => 'Quispe',
            'second_last_name' => 'Mamani',
            'married_last_name' => 'Rojas',
            'ci' => '1234567',
            'ci_extension' => '1a',
            'ci_issued_in' => 'BE',
            'birth_date' => '1990-05-20',
            'gender' => 'femenino',
            'phone_country_code' => '+591',
            'phone' => '71234567',
            'email' => 'MARIA@correo.com',
            'address' => 'Av. 6 de Agosto',
            'notes' => 'Cliente frecuente',
            'is_active' => true,
        ];
    }

    private function admin(): User
    {
        return User::factory()->withRole('Administrador')->create();
    }

    public function test_users_without_permission_cannot_manage_customers()
    {
        $user = User::factory()->withRole('Operador')->create();

        $this->actingAs($user)->get('/admin/customers')->assertForbidden();
        $this->actingAs($user)->post('/admin/customers', $this->validData())->assertForbidden();
    }

    public function test_the_old_example_address_leads_to_the_customers_module()
    {
        $this->actingAs($this->admin())->get('/admin/examples/customers')->assertRedirect('/admin/customers');
    }

    public function test_a_customer_is_registered_with_all_the_identity_data()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/customers', $this->validData())->assertSessionHasNoErrors()->assertSessionHas('success');

        $customer = Customer::sole();
        $this->assertSame('María Elena Quispe Mamani Rojas', $customer->full_name);
        $this->assertSame('1234567-1A BE', $customer->document);
        $this->assertSame('maria@correo.com', $customer->email);
        $this->assertSame($admin->id, $customer->registerUser_id);
    }

    public function test_the_phone_keeps_its_country_code_apart_from_the_number()
    {
        $this->actingAs($this->admin())->post('/admin/customers', $this->validData(['phone_country_code' => '+54', 'phone' => '11 4567-8900']))
            ->assertSessionHasNoErrors();

        $customer = Customer::sole();
        $this->assertSame('+54', $customer->phone_country_code);
        $this->assertSame('1145678900', $customer->phone);
        $this->assertSame('+54 1145678900', $customer->full_phone);
    }

    public function test_a_customer_without_phone_does_not_keep_a_country_code()
    {
        $this->actingAs($this->admin())->post('/admin/customers', $this->validData(['phone' => '']))->assertSessionHasNoErrors();

        $customer = Customer::sole();
        $this->assertNull($customer->phone);
        $this->assertNull($customer->phone_country_code);
        $this->assertNull($customer->full_phone);
    }

    public function test_the_phone_needs_a_known_country_code_and_a_valid_number()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/customers', $this->validData(['phone_country_code' => '+999']))->assertSessionHasErrors('phone_country_code');
        $this->actingAs($admin)->post('/admin/customers', $this->validData(['phone_country_code' => '']))->assertSessionHasErrors('phone_country_code');
        $this->actingAs($admin)->post('/admin/customers', $this->validData(['phone' => '123']))->assertSessionHasErrors('phone');

        $this->assertSame(0, Customer::count());
    }

    public function test_every_customer_gets_a_unique_16_character_code()
    {
        $codes = Customer::factory(5)->create()->pluck('code');

        $this->assertSame(5, $codes->unique()->count());
        $codes->each(fn (string $code) => $this->assertMatchesRegularExpression('/^[0-9A-HJKMNP-TV-Z]{16}$/', $code));
    }

    public function test_urls_use_the_code_and_the_id_never_reaches_the_browser()
    {
        $admin = $this->admin();
        $customer = Customer::factory()->create();

        $this->actingAs($admin)->delete("/admin/customers/{$customer->id}")->assertNotFound();
        $this->assertNotSoftDeleted($customer);

        $this->assertSame(url("/admin/customers/{$customer->code}"), route('admin.customers.update', $customer));
        $this->get('/admin/customers')->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.code', $customer->code)
            ->missing('customers.data.0.id'));
    }

    public function test_the_code_cannot_be_changed_from_the_form()
    {
        $customer = Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '1A']);
        $code = $customer->code;

        $this->actingAs($this->admin())->put("/admin/customers/{$customer->code}", $this->validData(['code' => 'AAAAAAAAAAAAAAAA']))->assertSessionHasNoErrors();

        $this->assertSame($code, $customer->fresh()->code);
    }

    public function test_the_short_code_is_made_of_the_initials_and_the_ci()
    {
        $this->actingAs($this->admin())->post('/admin/customers', $this->validData())->assertSessionHasNoErrors();

        $this->assertSame('MEQMR-1234567-1A', Customer::sole()->short_code);
    }

    public function test_the_short_code_skips_particles_and_accents_and_omits_an_empty_extension()
    {
        $customer = Customer::factory()->create([
            'first_name' => 'Ángela', 'second_name' => 'del Carmen', 'first_last_name' => 'Égüez', 'second_last_name' => null, 'ci' => '7654321',
        ]);

        $this->assertSame('ACE-7654321', $customer->short_code);
    }

    public function test_the_short_code_follows_the_data_and_cannot_be_set_from_the_form()
    {
        $customer = Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '1A']);

        $this->actingAs($this->admin())
            ->put("/admin/customers/{$customer->code}", $this->validData(['first_name' => 'Ana', 'second_name' => '', 'short_code' => 'XXX']))
            ->assertSessionHasNoErrors();

        $this->assertSame('AQMR-1234567-1A', $customer->fresh()->short_code);
    }

    public function test_customers_can_be_searched_by_their_short_code()
    {
        $customer = Customer::factory()->create(['first_name' => 'Luis', 'second_name' => null, 'first_last_name' => 'Vargas', 'second_last_name' => null, 'ci' => '7654321']);
        Customer::factory()->create();

        $this->actingAs($this->admin())->get('/admin/customers?search=LV-7654321')
            ->assertInertia(fn (Assert $page) => $page->has('customers.data', 1)->where('customers.data.0.code', $customer->code));
    }

    public function test_the_location_is_saved_with_both_coordinates()
    {
        $this->actingAs($this->admin())->post('/admin/customers', $this->validData(['latitude' => '-14.8333123', 'longitude' => '-64.9012345']))
            ->assertSessionHasNoErrors();

        $customer = Customer::sole();
        $this->assertEquals(-14.8333123, $customer->latitude);
        $this->assertEquals(-64.9012345, $customer->longitude);
    }

    public function test_the_location_needs_both_coordinates_in_range()
    {
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/customers', $this->validData(['latitude' => '-14.83']))->assertSessionHasErrors('longitude');
        $this->actingAs($admin)->post('/admin/customers', $this->validData(['longitude' => '-64.9']))->assertSessionHasErrors('latitude');
        $this->actingAs($admin)->post('/admin/customers', $this->validData(['latitude' => '91', 'longitude' => '181']))->assertSessionHasErrors(['latitude', 'longitude']);

        $this->assertSame(0, Customer::count());
    }

    public function test_the_page_receives_the_google_maps_key_from_the_configuration()
    {
        config(['services.google_maps.key' => 'clave-de-prueba']);

        $this->actingAs($this->admin())->get('/admin/customers')
            ->assertInertia(fn (Assert $page) => $page->where('googleMapsKey', 'clave-de-prueba'));
    }

    public function test_only_the_required_fields_are_needed()
    {
        $this->actingAs($this->admin())->post('/admin/customers', [
            'first_name' => 'Luis', 'first_last_name' => 'Vargas', 'ci' => '7654321', 'ci_issued_in' => 'LP',
        ])->assertSessionHasNoErrors();

        $this->assertSame('7654321 LP', Customer::sole()->document);
    }

    public function test_required_identity_fields_are_validated()
    {
        $this->actingAs($this->admin())
            ->post('/admin/customers', ['ci_issued_in' => 'XX'])
            ->assertSessionHasErrors(['first_name', 'first_last_name', 'ci', 'ci_issued_in']);
    }

    public function test_the_same_ci_cannot_be_registered_twice_even_if_the_customer_was_deleted()
    {
        $admin = $this->admin();
        Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '1A']);
        Customer::factory()->create(['ci' => '5555555'])->delete();

        $this->actingAs($admin)->post('/admin/customers', $this->validData())->assertSessionHasErrors('ci');
        $this->actingAs($admin)->post('/admin/customers', $this->validData(['ci' => '5555555', 'ci_extension' => '']))->assertSessionHasErrors('ci');
    }

    public function test_two_people_can_share_a_ci_number_with_different_extension()
    {
        Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '']);

        $this->actingAs($this->admin())->post('/admin/customers', $this->validData())->assertSessionHasNoErrors();

        $this->assertSame(2, Customer::count());
    }

    public function test_a_customer_can_keep_its_own_ci_when_edited()
    {
        $customer = Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '1A']);

        $this->actingAs($this->admin())->put("/admin/customers/{$customer->code}", $this->validData(['address' => 'Calle Nueva']))->assertSessionHasNoErrors();

        $this->assertSame('Calle Nueva', $customer->fresh()->address);
    }

    public function test_the_photo_is_stored_in_both_sizes_and_react_can_build_its_address()
    {
        $disk = Storage::fake(config('filesystems.default'));
        config(['filesystems.disks.s3.url' => 'https://bucket.test']);
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/customers', $this->validData([
            'photo' => UploadedFile::fake()->image('cliente.jpg', 800, 600),
        ]))->assertSessionHasNoErrors();

        $customer = Customer::sole();
        $this->assertStringEndsWith('.avif', $customer->photo);
        $this->assertStringStartsWith('customers/', $customer->photo);
        $disk->assertExists([$customer->photo, $customer->photo_thumb]);

        $this->get('/admin/customers')->assertInertia(fn (Assert $page) => $page
            ->where('aws_url', 'https://bucket.test')
            ->where('customers.data.0.photo', $customer->photo)
            ->where('customers.data.0.photo_thumb', $customer->photo_thumb));
    }

    public function test_the_photo_is_kept_replaced_or_removed_when_editing()
    {
        Storage::fake(config('filesystems.default'));
        $admin = $this->admin();
        $customer = Customer::factory()->create(['ci' => '1234567', 'ci_extension' => '1A', 'photo' => 'customers/vieja.avif']);
        $url = "/admin/customers/{$customer->code}";

        $this->actingAs($admin)->post($url, $this->validData(['_method' => 'put']))->assertSessionHasNoErrors();
        $this->assertSame('customers/vieja.avif', $customer->fresh()->photo);

        $this->post($url, $this->validData(['_method' => 'put', 'photo' => UploadedFile::fake()->image('nueva.png')]))->assertSessionHasNoErrors();
        $this->assertNotSame('customers/vieja.avif', $customer->fresh()->photo);

        $this->post($url, $this->validData(['_method' => 'put', 'remove_photo' => true]))->assertSessionHasNoErrors();
        $this->assertNull($customer->fresh()->photo);
    }

    public function test_only_images_are_accepted_as_photo()
    {
        $this->actingAs($this->admin())->post('/admin/customers', $this->validData([
            'photo' => UploadedFile::fake()->create('virus.pdf', 100, 'application/pdf'),
        ]))->assertSessionHasErrors('photo');

        $this->assertSame(0, Customer::count());
    }

    public function test_the_photo_can_weigh_up_to_3_mb_and_no_more()
    {
        Storage::fake(config('filesystems.default'));
        $admin = $this->admin();

        $this->actingAs($admin)->post('/admin/customers', $this->validData([
            'photo' => UploadedFile::fake()->image('pesada.jpg')->size(3073),
        ]))->assertSessionHasErrors(['photo' => 'La foto no puede pasar de 3 MB.']);
        $this->assertSame(0, Customer::count());

        $this->post('/admin/customers', $this->validData([
            'photo' => UploadedFile::fake()->image('justa.jpg')->size(3072),
        ]))->assertSessionHasNoErrors();
        $this->assertSame(1, Customer::count());
    }

    public function test_customers_can_be_searched_across_names_and_ci_and_filtered_by_status()
    {
        $admin = $this->admin();
        Customer::factory()->create(['first_name' => 'Zacarías', 'first_last_name' => 'Buscado', 'second_name' => null, 'ci' => '9090909']);
        Customer::factory(2)->inactive()->create(['first_name' => 'Otro', 'first_last_name' => 'Cliente', 'second_name' => null]);

        $this->actingAs($admin)->get('/admin/customers?search=zacar buscado')
            ->assertInertia(fn (Assert $page) => $page->component('admin/customers/index')->has('customers.data', 1)->where('customers.data.0.ci', '9090909'));

        $this->get('/admin/customers?search=9090')->assertInertia(fn (Assert $page) => $page->has('customers.data', 1));

        $this->get('/admin/customers?status=inactive')
            ->assertInertia(fn (Assert $page) => $page->has('customers.data', 2));
    }

    public function test_the_latest_customers_appear_first()
    {
        $admin = $this->admin();
        Customer::factory()->create(['first_last_name' => 'Zeballos']);
        $latest = Customer::factory()->create(['first_last_name' => 'Aguilar']);

        $this->actingAs($admin)->get('/admin/customers')
            ->assertInertia(fn (Assert $page) => $page->where('customers.data.0.code', $latest->code));
    }

    public function test_the_list_is_paginated_on_the_server()
    {
        $admin = $this->admin();
        Customer::factory(12)->create();

        $this->actingAs($admin)->get('/admin/customers')
            ->assertInertia(fn (Assert $page) => $page->has('customers.data', 10)->where('customers.total', 12)->where('customers.last_page', 2));

        $this->get('/admin/customers?page=2')->assertInertia(fn (Assert $page) => $page->has('customers.data', 2));

        // Un per_page fuera de la lista no puede traer toda la tabla
        $this->get('/admin/customers?per_page=100000')->assertInertia(fn (Assert $page) => $page->has('customers.data', 10));
    }

    public function test_the_list_brings_what_the_expandable_row_shows()
    {
        $admin = $this->admin();
        $this->actingAs($admin)->post('/admin/customers', $this->validData())->assertSessionHasNoErrors();

        $this->get('/admin/customers')->assertInertia(fn (Assert $page) => $page
            ->where('customers.data.0.second_name', 'Elena')
            ->where('customers.data.0.notes', 'Cliente frecuente')
            ->where('customers.data.0.registerRole', 'Administrador')
            ->where('customers.data.0.registered_by.name', $admin->name)
            ->has('customers.data.0.updated_at'));
    }

    public function test_deleting_from_the_list_keeps_its_filters()
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->from('/admin/customers?page=2')
            ->delete("/admin/customers/{$customer->code}")
            ->assertRedirect('/admin/customers?page=2');
    }

    public function test_deleting_a_customer_is_logical_and_records_who_did_it()
    {
        $admin = $this->admin();
        $customer = Customer::factory()->create();

        $this->actingAs($admin)->delete("/admin/customers/{$customer->code}")->assertSessionHas('success');

        $this->assertSoftDeleted($customer);
        $this->assertSame($admin->id, $customer->fresh()->deleteUser_id);
    }
}
