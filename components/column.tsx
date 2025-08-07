import { Kanban } from "@/types/board.interface";
import { Add20Filled } from "@fluentui/react-icons";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";
import { useDisclosure } from "@heroui/react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ColumnProps {
    col: Kanban.Column;
    setBoard: React.Dispatch<React.SetStateAction<Kanban.Board | null>>;
    onEditCard: (cardId: string, title: string, description: string) => void;
    onDeleteCard: (cardId: string) => void;
}

export default function Column({ col, setBoard, onEditCard, onDeleteCard }: ColumnProps) {
    const taskModalProps = useDisclosure();
    
    // Make the column a droppable area
    const { setNodeRef, isOver } = useDroppable({
        id: col.id,
    });

    // Get card IDs for sortable context
    const cardIds = col.cards.map(card => card.id);

    return (
        <>
            <div className={`w-full h-full bg-gray-100 transition-colors ${isOver ? '!bg-blue-100' : ''}`}>
                <div className="w-full py-4 px-3 my-auto flex flex-col gap-1 items-center justify-center">
                    <p className="text-lg">{col.title}</p>
                    <p className="text-sm text-gray-700">{`${col.cards.length} Tasks`}</p>
                    <button 
                        onClick={taskModalProps.onOpen}
                        className="mt-4 w-full !h-10 !min-h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:cursor-pointer"
                    >
                        <Add20Filled className="text-gray-700"/>
                    </button>
                </div>

                {/* Droppable area with visual feedback */}
                <div 
                    ref={setNodeRef}
                    className="flex flex-col  gap-4 px-3 pb-4"
                >
                    <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
                        {col.cards.map((card) => (
                            <TaskCard
                                key={card.id}
                                card={card}
                                onEdit={onEditCard}
                                onDelete={onDeleteCard}
                            />
                        ))}
                    </SortableContext>
                    
                </div>
            </div>
            
            <CreateTaskModal 
                modalProps={taskModalProps} 
                colIndex={col.index}
                columnName={col.title}
                setBoard={setBoard}
            />
        </>
    );
}