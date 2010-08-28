module.exports = Service;
function Service (client, conn) {
    var self = this;
    
    self.test = function (f) {
        f('woo dnode works');
    };
}
