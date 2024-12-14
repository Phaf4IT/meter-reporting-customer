import {Entity} from "@/lib/jpa/entity";

export abstract class EntityManager<T extends Entity> {
    abstract create(entity: T): Promise<T>;

    abstract findOne(
        ...primaryKeyValues: any[]
    ): Promise<T | null>;

    abstract findAll(): Promise<T[]>;

    abstract findBy(...keyValues: any[]): Promise<T[]>;

    abstract update(entity: T): Promise<void>;

    abstract delete(entity: T): Promise<void>;
}
