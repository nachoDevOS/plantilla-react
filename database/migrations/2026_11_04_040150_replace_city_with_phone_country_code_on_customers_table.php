<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * CLIENTES: se quita la ciudad y el teléfono pasa a guardarse en dos partes.
 * Los teléfonos que ya existían eran de Bolivia: reciben el código +591.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Código de país del teléfono: +591, +54… (Customer::PHONE_COUNTRIES). Null = sin teléfono
            $table->string('phone_country_code', 5)->nullable()->after('gender');
            $table->dropColumn('city');
        });

        DB::table('customers')->whereNotNull('phone')->update(['phone_country_code' => '+591']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            // Ciudad o localidad. Los valores que tenía no se recuperan
            $table->string('city', 100)->nullable()->after('email');
            $table->dropColumn('phone_country_code');
        });
    }
};
