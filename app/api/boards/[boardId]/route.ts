import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;

    // Get board data
    const board = db.prepare('SELECT * FROM boards WHERE id = ?').get(boardId) as { id: string; name: string } | undefined;
    if (!board) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Get columns for this board
    const columns = db.prepare(`
      SELECT * FROM columns 
      WHERE board_id = ? 
      ORDER BY order_index
    `).all(boardId) as Array<{ id: string; name: string; order_index: number }>;

    // Get cards for each column
    const boardData = {
      name: board.name,
      columns: columns.map((col) => {
        const cards = db.prepare(`
          SELECT * FROM cards 
          WHERE column_id = ? AND is_deleted = 0 
          ORDER BY order_index
        `).all(col.id) as Array<{
          id: string;
          title: string;
          description: string;
          is_deleted: number;
          created_at: string;
          updated_at: string;
          column_id: string;
          board_id: string;
        }>;

        return {
          id: col.id,
          title: col.name,
          index: col.order_index,
          cards: cards.map(card => ({
            id: card.id,
            title: card.title,
            description: card.description,
            is_deleted: card.is_deleted === 1,
            created_at: card.created_at,
            updated_at: card.updated_at,
            column_id: card.column_id,
            board_id: card.board_id
          }))
        };
      })
    };

    return NextResponse.json(boardData);
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 