function Thumbnail(board) {
    var self = this;
    self.element = $('<div>').attr('class', 'thumbnail');
    var im = Raphael(self.element[0], 200, 200);
    im.rect(0, 0, 200, 200, 20).attr({ fill : 'rgb(200,200,200)' });
    
    board.pieces.forEach(function (piece) {
        // ..
    });
}
