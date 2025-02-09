import {EntityManager} from './entity-manager';
import {Entity, EntityClasss} from './entity';
import {ExpressionBuilder, Kysely, sql} from 'kysely';
import {retry} from "ts-retry";

export abstract class KyselyEntityManager<T extends Entity> extends EntityManager<T> {

    private readonly db: Kysely<any>;
    private readonly entityClass: T
    private readonly EntityClasss: EntityClasss<T>;

    protected constructor(kysely: Kysely<any>, entityClass: EntityClasss<T>) {
        super();
        this.db = kysely
        this.entityClass = new entityClass()
        this.EntityClasss = entityClass
    }


    async create(entity: T): Promise<T> {
        const fields = entity.getFieldAndValues();
        const tableName = entity.getTableName();

        let result: any;
        await retry(
            async () => {
                result = await this.db
                    .insertInto(tableName)
                    .values(fields)
                    .returningAll()
                    .executeTakeFirst();
            },
            {delay: 100, maxTry: 3}
        );

        return Object.assign(entity, result);
    }

    async createAll(entities: T[]): Promise<T[]> {
        const tableName = this.entityClass.getTableName();

        const allFields = entities.map(entity => entity.getFieldAndValues());

        let results: any[] = [];

        await retry(
            async () => {
                results = await this.db
                    .insertInto(tableName)
                    .values(allFields)
                    .returningAll()
                    .execute();
            },
            {delay: 100, maxTry: 3}
        );

        return results.map((result, index) => {
            return Object.assign(entities[index], result);
        });
    }


    async findOne(
        primaryKeyValues: Record<string, any>
    ): Promise<T | undefined> {
        const tableName = this.entityClass.getTableName();
        const fieldNames = this.entityClass.getFields();

        let query = this.db.selectFrom(tableName).select(fieldNames);

        for (const primaryKeyValue in primaryKeyValues) {
            query = query.where(this.entityClass.getColumnName(primaryKeyValue), '=', primaryKeyValues[primaryKeyValue]);
        }

        const result = await query.execute();

        if (result.length === 0) {
            return undefined;
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

    async findByDateFilter(dateColumn: string, operator: '>' | '<' | '=' | '>=' | '<=', date: Date): Promise<T[]> {
        const tableName = this.entityClass.getTableName();
        const columnNames = this.entityClass.getFields();

        let query = this.db.selectFrom(tableName).select(columnNames);
        // Dynamische operator voor datumfilter
        query = query.where(dateColumn, operator, date);

        const result = await query.execute();

        return result.map((row: Record<string, any>) => {
            const instance = new this.EntityClasss(...Object.values(row));
            return instance as T;
        });
    }


    async update(entity: T): Promise<void> {
        const tableName = this.entityClass.getTableName();
        const fields = entity.getFieldAndValues();
        const primaryKeys = this.entityClass.getPrimaryKeys();

        let query = this.db.updateTable(tableName).set(fields);

        for (const key of primaryKeys) {
            query = query.where(this.entityClass.getColumnName(key), '=', (entity as any)[key]);
        }

        await query.execute();
    }

    async delete(entity: T): Promise<void> {
        const tableName: string = this.entityClass.getTableName();
        const primaryKeys: string[] = this.entityClass.getPrimaryKeys();

        let query = this.db.deleteFrom(tableName);

        for (const key of primaryKeys) {
            const value = (entity as any)[key];

            if (value instanceof Date) {
                query = query.where(this.getDateEquation(value, this.entityClass.getColumnName(key)))
            } else {
                query = query.where(this.entityClass.getColumnName(key), '=', value);
            }
        }

        const deleteResults = await query.execute();
        if (deleteResults.length == 0) {
            throw Error
        }
    }

    private getDateEquation(value: Date, columnName: any) {
        return (eb: ExpressionBuilder<any, any>) => {
            const millisecond = sql.lit("MILLISECOND");
            const left = eb.fn("date_trunc", [millisecond, eb.ref(columnName)]);
            const right = eb.val(value.toISOString());
            return eb(left, "=", right);
        };
    }
}
