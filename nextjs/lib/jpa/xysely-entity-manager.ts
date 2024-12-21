import {EntityManager} from './entity-manager';
import {Entity, EntityClasss} from './entity';
import {Kysely} from 'kysely';

export abstract class XyselyEntityManager<T extends Entity> extends EntityManager<T> {

    private db: Kysely<any>; 
    private entityClass: T
    private EntityClasss: EntityClasss<T>;

    protected constructor(kysely: Kysely<any>, entityClass: EntityClasss<T>) {
        super();
        this.db = kysely
        this.entityClass = new entityClass()
        this.EntityClasss = entityClass
    }

    test(): Promise<boolean> {
        return Promise.resolve(false);
    }

    
    async create(entity: T): Promise<T> {
        const fields = entity.getFieldAndValues();
        const tableName = entity.getTableName();
        const result = await this.db
            .insertInto(tableName)
            .values(fields)
            .executeTakeFirst();

        return Object.assign(entity, result);
    }

    
    async findOne(
        ...primaryKeyValues: any[]
    ): Promise<T | null> {
        const primaryKeys = this.entityClass.getPrimaryKeys();
        const tableName = this.entityClass.getTableName();
        const fieldNames = this.entityClass.getFields();

        
        let query = this.db.selectFrom(tableName).select(fieldNames);

        
        primaryKeys.forEach((key: any, index: any) => {
            query = query.where(key, '=', primaryKeyValues[index]);
        });

        const result = await query.execute();

        if (result.length === 0) {
            return null;
        }

        return new this.EntityClasss(...Object.values(result[0]));
    }

    
    async findAll(): Promise<T[]> {
        const tableName = this.entityClass.getTableName();
        const columnNames = this.entityClass.getFields();

        const result = await this.db
            .selectFrom(tableName)
            .select(columnNames)  
            .execute();

        return result.map((row: Record<string, any>) => {
                return new this.EntityClasss(...Object.values(row));
            }
        );
    }

    
    async findBy(keyValues: Record<string, any>): Promise<T[]> {
        const tableName = this.entityClass.getTableName();
        const columnNames = this.entityClass.getFields();

        let query = this.db.selectFrom(tableName).select(columnNames);

        
        Object.entries(keyValues).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                
                query = query.where(key, 'in', value);  
            } else {
                query = query.where(key, '=', value);  
            }
        });

        const result = await query.execute();

        return result.map((row: Record<string, any>) => {
            const instance = new this.EntityClasss(...Object.values(row));
            return instance as T;  
        });
    }

    
    async update(entity: T): Promise<void> {
        const primaryKeys = this.entityClass.getPrimaryKeys();
        const tableName = this.entityClass.getTableName();
        const fields = entity.getFieldAndValues();

        let query = this.db.updateTable(tableName).set(fields);

        primaryKeys.forEach((key: any) => {
            query = query.where(key, '=', (entity as any)[key]);
        });

        await query.execute();
    }



    async delete(entity: T): Promise<void> {
        const primaryKeys = this.entityClass.getPrimaryKeys();
        const tableName = this.entityClass.getTableName();

        let query = this.db.deleteFrom(tableName);

        
        primaryKeys.forEach((key: any) => {
            query = query.where(key, '=', (entity as any)[key]);
        });

        const deleteResults = await query.execute();
        if (deleteResults.length == 0) {
            throw Error
        }
    }


}
