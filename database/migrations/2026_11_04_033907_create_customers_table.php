<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * CLIENTES: datos personales, cédula de identidad (CI, extensión y expedido), contacto y foto.
 * Modelo: App\Models\Customer · Pantalla: /admin/customers
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();

            // Foto: ruta del .avif normal que devuelve StorageController::store_image. Null = sin foto.
            // Junto a ese archivo queda la versión recortada 300x300 (-cropped.webp). Nunca se borran del disco.
            $table->string('photo')->nullable();

            // NOMBRES Y APELLIDOS. Solo el primer nombre y el primer apellido son obligatorios.
            $table->string('first_name', 80);                  // Primer nombre
            $table->string('second_name', 80)->nullable();     // Segundo nombre (puede traer más de uno: "María del Carmen")
            $table->string('first_last_name', 80);             // Primer apellido (paterno)
            $table->string('second_last_name', 80)->nullable(); // Segundo apellido (materno)
            $table->string('married_last_name', 80)->nullable(); // Apellido de casada

            // CÉDULA DE IDENTIDAD. Se escribe así: 1234567-1A LP
            $table->string('ci', 20);                          // Número de CI, en mayúsculas
            $table->string('ci_extension', 5)->default('');    // Extensión (complemento) que distingue dos CI iguales. '' = no tiene; no es null para que el índice único la cubra
            $table->char('ci_issued_in', 2);                   // Expedido: LP, CB, SC, OR, PT, TJ, CH, BE, PD o EX (Customer::ISSUED_IN)

            // DATOS PERSONALES
            $table->date('birth_date')->nullable();            // Fecha de nacimiento (la edad se calcula, no se guarda)
            $table->string('gender', 15)->nullable();          // femenino o masculino (Customer::GENDERS)

            // CONTACTO
            $table->string('phone', 30)->nullable();           // Teléfono o celular
            $table->string('email')->nullable();               // Correo en minúsculas. No es único: una familia puede compartirlo
            $table->string('city', 100)->nullable();           // Ciudad o localidad
            $table->string('address')->nullable();             // Dirección (calle, número, zona)

            $table->text('notes')->nullable();                 // Observaciones libres del cliente
            $table->boolean('is_active')->default(true);       // false = cliente desactivado, sin eliminarlo

            $table->timestamps();                              // created_at = fecha de registro · updated_at = última edición

            // REGLA DEL SISTEMA: registerUser_id, registerRole, deleteUser_id, deleteRole y deleted_at
            $table->auditable();

            // Un mismo CI + extensión no se repite. Los eliminados también ocupan su lugar
            $table->unique(['ci', 'ci_extension']);
            // La lista se ordena por apellidos y nombre
            $table->index(['first_last_name', 'second_last_name', 'first_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
