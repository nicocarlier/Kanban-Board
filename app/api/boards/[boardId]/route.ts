import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await params;

    // Get all columns for this board
    const columnsStmt = db.prepare(`
      SELECT id, board_id, name as title, order_index as "index"
      FROM columns 
      WHERE board_id = ?
      ORDER BY order_index
    `);
    const columns = columnsStmt.all(boardId) as Array<{ id: string; board_id: string; title: string; index: number }>;

    if (!columns.length) {
      return NextResponse.json({ error: 'Board not found' }, { status: 404 });
    }

    // Get all cards for this board
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
      WHERE board_id = ? AND is_deleted = 0
      ORDER BY column_id, order_index
    `);
    const cards = cardsStmt.all(boardId);

    // Group cards by column
    const boardColumns = columns.map(column => ({
      title: column.title,
      index: column.index,
      cards: cards.filter((card: any) => card.column_id === column.id)
    }));

    return NextResponse.json({
      name: 'My Kanban Board',
      columns: boardColumns
    });
  } catch (error) {
    console.error('Error fetching board:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 