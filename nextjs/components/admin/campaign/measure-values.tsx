import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import {MeasureValue} from "@/components/admin/measure-value/measureValue";
import {useTranslations} from "next-intl";

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
    const handleMeasureToggle = (name: MeasureValue) => {
        setSelectedMeasures((prev: MeasureValue[]) =>
            prev.includes(name)
                ? prev.filter((measure) => measure !== name)
                : [...prev, name]
        );
    };

    const handleDragEnd = (result: any) => {
        const {destination, source} = result;


        if (!destination) return;


        if (destination.index === source.index) return;


        const reorderedMeasures = Array.from(measureValues);


        const [movedItem] = reorderedMeasures.splice(source.index, 1);
        reorderedMeasures.splice(destination.index, 0, movedItem);


        setMeasureValues(reorderedMeasures);


        const reorderedSelectedMeasures = reorderedMeasures
            .filter((measure) => selectedMeasures.includes(measure))
            .map((measure) => measure);


        setSelectedMeasures(reorderedSelectedMeasures);
    };
    const mT = useTranslations('admin.measureValue'); // Hier pak je de vertalingen voor measurevalues

    return (
        <div>
            <label>{t('measureValues')}</label>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="measures">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}
                             className="bg-cyan-800 p-4 rounded space-y-2">
                            {measureValues.map((measureValue: MeasureValue, index) => (
                                <Draggable key={measureValue.name} draggableId={measureValue.name} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="flex items-center space-x-4 bg-cyan-700 p-2 rounded shadow"
                                        >
                                            <input
                                                type="checkbox"
                                                id={measureValue.name}
                                                onChange={() => handleMeasureToggle(measureValue)}
                                                checked={selectedMeasures.includes(measureValue)}
                                                className="form-checkbox h-5 w-5 text-cyan-500"
                                            />
                                            <label htmlFor={measureValue.name} className="flex-grow">
                                                {measureValue.name} {measureValue.unit ?
                                                `(${measureValue.unit})` : ''} - {mT(`measureValueType.${measureValue.type}`)}
                                            </label>
                                            <span className="cursor-move text-gray-300">☰</span>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default MeasureValuesSelector;
