import { Kanban } from "@/types/board.interface";
import { 
    Card, 
    CardBody, 
    CardHeader,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Button
} from "@heroui/react";
import { MoreVertical20Regular } from "@fluentui/react-icons";
import { useState } from "react";

interface TaskCardProps {
    card: Kanban.Card;
    onEdit: (cardId: string, title: string, description: string) => void;
    onDelete: (cardId: string) => void;
}

export default function TaskCard({ card, onEdit, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editDescription, setEditDescription] = useState(card.description || "");

    const handleEdit = () => {
        if (editTitle.trim()) {
            onEdit(card.id, editTitle.trim(), editDescription.trim());
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setEditTitle(card.title);
        setEditDescription(card.description || "");
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <Card className="w-full mb-4">
                <CardBody className="p-4">
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                placeholder="Enter task title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none"
                                placeholder="Enter task description"
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button 
                                size="sm" 
                                color="primary" 
                                onPress={handleEdit}
                                isDisabled={!editTitle.trim()}
                                className="flex-1"
                            >
                                Save
                            </Button>
                            <Button 
                                size="sm" 
                                variant="light" 
                                onPress={handleCancelEdit}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    }

    return (
        <Card className="w-full mb-4 hover:shadow-md transition-shadow bg-white border-gray-400 rounded-lg p-4">
            <CardHeader className="pb-2">
                <div className="flex w-full justify-between items-start">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {card.title}
                    </h3>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button 
                                isIconOnly 
                                variant="light" 
                                size="sm"
                                className="text-gray-400 hover:text-gray-600 hover:cursor-pointer"
                            >
                                <MoreVertical20Regular />
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Card actions" className="bg-white rounded-lg overflow-hidden min-w-20 border border-gray-200 shadow-lg">
                            <DropdownItem 
                                key="edit" 
                                onPress={() => setIsEditing(true)}
                                className="text-gray-700 px-2 py-1 hover:cursor-pointer hover:bg-gray-100"
                            >
                                Edit
                            </DropdownItem>
                            <DropdownItem 
                                key="delete" 
                                onPress={() => onDelete(card.id)}
                                className="text-red-700 px-2 py-1 hover:cursor-pointer hover:bg-gray-100"
                            >
                                Delete
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardHeader>
            {card.description && (
                <CardBody className="pt-0">
                    <p className="text-xs text-gray-600 line-clamp-3">
                        {card.description}
                    </p>
                </CardBody>
            )}
        </Card>
    );
} 