function Thumbnail(board) {
    var self = this;
    self.element = $('<div>').addClass('thumbnail');
    
    var im = Raphael(self.element[0], 300, 350);
    im.rect(0, 25, 300, 300, 20).attr({ fill : 'rgb(200,200,200)' });
    
    function tile (x, y) {
        var w = (300 - 20) / 8;
        var h = (300 - 20) / 8;
        return {
            width : w,
            height : h,
            x : 10 + x * w,
            y : 25 + 10 + y * h
        };
    }
    
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            var t = tile(x, y);
            im
                .rect(t.x, t.y, t.width, t.height)
                .attr({ fill : (x + y) % 2 ? 'black' : 'white' })
            ;
        }
    }
    
    board.pieces.forEach(function (p) {
        var t = tile(p.x, p.y);
        im
            .text(t.x + 18, t.y + 24, p.code)
            .attr({
                fill : p.color == 'w' ? 'red' : 'green',
                'font-size' : '24px'
            })
        ;
        //console.log(p);
    });
}
