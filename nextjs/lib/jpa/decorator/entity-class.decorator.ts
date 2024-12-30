import {Entity} from "@/lib/jpa/entity";

type Constructor<T = Entity> = new (...args: any[]) => T;

export function EntityClass(tableName: string) {
    return function (constructor: Constructor) {
        Reflect.defineMetadata('tableName', tableName, constructor);  
    };
}