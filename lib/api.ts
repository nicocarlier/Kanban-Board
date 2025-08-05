import { BoardColumns } from '@/app/page';

const API_BASE = '/api';

export async function fetchBoard(boardId: string): Promise<Board> {
  const response = await fetch(`${API_BASE}/boards/${boardId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch board: ${response.statusText}`);
  }
  
  return response.json();
}

export async function fetchColumn(boardId: string, columnId: string): Promise<BoardColumns> {
  const response = await fetch(`${API_BASE}/boards/${boardId}/columns/${columnId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch column: ${response.statusText}`);
  }
  
  return response.json();
}

// Hardcoded IDs for testing
export const DEFAULT_BOARD_ID = 'default-board';
export const COLUMN_IDS = {
  TODO: 'todo',
  IN_PROGRESS: 'in-progress', 
  DONE: 'done'
}; 