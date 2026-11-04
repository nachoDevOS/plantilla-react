<?php

use App\Models\Customer;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * CLIENTES: código público de 16 caracteres, que reemplaza al id en las URL (trait HasPublicCode).
 * Se agrega vacío, se llena fila por fila (también los eliminados) y recién ahí pasa a ser obligatorio y único.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Código público: aleatorio, no sale de ningún dato del cliente y nunca cambia
            $table->char('code', 16)->nullable()->after('id');
        });

        DB::table('customers')->orderBy('id')->pluck('id')->each(
            fn (int $id) => DB::table('customers')->where('id', $id)->update(['code' => Customer::generatePublicCode()])
        );

        Schema::table('customers', function (Blueprint $table) {
            $table->char('code', 16)->nullable(false)->change();
            $table->unique('code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique(['code']);
            $table->dropColumn('code');
        });
    }
};
