function Set_AnalysisDraw(capturedPiece, type) {

    if (memory_checkmate) return

    // ? Have no moves
    const There_no_moves = Have_no_moves();

    Update_no_moves(capturedPiece, type);

    const is_insufficient = insufficient_material()

    DRAW = (is_insufficient || There_no_moves || count_no_moves >= LimitNoMoves ) ? true: false
}

function Have_no_moves() {
    return !total_moves_TURN
}

function Update_no_moves(capturedPiece, type) {
    
    count_no_moves += (capturedPiece || type === 'P') ? -count_no_moves: 1
}

function insufficient_material() {
    const lenW = team_pieces.w.length
    const lenB = team_pieces.b.length

    if (lenW === lenB && lenW === 1) return true

    if ((lenW == 1 && lenB == 2) || (lenW == 2 && lenB == 1)) {

        const whoMoreMaterial = lenW == 2 ? 'w': 'b'

        for (const piece of team_pieces[whoMoreMaterial]) {

            if (insufficient.has(piece)) return true
        }

        return false

    } else return false
}