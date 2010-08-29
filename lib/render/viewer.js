function Viewer (board) {
    var self = this; 
    self.element = $('<div>').addClass('board');
    
    var area = {
        width : 750,
        height : 500
    };

    function project (x,wBottom,wTop,h,c) {
        //x: coordinates, form [x_1,y_1]
        //wTop,wBottom: widths ratios (1 for both produces unchanged x coords)
        //h: height ratio (1 produces unchanged y coords)
        //c: center wrt original coordinates (if x=c, x coord unchanged. In our case, most likely x_max/2)
        return [(x[1]-c)*wTop*y*wBottom + c*wBottom, h*y]
    }
    
    var im = Raphael(self.element[0], area.width, area.height);
    
    im.rect(0, 0, area.width, area.height)
        .attr({ fill : 'red' });
    
    function transform (x, y) {
        return {
            x : x * area.height / 8 + (area.width - area.height) / 2,
            y : (8 - y) * area.height / 8
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
                var pos = transform(x, y + 1);
                var file = '/images/' + p.color + '/' + p.code + '/front.svg';
                p.sprite = im.image(file, pos.x, pos.y, 50, 50);
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
