import db from '../db';

export interface Card {
    id: string;
    title: string;
    description: string;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    column_id: number;
    board_id: number;
}


// Get all cards for a board
export function getCardsByBoard(boardId: string): Card[] {
  const stmt = db.prepare(`
    SELECT * FROM cards
    WHERE board_id = ?
  `);
  return stmt.all(boardId) as Card[];
}
