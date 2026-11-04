/**
 * TELÉFONO CON CÓDIGO DE PAÍS: selector con bandera a la izquierda y número a la derecha, como un solo campo.
 * Guarda las dos partes por separado.
 *
 *   <PhoneInput countries={phoneCountries} code={data.phone_country_code} number={data.phone}
 *       onCodeChange={(v) => setData('phone_country_code', v)} onNumberChange={(v) => setData('phone', v)} />
 *
 * PhoneText: el teléfono ya guardado, para leerlo en tablas y fichas.
 *   <PhoneText countries={phoneCountries} code={customer.phone_country_code} number={customer.phone} />
 */
import { CountryFlag } from '@/components/admin/common/country-flag';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface PhoneCountry {
    dial: string;
    iso: string;
    name: string;
}

interface PhoneInputProps {
    id?: string;
    countries: PhoneCountry[];
    code: string;
    number: string;
    onCodeChange: (code: string) => void;
    onNumberChange: (number: string) => void;
}

export function PhoneInput({ id, countries, code, number, onCodeChange, onNumberChange }: PhoneInputProps) {
    const selected = countries.find((country) => country.dial === code);

    return (
        <div className="flex">
            <Select value={code} onValueChange={onCodeChange}>
                <SelectTrigger aria-label="Código de país" className="h-10 w-[116px] shrink-0 rounded-r-none border-r-0 focus:z-10">
                    <SelectValue>
                        {selected && (
                            <span className="flex items-center gap-2">
                                <CountryFlag iso={selected.iso} />
                                <span className="num">{selected.dial}</span>
                            </span>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {countries.map((country) => (
                        <SelectItem key={country.dial} value={country.dial}>
                            <span className="flex items-center gap-2.5">
                                <CountryFlag iso={country.iso} />
                                <span>{country.name}</span>
                                <span className="num text-muted-foreground">{country.dial}</span>
                            </span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                id={id}
                type="tel"
                inputMode="numeric"
                autoComplete="off"
                maxLength={15}
                placeholder="71234567"
                value={number}
                // Solo dígitos: el código de país ya va en el selector
                onChange={(e) => onNumberChange(e.target.value.replace(/\D/g, ''))}
                className="rounded-l-none focus-visible:z-10"
            />
        </div>
    );
}

/** Bandera, código de país y número. Si no hay número muestra una raya. */
export function PhoneText({ countries, code, number }: { countries: PhoneCountry[]; code: string | null; number: string | null }) {
    if (!number) return <>—</>;
    const country = countries.find((item) => item.dial === code);

    return (
        <span className="num inline-flex items-center gap-2 whitespace-nowrap">
            {country && <CountryFlag iso={country.iso} />}
            <span>
                {code} {number}
            </span>
        </span>
    );
}
