import { Kanban } from "@/types/board.interface";

const STORAGE_KEY = 'kanban-board-data';

// Default board data
const defaultBoard: Kanban.Board = {
  name: 'My Kanban Board',
  columns: [
    {
      title: 'To Do',
      index: 0,
      cards: []
    },
    {
      title: 'In Progress', 
      index: 1,
      cards: []
    },
    {
      title: 'Done',
      index: 2,
      cards: []
    }
  ]
};

export function getBoard(): Kanban.Board {
  if (typeof window === 'undefined') return defaultBoard;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading board from localStorage:', error);
  }
  
  return defaultBoard;
}

export function saveBoard(board: Kanban.Board): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch (error) {
    console.error('Error saving board to localStorage:', error);
  }
}

export function addCard(board: Kanban.Board, columnIndex: number, title: string, description: string): Kanban.Board {
  const newCard: Kanban.Card = {
    id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    description,
    column_id: columnIndex,
    board_id: 1,
    is_deleted: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const updatedBoard = {
    ...board,
    columns: board.columns.map((col, index) => 
      index === columnIndex 
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    )
  };

  saveBoard(updatedBoard);
  return updatedBoard;
}

export function updateCard(board: Kanban.Board, cardId: string, title: string, description: string): Kanban.Board {
  const updatedBoard = {
    ...board,
    columns: board.columns.map(col => ({
      ...col,
      cards: col.cards.map(card => 
        card.id === cardId 
          ? { ...card, title, description, updated_at: new Date().toISOString() }
          : card
      )
    }))
  };

  saveBoard(updatedBoard);
  return updatedBoard;
}

export function deleteCard(board: Kanban.Board, cardId: string): Kanban.Board {
  const updatedBoard = {
    ...board,
    columns: board.columns.map(col => ({
      ...col,
      cards: col.cards.filter(card => card.id !== cardId)
    }))
  };

  saveBoard(updatedBoard);
  return updatedBoard;
} 