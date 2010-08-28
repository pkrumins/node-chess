module.exports = Square;
function Square(x,y,piece) {
    if (!(this instanceof Square)) return new Square(x,y,piece);
    if (x < 0 || x > 7)
        throw "Invalid x position for square";
    if (y < 0 || y > 7)
        throw "Invalid y position for square";

    var self = this;

    self.x = x;
    self.y = y;
    self.piece = piece;

    self.empty = function () {
        return self.piece == null;
    }

    self.clear = function () {
        self.piece = null;
    }

    var lookup = "ABCDEFGH".split('');

    self.position = lookup[x] + (y+1).toString();
};

