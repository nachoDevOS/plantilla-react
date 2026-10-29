import { PageHeader } from '@/components/admin/common/page-header';
import { SimpleSelect } from '@/components/admin/common/simple-select';
import { Panel, PanelHeader } from '@/components/admin/dashboard/panel';
import { ExampleNotice } from '@/components/admin/examples/example-parts';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AdminLayout from '@/layouts/admin/admin-layout';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Bell, Building2, CheckCircle2, ClipboardList, LoaderCircle, MapPin, Save, Store, Truck, UploadCloud, User } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

/*
 * PÁGINA DE EJEMPLO: Formulario  (ruta /admin/examples/form)
 * Formulario largo dividido en bloques: campos de texto, selector, opciones en tarjetas, interruptores,
 * casillas, área de texto y zona para subir archivo. Valida en el navegador y muestra los errores debajo de cada campo.
 * En un módulo real se usa useForm() de Inertia y la validación la hace Laravel (FormRequest).
 */

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Ejemplos', href: '/admin/examples/form' },
    { title: 'Formulario', href: '/admin/examples/form' },
];

const cities = ['Trinidad', 'Santa Cruz', 'La Paz', 'Cochabamba', 'Riberalta', 'Guayaramerín'].map((c) => ({ id: c, name: c }));

const deliveryOptions = [
    { id: 'store', title: 'Recoge en tienda', description: 'Sin costo', icon: Store },
    { id: 'delivery', title: 'Envío a domicilio', description: 'Bs 15,00 · 24 h', icon: Truck },
    { id: 'company', title: 'Cuenta empresa', description: 'Factura a nombre de la empresa', icon: Building2 },
];

interface FormData {
    name: string;
    document: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    delivery: string;
    notes: string;
    notifyEmail: boolean;
    notifyWhatsapp: boolean;
    acceptTerms: boolean;
}

const initial: FormData = {
    name: '',
    document: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    delivery: 'store',
    notes: '',
    notifyEmail: true,
    notifyWhatsapp: false,
    acceptTerms: false,
};

