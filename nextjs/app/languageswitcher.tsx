import {setUserLocale} from "@/lib/locale";
import { Logger } from "@/lib/logger";
import {useLocale} from "next-intl";

export default function LanguageSwitcher() {
    const locale = useLocale();
    Logger.debug(locale)
    return (
        <div>
            <button onClick={() => setUserLocale('en')}>
                EN
            </button>
            {' | '}
            <button onClick={() => setUserLocale('nl')}>
                NL
            </button>
        </div>
    );
}
