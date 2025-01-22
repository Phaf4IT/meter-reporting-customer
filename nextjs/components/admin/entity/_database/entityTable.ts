import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import {Entity as E} from "@/lib/jpa/entity";
import Entity from "@/components/database/schemas/public/Entity"; // UUID library

@EntityClass("entity")
export class EntityTable extends E implements Entity {
    @PrimaryKey
    @Field('id', true)
    id: string;

    @Field("entity_type")
    entityType: string;

    @Field("field_values")
    fieldValues: any;

    @Field()
    company: string;

    constructor(id: string, entityType: string, fieldValues: any, company: string) {
        super();
        this.id = id;
        this.entityType = entityType;
        this.fieldValues = fieldValues;
        this.company = company;
    }

    static of({id, entityType, fieldValues, company}: Entity): EntityTable {
        return new EntityTable(id, entityType, fieldValues, company);
    }
}
