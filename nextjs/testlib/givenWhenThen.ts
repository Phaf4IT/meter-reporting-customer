import {Context} from 'mocha';

export function given(description: string, fn: () => void | Promise<void>, timeout?: number): void {
    it(`Given ${description}`, function (this: Context) {
        this.timeout(timeout || this.timeout());
        return fn();
    });
}

export function when(description: string, fn: () => void | Promise<void>, timeout?: number): void {
    it(`When ${description}`, function (this: Context) {
        this.timeout(timeout || this.timeout());
        return fn();
    });
}

export function then(description: string, fn: () => void | Promise<void>, timeout?: number): void {
    it(`Then ${description}`, function (this: Context) {
        this.timeout(timeout || this.timeout());
        return fn();
    });
}
