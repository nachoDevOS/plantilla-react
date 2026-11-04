/**
 * Pieza de Clientes (se usa en pages/admin/customers/index.tsx).
 * A la izquierda la foto y un carnet que se arma en vivo mientras se escribe; a la derecha los datos.
 */
import { LocationPicker } from '@/components/admin/common/location-picker';
import { PhoneInput, type PhoneCountry } from '@/components/admin/common/phone-input';
import { SimpleSelect } from '@/components/admin/common/simple-select';
import { ageFrom } from '@/components/admin/customers/customer-avatar';
import { CustomerPhotoField } from '@/components/admin/customers/customer-photo-field';
import InputError from '@/components/shared/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStorageUrl } from '@/lib/storage';
import { type Customer, type CustomerForm, type Labels } from '@/types/admin/customers';
import { useForm } from '@inertiajs/react';
import { IdCard, LoaderCircle } from 'lucide-react';
import { FormEventHandler, useEffect, useMemo } from 'react';

/** Código de país que aparece elegido al registrar: Bolivia. */
const DEFAULT_PHONE_CODE = '+591';

const emptyForm: CustomerForm = {
    first_name: '',
    second_name: '',
    first_last_name: '',
    second_last_name: '',
    married_last_name: '',
    ci: '',
    ci_extension: '',
    ci_issued_in: '',
    birth_date: '',
    gender: '',
    phone_country_code: DEFAULT_PHONE_CODE,
    phone: '',
    email: '',
    address: '',
    latitude: '',
    longitude: '',
    notes: '',
    is_active: true,
    photo: null,
    remove_photo: false,
};

interface CustomerFormDialogProps {
    open: boolean;
    onClose: () => void;
    /** null = registrar uno nuevo */
    customer: Customer | null;
    issuedIn: Labels;
    genders: Labels;
    phoneCountries: PhoneCountry[];
    googleMapsKey: string | null;
}

