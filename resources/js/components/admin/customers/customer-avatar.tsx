/**
 * Pieza de Clientes: foto del cliente, o sus iniciales si no tiene.
 * La foto pequeña es la versión recortada 300x300 que guarda StorageController.
 * Con fullSrc, al pasar el mouse se expande el .avif normal; el navegador recién lo pide en ese momento.
 */
import { UserAvatar } from '@/components/admin/common/user-badges';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { TooltipPortal } from '@radix-ui/react-tooltip';

interface CustomerAvatarProps {
    name: string;
    src: string | null;
    fullSrc?: string | null;
    className?: string;
}

export function CustomerAvatar({ name, src, fullSrc, className }: CustomerAvatarProps) {
    if (!src) {
        return <UserAvatar name={name} className={className} />;
    }

    const thumbnail = (
        <img
            src={src}
            alt={`Foto de ${name}`}
            loading="lazy"
            className={cn('ring-border size-9 shrink-0 rounded-full object-cover ring-1', className)}
        />
    );

    if (!fullSrc) {
        return thumbnail;
    }

    return (
        <Tooltip delayDuration={120} disableHoverableContent>
            <TooltipTrigger asChild>{thumbnail}</TooltipTrigger>
            {/* En portal: la tabla tiene overflow-hidden y recortaría la foto */}
            <TooltipPortal>
                <TooltipContent
                    side="right"
                    align="center"
                    sideOffset={12}
                    collisionPadding={16}
                    className="bg-card text-foreground ring-border pointer-events-none rounded-xl p-2 shadow-xl ring-1"
                >
                    <img src={fullSrc} alt={`Foto ampliada de ${name}`} className="bg-muted size-72 rounded-lg object-contain" />
                    <p className="mt-2 max-w-72 truncate px-1 pb-0.5 text-center text-sm font-medium">{name}</p>
                </TooltipContent>
            </TooltipPortal>
        </Tooltip>
    );
}

/** Años cumplidos a partir de la fecha de nacimiento (AAAA-MM-DD). null si no hay fecha válida. */
export function ageFrom(birthDate: string | null | undefined): number | null {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate.slice(0, 10)}T00:00:00`);
    if (Number.isNaN(birth.getTime())) return null;
    const today = new Date();
    const hadBirthday = today.getMonth() > birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    const age = today.getFullYear() - birth.getFullYear() - (hadBirthday ? 0 : 1);
    return age >= 0 && age < 130 ? age : null;
}
