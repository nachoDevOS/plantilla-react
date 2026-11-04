/**
 * Pieza de Clientes: desplegable de cada fila de la lista (pages/admin/customers/index.tsx).
 * Los datos ya vienen en la página de la tabla: abrirlo no hace otra consulta.
 */
import { Detail } from '@/components/admin/common/data-table';
import { PhoneText, type PhoneCountry } from '@/components/admin/common/phone-input';
import { ageFrom } from '@/components/admin/customers/customer-avatar';
import { formatDate, formatPublicCode } from '@/lib/format';
import { type Customer, type Labels } from '@/types/admin/customers';
import { MapPin } from 'lucide-react';

interface CustomerRowDetailProps {
    customer: Customer;
    issuedIn: Labels;
    genders: Labels;
    phoneCountries: PhoneCountry[];
}

export function CustomerRowDetail({ customer, issuedIn, genders, phoneCountries }: CustomerRowDetailProps) {
    const age = ageFrom(customer.birth_date);

    return (
        <div className="grid gap-4 xl:grid-cols-3">
            <Block title="Datos personales">
                <Detail label="Primer nombre">{customer.first_name}</Detail>
                <Detail label="Segundo nombre">{customer.second_name || '—'}</Detail>
                <Detail label="Primer apellido">{customer.first_last_name}</Detail>
                <Detail label="Segundo apellido">{customer.second_last_name || '—'}</Detail>
                <Detail label="Apellido de casada">{customer.married_last_name || '—'}</Detail>
                <Detail label="Género">{customer.gender ? (genders[customer.gender] ?? customer.gender) : '—'}</Detail>
                <div className="col-span-2">
                    <Detail label="Nacimiento">
                        {customer.birth_date ? `${formatDate(customer.birth_date)}${age !== null ? ` · ${age} años` : ''}` : '—'}
                    </Detail>
                </div>
            </Block>

            <Block title="Documento y contacto">
                <Detail label="CI">
                    <span className="num">{customer.ci}</span>
                </Detail>
                <Detail label="Extensión">{customer.ci_extension || '—'}</Detail>
                <Detail label="Expedido">{issuedIn[customer.ci_issued_in] ?? customer.ci_issued_in}</Detail>
                <Detail label="Teléfono">
                    <PhoneText countries={phoneCountries} code={customer.phone_country_code} number={customer.phone} />
                </Detail>
                <div className="col-span-2">
                    <Detail label="Correo">
                        <span className="break-words">{customer.email || '—'}</span>
                    </Detail>
                </div>
                <div className="col-span-2">
                    <Detail label="Dirección">
                        <span className="break-words">{customer.address || '—'}</span>
                    </Detail>
                </div>
                <div className="col-span-2">
                    <Detail label="Ubicación">
                        {customer.latitude && customer.longitude ? (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${customer.latitude},${customer.longitude}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary num inline-flex items-center gap-1.5 hover:underline"
                            >
                                <MapPin className="size-3.5" />
                                {customer.latitude}, {customer.longitude}
                            </a>
                        ) : (
                            '—'
                        )}
                    </Detail>
                </div>
            </Block>

            <Block title="Registro">
                <div className="col-span-2">
                    <Detail label="Código">
                        <span className="font-mono text-xs tracking-wide break-all">{formatPublicCode(customer.code)}</span>
                    </Detail>
                </div>
                <Detail label="Registrado por">{customer.registered_by?.name ?? '—'}</Detail>
                <Detail label="Rol">{customer.registerRole ?? '—'}</Detail>
                <Detail label="Fecha de registro">{formatDate(customer.created_at)}</Detail>
                <Detail label="Última modificación">{formatDate(customer.updated_at)}</Detail>
                <div className="col-span-2">
                    <Detail label="Observaciones">
                        <span className="font-normal break-words whitespace-pre-line">{customer.notes || '—'}</span>
                    </Detail>
                </div>
            </Block>
        </div>
    );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="bg-card min-w-0 rounded-lg border p-4">
            <h3 className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{title}</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">{children}</div>
        </section>
    );
}
