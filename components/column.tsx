import { Kanban } from "@/types/board.interface";
import { Add20Filled } from "@fluentui/react-icons";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";
import {  useDisclosure } from "@heroui/react";

interface ColumnProps {
    col: Kanban.Column;
    board: Kanban.Board;
    setBoard: React.Dispatch<React.SetStateAction< Kanban.Board | null>>;
}

export default function Column({col, board, setBoard}: ColumnProps){

    const taskModalProps = useDisclosure();

    const handleEditCard = async (cardId: string, title: string, description: string) => {
        try {
            const response = await fetch(`/api/boards/default-board/cards/${cardId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, description }),
            });

            if (response.ok) {
                // Update the board state
                setBoard(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        columns: prev.columns.map(column => ({
                            ...column,
                            cards: column.cards.map(card => 
                                card.id === cardId 
                                    ? { ...card, title, description }
                                    : card
                            )
                        }))
                    };
                });
            } else {
                console.error('Failed to update card');
            }
        } catch (error) {
            console.error('Error updating card:', error);
        }
    };

    const handleDeleteCard = async (cardId: string) => {
        try {
            const response = await fetch(`/api/boards/default-board/cards/${cardId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Update the board state
                setBoard(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        columns: prev.columns.map(column => ({
                            ...column,
                            cards: column.cards.filter(card => card.id !== cardId)
                        }))
                    };
                });
            } else {
                console.error('Failed to delete card');
            }
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    return (
        <>
            <div className="w-full h-full bg-gray-100 ">

                <div className="w-full py-4 px-3 my-auto flex flex-col gap-1 items-center justify-center">
                    <p className="text-lg">{col.title}</p>
                    <p className="text-sm text-gray-700">{`${col.cards.length} Tasks`}</p>
                    <button 
                        onClick={() => {
                            console.log("Button clicked - opening modal");
                            taskModalProps.onOpen();
                        }}
                        className="mt-4 w-full !h-10 !min-h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:cursor-pointer"
                    >
                        <Add20Filled className="text-gray-700"/>
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-3 pb-4">
                    {col.cards.map((card) => (
                        <TaskCard
                            key={card.id}
                            card={card}
                            onEdit={handleEditCard}
                            onDelete={handleDeleteCard}
                        />
                    ))}
                </div>

            </div>
            
            <CreateTaskModal 
                modalProps={taskModalProps} 
                colIndex={col.index}
                columnName={col.title}
                setBoard={setBoard}
            />
        </>
    )
}