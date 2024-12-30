'use client';

import {Suspense} from 'react';
import Success from "@/app/success/success";

export default function SuccessPage() {
    return (
        <Suspense>
            <Success/>
        </Suspense>
    );
}
