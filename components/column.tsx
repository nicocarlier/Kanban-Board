import { Kanban } from "@/types/board.interface";

export default function Column({col}: {col: Kanban.Column}){

    return (
        <div className="w-full h-full bg-blue-100 rounded-lg hover:bg-[#94bfe8]">
            <div className="flex flex-col gap-4">
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