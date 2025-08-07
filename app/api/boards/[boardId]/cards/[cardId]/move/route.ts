import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; cardId: string }> }
) {
  try {
    const { boardId, cardId } = await params;
    const { columnId, newIndex } = await request.json();

    // Validate input
    if (!columnId) {
      return NextResponse.json({ error: 'columnId is required' }, { status: 400 });
    }

    // Check if card exists
    const cardExists = db.prepare('SELECT id FROM cards WHERE id = ? AND board_id = ? AND is_deleted = 0').get(cardId, boardId);
    if (!cardExists) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check if column exists
    const columnExists = db.prepare('SELECT id FROM columns WHERE id = ? AND board_id = ?').get(columnId, boardId);
    if (!columnExists) {
      return NextResponse.json({ error: 'Column not found' }, { status: 404 });
    }

    // Update card's column and order
    const updateCard = db.prepare(`
      UPDATE cards 
      SET column_id = ?, order_index = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND board_id = ?
    `);
    
    const result = updateCard.run(columnId, newIndex || 0, cardId, boardId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Failed to move card' }, { status: 500 });
    }

    // Return the updated card
    const updatedCard = db.prepare(`
      SELECT id, title, description, column_id, order_index, created_at, updated_at
      FROM cards WHERE id = ?
    `).get(cardId);

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error moving card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



