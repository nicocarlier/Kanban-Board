"use client";

import Column from "@/components/column";
import Image from "next/image";
import { fetchBoard, fetchColumn, DEFAULT_BOARD_ID, COLUMN_IDS } from "@/lib/api";
import { useEffect, useState } from "react";

interface Card {
  id: string;
  title: string;
  description: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  column_id: number;
  board_id: number;
}

export interface BoardColumn {
  cards: Card[];
  title: string;
  index: number;
}

interface Board {
  name: string;
  columns: Array<BoardColumn>
}

// Example board data
const exampleBoard: Board = {
  name: "Project Kanban Board",
  columns: [
    {
      title: "To Do",
      index: 0,
      cards: [
        {
          id: "card_1",
          title: "Design user interface",
          description: "Create wireframes and mockups for the new feature",
          is_deleted: false,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z",
          column_id: 0,
          board_id: 1
        },
        {
          id: "card_2", 
          title: "Set up database schema",
          description: "Define tables and relationships for the project",
          is_deleted: false,
          created_at: "2024-01-15T11:30:00Z",
          updated_at: "2024-01-15T11:30:00Z",
          column_id: 0,
          board_id: 1
        }
      ]
    },
    {
      title: "In Progress",
      index: 1,
      cards: [
        {
          id: "card_3",
          title: "Implement authentication",
          description: "Add user login and registration functionality",
          is_deleted: false,
          created_at: "2024-01-14T09:00:00Z",
          updated_at: "2024-01-16T14:20:00Z",
          column_id: 1,
          board_id: 1
        }
      ]
    },
    {
      title: "Done",
      index: 2,
      cards: [
        {
          id: "card_4",
          title: "Project setup",
          description: "Initialize Next.js project with TypeScript and Tailwind",
          is_deleted: false,
          created_at: "2024-01-13T08:00:00Z",
          updated_at: "2024-01-13T16:00:00Z",
          column_id: 2,
          board_id: 1
        },
        {
          id: "card_5",
          title: "Requirements gathering",
          description: "Document all project requirements and user stories",
          is_deleted: false,
          created_at: "2024-01-12T10:00:00Z",
          updated_at: "2024-01-12T15:30:00Z",
          column_id: 2,
          board_id: 1
        }
      ]
    }
  ]
};

export default function Home() {
  const [board, setBoard] = useState<Board | null>(null);
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
    <div className="w-full h-full">

      <div className="flex w-full items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Database Connected Kanban Board</h1>
        <button onClick={toggleDisplay} className="bg-blue-500">
          {display === "db" ? "Switch to example board" : "Switch to db connected"}
        </button>
      </div>
      
      {/* Show the fetched board */}
      {display === "db" && board && (
        <div className="flex gap-4 h-full w-full">
          {board.columns.map((col: BoardColumn, i: number) => (
            <div className="h-full flex-1 min-w-0" key={i}>
              <Column col={col}/>
            </div>
          ))}
        </div>
      )}

      {/* Show example board for comparison */}
      {display === "example" && (
        <div className="flex gap-4 h-full w-full">
          {exampleBoard.columns.map((col: BoardColumn, i: number) => (
            <div className="h-full flex-1 min-w-0" key={i}>
              <Column col={col}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
