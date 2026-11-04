<?php

namespace App\Models\Concerns;

/**
 * Código público del registro: 16 caracteres aleatorios que reemplazan al id en las URL.
 *   /admin/customers/5 → /admin/customers/7K3M9QXA2HTVP4NR
 * Así nadie ve cuántos registros hay ni puede recorrerlos probando /6, /7…
 *
 * Es aleatorio, no un hash: no se puede recalcular a partir del id ni de los datos del registro.
 * Sirve para IDENTIFICAR, no para autorizar: cada ruta debe seguir pidiendo su permiso.
 *
 * El modelo necesita la columna char('code', 16) única. El id deja de enviarse a React.
 */
trait HasPublicCode
{
    /** Números y mayúsculas sin I, L, O ni U, que se confunden al leerlos. */
    private const PUBLIC_CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

    private const PUBLIC_CODE_LENGTH = 16;

    public static function bootHasPublicCode(): void
    {
        static::creating(function (self $model) {
            $model->code ??= static::generatePublicCode();
        });
    }

    public function initializeHasPublicCode(): void
    {
        $this->mergeHidden([$this->getKeyName()]);
    }

    /** Las rutas buscan por código: route('admin.customers.update', $customer) lleva el código, no el id. */
    public function getRouteKeyName(): string
    {
        return 'code';
    }

    /** Código nuevo que no usa ningún registro, ni siquiera uno eliminado. */
    public static function generatePublicCode(): string
    {
        do {
            $code = '';
            for ($position = 0; $position < self::PUBLIC_CODE_LENGTH; $position++) {
                $code .= self::PUBLIC_CODE_ALPHABET[random_int(0, strlen(self::PUBLIC_CODE_ALPHABET) - 1)];
            }
        } while (static::withTrashed()->where('code', $code)->exists());

        return $code;
    }
}
