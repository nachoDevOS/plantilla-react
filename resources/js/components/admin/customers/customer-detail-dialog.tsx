/**
 * Pieza de Clientes (se usa en pages/admin/customers/index.tsx): ventana del botón "Ver", con la foto grande
 * y los mismos datos del desplegable de la fila (CustomerRowDetail).
 */
import { GoogleMap } from '@/components/admin/common/google-map';
import { toMapPosition } from '@/components/admin/common/location-picker';
import { type PhoneCountry } from '@/components/admin/common/phone-input';
import { StatusBadge, UserAvatar } from '@/components/admin/common/user-badges';
import { CustomerRowDetail } from '@/components/admin/customers/customer-row-detail';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStorageUrl } from '@/lib/storage';
import { type Customer, type Labels } from '@/types/admin/customers';
import { Pencil } from 'lucide-react';

interface CustomerDetailDialogProps {
    customer: Customer | null;
    issuedIn: Labels;
    genders: Labels;
    phoneCountries: PhoneCountry[];
    googleMapsKey: string | null;
    onClose: () => void;
    /** Sin esto (sin permiso) no aparece el botón Editar */
    onEdit?: (customer: Customer) => void;
}

export function CustomerDetailDialog({ customer, issuedIn, genders, phoneCountries, googleMapsKey, onClose, onEdit }: CustomerDetailDialogProps) {
    const imageUrl = useStorageUrl();
    const photoUrl = imageUrl(customer?.photo);
    const position = toMapPosition(customer?.latitude ?? null, customer?.longitude ?? null);

    return (
        <Dialog open={customer !== null} onOpenChange={(value) => !value && onClose()}>
            <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-5xl">
                {customer && (
                    <>
                        <DialogHeader>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                                {photoUrl ? (
                                    <a
                                        href={photoUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shrink-0"
                                        aria-label="Abrir foto en tamaño completo"
                                    >
                                        <img
                                            src={photoUrl}
                                            alt={`Foto de ${customer.full_name}`}
                                            className="bg-muted ring-border size-32 rounded-xl object-cover ring-1"
                                        />
                                    </a>
                                ) : (
                                    <UserAvatar name={customer.full_name} className="size-32 rounded-xl text-3xl" />
                                )}
                                <div className="min-w-0 space-y-1.5 pr-6">
                                    <DialogTitle className="text-xl break-words">{customer.full_name}</DialogTitle>
                                    <DialogDescription className="num">CI {customer.document}</DialogDescription>
                                    <StatusBadge active={customer.is_active} />
                                </div>
                            </div>
                        </DialogHeader>

                        <CustomerRowDetail customer={customer} issuedIn={issuedIn} genders={genders} phoneCountries={phoneCountries} />

                        {googleMapsKey && position && <GoogleMap apiKey={googleMapsKey} position={position} className="h-64 w-full" />}

                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>
                                Cerrar
                            </Button>
                            {onEdit && (
                                <Button className="btn-brand" onClick={() => onEdit(customer)}>
                                    <Pencil /> Editar
                                </Button>
                            )}
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
