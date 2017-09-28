var get = require('./get');
var ffmpeg = require('./ffmpeg');
var check = require('./check');
var remove = require('./remove');

module.exports = Object.assign({}, get, ffmpeg, check, remove);
