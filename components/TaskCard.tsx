import { Kanban } from "@/types/board.interface";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Drag24Filled } from "@fluentui/react-icons";

interface TaskCardProps {
    card: Kanban.Card;
    onEdit: (cardId: string, title: string, description: string) => void;
    onDelete: (cardId: string) => void;
}

export default function TaskCard({ card, onEdit, onDelete }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`
                bg-white border border-gray-200 rounded-lg p-4 shadow-sm 
                hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing
                ${isDragging ? 'opacity-50 shadow-lg' : ''}
            `}
        >
            {/* Drag handle indicator */}
            <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">
                        {card.title}
                    </h3>
                    {card.description && (
                        <p className="text-sm text-gray-600">
                            {card.description}
                        </p>
                    )}
                </div>
                
                {/* Drag handle visual indicator */}
                <div className="ml-2 opacity-30 hover:opacity-70 transition-opacity">
                    <Drag24Filled />
                </div>
            </div>

            {/* Card actions */}
            <div className="flex gap-2 mt-3">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit - you might want to open a modal here
                        const newTitle = prompt("Edit title:", card.title);
                        const newDescription = prompt("Edit description:", card.description);
                        if (newTitle !== null && newDescription !== null) {
                            onEdit(card.id, newTitle, newDescription);
                        }
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded bg-blue-50 hover:bg-blue-100"
                >
                    Edit
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this card?")) {
                            onDelete(card.id);
                        }
                    }}
                    className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded bg-red-50 hover:bg-red-100"
                >
                    Delete
                </button>
            </div>

            {/* Card metadata */}
            {card.created_at && (
                <div className="text-xs text-gray-400 mt-2">
                    Created: {new Date(card.created_at).toLocaleDateString()}
                </div>
            )}
        </div>
    );
}