/**
 * TIPOS DEL MÓDULO DE CLIENTES (pages/admin/customers y components/admin/customers).
 */

/** Filtros de la lista. Viajan en la URL: /admin/customers?search=ana&status=active */
export interface CustomerFilters {
    search?: string;
    status?: string;
    /** Registros por página ("Mostrar N registros"): 10, 15, 25, 50 o 100 */
    per_page?: string;
}

/** Un cliente tal como lo envía CustomerController. */
export interface Customer {
    /** Código público: reemplaza al id en las URL (trait HasPublicCode) */
    code: string;
    /** Foto: ruta del .avif en S3 (ver lib/storage.ts) */
    photo: string | null;
    first_name: string;
    second_name: string | null;
    first_last_name: string;
    second_last_name: string | null;
    married_last_name: string | null;
    ci: string;
    ci_extension: string;
    ci_issued_in: string;
    birth_date: string | null;
    gender: string | null;
    phone_country_code: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    /** Rol que tenía quien lo registró (trait Auditable) */
    registerRole: string | null;
    registered_by: { id: number; name: string } | null;
    /** Calculados en el modelo */
    full_name: string;
    document: string;
    /** Teléfono con código de país: +591 71234567 */
    full_phone: string | null;
    /** Versión recortada 300x300 de la foto */
    photo_thumb: string | null;
}

/** Campos del formulario para registrar / editar un cliente. */
export type CustomerForm = {
    first_name: string;
    second_name: string;
    first_last_name: string;
    second_last_name: string;
    married_last_name: string;
    ci: string;
    ci_extension: string;
    ci_issued_in: string;
    birth_date: string;
    gender: string;
    phone_country_code: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    is_active: boolean;
    /** Archivo nuevo elegido (o tomado con la cámara). null = no cambiar */
    photo: File | null;
    remove_photo: boolean;
};

/** Listas { LP: 'La Paz' } y { femenino: 'Femenino' } que envía el servidor (App\Models\Customer). */
export type Labels = Record<string, string>;
