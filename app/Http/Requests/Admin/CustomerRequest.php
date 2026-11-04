<?php

namespace App\Http\Requests\Admin;

use App\Models\Customer;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Validación del formulario de cliente (crear y editar).
 * POST /admin/customers  ·  PUT /admin/customers/{customer}
 *
 * El permiso para entrar (clientes.crear / clientes.editar) ya lo revisa la ruta (routes/admin.php).
 */
class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * CI y extensión siempre en mayúsculas y correo en minúsculas, para que "1a" y "1A" sean el mismo documento.
     * Del teléfono quedan solo los dígitos; sin número no se guarda código de país.
     */
    protected function prepareForValidation(): void
    {
        $phone = preg_replace('/\D/', '', (string) $this->input('phone'));

        $this->merge([
            'phone' => $phone !== '' ? $phone : null,
            'phone_country_code' => $phone !== '' ? $this->input('phone_country_code') : null,
            'ci' => mb_strtoupper((string) $this->input('ci')),
            'ci_extension' => mb_strtoupper((string) $this->input('ci_extension')),
            'email' => $this->filled('email') ? mb_strtolower($this->input('email')) : null,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'first_name' => ['required', 'string', 'max:80'],
            'second_name' => ['nullable', 'string', 'max:80'],
            'first_last_name' => ['required', 'string', 'max:80'],
            'second_last_name' => ['nullable', 'string', 'max:80'],
            'married_last_name' => ['nullable', 'string', 'max:80'],
            // Único por CI + extensión. Cuenta también los eliminados: la fila sigue ocupando el índice único
            'ci' => [
                'required', 'string', 'max:20', 'regex:/^[A-Z0-9-]+$/',
                Rule::unique('customers', 'ci')->where('ci_extension', $this->input('ci_extension'))->ignore($this->route('customer')),
            ],
            'ci_extension' => ['nullable', 'string', 'max:5', 'alpha_num'],
            'ci_issued_in' => ['required', Rule::in(array_keys(Customer::ISSUED_IN))],
            'birth_date' => ['nullable', 'date', 'before:today', 'after:1900-01-01'],
            'gender' => ['nullable', Rule::in(array_keys(Customer::GENDERS))],
            'phone_country_code' => ['nullable', 'required_with:phone', Rule::in(array_keys(Customer::PHONE_COUNTRIES))],
            'phone' => ['nullable', 'string', 'regex:/^[0-9]{6,15}$/'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
            // Ubicación: las dos coordenadas juntas o ninguna
            'latitude' => ['nullable', 'required_with:longitude', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'required_with:latitude', 'numeric', 'between:-180,180'],
            'notes' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['boolean'],
            // Foto (la guarda StorageController como .avif), máximo 3 MB. remove_photo = quitar la que tiene
            'photo' => ['nullable', 'image', 'mimes:jpeg,jpg,png,bmp,webp,gif,avif', 'max:3072'],
            'remove_photo' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'ci.unique' => 'Ya hay un cliente con ese CI y extensión (activo o eliminado).',
            'ci.regex' => 'El CI solo puede tener letras, números y guiones.',
            'phone.regex' => 'El teléfono debe tener entre 6 y 15 dígitos.',
            'phone_country_code.required_with' => 'Elige el código de país.',
            'photo.max' => 'La foto no puede pasar de 3 MB.',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'first_name' => 'primer nombre',
            'second_name' => 'segundo nombre',
            'first_last_name' => 'primer apellido',
            'second_last_name' => 'segundo apellido',
            'married_last_name' => 'apellido de casada',
            'ci' => 'CI',
            'ci_extension' => 'extensión',
            'ci_issued_in' => 'expedido',
            'birth_date' => 'fecha de nacimiento',
            'gender' => 'género',
            'phone_country_code' => 'código de país',
            'phone' => 'teléfono',
            'email' => 'correo',
            'address' => 'dirección',
            'latitude' => 'latitud',
            'longitude' => 'longitud',
            'notes' => 'observaciones',
            'photo' => 'foto',
        ];
    }
}
