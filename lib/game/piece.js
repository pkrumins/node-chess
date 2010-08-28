module.exports = Piece;
function Piece(type, color) {
    if (!(this instanceof Piece)) return new Piece(type, color);
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

    // self.white, self.black
    mkBoolProp('white', color, 'w', 'white');
    mkBoolProp('black', color, 'b', 'black');

    // self.{piece}
    mkBoolProp('rook', type, 'r', 'rook');
    mkBoolProp('knight', type, 'kn', 'knight');
    mkBoolProp('bishop', type, 'b', 'bishop');
    mkBoolProp('queen', type, 'q', 'queen');
    mkBoolProp('king', type, 'k', 'king');
    mkBoolProp('pawn', type, 'p', 'pawn');

    function shortName() {
        var name;
        if (self.white) name = 'w';
        else if (self.black) name = 'b';

        if (self.rook) name += 'r';
        else if (self.knight) name += 'kn';
        else if (self.bishop) name += 'b';
        else if (self.queen) name += 'q';
        else if (self.king) name += 'k';
        else if (self.pawn) name += 'p';

        return name;
    }

    self.shortName = shortName();
    self.color = self.shortName[0];
    self.pieceName = self.shortName.slice(1);
};

function ArrayToHash(arr) {
    var hash = {};
    for (var i = 0; i < arr.length; i++) {
        hash[arr[i]] = 1;
    }
    return hash;
}

