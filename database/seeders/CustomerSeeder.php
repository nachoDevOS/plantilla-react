<?php

namespace Database\Seeders;

use App\Models\Customer;
use Illuminate\Database\Seeder;

class CustomerSeeder extends Seeder
{
    /**
     * 24 clientes de prueba. Si ya hay clientes no crea nada: se puede correr varias veces.
     */
    public function run(): void
    {
        if (Customer::query()->exists()) {
            return;
        }

        Customer::factory(24)->create();
    }
}
