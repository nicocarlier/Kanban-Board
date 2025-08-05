import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; cardId: string }> }
) {
  try {
    const { boardId, cardId } = await params;
    const { title, description } = await request.json();

    // Validate input
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    // Check if card exists
    const cardExists = db.prepare('SELECT id FROM cards WHERE id = ? AND board_id = ? AND is_deleted = 0').get(cardId, boardId);
    if (!cardExists) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Update card
    const updateCard = db.prepare(`
      UPDATE cards 
      SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND board_id = ?
    `);
    
    const result = updateCard.run(title, description || '', cardId, boardId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Failed to update card' }, { status: 500 });
    }

    // Return the updated card
    const updatedCard = db.prepare(`
      SELECT id, title, description, column_id, order_index, created_at, updated_at
      FROM cards WHERE id = ?
    `).get(cardId);

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error updating card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ boardId: string; cardId: string }> }
) {
  try {
    const { boardId, cardId } = await params;

    // Check if card exists
    const cardExists = db.prepare('SELECT id FROM cards WHERE id = ? AND board_id = ? AND is_deleted = 0').get(cardId, boardId);
    if (!cardExists) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Soft delete the card (set is_deleted = 1)
    const deleteCard = db.prepare(`
      UPDATE cards 
      SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ? AND board_id = ?
    `);
    
    const result = deleteCard.run(cardId, boardId);

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Failed to delete card' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Error deleting card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 