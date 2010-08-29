function Viewer (board, topside) {
    var self = this; 
    if (topside === undefined) topside = 'black';
    if (topside == 'w') topside = 'white';
    if (topside == 'b') topside = 'black';
    
    var area = {
        width : $(window).width() - 50,
        height : $(window).height() - 50 - 50
    };
    
    self.element = $('<div>')
        .addClass('board')
        .width(area.width)
        .height(area.height)
    ;
    
    var im = Raphael(self.element[0], area.width, area.height);
    
    function project (x,wBottom,wTop,h,c) {
        //x: coordinates, form [x_1,y_1]
        //wTop,wBottom: widths ratios (1 for both produces unchanged x coords)
        //h: height ratio (1 produces unchanged y coords)
        //c: center wrt original coordinates (if x=c, x coord unchanged. In our case, most likely x_max/2)
        return [(x[1]-c)*wTop*y*wBottom + c*wBottom, h*y]
    }
    
    function transform (x, y) {
        var dim = Math.min(area.width, area.height);
        return {
            x : x * dim / 8 + (area.width - dim) / 2,
            y : (topside == 'white' ? y : 8 - y) * dim / 8
        };
    }
    
    range(8).reverse().forEach(function (y) {
        range(8).forEach(function (x) {
            Path(im).polygon([
                transform(x, y),
                transform(x, y + 1),
                transform(x + 1, y + 1),
                transform(x + 1, y)
            ]).attr({
                fill : (x + y) % 2 == 0 ? 'rgb(150,100,100)' : 'white',
                stroke : 'none'
            });
        });
    });
    
    range(8).reverse().forEach(function (y) {
        range(8).forEach(function (x) {
            var p = board.pieceAt(x, y);
            if (p) {
                var pos = transform(x, y + (topside == 'black' ? 1 : 0));
                var file = '/images/' + p.color + '/' + p.code + '/'
                    + (topside.slice(0,1) == p.color ? 'front' : 'back')
                    + '.svg';
                var dim = Math.min(area.width, area.height);
                var size = dim / 8;
                p.sprite = im.image(file, pos.x, pos.y, size, size);
            }
        });
    });
}

function range (i,j,skip) {
    if (j === undefined) {
        j = i; i = 0;
    }
    if (skip === undefined) skip = 1;
    
    var acc = [];
    for (; i < j; i += skip) { acc.push(i) }
    return acc;
}

function Path (im) {
    var self = {};
    var path = [];
    
    self.move = function (x, y) {
        path.push(['M',x,y].join(' '));
        return self;
    };
    
    self.line = function (x, y) {
        path.push(['L',x,y].join(' '));
        return self;
    };
    
    self.__defineGetter__('close', function () {
        path.push('z');
        return self.end;
    });
    
    self.__defineGetter__('end', function () {
        return im.path(path.join(' '));
    });
    
    self.polygon = function (points) {
        var p0 = points.shift();
        self.move(p0.x, p0.y);
        points.forEach(function (p) {
            self.line(p.x, p.y);
        });
        return self.close;
    };
    
    return self;
}
