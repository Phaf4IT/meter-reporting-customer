import {Entity} from "@/lib/jpa/entity";

export abstract class EntityManager<T extends Entity> {
    abstract create(entity: T): Promise<T>;

    abstract createAll(entities: T[]): Promise<T[]>;

    abstract findOne(
        primaryKeyValues: Record<string, any>
    ): Promise<T | undefined>;

    abstract findAll(): Promise<T[]>;

    abstract findBy(...keyValues: any[]): Promise<T[]>;

    abstract findByDateFilter(dateColumn: string, operator: '>' | '<' | '=' | '>=' | '<=', date: Date): Promise<T[]>;

    abstract update(entity: T): Promise<void>;

    abstract delete(entity: T): Promise<void>;
}
