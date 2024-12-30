'use server';

import {getCookie, setCookie} from "cookies-next";

const COOKIE_NAME = 'NEXT_LOCALE';

export async function getUserLocale() {
    return getCookie(COOKIE_NAME) || 'nl';
}

export async function setUserLocale(locale: string) {
    setCookie(COOKIE_NAME, locale);
}