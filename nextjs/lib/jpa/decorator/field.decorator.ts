export function Field(columnName?: string, generated: boolean = false) {
    return function (target: any, propertyKey: string | symbol) {
        const actualColumnName = columnName || propertyKey as string;
        Reflect.defineMetadata("field", actualColumnName, target, propertyKey);
        Reflect.defineMetadata("field_generated", generated, target, propertyKey);
    };
}