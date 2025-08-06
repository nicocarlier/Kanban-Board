"use client";

import Column from "@/components/column";
import { useEffect, useState } from "react";
import { Kanban } from "@/types/board.interface";
import { getBoard } from "@/lib/storage";

export default function Home() {
  const [board, setBoard] = useState<Kanban.Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [display, setDisplay] = useState<"example" | "db">("db")

  useEffect(() => {
    function loadBoard() {
      try {
        setLoading(true);
        // Load board from localStorage
        const boardData = getBoard();
        setBoard(boardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load board');
      } finally {
        setLoading(false);
      }
    }

    loadBoard();
  }, []);

  if (loading) {
    return <div className="w-full h-full flex items-center justify-center">
      <p>Loading board from database...</p>
    </div>;
  }

  if (error) {
    return <div className="w-full h-full flex items-center justify-center">
      <p className="text-red-500">Error: {error}</p>
    </div>;
  }

  const toggleDisplay = () => {
    setDisplay(prev => prev === "db" ? "example" : "db");
  }

  return (
    <div className="w-full h-full flex flex-col ">

      <div className="flex w-full items-center justify-between px-4 pb-4 border-b border-b-gray-400">
        <h1 className="text-2xl font-bold text-gray-700">Kanban Board</h1>
      </div>
      
      {/* Show the board */}
      {board && (
        <div className="flex h-full w-full border border-gray-400">
          {board.columns.map((col: Kanban.Column, i: number) => (
            <div className="h-full flex-1 min-w-0 border-r border-gray-400 last:!border-r-0" key={i}>
              <Column col={col} board={board} setBoard={setBoard}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
