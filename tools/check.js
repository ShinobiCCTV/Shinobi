module.exports = {
    checkRelativePath(x) {
        if (x.charAt(0) !== '/') {
            x = process.cwd() + '/' + x;
        }
        return x;
    },
    checkCorrectPathEnding(x) {
        var length = x.length;
        if (x.charAt(length - 1) !== '/') {
            x = x + '/';
        }
        return x.replace('__DIR__', process.cwd());
    },
};
