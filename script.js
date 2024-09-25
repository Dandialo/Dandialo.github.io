// Obtener elementos del DOM
const chessboard = document.getElementById('chessboard');
const clearButton = document.getElementById('clear-button');
const resetButton = document.getElementById('reset-button');

// Variable para rastrear la pieza arrastrada
let draggedElement = null;

// Inicializar el tablero con las posiciones iniciales
function initBoard(initial = true) {
    chessboard.innerHTML = ''; // Limpiar el tablero

    for(let row = 8; row >=1; row--){
        for(let col = 1; col <=8; col++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            // Determinar color de la celda
            if((row + col) % 2 === 0){
                cell.classList.add('white');
            } else {
                cell.classList.add('black');
            }
            cell.dataset.row = row;
            cell.dataset.col = col;
            chessboard.appendChild(cell);

            // Evento para permitir soltar piezas en la celda
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = draggedElementFromBar() ? 'copy' : 'move';
            });

            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                const pieceType = e.dataTransfer.getData('text/plain');
                if(pieceType) {
                    const targetCell = e.target.closest('.cell');
                    if(targetCell) {
                        if(draggedElementFromBar()) {
                            // Si la pieza viene de la barra, copiarla
                            addPieceToCell(targetCell, pieceType);
                        } else {
                            // Si la pieza viene del tablero, moverla
                            if(draggedElement && targetCell !== draggedElement.parentElement) {
                                // Remover pieza del origen
                                draggedElement.parentElement.innerHTML = '';
                                // Añadir pieza al destino
                                targetCell.appendChild(draggedElement);
                            }
                        }
                    }
                }
            });

            // Si se quiere inicializar con posiciones estándar
            if(initial) {
                const initialPosition = getInitialPosition(row, col);
                if(initialPosition) {
                    addPieceToCell(cell, initialPosition);
                }
            }
        }
    }
}

// Obtener la pieza inicial según la posición
function getInitialPosition(row, col) {
    const whitePieces = {
        1: ['rook_white', 'knight_white', 'bishop_white', 'queen_white', 'king_white', 'bishop_white', 'knight_white', 'rook_white'],
        2: Array(8).fill('pawn_white')
    };
    const blackPieces = {
        8: ['rook_black', 'knight_black', 'bishop_black', 'queen_black', 'king_black', 'bishop_black', 'knight_black', 'rook_black'],
        7: Array(8).fill('pawn_black')
    };

    if(row === 1 && col >=1 && col <=8) {
        return whitePieces[1][col -1];
    }
    if(row === 2) {
        return whitePieces[2][col -1];
    }
    if(row === 7) {
        return blackPieces[7][col -1];
    }
    if(row === 8 && col >=1 && col <=8) {
        return blackPieces[8][col -1];
    }
    return null; // No hay pieza en esta posición
}

// Función para agregar una pieza a una celda
function addPieceToCell(cell, piece) {
    // Remover pieza existente si hay
    cell.innerHTML = '';
    const img = document.createElement('img');
    img.src = getPieceImage(piece);
    img.classList.add('piece');
    img.draggable = true;
    img.dataset.piece = piece; // Almacenar el tipo de pieza en un atributo de datos

    // Evento para arrastrar la pieza
    img.addEventListener('dragstart', dragStart);
    // Evento para eliminar la pieza con doble clic
    img.addEventListener('dblclick', () => {
        cell.innerHTML = '';
    });

    cell.appendChild(img);
}

// Obtener la URL de la imagen según la pieza
function getPieceImage(piece) {
    const pieces = {
        'queen_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Chess_qlt45.svg/48px-Chess_qlt45.svg.png',
        'king_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Chess_klt45.svg/48px-Chess_klt45.svg.png',
        'bishop_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Chess_blt45.svg/48px-Chess_blt45.svg.png',
        'knight_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Chess_nlt45.svg/48px-Chess_nlt45.svg.png',
        'rook_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Chess_rlt45.svg/48px-Chess_rlt45.svg.png',
        'pawn_white': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Chess_plt45.svg/48px-Chess_plt45.svg.png',

        'queen_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chess_qdt45.svg/48px-Chess_qdt45.svg.png',
        'king_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Chess_kdt45.svg/48px-Chess_kdt45.svg.png',
        'bishop_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Chess_bdt45.svg/48px-Chess_bdt45.svg.png',
        'knight_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Chess_ndt45.svg/48px-Chess_ndt45.svg.png',
        'rook_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Chess_rdt45.svg/48px-Chess_rdt45.svg.png',
        'pawn_black': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Chess_pdt45.svg/48px-Chess_pdt45.svg.png'
    };
    return pieces[piece];
}

// Verificar si la pieza viene de la barra de piezas
function draggedElementFromBar() {
    return draggedElement && draggedElement.parentElement.id === 'piece-bar';
}

// Manejar la selección de una pieza desde la barra
let selectedPiece = null;

// Evento para seleccionar una pieza al hacer clic en la barra
document.querySelectorAll('.draggable-piece').forEach(piece => {
    piece.addEventListener('dragstart', (e) => {
        const pieceType = e.target.dataset.piece;
        e.dataTransfer.setData('text/plain', pieceType);
        // Marcar que la pieza viene de la barra
        draggedElement = null; // Indicar que no es una pieza existente del tablero
        // Para permitir que se pueda arrastrar múltiples veces
        e.dataTransfer.effectAllowed = 'copy';
    });

    // Opcional: permitir seleccionar una pieza al hacer clic
    piece.addEventListener('click', () => {
        selectedPiece = piece.dataset.piece;
    });
});

// Evento del botón Limpiar Tablero
clearButton.addEventListener('click', () => {
    document.querySelectorAll('.cell').forEach(cell => {
        cell.innerHTML = '';
    });
});

// Evento del botón Restablecer Tablero
resetButton.addEventListener('click', () => {
    initBoard(true); // Inicializar con posiciones estándar
});

// Funcionalidad de arrastrar y soltar dentro del tablero
function dragStart(e) {
    draggedElement = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.piece);
    // Para permitir mover la pieza
    e.dataTransfer.effectAllowed = 'move';
}

// Inicializar el tablero al cargar la página
window.onload = () => {
    initBoard(true);
};
