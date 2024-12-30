export function Field(columnName?: string) {
    return function (target: any, propertyKey: string | symbol) {
        const actualColumnName = columnName || propertyKey as string;
        Reflect.defineMetadata("field", actualColumnName, target, propertyKey);
    };
}