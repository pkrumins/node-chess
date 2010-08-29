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
    
    range(8).forEach(function (x) {
        range(8).forEach(function (y) {
            // Path(im).polygon(x0, y0, x1, y0, x1, y1, x0, y1);
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
    
    self.polygon = function () {
        var coords = [].slice.call(arguments);
        self.move(coords.shift(), coords.shift());
        for (var i = 0; i < coords.length; i += 2) {
            var x = coords[i];
            var y = coords[i + 1];
            self.line(x, y);
        }
        return self.close;
    };
    
    return self;
}
