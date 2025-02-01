import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {useTranslations} from "next-intl";
import {DraggableList} from "@/components/admin/draggable-list";

interface MeasureValuesSelectorProps {
    t: (key: string) => string;
    measureValues: MeasureValue[];
    selectedMeasures: MeasureValue[];
    setSelectedMeasures: React.Dispatch<React.SetStateAction<MeasureValue[]>>;
    setMeasureValues: React.Dispatch<React.SetStateAction<MeasureValue[]>>;
}

const MeasureValuesSelector = ({
                                   t,
                                   measureValues,
                                   selectedMeasures,
                                   setSelectedMeasures,
                                   setMeasureValues,
                               }: MeasureValuesSelectorProps) => {
    const handleMeasureToggle = (measureValue: MeasureValue) => {
        setSelectedMeasures((prev) =>
            prev.includes(measureValue)
                ? prev.filter((measure) => measure !== measureValue)
                : [...prev, measureValue]
        );
    };

    const handleItemsUpdate = (newItems: MeasureValue[]) => {
        setMeasureValues(newItems);

        // Update selected measures
        const reorderedSelectedMeasures = newItems.filter((measure) =>
            selectedMeasures.includes(measure)
        );
        setSelectedMeasures(reorderedSelectedMeasures);
    };

    const mT = useTranslations("admin.measureValue");

    return (
        <div>
            <label>{t("measureValues")}</label>
            <DraggableList
                items={measureValues}
                renderItem={(measureValue) => (
                    <div className="flex items-center space-x-4 w-full">
                        <input
                            type="checkbox"
                            id={measureValue.name}
                            onChange={() => handleMeasureToggle(measureValue)}
                            checked={selectedMeasures.includes(measureValue)}
                            className="form-checkbox h-5 w-5 text-cyan-500"
                        />
                        <label htmlFor={measureValue.name} className="flex-grow">
                            {measureValue.name} {measureValue.unit ? `(${measureValue.unit})` : ""} -{" "}
                            {mT(`measureValueType.${measureValue.type}`)}
                        </label>
                    </div>
                )}
                onItemsUpdate={handleItemsUpdate}
            />
        </div>
    );
};

export default MeasureValuesSelector;
