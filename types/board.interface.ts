export namespace Kanban {

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

    export interface Column {
        cards: Card[];
        title: string;
        index: number;
    }

    export interface Board {
        name: string;
        columns: Array<Column>
    }
}