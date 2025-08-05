import { Kanban } from "@/types/board.interface";

// Example board data
export const exampleBoard: Kanban.Board = {
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
  