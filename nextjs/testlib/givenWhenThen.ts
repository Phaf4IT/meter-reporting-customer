// testHelpers.ts

export function given(description: string, fn: () => void | Promise<void>): void {
    it(`Given ${description}`, async function() {
        await fn();
    });
}

export function when(description: string, fn: () => void | Promise<void>): void {
    it(`When ${description}`, async function() {
        await fn();
    });
}

export function then(description: string, fn: () => void | Promise<void>): void {
    it(`Then ${description}`, async function() {
        await fn();
    });
}
