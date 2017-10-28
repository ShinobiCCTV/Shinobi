var { io } = require('../io');

module.exports = {
    tx(z, y, x) {
        if (x) {
            return x.broadcast.to(y).emit('f', z);
        }
        io.to(y).emit('f', z);
    },
    cx(z, y, x) {
        if (x) {
            return x.broadcast.to(y).emit('c', z);
        }
        io.to(y).emit('c', z);
    },
};
