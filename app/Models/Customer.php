<?php

namespace App\Models;

use App\Models\Concerns\Auditable;
use App\Models\Concerns\HasPublicCode;
use Database\Factories\CustomerFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Cliente: datos personales, cédula de identidad (CI, extensión y expedido), contacto y foto.
 * La foto vive en el disco de FILESYSTEM_DISK (S3): React arma su dirección con useStorageUrl (lib/storage.ts).
 */
class Customer extends Model
{
    // REGLA DEL SISTEMA: eliminación lógica + quién registró / quién eliminó
    use Auditable;

    /** @use HasFactory<CustomerFactory> */
    use HasFactory;

    // En las URL y en React va el código público, nunca el id
    use HasPublicCode;

    /** Lugar de expedición del CI: los 9 departamentos de Bolivia y extranjero. */
    public const ISSUED_IN = [
        'LP' => 'La Paz',
        'CB' => 'Cochabamba',
        'SC' => 'Santa Cruz',
        'OR' => 'Oruro',
        'PT' => 'Potosí',
        'TJ' => 'Tarija',
        'CH' => 'Chuquisaca',
        'BE' => 'Beni',
        'PD' => 'Pando',
        'EX' => 'Extranjero',
    ];

    public const GENDERS = ['femenino' => 'Femenino', 'masculino' => 'Masculino'];

    /** Códigos de país del teléfono. La bandera de cada iso está en components/admin/common/country-flag.tsx */
    public const PHONE_COUNTRIES = [
        '+591' => ['iso' => 'BO', 'name' => 'Bolivia'],
        '+54' => ['iso' => 'AR', 'name' => 'Argentina'],
        '+55' => ['iso' => 'BR', 'name' => 'Brasil'],
        '+56' => ['iso' => 'CL', 'name' => 'Chile'],
        '+57' => ['iso' => 'CO', 'name' => 'Colombia'],
        '+593' => ['iso' => 'EC', 'name' => 'Ecuador'],
        '+595' => ['iso' => 'PY', 'name' => 'Paraguay'],
        '+51' => ['iso' => 'PE', 'name' => 'Perú'],
        '+598' => ['iso' => 'UY', 'name' => 'Uruguay'],
        '+58' => ['iso' => 'VE', 'name' => 'Venezuela'],
        '+52' => ['iso' => 'MX', 'name' => 'México'],
        '+34' => ['iso' => 'ES', 'name' => 'España'],
        '+1' => ['iso' => 'US', 'name' => 'Estados Unidos'],
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'photo', 'first_name', 'second_name', 'first_last_name', 'second_last_name', 'married_last_name',
        'ci', 'ci_extension', 'ci_issued_in', 'birth_date', 'gender', 'phone_country_code', 'phone', 'email', 'address', 'notes', 'is_active',
    ];

    /**
     * Campos calculados que recibe React.
     *
     * @var list<string>
     */
    protected $appends = ['full_name', 'document', 'full_phone', 'photo_thumb'];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'birth_date' => 'date:Y-m-d',
            'is_active' => 'boolean',
        ];
    }

    /** Nombre completo: nombres, apellidos y apellido de casada. */
    protected function fullName(): Attribute
    {
        return Attribute::get(fn () => collect([
            $this->first_name, $this->second_name, $this->first_last_name, $this->second_last_name, $this->married_last_name,
        ])->filter()->implode(' '));
    }

    /** CI como se escribe en un documento: 1234567-1A LP */
    protected function document(): Attribute
    {
        return Attribute::get(fn () => $this->ci.($this->ci_extension !== '' ? "-{$this->ci_extension}" : '')." {$this->ci_issued_in}");
    }

    /** Teléfono con su código de país: +591 71234567 */
    protected function fullPhone(): Attribute
    {
        return Attribute::get(fn () => $this->phone ? trim("{$this->phone_country_code} {$this->phone}") : null);
    }

    /** Ruta de la versión recortada 300x300 que StorageController guarda junto a la imagen normal. */
    protected function photoThumb(): Attribute
    {
        return Attribute::get(fn () => $this->photo ? preg_replace('/\.avif$/', '-cropped.webp', $this->photo) : null);
    }

    /** Busca por nombres, apellidos, CI, correo o teléfono. Cada palabra puede estar en un campo distinto. */
    public function scopeSearch(Builder $query, ?string $search): void
    {
        foreach (preg_split('/\s+/', trim((string) $search), -1, PREG_SPLIT_NO_EMPTY) as $term) {
            $query->where(fn (Builder $q) => $q
                ->where('first_name', 'like', "%{$term}%")
                ->orWhere('second_name', 'like', "%{$term}%")
                ->orWhere('first_last_name', 'like', "%{$term}%")
                ->orWhere('second_last_name', 'like', "%{$term}%")
                ->orWhere('married_last_name', 'like', "%{$term}%")
                ->orWhere('ci', 'like', "{$term}%")
                ->orWhere('email', 'like', "%{$term}%")
                ->orWhere('phone', 'like', "%{$term}%"));
        }
    }
}
