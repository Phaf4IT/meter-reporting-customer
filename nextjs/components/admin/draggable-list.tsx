import React, {useState} from "react";

interface DraggableListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => React.ReactNode;
    onItemsUpdate: (newItems: T[]) => void;
}

export const DraggableList = <T, >({
                                       items,
                                       renderItem,
                                       onItemsUpdate,
                                   }: DraggableListProps<T>) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index: number, e: React.DragEvent) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggingIndex === null || draggingIndex === index) return;

        const newItems = [...items];
        const [movedItem] = newItems.splice(draggingIndex, 1);
        newItems.splice(index, 0, movedItem);

        onItemsUpdate(newItems);

        // Reset dragging state
        setDraggingIndex(null);
        setDragOverIndex(null);
    };

    return (
        <div>
            {items.map((item, index) => (
                <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(index, e)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center space-x-4 p-4 rounded shadow mb-2 bg-cyan-700 ${
                        dragOverIndex === index ? "border-2 border-blue-500" : ""
                    } w-full`}
                >
                    {renderItem(item, index)}
                    <span className="cursor-move text-gray-300">☰</span>
                </div>
            ))}
        </div>
    );
};
