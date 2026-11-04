/**
 * BANDERA DE UN PAÍS dibujada en SVG, para que se vea igual en todo equipo (Windows no tiene emojis de banderas).
 * Son versiones simplificadas pensadas para tamaño pequeño, sin escudos.
 * Uso: <CountryFlag iso="BO" />
 * Para agregar un país: súmalo aquí y en Customer::PHONE_COUNTRIES.
 */
import { cn } from '@/lib/utils';

/** Franjas horizontales del mismo alto. */
const rows = (...colors: string[]) =>
    colors.map((color, i) => <rect key={i} y={(20 / colors.length) * i} width="30" height={20 / colors.length} fill={color} />);

/** Franjas verticales del mismo ancho. */
const columns = (...colors: string[]) => colors.map((color, i) => <rect key={i} x={10 * i} width="10" height="20" fill={color} />);

const FLAGS: Record<string, React.ReactNode> = {
    BO: rows('#D52B1E', '#F9E300', '#007934'),
    AR: (
        <>
            {rows('#74ACDF', '#FFFFFF', '#74ACDF')}
            <circle cx="15" cy="10" r="2.2" fill="#F6B40E" />
        </>
    ),
    BR: (
        <>
            <rect width="30" height="20" fill="#009B3A" />
            <polygon points="15,2 28,10 15,18 2,10" fill="#FEDF00" />
            <circle cx="15" cy="10" r="4.5" fill="#002776" />
        </>
    ),
    CL: (
        <>
            {rows('#FFFFFF', '#D52B1E')}
            <rect width="10" height="10" fill="#0039A6" />
            <circle cx="5" cy="5" r="1.8" fill="#FFFFFF" />
        </>
    ),
    CO: (
        <>
            <rect width="30" height="10" fill="#FCD116" />
            <rect y="10" width="30" height="5" fill="#003893" />
            <rect y="15" width="30" height="5" fill="#CE1126" />
        </>
    ),
    EC: (
        <>
            <rect width="30" height="10" fill="#FFDD00" />
            <rect y="10" width="30" height="5" fill="#034EA2" />
            <rect y="15" width="30" height="5" fill="#ED1C24" />
            <circle cx="15" cy="10" r="2.4" fill="#8C5A2B" />
        </>
    ),
    PY: rows('#D52B1E', '#FFFFFF', '#0038A8'),
    PE: columns('#D91023', '#FFFFFF', '#D91023'),
    UY: (
        <>
            {rows('#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF', '#0038A8', '#FFFFFF')}
            <rect width="11" height="11" fill="#FFFFFF" />
            <circle cx="5.5" cy="5.5" r="3" fill="#FCD116" />
        </>
    ),
    VE: (
        <>
            {rows('#FFCC00', '#00247D', '#CF142B')}
            <circle cx="11" cy="10" r="0.8" fill="#FFFFFF" />
            <circle cx="15" cy="9" r="0.8" fill="#FFFFFF" />
            <circle cx="19" cy="10" r="0.8" fill="#FFFFFF" />
        </>
    ),
    MX: (
        <>
            {columns('#006847', '#FFFFFF', '#CE1126')}
            <circle cx="15" cy="10" r="2" fill="#8C5A2B" />
        </>
    ),
    ES: (
        <>
            <rect width="30" height="20" fill="#AA151B" />
            <rect y="5" width="30" height="10" fill="#F1BF00" />
        </>
    ),
    US: (
        <>
            {rows(...Array.from({ length: 13 }, (_, i) => (i % 2 === 0 ? '#B22234' : '#FFFFFF')))}
            <rect width="13" height="10.8" fill="#3C3B6E" />
        </>
    ),
};

export function CountryFlag({ iso, className }: { iso: string; className?: string }) {
    return (
        <svg viewBox="0 0 30 20" aria-hidden="true" className={cn('ring-foreground/10 h-3.5 w-[21px] shrink-0 rounded-[2px] ring-1', className)}>
            {FLAGS[iso]}
        </svg>
    );
}
