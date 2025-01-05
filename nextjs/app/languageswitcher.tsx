import {setUserLocale} from "@/lib/locale";
import {useLocale} from "next-intl";

export default function LanguageSwitcher() {
    const locale = useLocale();
    return (
        <div>
            <button className={locale === 'en' ? 'text-cyan-500' : 'text-white'} onClick={() => setUserLocale('en')}>
                EN
            </button>
            {' | '}
            <button className={locale === 'nl' ? 'text-cyan-500' : 'text-white'} onClick={() => setUserLocale('nl')}>
                NL
            </button>
        </div>
    );
}
