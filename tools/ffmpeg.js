var exec = require('child_process').exec;

module.exports = {
    ffmpegKill(callback){
        var cmd=''
        if(process.platform === 'win32'){
            cmd="Taskkill /IM ffmpeg.exe /T /F"
        }else{
            cmd="ps aux | grep -ie ffmpeg | awk '{print $2}' | xargs kill -9"
        }
        exec(cmd, callback)
    },
}