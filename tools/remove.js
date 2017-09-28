var fs = require('fs');
var path = require('path');

var rmDir = function(dirPath, removeSelf) {
    if (removeSelf === undefined) {
        removeSelf = true;
    }
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { console.log(e); return false; }
    try {
        if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
                var filePath = path.join(dirPath, '/', files[i]);
                if (fs.statSync(filePath).isFile()) {
                    fs.unlinkSync(filePath);
                } else {
                    rmDir(filePath);
                }
            }
        }
        if (removeSelf) {
            fs.rmdirSync(dirPath);
            return true;
        }
    } catch (error) {
        console.log(error);
        return false;
    }
    
    return true;
};

module.exports = {
    rmDir
}
