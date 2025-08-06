"use client";

import Column from "@/components/column";
import { fetchBoard, DEFAULT_BOARD_ID } from "@/lib/api";
import { useEffect, useState } from "react";
import { Kanban } from "@/types/board.interface";
import { exampleBoard } from "@/const/exampleData";

export default function Home() {
  const [board, setBoard] = useState<Kanban.Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [display, setDisplay] = useState<"example" | "db">("db")

  useEffect(() => {
    async function loadBoard() {
      try {
        setLoading(true);
        // Fetch the entire board with all columns from the database
        const boardData = await fetchBoard(DEFAULT_BOARD_ID);
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
        <h1 className="text-2xl font-bold text-gray-700">Database Connected Kanban Board</h1>
        <button onClick={toggleDisplay} className="bg-blue-500">
          {display === "db" ? "Switch to example board" : "Switch to db connected"}
        </button>
      </div>
      
      {/* Show the fetched board */}
      {display === "db" && board && (
        <div className="flex h-full w-full border border-gray-400">
          {board.columns.map((col: Kanban.Column, i: number) => (
            <div className="h-full flex-1 min-w-0 border-r border-gray-400 last:!border-r-0" key={i}>
              <Column col={col} board={board} setBoard={setBoard}/>
            </div>
          ))}
        </div>
      )}

      {/* Show example board for comparison */}
      {/* {display === "example" && (
        <div className="flex h-full w-full">
          {exampleBoard.columns.map((col: Kanban.Column, i: number) => (
            <div className="h-full flex-1 min-w-0" key={i}>
              <Column col={col}/>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
