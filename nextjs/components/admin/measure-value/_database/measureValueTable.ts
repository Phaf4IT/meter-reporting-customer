import {Entity} from "@/lib/jpa/entity";
import {PrimaryKey} from "@/lib/jpa/decorator/primary-key.decorator";
import {Field} from "@/lib/jpa/decorator/field.decorator";
import {EntityClass} from "@/lib/jpa/decorator/entity-class.decorator";
import MeasureValue from "@/components/database/schemas/public/MeasureValue";

@EntityClass("measure_value")
export class MeasureValueTable extends Entity implements MeasureValue {
    @PrimaryKey
    @Field()
    name: string;
    @Field("translations")
    translations: Record<string, string>;
    @Field("measure_unit")
    measureUnit: string | null;
    @Field("type")
    type: string;
    @Field("is_editable")
    isEditable: boolean;
    @Field("default_value")
    defaultValue: string | null;
    @PrimaryKey
    @Field("company")
    company: string;

    constructor(
        name: string,
        translations: Record<string, string>,
        measureUnit: string | undefined,
        type: string,
        isEditable: boolean,
        defaultValue: string | undefined,
        company: string) {
        super();
        this.name = name;
        this.translations = translations;
        this.measureUnit = measureUnit || null;
        this.type = type;
        this.isEditable = isEditable;
        this.defaultValue = defaultValue || null;
        this.company = company;
    }
}
