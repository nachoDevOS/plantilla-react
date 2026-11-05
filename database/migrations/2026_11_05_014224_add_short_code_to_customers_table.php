<?php

use App\Models\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * CLIENTES: código corto legible, iniciales del nombre completo + CI (MEQMR-1234567-1A). No reemplaza al código público.
 * Se agrega vacío, se llena fila por fila (también los eliminados) y recién ahí pasa a ser obligatorio.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Sale de los nombres y el CI: el modelo lo recalcula en cada guardado
            $table->string('short_code')->nullable()->after('code');
        });

        Customer::withTrashed()->lazyById()->each(
            fn (Customer $customer) => DB::table('customers')->where('id', $customer->id)->update(['short_code' => $customer->makeShortCode()])
        );

        Schema::table('customers', function (Blueprint $table) {
            $table->string('short_code')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('short_code');
        });
    }
};
