function Viewer () {
    var self = this; 
    self.element = $('<div>').addClass('board');
    
    var area = {
        width : 750,
        height : 500
    };
    
    var im = Raphael(self.element[0], area.width, area.height);
    
    im.rect(0, 0, area.width, area.height)
        .attr({ fill : 'red' });
}
