import { Kanban } from "@/types/board.interface";
import { Add20Filled, Add20Regular } from "@fluentui/react-icons";

export default function Column({col}: {col: Kanban.Column}){

    return (
        <div className="w-full h-full bg-blue-100 hover:bg-[#94bfe8] border-r border-gray-400 transition-all duration-300 ease-in-out">

            <div className="w-full py-4 px-3 my-auto flex flex-col gap-1 items-center justify-center">
                <p className="text-lg">{col.title}</p>
                <p className="text-sm text-gray-700">{`${col.cards.length} Tasks`}</p>
                <button className="mt-4 w-full !h-10 !min-h-10 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:cursor-pointer">
                    <Add20Filled />
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
    )
}