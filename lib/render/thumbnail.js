function Thumbnail(board) {
    var self = this;
    self.element = $('<div>').addClass('thumbnail');
    
    var im = Raphael(self.element[0], 300, 350);
    im.rect(0, 25, 300, 300, 20).attr({ fill : 'rgb(200,200,200)' });
    
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            var w = (300 - 20) / 8;
            var h = (300 - 20) / 8;
            var xx = 10 + x * w;
            var yy = 25 + 10 + y * h;
            
            im
                .rect(xx, yy, w, h)
                .attr({ fill : (x + y) % 2 ? 'black' : 'white' })
            ;
        }
    }
    
    board.pieces.forEach(function (piece) {
        // ..
    });
}
