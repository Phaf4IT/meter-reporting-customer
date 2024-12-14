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

    getFieldAndColumnNames(): Record<string, any> {
        const fieldAndColumnNames: Record<string, any> = {};
        const keys = Object.getOwnPropertyNames(this);  

        for (const key of keys) {
            const columnName = Reflect.getMetadata("field", this.constructor.prototype, key);  
            if (columnName) {
                fieldAndColumnNames[key] = columnName;  
            }
        }
        return fieldAndColumnNames;
    }

    getFieldAndValues(): Record<string, any> {
        
        const fieldAndColumnNames: Record<string, any> = this.getFieldAndColumnNames();
        const fields: Record<string, any> = {};
        for (const fieldAndColumnNamesKey in fieldAndColumnNames) {
            const columnName = fieldAndColumnNames[fieldAndColumnNamesKey];
            if (columnName) {
                fields[columnName] = this[fieldAndColumnNamesKey as keyof Entity]
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

