'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UseSearchParams() {
    const searchParams = useSearchParams();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const tokenFromParams = searchParams.get('token');
        setToken(tokenFromParams);
    }, [searchParams]);

    return token;
}
