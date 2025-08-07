import { Dismiss20Regular } from "@fluentui/react-icons";
import { useState } from "react";
import { UseDisclosureProps } from "@/types/general.interface";
import { Kanban } from "@/types/board.interface";

interface CreateTaskModalProps {
    modalProps: UseDisclosureProps;
    colIndex: number;
    columnName: string;
    setBoard: React.Dispatch<React.SetStateAction<Kanban.Board | null>>;
}

export default function CreateTaskModal({
    modalProps,
    colIndex,
    columnName,
    setBoard,
} : CreateTaskModalProps) {

    const [taskTitle, setTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    console.log('CreateTaskModal render - isOpen:', modalProps.isOpen, 'colIndex:', colIndex, 'columnName:', columnName);

    const handleCreateTask = async () => {
        if (!taskTitle.trim()) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('/api/boards/default-board/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: taskTitle,
                    description: taskDescription,
                    columnId: colIndex === 0 ? 'todo' : colIndex === 1 ? 'in-progress' : 'done'
                }),
            });

            if (response.ok) {
                const newCard: Kanban.Card = await response.json();
                setTaskTitle("");
                setTaskDescription("");
                modalProps.onClose();

                // Update the board state
                setBoard(prev => {
                    if (!prev) return prev;
                    const updatedBoard: Kanban.Board = {
                        ...prev,
                        columns: prev.columns.map((col, index) => {
                            if (index === colIndex) {
                                return {
                                    ...col,
                                    cards: [...col.cards, newCard]
                                }
                            }
                            return col;
                        })
                    }
                    return updatedBoard;
                })
            } else {
                console.error('Failed to create task');
            }
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsLoading(false);
        }
    }

    // If modal is not open, don't render anything
    if (!modalProps.isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[rgba(0,0,0,0.5)] bg-opacity-50"
                onClick={modalProps.onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white bg-opacity-50 backdrop-blur-sm rounded-lg p-6 w-full max-w-2xl mx-4">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Create New Task</h2>
                        <p className="text-sm text-gray-600 mt-1">Adding to: <span className="font-medium">{columnName}</span></p>
                    </div>
                    <button 
                        onClick={modalProps.onClose}
                        className="hover:cursor-pointer"
                    >
                        <Dismiss20Regular className="text-gray-800" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                        <input
                            type="text"
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="Enter task title"
                            className="w-full px-3 py-2 text-gray-900 bg-white bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                            placeholder="Enter task description"
                            rows={4}
                            className="w-full px-3 py-2 text-gray-900 bg-white bg-opacity-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 resize-none"
                        />
                    </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={modalProps.onClose}
                        className="px-6 py-2 text-gray-700 hover:cursor-pointer rounded-md bg-gray-200 bg-opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateTask}
                        disabled={!taskTitle.trim() || isLoading}
                        className="px-6 py-2 bg-blue-500 bg-opacity-50 hover:cursor-pointer text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Creating...' : 'Create Task'}
                    </button>
                </div>
            </div>
        </div>
    );
}
