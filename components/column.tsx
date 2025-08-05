import { BoardColumn } from "@/app/page";


export default function Column({col}: {col: BoardColumn}){

    return (
        <div className="w-full h-full bg-blue-100 rounded-lg">
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