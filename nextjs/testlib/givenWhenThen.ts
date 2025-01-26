import {Context} from 'mocha';

export function given(description: string, fn: () => void | Promise<void>, timeout?: number, retries?: number): void {
    it(`Given ${description}`, function (this: Context) {
        this.timeout(Math.max(timeout || 0, this.timeout()));
        if (retries) {
            this.retries(retries)
        }
        return fn();
    });
}

export function when(description: string, fn: () => void | Promise<void>, timeout?: number, retries?: number): void {
    it(`When ${description}`, function (this: Context) {
        this.timeout(Math.max(timeout || 0, this.timeout()));
        if (retries) {
            this.retries(retries)
        }
        return fn();
    });
}

export function then(description: string, fn: () => void | Promise<void>, timeout?: number, retries?: number): void {
    it(`Then ${description}`, function (this: Context) {
        this.timeout(Math.max(timeout || 0, this.timeout()));
        if (retries) {
            this.retries(retries)
        }
        return fn();
    });
}
