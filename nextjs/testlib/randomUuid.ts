export function randomUUID() : string {
    return (
        Math.random().toString(16).substring(2, 10) + '-' +
        Math.random().toString(16).substring(2, 10) + '-' +
        Math.random().toString(16).substring(2, 10) + '-' +
        Math.random().toString(16).substring(2, 10) + '-' +
        Math.random().toString(16).substring(2, 10)
    );
}