export function CustomerFormDialog({ open, onClose, customer, issuedIn, genders, phoneCountries, googleMapsKey }: CustomerFormDialogProps) {
    const isEdit = customer !== null;
    const imageUrl = useStorageUrl();
    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm<CustomerForm>(emptyForm);

    const issuedOptions = useMemo(() => Object.entries(issuedIn).map(([id, name]) => ({ id, name: `${id} · ${name}` })), [issuedIn]);
    const genderOptions = useMemo(() => Object.entries(genders).map(([id, name]) => ({ id, name })), [genders]);

    // Cada vez que se abre: cargamos los datos del cliente, o vaciamos el formulario
    useEffect(() => {
        if (!open) return;
        clearErrors();
        setData({
            ...emptyForm,
            first_name: customer?.first_name ?? '',
            second_name: customer?.second_name ?? '',
            first_last_name: customer?.first_last_name ?? '',
            second_last_name: customer?.second_last_name ?? '',
            married_last_name: customer?.married_last_name ?? '',
            ci: customer?.ci ?? '',
            ci_extension: customer?.ci_extension ?? '',
            ci_issued_in: customer?.ci_issued_in ?? '',
            birth_date: customer?.birth_date?.slice(0, 10) ?? '',
            gender: customer?.gender ?? '',
            phone_country_code: customer?.phone_country_code ?? DEFAULT_PHONE_CODE,
            phone: customer?.phone ?? '',
            email: customer?.email ?? '',
            address: customer?.address ?? '',
            latitude: customer?.latitude ?? '',
            longitude: customer?.longitude ?? '',
            notes: customer?.notes ?? '',
            is_active: customer?.is_active ?? true,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, customer]);

    // Con archivos PHP solo lee POST: al editar se envía POST con _method=put (Laravel lo trata como PUT)
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        transform((form) => (isEdit ? { ...form, _method: 'put' } : form));
        post(isEdit ? route('admin.customers.update', customer.code) : route('admin.customers.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const text = (field: keyof CustomerForm) => ({
        id: field,
        value: data[field] as string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setData(field, e.target.value),
    });

    const fullName = [data.first_name, data.second_name, data.first_last_name, data.second_last_name, data.married_last_name]
        .filter((part) => part.trim() !== '')
        .join(' ');
    const documentText = data.ci
        ? `${data.ci.toUpperCase()}${data.ci_extension ? `-${data.ci_extension.toUpperCase()}` : ''} ${data.ci_issued_in}`.trim()
        : '';
    const age = ageFrom(data.birth_date);

    return (
        <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
                    <DialogDescription>
                        Los campos con <RequiredMark /> son obligatorios.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-6">
                    <div className="grid gap-6 md:grid-cols-[240px_1fr]">
                        <div className="grid content-start gap-4">
                            <CustomerPhotoField
                                currentUrl={data.remove_photo ? null : imageUrl(customer?.photo)}
                                file={data.photo}
                                onChange={(file) => setData('photo', file)}
                                onRemoveCurrent={() => setData('remove_photo', true)}
                                error={errors.photo}
                            />

                            {/* Carnet: repite lo escrito para revisar nombre y CI de un vistazo */}
                            <div className="bg-primary/5 ring-primary/15 rounded-xl p-3 ring-1 ring-inset">
                                <p className="text-primary mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase">
                                    <IdCard className="size-3.5" /> Así quedará registrado
                                </p>
                                <p className="font-medium break-words">
                                    {fullName || <span className="text-muted-foreground">Nombre del cliente</span>}
                                </p>
                                <p className="num text-muted-foreground mt-0.5 text-sm">
                                    CI {documentText || '—'}
                                    {age !== null && ` · ${age} ${age === 1 ? 'año' : 'años'}`}
                                </p>
                            </div>
                        </div>

                        <div className="grid content-start gap-6">
                            <Section title="Nombres y apellidos">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Primer nombre" required htmlFor="first_name" error={errors.first_name}>
                                        <Input {...text('first_name')} autoFocus autoComplete="off" />
                                    </Field>
                                    <Field label="Segundo nombre" htmlFor="second_name" error={errors.second_name}>
                                        <Input {...text('second_name')} autoComplete="off" />
                                    </Field>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <Field label="Primer apellido" required htmlFor="first_last_name" error={errors.first_last_name}>
                                        <Input {...text('first_last_name')} autoComplete="off" />
                                    </Field>
                                    <Field label="Segundo apellido" htmlFor="second_last_name" error={errors.second_last_name}>
                                        <Input {...text('second_last_name')} autoComplete="off" />
                                    </Field>
                                    <Field label="Apellido de casada" htmlFor="married_last_name" error={errors.married_last_name}>
                                        <Input {...text('married_last_name')} autoComplete="off" />
                                    </Field>
                                </div>
                            </Section>

                            <Section title="Documento de identidad">
                                <div className="grid gap-4 sm:grid-cols-[1fr_110px_1fr]">
                                    <Field label="CI" required htmlFor="ci" error={errors.ci}>
                                        <Input {...text('ci')} inputMode="numeric" placeholder="1234567" autoComplete="off" />
                                    </Field>
                                    <Field label="Extensión" htmlFor="ci_extension" error={errors.ci_extension}>
                                        <Input {...text('ci_extension')} placeholder="1A" maxLength={5} autoComplete="off" />
                                    </Field>
                                    <Field label="Expedido" required htmlFor="ci_issued_in" error={errors.ci_issued_in}>
                                        <SimpleSelect
                                            id="ci_issued_in"
                                            className="h-10"
                                            options={issuedOptions}
                                            value={data.ci_issued_in}
                                            onChange={(value) => setData('ci_issued_in', value)}
                                        />
                                    </Field>
                                </div>
                            </Section>

                            <Section title="Datos personales">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Fecha de nacimiento" htmlFor="birth_date" error={errors.birth_date}>
                                        <Input {...text('birth_date')} type="date" />
                                    </Field>
                                    <Field label="Género" htmlFor="gender" error={errors.gender}>
                                        <SimpleSelect
                                            id="gender"
                                            className="h-10"
                                            options={genderOptions}
                                            value={data.gender}
                                            onChange={(value) => setData('gender', value)}
                                        />
                                    </Field>
                                </div>
                            </Section>

                            <Section title="Contacto">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Teléfono / celular" htmlFor="phone" error={errors.phone ?? errors.phone_country_code}>
                                        <PhoneInput
                                            id="phone"
                                            countries={phoneCountries}
                                            code={data.phone_country_code}
                                            number={data.phone}
                                            onCodeChange={(value) => setData('phone_country_code', value)}
                                            onNumberChange={(value) => setData('phone', value)}
                                        />
                                    </Field>
                                    <Field label="Correo electrónico" htmlFor="email" error={errors.email}>
                                        <Input {...text('email')} type="email" placeholder="correo@ejemplo.com" autoComplete="off" />
                                    </Field>
                                </div>
                                <Field label="Dirección" htmlFor="address" error={errors.address}>
                                    <Input {...text('address')} autoComplete="off" />
                                </Field>
                                <LocationPicker
                                    apiKey={googleMapsKey}
                                    latitude={data.latitude}
                                    longitude={data.longitude}
                                    onChange={(latitude, longitude) => setData({ ...data, latitude, longitude })}
                                    latitudeError={errors.latitude}
                                    longitudeError={errors.longitude}
                                />
                                <Field label="Observaciones" htmlFor="notes" error={errors.notes}>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-hidden"
                                    />
                                </Field>
                                <label className="flex h-10 w-fit cursor-pointer items-center gap-3 rounded-md border px-3">
                                    <Checkbox checked={data.is_active} onCheckedChange={(checked) => setData('is_active', checked === true)} />
                                    <span className="text-sm">Cliente activo</span>
                                </label>
                            </Section>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing} className="btn-brand">
                            {processing && <LoaderCircle className="size-4 animate-spin" />}
                            {isEdit ? 'Guardar cambios' : 'Registrar cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <fieldset className="grid gap-4">
            <legend className="text-muted-foreground mb-3 text-xs font-semibold tracking-wide uppercase">{title}</legend>
            {children}
        </fieldset>
    );
}

/** Asterisco rojo de los campos obligatorios. */
function RequiredMark() {
    return (
        <span aria-hidden="true" className="font-semibold text-red-600 dark:text-red-400">
            *
        </span>
    );
}

interface FieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
}

function Field({ label, htmlFor, required, error, children }: FieldProps) {
    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={htmlFor}>
                {label} {required && <RequiredMark />}
            </Label>
            {children}
            <InputError message={error} />
        </div>
    );
}