export default function ExampleForm() {
    const [data, setData] = useState<FormData>(initial);
    const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
    const [processing, setProcessing] = useState(false);
    const [saved, setSaved] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);

    const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
        setData((d) => ({ ...d, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        const found: typeof errors = {};
        if (!data.name.trim()) found.name = 'El nombre es obligatorio.';
        if (!/^\d{5,12}$/.test(data.document)) found.document = 'Ingresa solo números (de 5 a 12 dígitos).';
        if (!/^\S+@\S+\.\S+$/.test(data.email)) found.email = 'Ingresa un correo válido.';
        if (!data.city) found.city = 'Elige una ciudad.';
        if (data.delivery === 'delivery' && !data.address.trim()) found.address = 'Para el envío necesitamos la dirección.';
        if (!data.acceptTerms) found.acceptTerms = 'Debes aceptar los términos para continuar.';
        setErrors(found);
        setSaved(false);
        if (Object.keys(found).length > 0) return;

        // Simula la espera del servidor
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            setSaved(true);
        }, 900);
    };

    const reset = () => {
        setData(initial);
        setErrors({});
        setSaved(false);
        setFileName(null);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Formulario (ejemplo)" />
            <form onSubmit={submit} className="flex w-full flex-1 flex-col gap-6 p-4 md:p-8">
                <PageHeader
                    icon={ClipboardList}
                    title="Registro de cliente"
                    description="Ejemplo de formulario completo con validación"
                    actions={
                        <>
                            <Button type="button" variant="outline" onClick={reset}>
                                Limpiar
                            </Button>
                            <Button type="submit" className="btn-brand" disabled={processing}>
                                {processing ? <LoaderCircle className="animate-spin" /> : <Save />} Guardar
                            </Button>
                        </>
                    }
                />

                <ExampleNotice />

                {saved && (
                    <div className="flex items-start gap-3 rounded-lg border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                        <p>
                            <span className="font-semibold">¡Listo!</span> {data.name} quedó registrado (de mentira: es un ejemplo).
                        </p>
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="flex flex-col gap-6 xl:col-span-2">
                        <Panel>
                            <PanelHeader icon={User} title="Datos personales" description="Así aparecerá en las facturas" />
                            <div className="grid gap-4 p-5 sm:grid-cols-2">
                                <Field label="Nombre completo" required error={errors.name} className="sm:col-span-2">
                                    <Input value={data.name} onChange={(e) => set('name', e.target.value)} placeholder="Ej: María Fernanda Rojas" />
                                </Field>
                                <Field label="CI / NIT" required error={errors.document}>
                                    <Input
                                        value={data.document}
                                        onChange={(e) => set('document', e.target.value)}
                                        inputMode="numeric"
                                        placeholder="6234512"
                                    />
                                </Field>
                                <Field label="Teléfono" hint="Opcional">
                                    <Input value={data.phone} onChange={(e) => set('phone', e.target.value)} inputMode="tel" placeholder="71234567" />
                                </Field>
                                <Field label="Correo electrónico" required error={errors.email} className="sm:col-span-2">
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => set('email', e.target.value)}
                                        placeholder="nombre@correo.com"
                                    />
                                </Field>
                            </div>
                        </Panel>

                        <Panel>
                            <PanelHeader icon={MapPin} title="Entrega" description="Cómo recibe sus pedidos" />
                            <div className="grid gap-4 p-5">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {deliveryOptions.map((option) => {
                                        const active = data.delivery === option.id;
                                        return (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => set('delivery', option.id)}
                                                className={cn(
                                                    'flex items-start gap-3 rounded-lg border p-3.5 text-left transition-colors',
                                                    active ? 'border-primary bg-primary/5 ring-primary/20 ring-2' : 'hover:border-primary/40 bg-card',
                                                )}
                                            >
                                                <option.icon
                                                    className={cn('mt-0.5 size-5 shrink-0', active ? 'text-primary' : 'text-muted-foreground')}
                                                />
                                                <span>
                                                    <span className="block text-[13px] font-semibold">{option.title}</span>
                                                    <span className="text-muted-foreground block text-xs">{option.description}</span>
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field label="Ciudad" required error={errors.city}>
                                        <SimpleSelect
                                            className="h-10"
                                            options={cities}
                                            value={data.city}
                                            onChange={(value) => set('city', value)}
                                            placeholder="Elige una ciudad"
                                        />
                                    </Field>
                                    <Field label="Dirección" required={data.delivery === 'delivery'} error={errors.address}>
                                        <Input
                                            value={data.address}
                                            onChange={(e) => set('address', e.target.value)}
                                            placeholder="Calle, número y zona"
                                        />
                                    </Field>
                                </div>
                                <Field label="Notas para el repartidor" hint={`${data.notes.length}/200`}>
                                    <textarea
                                        value={data.notes}
                                        maxLength={200}
                                        onChange={(e) => set('notes', e.target.value)}
                                        rows={3}
                                        placeholder="Ej: tocar el timbre dos veces"
                                        className="border-input bg-card placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/20 dark:bg-background/60 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow] outline-none focus-visible:ring-3"
                                    />
                                </Field>
                            </div>
                        </Panel>
                    </div>

                    <div className="flex flex-col gap-6">
                        <Panel>
                            <PanelHeader icon={Bell} title="Notificaciones" />
                            <div className="divide-y">
                                <SwitchRow
                                    label="Avisos por correo"
                                    description="Ofertas y estado de pedidos"
                                    checked={data.notifyEmail}
                                    onChange={(v) => set('notifyEmail', v)}
                                />
                                <SwitchRow
                                    label="Avisos por WhatsApp"
                                    description="Solo cuando el pedido sale"
                                    checked={data.notifyWhatsapp}
                                    onChange={(v) => set('notifyWhatsapp', v)}
                                />
                            </div>
                        </Panel>

                        <Panel>
                            <PanelHeader icon={UploadCloud} title="Documento" description="Foto del CI (opcional)" />
                            <div className="p-5">
                                <label className="border-input hover:border-primary/50 hover:bg-primary/5 flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors">
                                    <UploadCloud className="text-primary size-8" />
                                    <span className="text-[13px] font-medium">{fileName ?? 'Haz clic para elegir un archivo'}</span>
                                    <span className="text-muted-foreground text-xs">JPG, PNG o PDF · máximo 2 MB</span>
                                    <input type="file" className="sr-only" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
                                </label>
                            </div>
                        </Panel>

                        <Panel>
                            <div className="space-y-2 p-5">
                                <label className="flex items-start gap-3 text-[13px]">
                                    <Checkbox checked={data.acceptTerms} onCheckedChange={(v) => set('acceptTerms', v === true)} className="mt-0.5" />
                                    <span>
                                        Acepto los <span className="text-primary font-medium">términos y condiciones</span> y la política de
                                        privacidad.
                                    </span>
                                </label>
                                {errors.acceptTerms && <p className="text-destructive text-xs">{errors.acceptTerms}</p>}
                            </div>
                        </Panel>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

interface FieldProps {
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    className?: string;
    children: React.ReactNode;
}

function Field({ label, required, hint, error, className, children }: FieldProps) {
    return (
        <div className={cn('grid content-start gap-1.5', className, error && '[&_input]:border-destructive [&_button]:border-destructive')}>
            <div className="flex items-center justify-between">
                <Label>
                    {label} {required && <span className="text-destructive">*</span>}
                </Label>
                {hint && <span className="text-muted-foreground num text-xs">{hint}</span>}
            </div>
            {children}
            {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
    );
}

/** Fila con interruptor (encendido / apagado). */
function SwitchRow({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div>
                <p className="text-[13px] font-medium">{label}</p>
                <p className="text-muted-foreground text-xs">{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={label}
                onClick={() => onChange(!checked)}
                className={cn('relative h-5 w-9 shrink-0 rounded-full transition-colors', checked ? 'bg-primary' : 'bg-input')}
            >
                <span
                    className={cn('absolute top-0.5 left-0.5 size-4 rounded-full bg-white shadow transition-transform', checked && 'translate-x-4')}
                />
            </button>
        </div>
    );
}
