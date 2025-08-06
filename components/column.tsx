import { Kanban } from "@/types/board.interface";
import { Add20Filled } from "@fluentui/react-icons";
import CreateTaskModal from "./CreateTaskModal";
import {  useDisclosure } from "@heroui/react";

interface ColumnProps {
    col: Kanban.Column;
    board: Kanban.Board;
    setBoard: React.Dispatch<React.SetStateAction< Kanban.Board | null>>;
}

export default function Column({col, board, setBoard}: ColumnProps){

    const taskModalProps = useDisclosure();

    return (
        <>
            <div className="w-full h-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ease-in-out">

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

                <div className="flex flex-col gap-4 px-3">
                    {col.cards.map((card) => (
                        <div key={card.id} className="h-20 bg-red-200 flex flex-col">
                            {card.title}
                            {card.description}
                        </div>
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