import { Kanban } from "@/types/board.interface";

const API_BASE = '/api';

// Hardcoded IDs for testing
export const DEFAULT_BOARD_ID = 'default-board';
export const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress', 
  DONE: 'done'
}; 


export async function fetchBoard(boardId: string): Promise<Kanban.Board> {
  const response = await fetch(`${API_BASE}/boards/${boardId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch board: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchColumn(boardId: string, columnId: string): Promise<Kanban.Column> {
  const response = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch column: ${response.statusText}`);
  }
  
  return response.json();
}

export const handleEditCard = async (cardId: string, title: string, description: string): Promise<Response> => {
  try {
    const response = await fetch(`/api/boards/default-board/cards/${cardId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description }),
    });

    if (!response.ok) {
      console.error('Failed to update card');
    }
    
    return response;
  } catch (error) {
    console.error('Error updating card:', error);
    throw error;
  }
};

export const handleDeleteCard = async (cardId: string): Promise<Response> => {
  try {
    const response = await fetch(`/api/boards/default-board/cards/${cardId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Failed to delete card');
    }
    
    return response;
  } catch (error) {
    console.error('Error deleting card:', error);
    throw error;
  }
};

export const updateCardPosition = async (cardId: string, columnId: string, newIndex: number): Promise<Response> => {
  try {
    const response = await fetch(`/api/boards/default-board/cards/${cardId}/move`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        columnId, 
        newIndex 
      }),
    });

    if (!response.ok) {
      console.error('Failed to update card position');
    }
    
    return response;
  } catch (error) {
    console.error('Error updating card position:', error);
    throw error;
  }
};

export const moveCardBetweenColumns = async (cardId: string, destinationColumnId: string, newIndex: number): Promise<Response> => {
  try {
    const response = await fetch(`/api/boards/default-board/cards/${cardId}/move`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        columnId: destinationColumnId, 
        newIndex 
      }),
    });

    if (!response.ok) {
      console.error('Failed to move card between columns');
    }
    
    return response;
  } catch (error) {
    console.error('Error moving card between columns:', error);
    throw error;
  }
};