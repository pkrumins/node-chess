function Viewer (board) {
    var self = this; 
    self.element = $('<div>').addClass('board');
    
    var area = {
        width : 750,
        height : 500
    };
   
    var im = Raphael(self.element[0], area.width, area.height);
    
    im.rect(0, 0, area.width, area.height)
        .attr({ fill : 'red' });

    function transform (x, y, cx, cy) {
        var wBottom = 1;
        var wTop = 0.7;
        var height = 0.4;

        var ynew = (y-cy) * height + cy;
        var xnew = (x-cx) * ( 0.5*(wTop + wBottom) - 0.25*(wBottom-wTop)*(y-cy) ) + cx;

        return {
            x: xnew*area.height/8 + (area.width-area.height)/2,
            y: (8-ynew) * area.height/8
        };
    }
    
    range(8).reverse().forEach(function (y) {
        range(8).forEach(function (x) {
            Path(im).polygon([
                transform(x, y, 4, 4),
                transform(x, y + 1, 4, 4),
                transform(x + 1, y + 1, 4, 4),
                transform(x + 1, y, 4, 4)
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
