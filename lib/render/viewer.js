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
        var wBottom = 8;
        var wTop = 7;
        var height = 5;
        return {
            x: (x-cx)*wTop*y*wBottom + x*wBottom,
            y: height*(y - cy) + cy
        };
    }
    
    range(8).forEach(function (x) {
        range(8).forEach(function (y) {
            Path(im).polygon([
                transform(x, y, 4, 4),
                transform(x, y + 1, 4, 4),
                transform(x + 1, y + 1, 4, 4),
                transform(x + 1, y, 4, 4)
            ]).attr({ fill : (x + y) % 2 == 0 ? 'white' : 'black' });
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
