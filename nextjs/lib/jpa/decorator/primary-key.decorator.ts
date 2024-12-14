export function PrimaryKey(target: any, propertyKey: string | symbol) {
    const existingPrimaryKeys = Reflect.getMetadata('primaryKeys', target) || [];
    existingPrimaryKeys.push(propertyKey);
    Reflect.defineMetadata('primaryKeys', existingPrimaryKeys, target);
}
