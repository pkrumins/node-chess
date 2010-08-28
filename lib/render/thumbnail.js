function Thumbnail(board) {
    var self = this;
    self.element = $('<div>')
        .addClass('thumbnail')
        .mouseover(function () {
            bg.attr({ fill : 'rgb(200,50,50)' })
            label.attr({ opacity : 1 });
            boardOverlay.attr({ opacity : 0.5 });
        })
        .mouseout(function () {
            bg.attr({ fill : 'rgb(220,200,200)' })
            label.attr({ opacity : 0 });
            boardOverlay.attr({ opacity : 0 });
        })
    ;
    
    var im = Raphael(self.element[0], 300, 350);
    var bg = im.rect(0, 25, 300, 300, 20)
        .attr({
            fill : 'rgb(220,200,200)',
            stroke : 'none'
        });
    
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
            im.rect(t.x, t.y, t.width, t.height)
                .attr({
                    fill : (x + y) % 2 ? 'rgb(150,100,100)' : 'white',
                    stroke : 'none'
                });
        }
    }
    var boardOverlay = im.rect(0, 25, 300, 300, 20)
        .attr({
            fill : 'rgb(200, 50, 50)',
            opacity : 0
        });
    
    board.pieces.forEach(function (p) {
        var t = tile(p.x, p.y);
        var file = 'images/' + p.color + '/' + p.code + '/' +
            (p.color == 'w' ? 'front' : 'back') + '.svg';
        im.image(file, t.x, t.y, 35, 35);
    });
    
    var label = im.text(150,190,'watch')
        .attr({
            opacity : 0,
            'font-size' : 72,
            'fill' : 'rgb(255,230,100)',
            stroke : 'rgb(100,70,10)',
            'stroke-width' : 2
        });
    
}
