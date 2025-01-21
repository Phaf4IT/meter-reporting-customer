import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import EntityType from "@/components/database/schemas/public/EntityType";
import {Entity} from "@/lib/jpa/entity";

@EntityClass("entity_type")
export class EntityTypeTable extends Entity implements EntityType {
    @PrimaryKey
    @Field()
    name: string;

    @Field("fields")
    fields: any;

    @Field()
    company: string;

    constructor(name: string, fields: any, company: string) {
        super();
        this.name = name;
        this.fields = fields;
        this.company = company;
    }

    static of({name, fields, company}: EntityType): EntityTypeTable {
        return new EntityTypeTable(name, fields, company);
    }
}
