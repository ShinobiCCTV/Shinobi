var msg = function (){
    console.log('Shinobi : please turn off cron.js, The contents of the file are now in camera.js')
}
msg()
setInterval(function(){
    msg()
},1000 * 60 * 60 * 24)