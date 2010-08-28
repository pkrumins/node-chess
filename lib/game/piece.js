module.exports = Piece;
function Piece(type, color) {
    if (!(color in ArrayToHash(['w', 'white', 'b', 'black'])))
        throw "color must be w, b, white or black";

    if (!(type in ArrayToHash(['r', 'rook', 'kn', 'knight', 'b', 'bishop',
        'q', 'queen', 'k', 'king', 'p', 'pawn'])))
        throw "type must be r, kn, b, q, k, p, rook, knight, bishop, queen, king, or pawn";

    var self = this;

    function mkBoolProp() {
        var args = [].concat.apply([],arguments);
        var name = args.splice(0,1);
        var prop = args.splice(0,1);
        self[name] = (prop in ArrayToHash(args));
    }

    // this.white, this.black
    mkBoolProp('white', color, 'w', 'white');
    mkBoolProp('black', color, 'b', 'black');

    // {piece}
    mkBoolProp('rook', type, 'r', 'rook');
    mkBoolProp('knight', type, 'kn', 'knight');
    mkBoolProp('bishop', type, 'b', 'bishop');
    mkBoolProp('queen', type, 'q', 'queen');
    mkBoolProp('king', type, 'k', 'king');
    mkBoolProp('pawn', type, 'p', 'pawn');
};

function ArrayToHash(arr) {
    var hash = {};
    for (var i = 0; i < arr.length; i++) {
        hash[arr[i]] = 1;
    }
    return hash;
}

