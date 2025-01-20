import "reflect-metadata";

export abstract class Entity {

    static getPrimaryKey(): string[] {
        return Reflect.getMetadata('primaryKeys', this) || [];
    }

    static getTableName(): string {
        return (this as any).tableName;
    }

    getFields(): string[] {
        const fields: string[] = [];
        const keys = Object.getOwnPropertyNames(this);

        for (const key of keys) {
            const columnName = Reflect.getMetadata("field", this.constructor.prototype, key);
            if (columnName) {
                fields.push(columnName);
            }
        }
        return fields;
    }

    getFieldAndColumnNames(): Record<string, ColumnProperties> {
        const fieldAndColumnNames: Record<string, ColumnProperties> = {};
        const keys = Object.getOwnPropertyNames(this);

        for (const key of keys) {
            fieldAndColumnNames[key] = {columnName: this.getColumnName(key), isGenerated: this.isGeneratedColumn(key)};
        }
        return fieldAndColumnNames;
    }

    getColumnName(key: string) {
        const columnName = Reflect.getMetadata("field", this.constructor.prototype, key);
        if (columnName) {
            return columnName;
        }
    }

    isGeneratedColumn(key: string) {
        return !!Reflect.getMetadata("field_generated", this.constructor.prototype, key);
    }

    getFieldAndValues(): Record<string, any> {
        const fieldAndColumnNames: Record<string, ColumnProperties> = this.getFieldAndColumnNames();
        const fields: Record<string, any> = {};
        for (const fieldAndColumnNamesKey in fieldAndColumnNames) {
            const columnProperties = fieldAndColumnNames[fieldAndColumnNamesKey];
            if (!columnProperties.isGenerated && columnProperties.columnName) {
                fields[columnProperties.columnName] = this[fieldAndColumnNamesKey as keyof Entity]
            }
        }
        return fields;
    }

    getPrimaryKeys() {
        return Reflect.getMetadata('primaryKeys', this) || [];
    }

    getTableName() {
        return Reflect.getMetadata('tableName', this.constructor);
    }
}


export interface EntityClasss<T extends Entity> {
    new(...args: any[]): T;

    getPrimaryKey(): string[];

    getTableName(): string;
}

interface ColumnProperties {
    columnName: string;
    isGenerated: boolean;
}
