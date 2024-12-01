import {setUserLocale} from "@/lib/locale";

export default function LanguageSwitcher() {
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
