import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; columnId: string }> }
) {
  try {
    const { boardId, columnId } = await params;

    // Get column information
    const columnStmt = db.prepare(`
      SELECT id, board_id, name as title, order_index as "index"
      FROM columns 
      WHERE board_id = ? AND id = ?
    `);
    const column = columnStmt.get(boardId, columnId) as { id: string; board_id: string; title: string; index: number } | undefined;

    if (!column) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    // Get cards for this column
    const cardsStmt = db.prepare(`
      SELECT 
        id,
        title,
        description,
        is_deleted,
        created_at,
        updated_at,
        column_id,
        board_id
      FROM cards 
      WHERE board_id = ? AND column_id = ? AND is_deleted = 0
      ORDER BY order_index
    `);
    const cards = cardsStmt.all(boardId, columnId);

    // Format the response to match BoardColumns interface
    const boardColumn = {
      title: column.title,
      index: column.index,
      cards: cards
    };

    return NextResponse.json(boardColumn);
  } catch (error) {
    console.error('Error fetching column:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 