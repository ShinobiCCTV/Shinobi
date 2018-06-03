//
// Shinobi
// Copyright (C) 2016 Moe Alam, moeiscool
//
//
// # Donate
//
// If you like what I am doing here and want me to continue please consider donating :)
// PayPal : paypal@m03.ca
//
var fs = require('fs');
process.on('uncaughtException', function (err) {
    console.error('Uncaught Exception occured!');
    console.error(err.stack);
});
var staticFFmpeg = false;
try{
    staticFFmpeg = require('ffmpeg-static').path;
    if (!fs.existsSync(staticFFmpeg)) {
        staticFFmpeg = false
        console.log('"ffmpeg-static" from NPM has failed to provide a compatible library or has been corrupted.')
        console.log('You may need to install FFmpeg manually or you can try running "npm uninstall ffmpeg-static && npm install ffmpeg-static".')
    }
}catch(err){
    staticFFmpeg = false;
    console.log('No Static FFmpeg. Continuing.')
    //no static ffmpeg
}
var os = require('os');
var URL = require('url');
var path = require('path');
var mysql = require('mysql');
var moment = require('moment');
var request = require("request");
var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var server = http.createServer(app);
var bodyParser = require('body-parser');
var CircularJSON = require('circular-json');
var ejs = require('ejs');
var io = new (require('socket.io'))();
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var socketIOclient = require('socket.io-client');
var crypto = require('crypto');
var webdav = require("webdav");
var jsonfile = require("jsonfile");
var connectionTester = require('connection-tester');
var events = require('events');
var onvif = require('node-onvif');
var knex = require('knex');
var Mp4Frag = require('mp4frag');
var P2P = require('pipe2pam');
var PamDiff = require('pam-diff');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({})
var location = {}
location.super = __dirname+'/super.json'
location.config = __dirname+'/conf.json'
location.languages = __dirname+'/languages'
location.definitions = __dirname+'/definitions'
var config = require(location.config);
if(!config.productType){
    config.productType='CE'
}
if(config.productType==='Pro'){
    var LdapAuth = require('ldapauth-fork');
}
if(!config.language){
    config.language='en_CA'
}
try{
    var lang = require(location.languages+'/'+config.language+'.json');
}catch(er){
    console.error(er)
    console.log('There was an error loading your language file.')
    var lang = require(location.languages+'/en_CA.json');
}
try{
    var definitions = require(location.definitions+'/'+config.language+'.json');
}catch(er){
    console.error(er)
    console.log('There was an error loading your language file.')
    var definitions = require(location.definitions+'/en_CA.json');
}
process.send = process.send || function () {};
if(config.mail){
    var nodemailer = require('nodemailer').createTransport(config.mail);
}
//config defaults
if(config.cpuUsageMarker===undefined){config.cpuUsageMarker='%Cpu'}
if(config.customCpuCommand===undefined){config.customCpuCommand=null}
if(config.autoDropCache===undefined){config.autoDropCache=true}
if(config.doSnapshot===undefined){config.doSnapshot=true}
if(config.restart===undefined){config.restart={}}
if(config.systemLog===undefined){config.systemLog=true}
if(config.deleteCorruptFiles===undefined){config.deleteCorruptFiles=true}
if(config.restart.onVideoNotExist===undefined){config.restart.onVideoNotExist=true}
if(config.ip===undefined||config.ip===''||config.ip.indexOf('0.0.0.0')>-1){config.ip='localhost'}else{config.bindip=config.ip};
if(config.cron===undefined)config.cron={};
if(config.cron.enabled===undefined)config.cron.enabled=true;
if(config.cron.deleteOld===undefined)config.cron.deleteOld=true;
if(config.cron.deleteOrphans===undefined)config.cron.deleteOrphans=false;
if(config.cron.deleteNoVideo===undefined)config.cron.deleteNoVideo=true;
if(config.cron.deleteNoVideoRecursion===undefined)config.cron.deleteNoVideoRecursion=false;
if(config.cron.deleteOverMax===undefined)config.cron.deleteOverMax=true;
if(config.cron.deleteOverMaxOffset===undefined)config.cron.deleteOverMaxOffset=0.9;
if(config.cron.deleteLogs===undefined)config.cron.deleteLogs=true;
if(config.cron.deleteEvents===undefined)config.cron.deleteEvents=true;
if(config.cron.deleteFileBins===undefined)config.cron.deleteFileBins=true;
if(config.cron.interval===undefined)config.cron.interval=1;
if(config.databaseType===undefined){config.databaseType='mysql'}
if(config.pluginKeys===undefined)config.pluginKeys={};
if(config.databaseLogs===undefined){config.databaseLogs=false}
if(config.useUTC===undefined){config.useUTC=false}
if(config.pipeAddition===undefined){config.pipeAddition=7}else{config.pipeAddition=parseInt(config.pipeAddition)}
//Web Paths
if(config.webPaths===undefined){config.webPaths={}}
    //main access URI
    if(config.webPaths.home===undefined){config.webPaths.index='/'}
    //Super User URI
    if(config.webPaths.super===undefined){config.webPaths.super='/super'}
    //Admin URI
    if(config.webPaths.admin===undefined){config.webPaths.admin='/admin'}
//Page Rander Paths
if(config.renderPaths===undefined){config.renderPaths={}}
    //login page
    if(config.renderPaths.index===undefined){config.renderPaths.index='pages/index'}
    //dashboard page
    if(config.renderPaths.home===undefined){config.renderPaths.home='pages/home'}
    //sub-account administration page
    if(config.renderPaths.admin===undefined){config.renderPaths.admin='pages/admin'}
    //superuser page
    if(config.renderPaths.super===undefined){config.renderPaths.super='pages/super'}
    //2-Factor Auth page
    if(config.renderPaths.factorAuth===undefined){config.renderPaths.factorAuth='pages/factor'}
    //Streamer (Dashbcam Prototype) page
    if(config.renderPaths.streamer===undefined){config.renderPaths.streamer='pages/streamer'}
    //Streamer v2 (Dashbcam) page
    if(config.renderPaths.dashcam===undefined){config.renderPaths.dashcam='pages/dashcam'}
    //embeddable widget page
    if(config.renderPaths.embed===undefined){config.renderPaths.embed='pages/embed'}
    //mjpeg full screen page
    if(config.renderPaths.mjpeg===undefined){config.renderPaths.mjpeg='pages/mjpeg'}
    //gridstack only page
    if(config.renderPaths.grid===undefined){config.renderPaths.grid='pages/grid'}
//Child Nodes
if(config.childNodes===undefined)config.childNodes = {};
    //enabled
    if(config.childNodes.enabled===undefined)config.childNodes.enabled = false;
    //mode, set value as `child` for all other machines in the cluster
    if(config.childNodes.mode===undefined)config.childNodes.mode = 'master';
    //child node connection port
    if(config.childNodes.port===undefined)config.childNodes.port = 8288;
    //child node connection key
    if(config.childNodes.key===undefined)config.childNodes.key = [
        '3123asdasdf1dtj1hjk23sdfaasd12asdasddfdbtnkkfgvesra3asdsd3123afdsfqw345'
    ];


s={
    factorAuth : {},
    totalmem : os.totalmem(),
    platform : os.platform(),
    s : JSON.stringify,
    isWin : (process.platform==='win32'),
    utcOffset : moment().utcOffset()
};
//load languages dynamically
s.loadedLanguages={}
s.loadedLanguages[config.language]=lang;
s.getLanguageFile=function(rule){
    if(rule&&rule!==''){
        var file=s.loadedLanguages[file]
        if(!file){
            try{
                s.loadedLanguages[rule]=require(location.languages+'/'+rule+'.json')
                file=s.loadedLanguages[rule]
            }catch(err){
                file=lang
            }
        }
    }else{
        file=lang
    }
    return file
}
//load defintions dynamically
s.loadedDefinitons={}
s.loadedDefinitons[config.language]=definitions;
s.getDefinitonFile=function(rule){
    if(rule&&rule!==''){
        var file=s.loadedDefinitons[file]
        if(!file){
            try{
                s.loadedDefinitons[rule]=require(location.definitions+'/'+rule+'.json')
                file=s.loadedDefinitons[rule]
            }catch(err){
                file=definitions
            }
        }
    }else{
        file=definitions
    }
    return file
}
var databaseOptions = {
  client: config.databaseType,
  connection: config.db,
}
if(databaseOptions.client.indexOf('sqlite')>-1){
    databaseOptions.client = 'sqlite3';
    databaseOptions.useNullAsDefault = true;
}
if(databaseOptions.client === 'sqlite3' && databaseOptions.connection.filename === undefined){
    databaseOptions.connection.filename = __dirname+"/shinobi.sqlite"
}
s.databaseEngine = knex(databaseOptions)
s.sqlDate = function(value){
    var dateQueryFunction = ''
    if(databaseOptions.client === 'sqlite3'){
        value = value.toLowerCase()
        if (value.slice(-1) !== 's') {
            value = value+'s'
        }
        dateQueryFunction = "datetime('now', '-"+value+"')"
    }else{
        value = value.toUpperCase()
        if (value.slice(-1) === 'S') {
            value = value.slice(0, -1);  
        }
        dateQueryFunction = "DATE_SUB(NOW(), INTERVAL "+value+")"
    }
    return dateQueryFunction
}
s.mergeQueryValues = function(query,values){
    if(!values){values=[]}
    var valuesNotFunction = true;
    if(typeof values === 'function'){
        var onMoveOn = values;
        var values = [];
        valuesNotFunction = false;
    }
    if(!onMoveOn){onMoveOn=function(){}}
    if(values&&valuesNotFunction){
        var splitQuery = query.split('?')
        var newQuery = ''
        splitQuery.forEach(function(v,n){
            newQuery += v
            if(values[n]){
                if(isNaN(values[n])){
                    newQuery += "'"+values[n]+"'"
                }else{
                    newQuery += values[n]
                }
            }
        })
    }else{
        newQuery = query
    }
    return newQuery
}
s.sqlQuery = function(query,values,onMoveOn,hideLog){
    if(!values){values=[]}
    if(typeof values === 'function'){
        var onMoveOn = values;
        var values = [];
    }
    if(!onMoveOn){onMoveOn=function(){}}
    var mergedQuery = s.mergeQueryValues(query,values)
    return s.databaseEngine.raw(query,values)
        .asCallback(function(err,r){
            if(err&&config.databaseLogs){
                s.systemLog('s.sqlQuery QUERY',query)
                s.systemLog('s.sqlQuery ERROR',err)
            }
            if(onMoveOn && typeof onMoveOn === 'function'){
                switch(databaseOptions.client){
                    case'sqlite3':
                        if(!r)r=[]
                    break;
                    default:
                        if(r)r=r[0]
                    break;
                }
                onMoveOn(err,r)
            }
        })
}
//kill any ffmpeg running
s.ffmpegKill=function(){
    var cmd=''
    if(s.isWin===true){
        cmd="Taskkill /IM ffmpeg.exe /F"
    }else{
        cmd="ps aux | grep -ie ffmpeg | awk '{print $2}' | xargs kill -9"
    }
    exec(cmd,{detached: true})
};
process.on('exit',s.ffmpegKill.bind(null,{cleanup:true}));
process.on('SIGINT',s.ffmpegKill.bind(null, {exit:true}));
s.checkRelativePath=function(x){
    if(x.charAt(0)!=='/'){
        x=__dirname+'/'+x
    }
    return x
}
s.checkCorrectPathEnding=function(x){
    var length=x.length
    if(x.charAt(length-1)!=='/'){
        x=x+'/'
    }
    return x.replace('__DIR__',__dirname)
}
s.md5=function(x){return crypto.createHash('md5').update(x).digest("hex");}
//send data to detector plugin
s.ocvTx=function(data){
    if(!s.ocv){return}
    if(s.ocv.isClientPlugin===true){
        s.tx(data,s.ocv.id)
    }else{
        s.connectedPlugins[s.ocv.plug].tx(data)
    }
}
//send data to socket client function
s.tx=function(z,y,x){if(x){return x.broadcast.to(y).emit('f',z)};io.to(y).emit('f',z);}
s.txWithSubPermissions=function(z,y,permissionChoices){
    if(typeof permissionChoices==='string'){
        permissionChoices=[permissionChoices]
    }
    if(s.group[z.ke]){
        Object.keys(s.group[z.ke].users).forEach(function(v){
            var user = s.group[z.ke].users[v]
            if(user.details.sub){
                if(user.details.allmonitors!=='1'){
                    var valid=0
                    var checked=permissionChoices.length
                    permissionChoices.forEach(function(b){
                        if(user.details[b].indexOf(z.mid)!==-1){
                            ++valid
                        }
                    })
                    if(valid===checked){
                       s.tx(z,user.cnid)
                    }
                }else{
                    s.tx(z,user.cnid)
                }
            }else{
                s.tx(z,user.cnid)
            }
        })
    }
}
//load camera controller vars
s.nameToTime=function(x){x=x.split('.')[0].split('T'),x[1]=x[1].replace(/-/g,':');x=x.join(' ');return x;}
s.ratio=function(width,height,ratio){ratio = width / height;return ( Math.abs( ratio - 4 / 3 ) < Math.abs( ratio - 16 / 9 ) ) ? '4:3' : '16:9';}
s.randomNumber=function(x){
    if(!x){x=10};
    return Math.floor((Math.random() * x) + 1);
};
s.gid=function(x){
    if(!x){x=10};var t = "";var p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < x; i++ )
        t += p.charAt(Math.floor(Math.random() * p.length));
    return t;
};
s.nid=function(x){
    if(!x){x=6};var t = "";var p = "0123456789";
    for( var i=0; i < x; i++ )
        t += p.charAt(Math.floor(Math.random() * p.length));
    return t;
};
s.formattedTime_withOffset=function(e,x){
    if(!e){e=new Date};if(!x){x='YYYY-MM-DDTHH-mm-ss'};
    e=s.timeObject(e);if(config.utcOffset){e=e.utcOffset(config.utcOffset)}
    return e.format(x);
}
s.formattedTime=function(e,x){
    if(!e){e=new Date};if(!x){x='YYYY-MM-DDTHH-mm-ss'};
    return s.timeObject(e).format(x);
}
s.utcToLocal = function(time){
    return moment.utc(time).utcOffset(s.utcOffset).format()
}
s.localTimeObject = function(e,x){
    return moment(e)
}
if(config.useUTC === true){
    s.timeObject = function(time){
        return moment(time).utc()
    }
}else{
    s.timeObject = moment
}
console.log('config.useUTC',config.useUTC)
s.ipRange=function(start_ip, end_ip) {
  var start_long = s.toLong(start_ip);
  var end_long = s.toLong(end_ip);
  if (start_long > end_long) {
    var tmp=start_long;
    start_long=end_long
    end_long=tmp;
  }
  var range_array = [];
  var i;
  for (i=start_long; i<=end_long;i++) {
    range_array.push(s.fromLong(i));
  }
  return range_array;
}
s.portRange=function(lowEnd,highEnd){
    var list = [];
    for (var i = lowEnd; i <= highEnd; i++) {
        list.push(i);
    }
    return list;
}
//toLong taken from NPM package 'ip'
s.toLong=function(ip) {
  var ipl = 0;
  ip.split('.').forEach(function(octet) {
    ipl <<= 8;
    ipl += parseInt(octet);
  });
  return(ipl >>> 0);
};

//fromLong taken from NPM package 'ip'
s.fromLong=function(ipl) {
  return ((ipl >>> 24) + '.' +
      (ipl >> 16 & 255) + '.' +
      (ipl >> 8 & 255) + '.' +
      (ipl & 255) );
};
s.getFunctionParamNames = function(func) {
  var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
     result = [];
  return result;
}
s.createPamDiffRegionArray = function(regions,globalSensitivity,fullFrame){
    var pamDiffCompliantArray = [],
        arrayForOtherStuff = [],
        json
    try{
        json = JSON.parse(regions)
    }catch(err){
        json = regions
    }
    if(fullFrame){
        json[fullFrame.name]=fullFrame;
    }
    Object.values(json).forEach(function(region){
        region.polygon = [];
        region.points.forEach(function(points){
            region.polygon.push({x:parseFloat(points[0]),y:parseFloat(points[1])})
        })
        if(region.sensitivity===''){
            region.sensitivity = globalSensitivity
        }else{
            region.sensitivity = parseInt(region.sensitivity)
        }
        pamDiffCompliantArray.push({name: region.name, difference: 9, percent: region.sensitivity, polygon:region.polygon})
        arrayForOtherStuff[region.name] = region;
    })
    if(pamDiffCompliantArray.length===0){pamDiffCompliantArray = null}
    return {forPam:pamDiffCompliantArray,notForPam:arrayForOtherStuff};
}
s.getRequest = function(url,callback){
    return http.get(url, function(res){
        var body = '';
        res.on('data', function(chunk){
            body += chunk;
        });
        res.on('end',function(){
            try{body = JSON.parse(body)}catch(err){}
            callback(body)
        });
    }).on('error', function(e){
//                              s.systemLog("Get Snapshot Error", e);
    });
}
s.kill=function(x,e,p){
    if(s.group[e.ke]&&s.group[e.ke].mon[e.id]&&s.group[e.ke].mon[e.id].spawn !== undefined){
        if(s.group[e.ke].mon[e.id].spawn){
            s.group[e.ke].mon[e.id].spawn.stdio[3].unpipe();
//            if(s.group[e.ke].mon[e.id].p2pStream){s.group[e.ke].mon[e.id].p2pStream.unpipe();}
            if(s.group[e.ke].mon[e.id].p2p){s.group[e.ke].mon[e.id].p2p.unpipe();}
            delete(s.group[e.ke].mon[e.id].p2pStream)
            delete(s.group[e.ke].mon[e.id].p2p)
            delete(s.group[e.ke].mon[e.id].pamDiff)
            try{
            s.group[e.ke].mon[e.id].spawn.removeListener('end',s.group[e.ke].mon[e.id].spawn_exit);
            s.group[e.ke].mon[e.id].spawn.removeListener('exit',s.group[e.ke].mon[e.id].spawn_exit);
            delete(s.group[e.ke].mon[e.id].spawn_exit);
            }catch(er){}
        }
        clearTimeout(s.group[e.ke].mon[e.id].checker);
        delete(s.group[e.ke].mon[e.id].checker);
        clearTimeout(s.group[e.ke].mon[e.id].checkStream);
        delete(s.group[e.ke].mon[e.id].checkStream);
        clearTimeout(s.group[e.ke].mon[e.id].watchdog_stop);
        delete(s.group[e.ke].mon[e.id].watchdog_stop);
        delete(s.group[e.ke].mon[e.id].lastJpegDetectorFrame);
        if(e&&s.group[e.ke].mon[e.id].record){
            clearTimeout(s.group[e.ke].mon[e.id].record.capturing);
//            if(s.group[e.ke].mon[e.id].record.request){s.group[e.ke].mon[e.id].record.request.abort();delete(s.group[e.ke].mon[e.id].record.request);}
        };
        if(s.group[e.ke].mon[e.id].childNode){
            s.cx({f:'kill',d:s.init('noReference',e)},s.group[e.ke].mon[e.id].childNodeId)
        }else{
            if(!x||x===1){return};
            p=x.pid;
            if(s.group[e.ke].mon_conf[e.id].type===('dashcam'||'socket'||'jpeg'||'pipe')){
                x.stdin.pause();setTimeout(function(){x.kill('SIGTERM');delete(x);},500)
            }else{
                try{
                    x.stdin.setEncoding('utf8');x.stdin.write('q');
                }catch(er){}
            }
            setTimeout(function(){exec('kill -9 '+p,{detached: true})},1000)
        }
    }
}
//user log
s.log=function(e,x){
    if(!x||!e.mid){return}
    if((e.details&&e.details.sqllog==='1')||e.mid.indexOf('$')>-1){
        s.sqlQuery('INSERT INTO Logs (ke,mid,info) VALUES (?,?,?)',[e.ke,e.mid,s.s(x)]);
    }
    s.tx({f:'log',ke:e.ke,mid:e.mid,log:x,time:s.timeObject()},'GRPLOG_'+e.ke);
//    s.systemLog('s.log : ',{f:'log',ke:e.ke,mid:e.mid,log:x,time:s.timeObject()},'GRP_'+e.ke)
}
//system log
s.systemLog=function(q,w,e){
    if(!w){w=''}
    if(!e){e=''}
    if(config.systemLog===true){
        if(typeof q==='string'&&s.databaseEngine){
            s.sqlQuery('INSERT INTO Logs (ke,mid,info) VALUES (?,?,?)',['$','$SYSTEM',s.s({type:q,msg:w})]);
            s.tx({f:'log',log:{time:s.timeObject(),ke:'$',mid:'$SYSTEM',time:s.timeObject(),info:s.s({type:q,msg:w})}},'$');
        }
        return console.log(s.timeObject().format(),q,w,e)
    }
}
//SSL options
if(config.ssl&&config.ssl.key&&config.ssl.cert){
    config.ssl.key=fs.readFileSync(s.checkRelativePath(config.ssl.key),'utf8')
    config.ssl.cert=fs.readFileSync(s.checkRelativePath(config.ssl.cert),'utf8')
    if(config.ssl.port===undefined){
        config.ssl.port=443
    }
    if(config.ssl.bindip===undefined){
        config.ssl.bindip=config.bindip
    }
    if(config.ssl.ca&&config.ssl.ca instanceof Array){
        config.ssl.ca.forEach(function(v,n){
            config.ssl.ca[n]=fs.readFileSync(s.checkRelativePath(v),'utf8')
        })
    }
    var serverHTTPS = https.createServer(config.ssl,app);
    serverHTTPS.listen(config.ssl.port,config.bindip,function(){
        console.log('SSL '+lang.Shinobi+' - SSL PORT : '+config.ssl.port);
    });
    io.attach(serverHTTPS);
}
//start HTTP
server.listen(config.port,config.bindip,function(){
    console.log(lang.Shinobi+' - PORT : '+config.port);
});
io.attach(server);
console.log('NODE.JS version : '+execSync("node -v"))
//ffmpeg location
if(!config.ffmpegDir){
    if(staticFFmpeg !== false){
        config.ffmpegDir = staticFFmpeg
    }else{
        if(s.isWin===true){
            config.ffmpegDir = __dirname+'/ffmpeg/ffmpeg.exe'
        }else{
            config.ffmpegDir = 'ffmpeg'
        }
    }
}
//ffmpeg version
s.ffmpegVersion=execSync(config.ffmpegDir+" -version").toString().split('Copyright')[0].replace('ffmpeg version','').trim()
console.log('FFMPEG version : '+s.ffmpegVersion)
if(s.ffmpegVersion.indexOf(': 2.')>-1){
    s.systemLog('FFMPEG is too old : '+s.ffmpegVersion+', Needed : 3.2+',err)
    return
}
//directories
s.group={};
if(!config.windowsTempDir&&s.isWin===true){config.windowsTempDir='C:/Windows/Temp'}
if(!config.defaultMjpeg){config.defaultMjpeg=__dirname+'/web/libs/img/bg.jpg'}
//default stream folder check
if(!config.streamDir){
    if(s.isWin===false){
        config.streamDir='/dev/shm'
    }else{
        config.streamDir=config.windowsTempDir
    }
    if(!fs.existsSync(config.streamDir)){
        config.streamDir=__dirname+'/streams/'
    }else{
        config.streamDir+='/streams/'
    }
}
if(!config.videosDir){config.videosDir=__dirname+'/videos/'}
if(!config.binDir){config.binDir=__dirname+'/fileBin/'}
if(!config.addStorage){config.addStorage=[]}
s.dir={
    videos:s.checkCorrectPathEnding(config.videosDir),
    streams:s.checkCorrectPathEnding(config.streamDir),
    fileBin:s.checkCorrectPathEnding(config.binDir),
    addStorage:config.addStorage,
    languages:location.languages+'/'
};
//streams dir
if(!fs.existsSync(s.dir.streams)){
    fs.mkdirSync(s.dir.streams);
}
//videos dir
if(!fs.existsSync(s.dir.videos)){
    fs.mkdirSync(s.dir.videos);
}
//fileBin dir
if(!fs.existsSync(s.dir.fileBin)){
    fs.mkdirSync(s.dir.fileBin);
}
//additional storage areas
s.dir.addStorage.forEach(function(v,n){
    v.path=s.checkCorrectPathEnding(v.path)
    if(!fs.existsSync(v.path)){
        fs.mkdirSync(v.path);
    }
})
////Camera Controller
s.init=function(x,e,k,fn){
    if(!e){e={}}
    if(!k){k={}}
    switch(x){
        case 0://init camera
            if(!s.group[e.ke]){s.group[e.ke]={}};
            if(!s.group[e.ke].fileBin){s.group[e.ke].fileBin={}};
            if(!s.group[e.ke].mon){s.group[e.ke].mon={}}
            if(!s.group[e.ke].sizeChangeQueue){s.group[e.ke].sizeChangeQueue=[]}
            if(!s.group[e.ke].sizePurgeQueue){s.group[e.ke].sizePurgeQueue=[]}
            if(!s.group[e.ke].users){s.group[e.ke].users={}}
            if(!s.group[e.ke].mon[e.mid]){s.group[e.ke].mon[e.mid]={}}
            if(!s.group[e.ke].mon[e.mid].streamIn){s.group[e.ke].mon[e.mid].streamIn={}};
            if(!s.group[e.ke].mon[e.mid].emitterChannel){s.group[e.ke].mon[e.mid].emitterChannel={}};
            if(!s.group[e.ke].mon[e.mid].mp4frag){s.group[e.ke].mon[e.mid].mp4frag={}};
            if(!s.group[e.ke].mon[e.mid].firstStreamChunk){s.group[e.ke].mon[e.mid].firstStreamChunk={}};
            if(!s.group[e.ke].mon[e.mid].contentWriter){s.group[e.ke].mon[e.mid].contentWriter={}};
            if(!s.group[e.ke].mon[e.mid].childNodeStreamWriters){s.group[e.ke].mon[e.mid].childNodeStreamWriters={}};
            if(!s.group[e.ke].mon[e.mid].eventBasedRecording){s.group[e.ke].mon[e.mid].eventBasedRecording={}};
            if(!s.group[e.ke].mon[e.mid].watch){s.group[e.ke].mon[e.mid].watch={}};
            if(!s.group[e.ke].mon[e.mid].fixingVideos){s.group[e.ke].mon[e.mid].fixingVideos={}};
            if(!s.group[e.ke].mon[e.mid].record){s.group[e.ke].mon[e.mid].record={yes:e.record}};
            if(!s.group[e.ke].mon[e.mid].started){s.group[e.ke].mon[e.mid].started=0};
            if(s.group[e.ke].mon[e.mid].delete){clearTimeout(s.group[e.ke].mon[e.mid].delete)}
            if(!s.group[e.ke].mon_conf){s.group[e.ke].mon_conf={}}
            s.init('apps',e)
        break;
        case'group':
            if(!s.group[e.ke]){
                s.group[e.ke]={}
            }
            if(!s.group[e.ke].init){
                s.group[e.ke].init={}
            }
            if(!e.limit||e.limit===''){e.limit=10000}else{e.limit=parseFloat(e.limit)}
            //save global space limit for group key (mb)
            s.group[e.ke].sizeLimit=e.limit;
            //save global used space as megabyte value
            s.group[e.ke].usedSpace=e.size/1000000;
            //emit the changes to connected users
            s.init('diskUsedEmit',e)
        break;
        case'apps':
            if(!s.group[e.ke].init){
                s.group[e.ke].init={};
            }
            if(!s.group[e.ke].webdav||!s.group[e.ke].sizeLimit){
                s.sqlQuery('SELECT * FROM Users WHERE ke=? AND details NOT LIKE ?',[e.ke,'%"sub"%'],function(ar,r){
                    if(r&&r[0]){
                        r=r[0];
                        ar=JSON.parse(r.details);
                        //owncloud/webdav
                        if(ar.webdav_user&&
                           ar.webdav_user!==''&&
                           ar.webdav_pass&&
                           ar.webdav_pass!==''&&
                           ar.webdav_url&&
                           ar.webdav_url!==''
                          ){
                            if(!ar.webdav_dir||ar.webdav_dir===''){
                                ar.webdav_dir='/';
                                if(ar.webdav_dir.slice(-1)!=='/'){ar.webdav_dir+='/';}
                            }
                            s.group[e.ke].webdav = webdav(
                                ar.webdav_url,
                                ar.webdav_user,
                                ar.webdav_pass
                            );
                        }
                        Object.keys(ar).forEach(function(v){
                            s.group[e.ke].init[v]=ar[v]
                        })
                    }
                });
            }
        break;
        case'sync':
            e.cn=Object.keys(s.childNodes);
            e.cn.forEach(function(v){
                if(s.group[e.ke]){
                   s.cx({f:'sync',sync:s.init('noReference',s.group[e.ke].mon_conf[e.mid]),ke:e.ke,mid:e.mid},s.childNodes[v].cnid);
                }
            });
        break;
        case'noReference':
            x={keys:Object.keys(e),ar:{}};
            x.keys.forEach(function(v){
                if(v!=='last_frame'&&v!=='record'&&v!=='spawn'&&v!=='running'&&(v!=='time'&&typeof e[v]!=='function')){x.ar[v]=e[v];}
            });
            return x.ar;
        break;
        case'url':
            //build a complete url from pieces
            e.authd='';
            if(e.details.muser&&e.details.muser!==''&&e.host.indexOf('@')===-1) {
                e.authd=e.details.muser+':'+e.details.mpass+'@';
            }
            if(e.port==80&&e.details.port_force!=='1'){e.porty=''}else{e.porty=':'+e.port}
            e.url=e.protocol+'://'+e.authd+e.host+e.porty+e.path;return e.url;
        break;
        case'url_no_path':
            e.authd='';
            if(!e.details.muser){e.details.muser=''}
            if(!e.details.mpass){e.details.mpass=''}
            if(e.details.muser!==''&&e.host.indexOf('@')===-1) {
                e.authd=e.details.muser+':'+e.details.mpass+'@';
            }
            if(e.port==80&&e.details.port_force!=='1'){e.porty=''}else{e.porty=':'+e.port}
            e.url=e.protocol+'://'+e.authd+e.host+e.porty;return e.url;
        break;
        case'diskUsedEmit':
            //send the amount used disk space to connected users
            if(s.group[e.ke]&&s.group[e.ke].init){
                s.tx({f:'diskUsed',size:s.group[e.ke].usedSpace,limit:s.group[e.ke].sizeLimit},'GRP_'+e.ke);
            }
        break;
        case'diskUsedSet':
            //`k` will be used as the value to add or substract
            s.group[e.ke].sizeChangeQueue.push(k)
            if(s.group[e.ke].sizeChanging!==true){
                //lock this function
                s.group[e.ke].sizeChanging=true
                //validate current values
                if(!s.group[e.ke].usedSpace){
                    s.group[e.ke].usedSpace=0
                }else{
                    s.group[e.ke].usedSpace=parseFloat(s.group[e.ke].usedSpace)
                }
                if(s.group[e.ke].usedSpace<0||isNaN(s.group[e.ke].usedSpace)){
                    s.group[e.ke].usedSpace=0
                }
                //set queue processor
                var checkQueue=function(){
                    //get first in queue
                    var currentChange = s.group[e.ke].sizeChangeQueue[0]
                    //change global size value
                    s.group[e.ke].usedSpace=s.group[e.ke].usedSpace+currentChange
                    //remove value just used from queue
                    s.group[e.ke].sizeChangeQueue = s.group[e.ke].sizeChangeQueue.splice(1,s.group[e.ke].sizeChangeQueue.length+10)
                    //do next one
                    if(s.group[e.ke].sizeChangeQueue.length>0){
                        checkQueue()
                    }else{
                        s.group[e.ke].sizeChanging=false
                        s.init('diskUsedEmit',e)
                    }
                }
                checkQueue()
            }
        break;
    }
    if(typeof e.callback==='function'){setTimeout(function(){e.callback()},500);}
}
s.filterEvents=function(x,d){
    switch(x){
        case'archive':
            d.videos.forEach(function(v,n){
                s.video('archive',v)
            })
        break;
        case'email':
            if(d.videos&&d.videos.length>0){
                d.videos.forEach(function(v,n){

                })
                d.mailOptions = {
                    from: '"ShinobiCCTV" <no-reply@shinobi.video>', // sender address
                    to: d.mail, // list of receivers
                    subject: lang['Filter Matches']+' : '+d.name, // Subject line
                    html: lang.FilterMatchesText1+' '+d.videos.length+' '+lang.FilterMatchesText2,
                };
                if(d.execute&&d.execute!==''){
                    d.mailOptions.html+='<div><b>'+lang.Executed+' :</b> '+d.execute+'</div>'
                }
                if(d.delete==='1'){
                    d.mailOptions.html+='<div><b>'+lang.Deleted+' :</b> '+lang.Yes+'</div>'
                }
                d.mailOptions.html+='<div><b>'+lang.Query+' :</b> '+d.query+'</div>'
                d.mailOptions.html+='<div><b>'+lang['Filter ID']+' :</b> '+d.id+'</div>'
                nodemailer.sendMail(d.mailOptions, (error, info) => {
                    if (error) {
                        s.tx({f:'error',ff:'filter_mail',ke:d.ke,error:error},'GRP_'+d.ke);
                        return ;
                    }
                    s.tx({f:'filter_mail',ke:d.ke,info:info},'GRP_'+d.ke);
                });
            }
        break;
        case'delete':
            d.videos.forEach(function(v,n){
                s.video('delete',v)
            })
        break;
        case'execute':
            exec(d.execute,{detached: true})
        break;
    }
}
s.video=function(x,e,k){
    if(!e){e={}};
    switch(x){
        case'getDir':
            if(e.mid&&!e.id){e.id=e.mid};
            if(e.details&&(e.details instanceof Object)===false){
                try{e.details=JSON.parse(e.details)}catch(err){}
            }
            if(e.details&&e.details.dir&&e.details.dir!==''){
                return s.checkCorrectPathEnding(e.details.dir)+e.ke+'/'+e.id+'/'
            }else{
                return s.dir.videos+e.ke+'/'+e.id+'/';
            }
        break;
    }
    if(!k)k={};
    if(x!=='getDir'){e.dir=s.video('getDir',e)}
    switch(x){
        case'fix':
            e.sdir=s.dir.streams+e.ke+'/'+e.id+'/';
            if(!e.filename&&e.time){e.filename=s.formattedTime(e.time)}
            if(e.filename.indexOf('.')===-1){
                e.filename=e.filename+'.'+e.ext
            }
            s.tx({f:'video_fix_start',mid:e.mid,ke:e.ke,filename:e.filename},'GRP_'+e.ke)
            s.group[e.ke].mon[e.id].fixingVideos[e.filename]={}
            switch(e.ext){
                case'mp4':
                    e.fixFlags='-vcodec libx264 -acodec aac -strict -2';
                break;
                case'webm':
                    e.fixFlags='-vcodec libvpx -acodec libvorbis';
                break;
            }
            e.spawn=spawn(config.ffmpegDir,('-i '+e.dir+e.filename+' '+e.fixFlags+' '+e.sdir+e.filename).split(' '),{detached: true})
            e.spawn.stdout.on('data',function(data){
                s.tx({f:'video_fix_data',mid:e.mid,ke:e.ke,filename:e.filename},'GRP_'+e.ke)
            });
            e.spawn.on('close',function(data){
                exec('mv '+e.dir+e.filename+' '+e.sdir+e.filename,{detached: true}).on('exit',function(){
                    s.tx({f:'video_fix_success',mid:e.mid,ke:e.ke,filename:e.filename},'GRP_'+e.ke)
                    delete(s.group[e.ke].mon[e.id].fixingVideos[e.filename]);
                })
            });
        break;
        case'archive':
            if(!e.filename&&e.time){e.filename=s.formattedTime(e.time)}
            if(!e.status){e.status=0}
            e.details.archived="1"
            e.save=[JSON.stringify(e.details),e.id,e.ke,s.nameToTime(e.filename)];
            s.sqlQuery('UPDATE Videos SET details=? WHERE `mid`=? AND `ke`=? AND `time`=?',e.save,function(err,r){
                s.tx({f:'video_edit',status:3,filename:e.filename+'.'+e.ext,mid:e.mid,ke:e.ke,time:s.nameToTime(e.filename)},'GRP_'+e.ke);
            });
        break;
        case'delete':
            if(!e.filename&&e.time){e.filename=s.formattedTime(e.time)}
            var filename
            if(e.filename.indexOf('.')>-1){
                filename = e.filename
            }else{
                filename = e.filename+'.'+e.ext
            }
            if(!e.status){e.status=0}
            e.save=[e.id,e.ke,s.nameToTime(filename)];
            s.sqlQuery('SELECT * FROM Videos WHERE `mid`=? AND `ke`=? AND `time`=?',e.save,function(err,r){
                if(r&&r[0]){
                    r=r[0]
                    var dir=s.video('getDir',r)
                    s.sqlQuery('DELETE FROM Videos WHERE `mid`=? AND `ke`=? AND `time`=?',e.save,function(){
                        fs.stat(dir+filename,function(err,file){
                            if(err){
                                s.systemLog('File Delete Error : '+e.ke+' : '+' : '+e.mid,err)
                            }
                            s.init('diskUsedSet',e,-(r.size/1000000))
                        })
                        s.tx({f:'video_delete',filename:filename,mid:e.mid,ke:e.ke,time:s.nameToTime(filename),end:s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss')},'GRP_'+e.ke);
                        s.file('delete',dir+filename)
                    })
                }
            })
        break;
//        case'open':
//            //on video open
//            e.save=[e.id,e.ke,s.nameToTime(e.filename),e.ext];
//            if(!e.status){e.save.push(0)}else{e.save.push(e.status)}
//            k.details={}
//            if(e.details&&e.details.dir&&e.details.dir!==''){
//                k.details.dir=e.details.dir
//            }
//            e.save.push(s.s(k.details))
//            s.sqlQuery('INSERT INTO Videos (mid,ke,time,ext,status,details) VALUES (?,?,?,?,?,?)',e.save)
//            s.tx({f:'video_build_start',filename:e.filename+'.'+e.ext,mid:e.id,ke:e.ke,time:s.nameToTime(e.filename),end:s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss')},'GRP_'+e.ke);
//        break;
//        case'close':
//            //video function : close
//            if(s.group[e.ke]&&s.group[e.ke].mon[e.id]){
//                if(s.group[e.ke].mon[e.id].open&&!e.filename){
//                    e.filename=s.group[e.ke].mon[e.id].open;
//                    e.ext=s.group[e.ke].mon[e.id].open_ext
//                }
//                if(s.group[e.ke].mon[e.id].childNode){
//                    s.cx({f:'close',d:s.init('noReference',e)},s.group[e.ke].mon[e.id].childNodeId);
//                }else{
//                    k.file = e.filename+'.'+e.ext
//                    k.dir = e.dir.toString()
//                    //get file directory
//                    k.fileExists = fs.existsSync(k.dir+k.file)
//                    if(k.fileExists!==true){
//                        k.dir=s.dir.videos+'/'+e.ke+'/'+e.id+'/'
//                        k.fileExists=fs.existsSync(k.dir+k.file)
//                        if(k.fileExists!==true){
//                            s.dir.addStorage.forEach(function(v){
//                                if(k.fileExists!==true){
//                                    k.dir=s.checkCorrectPathEnding(v.path)+e.ke+'/'+e.id+'/'
//                                    k.fileExists=fs.existsSync(k.dir+k.file)
//                                }
//                            })
//                        }
//                    }
//                    if(k.fileExists===true){
//                        //close video row
//                        k.stat = fs.statSync(k.dir+k.file)
//                        e.filesize = k.stat.size
//                        e.filesizeMB = parseFloat((e.filesize/1000000).toFixed(2))
//                        e.end_time = s.formattedTime(k.stat.mtime,'YYYY-MM-DD HH:mm:ss')
//                        var save = [
//                            e.filesize,
//                            1,
//                            e.end_time,
//                            e.id,
//                            e.ke,
//                            s.nameToTime(e.filename)
//                        ]
//                        if(!e.status){
//                            save.push(0)
//                        }else{
//                            save.push(e.status)
//                        }
//                        s.sqlQuery('UPDATE Videos SET `size`=?,`status`=?,`end`=? WHERE `mid`=? AND `ke`=? AND `time`=? AND `status`=?',save)
//                        //send event for completed recording
//                        s.txWithSubPermissions({
//                            f:'video_build_success',
//                            hrefNoAuth:'/videos/'+e.ke+'/'+e.mid+'/'+k.file,
//                            filename:k.file,
//                            mid:e.id,
//                            ke:e.ke,
//                            time:s.timeObject(s.nameToTime(e.filename)).format(),
//                            size:e.filesize,
//                            end:s.timeObject(e.end_time).format()
//                        },'GRP_'+e.ke,'video_view');
//                        //send new diskUsage values
//                        s.video('diskUseUpdate',e,k)
//                    }else{
//                        s.video('delete',e);
//                        s.log(e,{type:lang['File Not Exist'],msg:lang.FileNotExistText,ffmpeg:s.group[e.ke].mon[e.id].ffmpeg})
//                        if(e.mode && config.restart.onVideoNotExist === true){
//                            delete(s.group[e.ke].mon[e.id].open);
//                            s.log(e,{
//                                type : lang['Camera is not recording'],
//                                msg : {
//                                    msg : lang.CameraNotRecordingText
//                                }
//                            });
//                            if(s.group[e.ke].mon[e.id].started===1){
//                                s.camera('restart',e)
//                            }
//                        }
//                    }
//                }
//            }
//            delete(s.group[e.ke].mon[e.id].open);
//        break;
        case'linkBuild':
            //e = video rows
            //k = auth key
            e.forEach(function(v){
                var details = JSON.parse(v.details)
                var queryString = []
                if(details.isUTC === true){
                    queryString.push('isUTC=true')
                }else{
                    v.time = s.utcToLocal(v.time)
                    v.end = s.utcToLocal(v.end)
                }
                if(queryString.length > 0){
                    queryString = '?'+queryString.join('&')
                }else{
                    queryString = ''
                }
                v.href = '/'+k+'/videos/'+v.ke+'/'+v.mid+'/'+s.formattedTime(v.time)+'.'+v.ext;
                v.links = {
                    deleteVideo : v.href+'/delete' + queryString,
                    changeToUnread : v.href+'/status/1' + queryString,
                    changeToRead : v.href+'/status/2' + queryString
                }
                v.href = v.href + queryString
                v.details = details
            })
        break;
        case'diskUseUpdate':
            if(s.group[e.ke].init){
                s.init('diskUsedSet',e,e.filesizeMB)
                if(config.cron.deleteOverMax===true){
                    //check space
                    s.group[e.ke].sizePurgeQueue.push(1)
                    if(s.group[e.ke].sizePurging!==true){
                        //lock this function
                        s.group[e.ke].sizePurging=true
                        //set queue processor
                        var finish=function(){
                            //remove value just used from queue
                            s.group[e.ke].sizePurgeQueue = s.group[e.ke].sizePurgeQueue.splice(1,s.group[e.ke].sizePurgeQueue.length+10)
                            //do next one
                            if(s.group[e.ke].sizePurgeQueue.length>0){
                                checkQueue()
                            }else{
                                s.group[e.ke].sizePurging=false
                                s.init('diskUsedEmit',e)
                            }
                        }
                        var checkQueue=function(){
                            //get first in queue
                            var currentPurge = s.group[e.ke].sizePurgeQueue[0]
                            var deleteVideos = function(){
                                //run purge command
                                if(s.group[e.ke].usedSpace>(s.group[e.ke].sizeLimit*config.cron.deleteOverMaxOffset)){
                                        s.sqlQuery('SELECT * FROM Videos WHERE status != 0 AND details NOT LIKE \'%"archived":"1"%\' AND ke=? ORDER BY `time` ASC LIMIT 2',[e.ke],function(err,evs){
                                            k.del=[];k.ar=[e.ke];
                                            evs.forEach(function(ev){
                                                ev.dir=s.video('getDir',ev)+s.formattedTime(ev.time)+'.'+ev.ext;
                                                k.del.push('(mid=? AND time=?)');
                                                k.ar.push(ev.mid),k.ar.push(ev.time);
                                                s.file('delete',ev.dir);
                                                s.init('diskUsedSet',e,-(ev.size/1000000))
                                                s.tx({f:'video_delete',ff:'over_max',filename:s.formattedTime(ev.time)+'.'+ev.ext,mid:ev.mid,ke:ev.ke,time:ev.time,end:s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss')},'GRP_'+e.ke);
                                            });
                                            if(k.del.length>0){
                                                k.qu=k.del.join(' OR ');
                                                s.sqlQuery('DELETE FROM Videos WHERE ke =? AND ('+k.qu+')',k.ar,function(){
                                                    deleteVideos()
                                                })
                                            }else{
                                                finish()
                                            }
                                        })
                                }else{
                                    finish()
                                }
                            }
                            deleteVideos()
                        }
                        checkQueue()
                    }
                }else{
                    s.init('diskUsedEmit',e)
                }
            }
        break;
        case'insertCompleted':
            k.dir = e.dir.toString()
            if(s.group[e.ke].mon[e.id].childNode){
                s.cx({f:'insertCompleted',d:s.group[e.ke].mon_conf[e.id],k:k},s.group[e.ke].mon[e.id].childNodeId);
            }else{
                //get file directory
                k.fileExists = fs.existsSync(k.dir+k.file)
                if(k.fileExists!==true){
                    k.dir = s.dir.videos+'/'+e.ke+'/'+e.id+'/'
                    k.fileExists = fs.existsSync(k.dir+k.file)
                    if(k.fileExists !== true){
                        s.dir.addStorage.forEach(function(v){
                            if(k.fileExists !== true){
                                k.dir = s.checkCorrectPathEnding(v.path)+e.ke+'/'+e.id+'/'
                                k.fileExists = fs.existsSync(k.dir+k.file)
                            }
                        })
                    }
                }
                if(k.fileExists===true){
                    //close video row
                    k.stat = fs.statSync(k.dir+k.file)
                    e.filesize = k.stat.size
                    e.filesizeMB = parseFloat((e.filesize/1000000).toFixed(2))
                    
                    e.startTime = new Date(s.nameToTime(k.file))
                    e.endTime = new Date(k.stat.mtime)
                    if(config.useUTC === true){
                        fs.rename(k.dir+k.file, k.dir+s.formattedTime(e.startTime)+'.'+e.ext, (err) => {
                            if (err) return console.error(err);
                        });
                        k.filename = s.formattedTime(e.startTime)+'.'+e.ext
                    }else{
                        e.startTime = s.utcToLocal(e.startTime)
                        e.endTime = s.utcToLocal(e.endTime)
                        k.filename = k.file
                    }
                    if(!e.ext){e.ext = k.filename.split('.')[1]}
                    //send event for completed recording
                    if(config.childNodes.enabled === true && config.childNodes.mode === 'child' && config.childNodes.host){
                        fs.createReadStream(k.dir+k.filename)
                        .on('data',function(data){
                            s.cx({
                                f:'created_file_chunk',
                                mid:e.id,
                                ke:e.ke,
                                chunk:data,
                                filename:k.filename,
                                d:s.init('noReference',e),
                                filesize:e.filesize,
                                time:s.timeObject(e.startTime).format(),
                                end:s.timeObject(e.endTime).format()
                            })
                        })
                        .on('close',function(){
                            clearTimeout(s.group[e.ke].mon[e.id].checker)
                            clearTimeout(s.group[e.ke].mon[e.id].checkStream)
                            s.cx({
                                f:'created_file',
                                mid:e.id,
                                ke:e.ke,
                                filename:k.filename,
                                d:s.init('noReference',e),
                                filesize:e.filesize,
                                time:s.timeObject(e.startTime).format(),
                                end:s.timeObject(e.endTime).format()
                            })
                        });
                    }else{
                        var href = '/videos/'+e.ke+'/'+e.mid+'/'+k.filename
                        if(config.useUTC === true)href += '?isUTC=true';
                        s.txWithSubPermissions({
                            f:'video_build_success',
                            hrefNoAuth:href,
                            filename:k.filename,
                            mid:e.mid,
                            ke:e.ke,
                            time:s.timeObject(e.startTime).format(),
                            size:e.filesize,
                            end:s.timeObject(e.endTime).format()
                        },'GRP_'+e.ke,'video_view');
                    }
                    //cloud auto savers
                    //webdav
    //                var webDAV = s.group[e.ke].webdav
    //                if(webDAV&&s.group[e.ke].init.use_webdav!=='0'&&s.group[e.ke].init.webdav_save=="1"){
    //                   fs.readFile(k.dir+k.filename,function(err,data){
    //                       var webdavUploadDir = s.group[e.ke].init.webdav_dir+e.ke+'/'+e.mid+'/'
    //                       fs.readFile(k.dir+k.filename,function(err,data){
    //                           webDAV.putFileContents(webdavUploadDir+k.filename,"binary",data).catch(function(err) {
    //                               if(err){
    //                                   webDAV.createDirectory(webdavUploadDir).catch(function(err) {
    //                                       s.log(e,{type:lang['Webdav Error'],msg:{msg:lang.WebdavErrorText+' <b>/'+webdavUploadDir+'</b>',info:err}})
    //                                   })
    //                                   webDAV.putFileContents(webdavUploadDir+k.filename,"binary",data).catch(function(err) {
    //                                       s.log(e,{type:lang['Webdav Error'],msg:{msg:lang.WebdavErrorText+' <b>/'+webdavUploadDir+'</b>',info:err}})
    //                                   })
    //                                   s.log(e,{type:lang['Webdav Error'],msg:{msg:lang.WebdavErrorText+' <b>/'+webdavUploadDir+'</b>',info:err}})
    //                               }
    //                           });
    //                        });
    //                    });
    //                }
                    if(s.group[e.ke].webdav&&s.group[e.ke].init.use_webdav!=='0'&&s.group[e.ke].init.webdav_save=="1"){
                       fs.readFile(k.dir+k.filename,function(err,data){
                           s.group[e.ke].webdav.putFileContents(s.group[e.ke].init.webdav_dir+e.ke+'/'+e.mid+'/'+k.filename,"binary",data)
                        .catch(function(err) {
                               s.log(e,{type:lang['Webdav Error'],msg:{msg:lang.WebdavErrorText+' <b>/'+e.ke+'/'+e.id+'</b>',info:err},ffmpeg:s.group[e.ke].mon[e.id].ffmpeg})
                            console.error(err);
                           });
                        });
                    }
                    k.details = {}
                    if(e.details&&e.details.dir&&e.details.dir!==''){
                        k.details.dir = e.details.dir
                    }
                    if(config.useUTC)k.details.isUTC = config.useUTC;
                    var save = [
                        e.mid,
                        e.ke,
                        e.startTime,
                        e.ext,
                        1,
                        s.s(k.details),
                        e.filesize,
                        e.endTime,
                    ]
                    s.sqlQuery('INSERT INTO Videos (mid,ke,time,ext,status,details,size,end) VALUES (?,?,?,?,?,?,?,?)',save)
                    //send new diskUsage values
                    s.video('diskUseUpdate',e,k)
                }
            }
        break;
    }
}
s.splitForFFPMEG = function (ffmpegCommandAsString) {
    //this function ignores spaces inside quotes.
    return ffmpegCommandAsString.match(/\\?.|^$/g).reduce((p, c) => {
        if(c === '"'){
            p.quote ^= 1;
        }else if(!p.quote && c === ' '){
            p.a.push('');
        }else{
            p.a[p.a.length-1] += c.replace(/\\(.)/,"$1");
        }
        return  p;
    }, {a: ['']}).a
};
s.ffmpeg=function(e){
    //create input map
    var createFFmpegMap = function(arrayOfMaps){
        //e.details.input_map_choices.stream
        var string = '';
        if(e.details.input_maps && e.details.input_maps.length > 0){
            if(arrayOfMaps && arrayOfMaps instanceof Array && arrayOfMaps.length>0){
                arrayOfMaps.forEach(function(v){
                    if(v.map==='')v.map='0'
                    string += ' -map '+v.map
                })
            }else{
                string += ' -map 0:0'
            }
        }
        return string;
    }
    var createInputMap = function(number,input){
        //fulladdress - Full Input Path
        //`x` is an object used to contain temporary values.
        var x = {}
        x.cust_input = ''
        x.hwaccel = ''
        if(input.cust_input&&input.cust_input!==''){x.cust_input+=' '+input.cust_input;}
        //input - analyze duration
        if(input.aduration&&input.aduration!==''){x.cust_input+=' -analyzeduration '+input.aduration};
        //input - probe size
        if(input.probesize&&input.probesize!==''){x.cust_input+=' -probesize '+input.probesize};
        //input - stream loop (good for static files/lists)
        if(input.stream_loop==='1'){x.cust_input+=' -stream_loop -1'};
        //input - fps
        if(x.cust_input.indexOf('-r ')===-1&&input.sfps&&input.sfps!==''){
            input.sfps=parseFloat(input.sfps);
            if(isNaN(input.sfps)){input.sfps=1}
            x.cust_input+=' -r '+input.sfps
        }
        //input - is mjpeg
        if(input.type==='mjpeg'){
            if(x.cust_input.indexOf('-f ')===-1){
                x.cust_input+=' -f mjpeg'
            }
            //input - frames per second
            x.cust_input+=' -reconnect 1';
        }else
        //input - is h264 has rtsp in address and transport method is chosen
        if((input.type==='h264'||input.type==='mp4')&&input.fulladdress.indexOf('rtsp://')>-1&&input.rtsp_transport!==''&&input.rtsp_transport!=='no'){
            x.cust_input += ' -rtsp_transport '+input.rtsp_transport;
        }else
        if((input.type==='mp4'||input.type==='mjpeg')&&x.cust_input.indexOf('-re')===-1){
            x.cust_input += ' -re'
        }
        //hardware acceleration
        if(input.accelerator&&input.accelerator==='1'){
            if(input.hwaccel&&input.hwaccel!==''){
                x.hwaccel+=' -hwaccel '+input.hwaccel;
            }
            if(input.hwaccel_vcodec&&input.hwaccel_vcodec!==''&&input.hwaccel_vcodec!=='auto'&&input.hwaccel_vcodec!=='no'){
                x.hwaccel+=' -c:v '+input.hwaccel_vcodec;
            }
            if(input.hwaccel_device&&input.hwaccel_device!==''){
                switch(input.hwaccel){
                    case'vaapi':
                        x.hwaccel+=' -vaapi_device '+input.hwaccel_device+' -hwaccel_output_format vaapi';
                    break;
                    default:
                        x.hwaccel+=' -hwaccel_device '+input.hwaccel_device;
                    break;
                }
            }
        }
        //custom - input flags
        return x.hwaccel+x.cust_input+' -i "'+input.fulladdress+'"';
    }
    //create sub stream channel
    var createStreamChannel = function(number,channel){
        //`x` is an object used to contain temporary values.
        var x = {
            pipe:''
        }
        if(!number||number==''){
            x.channel_sdir = e.sdir;
        }else{
            x.channel_sdir = e.sdir+'channel'+number+'/';
            if (!fs.existsSync(x.channel_sdir)){
                fs.mkdirSync(x.channel_sdir);
            }
        }
        x.stream_video_filters=[]
        //stream - frames per second
        if(channel.stream_vcodec!=='copy'){
            if(!channel.stream_fps||channel.stream_fps===''){
                switch(channel.stream_type){
                    case'rtmp':
                        channel.stream_fps=30
                    break;
                    default:
//                        channel.stream_fps=5
                    break;
                }
            }
        }
        if(channel.stream_fps&&channel.stream_fps!==''){x.stream_fps=' -r '+channel.stream_fps}else{x.stream_fps=''}

        //stream - hls vcodec
        if(channel.stream_vcodec&&channel.stream_vcodec!=='no'){
            if(channel.stream_vcodec!==''){x.stream_vcodec=' -c:v '+channel.stream_vcodec}else{x.stream_vcodec=' -c:v libx264'}
        }else{
            x.stream_vcodec='';
        }
        //stream - hls acodec
        if(channel.stream_acodec!=='no'){
        if(channel.stream_acodec&&channel.stream_acodec!==''){x.stream_acodec=' -c:a '+channel.stream_acodec}else{x.stream_acodec=''}
        }else{
            x.stream_acodec=' -an';
        }
        //stream - resolution
        if(channel.stream_scale_x&&channel.stream_scale_x!==''&&channel.stream_scale_y&&channel.stream_scale_y!==''){
            x.dimensions = channel.stream_scale_x+'x'+channel.stream_scale_y;
        }
        //stream - hls segment time
        if(channel.hls_time&&channel.hls_time!==''){x.hls_time=channel.hls_time}else{x.hls_time="2"}
        //hls list size
        if(channel.hls_list_size&&channel.hls_list_size!==''){x.hls_list_size=channel.hls_list_size}else{x.hls_list_size=2}
        //stream - custom flags
        if(channel.cust_stream&&channel.cust_stream!==''){x.cust_stream=' '+channel.cust_stream}else{x.cust_stream=''}
        //stream - preset
        if(channel.preset_stream&&channel.preset_stream!==''){x.preset_stream=' -preset '+channel.preset_stream;}else{x.preset_stream=''}
        //hardware acceleration
        if(e.details.accelerator&&e.details.accelerator==='1'){
            if(e.details.hwaccel&&e.details.hwaccel!==''){
                x.hwaccel+=' -hwaccel '+e.details.hwaccel;
            }
            if(e.details.hwaccel_vcodec&&e.details.hwaccel_vcodec!==''){
                x.hwaccel+=' -c:v '+e.details.hwaccel_vcodec;
            }
            if(e.details.hwaccel_device&&e.details.hwaccel_device!==''){
                switch(e.details.hwaccel){
                    case'vaapi':
                        x.hwaccel+=' -vaapi_device '+e.details.hwaccel_device+' -hwaccel_output_format vaapi';
                    break;
                    default:
                        x.hwaccel+=' -hwaccel_device '+e.details.hwaccel_device;
                    break;
                }
            }
    //        else{
    //            if(e.details.hwaccel==='vaapi'){
    //                x.hwaccel+=' -hwaccel_device 0';
    //            }
    //        }
        }

        if(channel.rotate_stream&&channel.rotate_stream!==""&&channel.rotate_stream!=="no"){
            x.stream_video_filters.push('transpose='+channel.rotate_stream);
        }
        //stream - video filter
        if(channel.svf&&channel.svf!==''){
            x.stream_video_filters.push(channel.svf)
        }
        if(x.stream_video_filters.length>0){
            var string = x.stream_video_filters.join(',').trim()
            if(string===''){
                x.stream_video_filters=''
            }else{
                x.stream_video_filters=' -vf '+string
            }
        }else{
            x.stream_video_filters=''
        }
        if(e.details.input_map_choices&&e.details.input_map_choices.record){
            //add input feed map
            x.pipe += createFFmpegMap(e.details.input_map_choices['stream_channel-'+(number-config.pipeAddition)])
        }
        if(channel.stream_vcodec!=='copy'){
            x.cust_stream+=x.stream_fps
        }
        switch(channel.stream_type){
            case'mp4':
                x.cust_stream+=' -movflags +frag_keyframe+empty_moov+default_base_moof -metadata title="Poseidon Stream" -reset_timestamps 1'
                if(channel.stream_vcodec!=='copy'){
                    if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                    if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -crf '+channel.stream_quality;
                    x.cust_stream+=x.preset_stream
                    x.cust_stream+=x.stream_video_filters
                }
                x.pipe+=' -f mp4'+x.stream_acodec+x.stream_vcodec+x.cust_stream+' pipe:'+number;
            break;
            case'rtmp':
                x.rtmp_server_url=s.checkCorrectPathEnding(channel.rtmp_server_url);
                if(channel.stream_vcodec!=='copy'){
                    if(channel.stream_vcodec==='libx264'){
                        channel.stream_vcodec = 'h264'
                    }
                    if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -crf '+channel.stream_quality;
                    x.cust_stream+=x.preset_stream
                    if(channel.stream_v_br&&channel.stream_v_br!==''){x.cust_stream+=' -b:v '+channel.stream_v_br}
                }
                if(channel.stream_vcodec!=='no'&&channel.stream_vcodec!==''){
                    x.cust_stream+=' -vcodec '+channel.stream_vcodec
                }
                if(channel.stream_acodec!=='copy'){
                    if(!channel.stream_acodec||channel.stream_acodec===''||channel.stream_acodec==='no'){
                        channel.stream_acodec = 'aac'
                    }
                    if(!channel.stream_a_br||channel.stream_a_br===''){channel.stream_a_br='128k'}
                    x.cust_stream+=' -ab '+channel.stream_a_br
                }
                if(channel.stream_acodec!==''){
                    x.cust_stream+=' -acodec '+channel.stream_acodec
                }
                x.pipe+=' -f flv'+x.stream_video_filters+x.cust_stream+' "'+x.rtmp_server_url+channel.rtmp_stream_key+'"';
            break;
            case'h264':
                if(channel.stream_vcodec!=='copy'){
                    if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                    if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -crf '+channel.stream_quality;
                    x.cust_stream+=x.preset_stream
                    x.cust_stream+=x.stream_video_filters
                }
                x.pipe+=' -f mpegts'+x.stream_acodec+x.stream_vcodec+x.cust_stream+' pipe:'+number;
            break;
            case'flv':
                if(channel.stream_vcodec!=='copy'){
                    if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                    if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -crf '+channel.stream_quality;
                    x.cust_stream+=x.preset_stream
                    x.cust_stream+=x.stream_video_filters
                }
                x.pipe+=' -f flv'+x.stream_acodec+x.stream_vcodec+x.cust_stream+' pipe:'+number;
            break;
            case'hls':
                if(channel.stream_vcodec!=='h264_vaapi'&&channel.stream_vcodec!=='copy'){
                    if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -crf '+channel.stream_quality;
                    if(x.cust_stream.indexOf('-tune')===-1){x.cust_stream+=' -tune zerolatency'}
                    if(x.cust_stream.indexOf('-g ')===-1){x.cust_stream+=' -g 1'}
                    if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                    x.cust_stream+=x.stream_video_filters
                }
                x.pipe+=x.preset_stream+x.stream_acodec+x.stream_vcodec+' -f hls'+x.cust_stream+' -hls_time '+x.hls_time+' -hls_list_size '+x.hls_list_size+' -start_number 0 -hls_allow_cache 0 -hls_flags +delete_segments+omit_endlist "'+x.channel_sdir+'s.m3u8"';
            break;
            case'mjpeg':
                if(channel.stream_quality && channel.stream_quality !== '')x.cust_stream+=' -q:v '+channel.stream_quality;
                if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                x.pipe+=' -c:v mjpeg -f mpjpeg -boundary_tag shinobi'+x.cust_stream+x.stream_video_filters+' pipe:'+number;
            break;
            default:
                x.pipe=''
            break;
        }
        return x.pipe
    }
    //set X for temporary values so we don't break our main monitor object.
    var x={tmp:''};
    //set some placeholding values to avoid "undefined" in ffmpeg string.
    x.record_string=''
    x.cust_input=''
    x.cust_detect=' '
    x.record_video_filters=[]
    x.stream_video_filters=[]
    x.hwaccel=''
    x.pipe=''
    //input - frame rate (capture rate)
    if(e.details.sfps && e.details.sfps!==''){x.input_fps=' -r '+e.details.sfps}else{x.input_fps=''}
    //input - analyze duration
    if(e.details.aduration&&e.details.aduration!==''){x.cust_input+=' -analyzeduration '+e.details.aduration};
    //input - probe size
    if(e.details.probesize&&e.details.probesize!==''){x.cust_input+=' -probesize '+e.details.probesize};
    //input - stream loop (good for static files/lists)
    if(e.details.stream_loop==='1'){x.cust_input+=' -stream_loop -1'};
    //input
    switch(e.type){
        case'h264':
            switch(e.protocol){
                case'rtsp':
                    if(e.details.cust_input.indexOf('-fflags') === -1){x.cust_input+=' -fflags +igndts'}
                    if(e.details.rtsp_transport&&e.details.rtsp_transport!==''&&e.details.rtsp_transport!=='no'){x.cust_input+=' -rtsp_transport '+e.details.rtsp_transport;}
                break;
            }
        break;
    }
    //record - resolution
    if(e.width!==''&&e.height!==''&&!isNaN(e.width)&&!isNaN(e.height)){
        x.record_dimensions=' -s '+e.width+'x'+e.height
    }else{
        x.record_dimensions=''
    }
    if(e.details.stream_scale_x&&e.details.stream_scale_x!==''&&e.details.stream_scale_y&&e.details.stream_scale_y!==''){
        x.dimensions = e.details.stream_scale_x+'x'+e.details.stream_scale_y;
    }
    //record - segmenting
    x.segment=' -f segment -segment_atclocktime 1 -reset_timestamps 1 -strftime 1 -segment_list pipe:2 -segment_time '+(60*e.cutoff)+' "'+e.dir+'%Y-%m-%dT%H-%M-%S.'+e.ext+'"';
    //record - set defaults for extension, video quality
    switch(e.ext){
        case'mp4':
            x.vcodec='libx264';x.acodec='aac';
            if(e.details.crf&&e.details.crf!==''){x.vcodec+=' -crf '+e.details.crf}
        break;
        case'webm':
            x.acodec='libvorbis',x.vcodec='libvpx';
            if(e.details.crf&&e.details.crf!==''){x.vcodec+=' -q:v '+e.details.crf}else{x.vcodec+=' -q:v 1';}
        break;
    }
    if(e.details.vcodec==='h264_vaapi'){
       x.record_video_filters.push('format=nv12,hwupload');
    }
    //record - use custom video codec
    if(e.details.vcodec&&e.details.vcodec!==''&&e.details.vcodec!=='default'){x.vcodec=e.details.vcodec}
    //record - use custom audio codec
    if(e.details.acodec&&e.details.acodec!==''&&e.details.acodec!=='default'){x.acodec=e.details.acodec}
    if(e.details.cust_record){
        if(x.acodec=='aac'&&e.details.cust_record.indexOf('-strict -2')===-1){e.details.cust_record+=' -strict -2';}
        if(e.details.cust_record.indexOf('-threads')===-1){e.details.cust_record+=' -threads 1';}
    }
//    if(e.details.cust_input&&(e.details.cust_input.indexOf('-use_wallclock_as_timestamps 1')>-1)===false){e.details.cust_input+=' -use_wallclock_as_timestamps 1';}
    //record - ready or reset codecs
    if(x.acodec!=='no'){
        if(x.acodec.indexOf('none')>-1){x.acodec=''}else{x.acodec=' -acodec '+x.acodec}
    }else{
        x.acodec=' -an'
    }
    if(x.vcodec.indexOf('none')>-1){x.vcodec=''}else{x.vcodec=' -vcodec '+x.vcodec}
    //record - frames per second (fps)
    if(e.fps&&e.fps!==''&&e.details.vcodec!=='copy'){x.record_fps=' -r '+e.fps}else{x.record_fps=''}
    //stream - frames per second (fps)
    if(e.details.stream_fps&&e.details.stream_fps!==''){x.stream_fps=' -r '+e.details.stream_fps}else{x.stream_fps=''}
    //record - timestamp options for -vf
    if(e.details.timestamp&&e.details.timestamp=="1"&&e.details.vcodec!=='copy'){
        //font
        if(e.details.timestamp_font&&e.details.timestamp_font!==''){x.time_font=e.details.timestamp_font}else{x.time_font='/usr/share/fonts/truetype/freefont/FreeSans.ttf'}
        //position x
        if(e.details.timestamp_x&&e.details.timestamp_x!==''){x.timex=e.details.timestamp_x}else{x.timex='(w-tw)/2'}
        //position y
        if(e.details.timestamp_y&&e.details.timestamp_y!==''){x.timey=e.details.timestamp_y}else{x.timey='0'}
        //text color
        if(e.details.timestamp_color&&e.details.timestamp_color!==''){x.time_color=e.details.timestamp_color}else{x.time_color='white'}
        //box color
        if(e.details.timestamp_box_color&&e.details.timestamp_box_color!==''){x.time_box_color=e.details.timestamp_box_color}else{x.time_box_color='0x00000000@1'}
        //text size
        if(e.details.timestamp_font_size&&e.details.timestamp_font_size!==''){x.time_font_size=e.details.timestamp_font_size}else{x.time_font_size='10'}

        x.record_video_filters.push('drawtext=fontfile='+x.time_font+':text=\'%{localtime}\':x='+x.timex+':y='+x.timey+':fontcolor='+x.time_color+':box=1:boxcolor='+x.time_box_color+':fontsize='+x.time_font_size);
    }
    //record - watermark for -vf
    if(e.details.watermark&&e.details.watermark=="1"&&e.details.watermark_location&&e.details.watermark_location!==''){
        switch(e.details.watermark_position){
            case'tl'://top left
                x.watermark_position='10:10'
            break;
            case'tr'://top right
                x.watermark_position='main_w-overlay_w-10:10'
            break;
            case'bl'://bottom left
                x.watermark_position='10:main_h-overlay_h-10'
            break;
            default://bottom right
                x.watermark_position='(main_w-overlay_w-10)/2:(main_h-overlay_h-10)/2'
            break;
        }
        x.record_video_filters.push('movie='+e.details.watermark_location+'[watermark],[in][watermark]overlay='+x.watermark_position+'[out]');
    }
    //record - rotation
    if(e.details.rotate_record&&e.details.rotate_record!==""&&e.details.rotate_record!=="no"&&e.details.stream_vcodec!=="copy"){
        x.record_video_filters.push('transpose='+e.details.rotate_record);
    }
    //check custom record filters for -vf
    if(e.details.vf&&e.details.vf!==''){
        x.record_video_filters.push(e.details.vf)
    }
    //compile filter string for -vf
    if(x.record_video_filters.length>0){
       x.record_video_filters=' -vf '+x.record_video_filters.join(',')
    }else{
        x.record_video_filters=''
    }
    //stream - timestamp
    if(e.details.stream_timestamp&&e.details.stream_timestamp=="1"&&e.details.vcodec!=='copy'){
        //font
        if(e.details.stream_timestamp_font&&e.details.stream_timestamp_font!==''){x.stream_timestamp_font=e.details.stream_timestamp_font}else{x.stream_timestamp_font='/usr/share/fonts/truetype/freefont/FreeSans.ttf'}
        //position x
        if(e.details.stream_timestamp_x&&e.details.stream_timestamp_x!==''){x.stream_timestamp_x=e.details.stream_timestamp_x}else{x.stream_timestamp_x='(w-tw)/2'}
        //position y
        if(e.details.stream_timestamp_y&&e.details.stream_timestamp_y!==''){x.stream_timestamp_y=e.details.stream_timestamp_y}else{x.stream_timestamp_y='0'}
        //text color
        if(e.details.stream_timestamp_color&&e.details.stream_timestamp_color!==''){x.stream_timestamp_color=e.details.stream_timestamp_color}else{x.stream_timestamp_color='white'}
        //box color
        if(e.details.stream_timestamp_box_color&&e.details.stream_timestamp_box_color!==''){x.stream_timestamp_box_color=e.details.stream_timestamp_box_color}else{x.stream_timestamp_box_color='0x00000000@1'}
        //text size
        if(e.details.stream_timestamp_font_size&&e.details.stream_timestamp_font_size!==''){x.stream_timestamp_font_size=e.details.stream_timestamp_font_size}else{x.stream_timestamp_font_size='10'}

        x.stream_video_filters.push('drawtext=fontfile='+x.stream_timestamp_font+':text=\'%{localtime}\':x='+x.stream_timestamp_x+':y='+x.stream_timestamp_y+':fontcolor='+x.stream_timestamp_color+':box=1:boxcolor='+x.stream_timestamp_box_color+':fontsize='+x.stream_timestamp_font_size);
    }
    //stream - watermark for -vf
    if(e.details.stream_watermark&&e.details.stream_watermark=="1"&&e.details.stream_watermark_location&&e.details.stream_watermark_location!==''){
        switch(e.details.stream_watermark_position){
            case'tl'://top left
                x.stream_watermark_position='10:10'
            break;
            case'tr'://top right
                x.stream_watermark_position='main_w-overlay_w-10:10'
            break;
            case'bl'://bottom left
                x.stream_watermark_position='10:main_h-overlay_h-10'
            break;
            default://bottom right
                x.stream_watermark_position='(main_w-overlay_w-10)/2:(main_h-overlay_h-10)/2'
            break;
        }
        x.stream_video_filters.push('movie='+e.details.stream_watermark_location+'[watermark],[in][watermark]overlay='+x.stream_watermark_position+'[out]');
    }
    //stream - rotation
    if(e.details.rotate_stream&&e.details.rotate_stream!==""&&e.details.rotate_stream!=="no"&&e.details.stream_vcodec!=='copy'){
        x.stream_video_filters.push('transpose='+e.details.rotate_stream);
    }
    //stream - hls vcodec
    if(e.details.stream_vcodec&&e.details.stream_vcodec!=='no'){
        if(e.details.stream_vcodec!==''){x.stream_vcodec=' -c:v '+e.details.stream_vcodec}else{x.stream_vcodec=' -c:v libx264'}
    }else{
        x.stream_vcodec='';
    }
    //stream - hls acodec
    if(e.details.stream_acodec!=='no'){
    if(e.details.stream_acodec&&e.details.stream_acodec!==''){x.stream_acodec=' -c:a '+e.details.stream_acodec}else{x.stream_acodec=''}
    }else{
        x.stream_acodec=' -an';
    }
    //stream - hls segment time
    if(e.details.hls_time&&e.details.hls_time!==''){x.hls_time=e.details.hls_time}else{x.hls_time="2"}    //hls list size
    if(e.details.hls_list_size&&e.details.hls_list_size!==''){x.hls_list_size=e.details.hls_list_size}else{x.hls_list_size=2}
    //stream - custom flags
    if(e.details.cust_stream&&e.details.cust_stream!==''){x.cust_stream=' '+e.details.cust_stream}else{x.cust_stream=''}
    //stream - preset
    if(e.details.preset_stream&&e.details.preset_stream!==''){x.preset_stream=' -preset '+e.details.preset_stream;}else{x.preset_stream=''}
    //stream - quality
    //hardware acceleration
    if(e.details.accelerator&&e.details.accelerator==='1'){
        if(e.details.hwaccel&&e.details.hwaccel!==''){
            x.hwaccel+=' -hwaccel '+e.details.hwaccel;
        }
        if(e.details.hwaccel_vcodec&&e.details.hwaccel_vcodec!==''){
            x.hwaccel+=' -c:v '+e.details.hwaccel_vcodec;
        }
        if(e.details.hwaccel_device&&e.details.hwaccel_device!==''){
            switch(e.details.hwaccel){
                case'vaapi':
                    x.hwaccel+=' -vaapi_device '+e.details.hwaccel_device;
                break;
                default:
                    x.hwaccel+=' -hwaccel_device '+e.details.hwaccel_device;
                break;
            }
        }
//        else{
//            if(e.details.hwaccel==='vaapi'){
//                x.hwaccel+=' -hwaccel_device 0';
//            }
//        }
    }
    if(e.details.stream_vcodec==='h264_vaapi'){
        x.stream_video_filters=[]
        x.stream_video_filters.push('format=nv12,hwupload');
        if(e.details.stream_scale_x&&e.details.stream_scale_x!==''&&e.details.stream_scale_y&&e.details.stream_scale_y!==''){
            x.stream_video_filters.push('scale_vaapi=w='+e.details.stream_scale_x+':h='+e.details.stream_scale_y)
        }
	}
    //stream - video filter
    if(e.details.svf&&e.details.svf!==''){
        x.stream_video_filters.push(e.details.svf)
    }
    if(x.stream_video_filters.length>0){
        x.stream_video_filters=' -vf '+x.stream_video_filters.join(',')
    }else{
        x.stream_video_filters=''
    }
    //stream - pipe build
    if(e.details.input_map_choices&&e.details.input_map_choices.stream){
        //add input feed map
        x.pipe += createFFmpegMap(e.details.input_map_choices.stream)
    }
    if(e.details.stream_vcodec!=='copy'){
        x.cust_stream+=x.stream_fps
    }
    switch(e.details.stream_type){
        case'mp4':
            x.cust_stream+=' -movflags +frag_keyframe+empty_moov+default_base_moof -metadata title="Poseidon Stream" -reset_timestamps 1'
            if(e.details.stream_vcodec!=='copy'){
                if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -crf '+e.details.stream_quality;
                x.cust_stream+=x.preset_stream
                x.cust_stream+=x.stream_video_filters
            }
            x.pipe+=' -f mp4'+x.stream_acodec+x.stream_vcodec+x.cust_stream+' pipe:1';
        break;
        case'flv':
            if(e.details.stream_vcodec!=='copy'){
                if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -crf '+e.details.stream_quality;
                x.cust_stream+=x.preset_stream
                x.cust_stream+=x.stream_video_filters
            }
            x.pipe+=' -f flv'+x.stream_acodec+x.stream_vcodec+x.cust_stream+' pipe:1';
        break;
        case'hls':
            if(e.details.stream_vcodec!=='h264_vaapi'&&e.details.stream_vcodec!=='copy'){
                if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -crf '+e.details.stream_quality;
                if(x.cust_stream.indexOf('-tune')===-1){x.cust_stream+=' -tune zerolatency'}
                if(x.cust_stream.indexOf('-g ')===-1){x.cust_stream+=' -g 1'}
                if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
                x.cust_stream+=x.stream_video_filters
            }
            x.pipe+=x.preset_stream+x.stream_acodec+x.stream_vcodec+' -f hls'+x.cust_stream+' -hls_time '+x.hls_time+' -hls_list_size '+x.hls_list_size+' -start_number 0 -hls_allow_cache 0 -hls_flags +delete_segments+omit_endlist "'+e.sdir+'s.m3u8"';
        break;
        case'mjpeg':
            if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -q:v '+e.details.stream_quality;
            if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
            x.pipe+=' -an -c:v mjpeg -f mpjpeg -boundary_tag shinobi'+x.cust_stream+x.stream_video_filters+' pipe:1';
        break;
        case'pam':
            if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
            if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -q:v '+e.details.stream_quality;
            x.pipe+=' -an -c:v pam -pix_fmt rgba -f image2pipe'+x.cust_stream+x.stream_video_filters+' pipe:1';
        break;
        case'b64':case'':case undefined:case null://base64
            if(e.details.stream_quality && e.details.stream_quality !== '')x.cust_stream+=' -q:v '+e.details.stream_quality;
            if(x.dimensions && x.cust_stream.indexOf('-s ')===-1){x.cust_stream+=' -s '+x.dimensions}
            x.pipe+=' -an -c:v mjpeg -f image2pipe'+x.cust_stream+x.stream_video_filters+' pipe:1';
        break;
        default:
            x.pipe=''
        break;
    }
    if(e.details.stream_channels){
        e.details.stream_channels.forEach(function(v,n){
            x.pipe+=createStreamChannel(n+config.pipeAddition,v)
        })
    }
    //detector - plugins, motion
    if(e.details.detector==='1'&&e.details.detector_send_frames==='1'){
        if(e.details.input_map_choices&&e.details.input_map_choices.detector){
            //add input feed map
            x.pipe += createFFmpegMap(e.details.input_map_choices.detector)
        }
        if(!e.details.detector_fps||e.details.detector_fps===''){e.details.detector_fps=2}
        if(e.details.detector_scale_x&&e.details.detector_scale_x!==''&&e.details.detector_scale_y&&e.details.detector_scale_y!==''){x.dratio=' -s '+e.details.detector_scale_x+'x'+e.details.detector_scale_y}else{x.dratio=' -s 320x240'}
        if(e.details.cust_detect&&e.details.cust_detect!==''){x.cust_detect+=e.details.cust_detect;}
        if(e.details.detector_pam==='1'){
            x.pipe+=' -an -c:v pam -pix_fmt gray -f image2pipe -vf fps='+e.details.detector_fps+x.cust_detect+x.dratio+' pipe:3'
            if(e.details.detector_use_detect_object === '1'){
                //for object detection
                x.pipe += createFFmpegMap(e.details.input_map_choices.detector)
                x.pipe += ' -f singlejpeg -vf fps='+e.details.detector_fps+x.cust_detect+x.dratio+' pipe:4';
            }
        }else{
            x.pipe+=' -f singlejpeg -vf fps='+e.details.detector_fps+x.cust_detect+x.dratio+' pipe:3';
        }
    }
    //api - snapshot bin/ cgi.bin (JPEG Mode)
    if(e.details.snap==='1'){
        if(e.details.input_map_choices&&e.details.input_map_choices.snap){
            //add input feed map
            x.pipe += createFFmpegMap(e.details.input_map_choices.snap)
        }
        if(!e.details.snap_fps||e.details.snap_fps===''){e.details.snap_fps=1}
        if(e.details.snap_vf&&e.details.snap_vf!==''){x.snap_vf=' -vf '+e.details.snap_vf}else{x.snap_vf=''}
        if(e.details.snap_scale_x&&e.details.snap_scale_x!==''&&e.details.snap_scale_y&&e.details.snap_scale_y!==''){x.snap_ratio=' -s '+e.details.snap_scale_x+'x'+e.details.snap_scale_y}else{x.snap_ratio=''}
        if(e.details.cust_snap&&e.details.cust_snap!==''){x.cust_snap=' '+e.details.cust_snap;}else{x.cust_snap=''}
        x.pipe+=' -update 1 -r '+e.details.snap_fps+x.cust_snap+x.snap_ratio+x.snap_vf+' "'+e.sdir+'s.jpg" -y';
    }
    //Traditional Recording Buffer
    if(e.details.detector=='1'&&e.details.detector_trigger=='1'&&e.details.detector_record_method==='sip'){
        if(e.details.input_map_choices&&e.details.input_map_choices.detector_sip_buffer){
            //add input feed map
            x.pipe += createFFmpegMap(e.details.input_map_choices.detector_sip_buffer)
        }
        x.detector_buffer_filters=[]
        if(!e.details.detector_buffer_vcodec||e.details.detector_buffer_vcodec===''||e.details.detector_buffer_vcodec==='auto'){
            switch(e.type){
                case'h264':case'hls':case'mp4':
                    e.details.detector_buffer_vcodec = 'copy'
                break;
                default:
                    e.details.detector_buffer_vcodec = 'libx264'
                break;
            }
        }
        if(!e.details.detector_buffer_acodec||e.details.detector_buffer_acodec===''||e.details.detector_buffer_acodec==='auto'){
            switch(e.type){
                case'h264':case'hls':case'mp4':
                    e.details.detector_buffer_acodec = 'copy'
                break;
                default:
                    e.details.detector_buffer_acodec = 'aac'
                break;
            }
        }
        if(e.details.detector_buffer_acodec === 'no'){
            x.detector_buffer_acodec = ' -an'
        }else{
            x.detector_buffer_acodec = ' -c:a '+e.details.detector_buffer_acodec
        }
        if(!e.details.detector_buffer_tune||e.details.detector_buffer_tune===''){e.details.detector_buffer_tune='zerolatency'}
        if(!e.details.detector_buffer_g||e.details.detector_buffer_g===''){e.details.detector_buffer_g='1'}
        if(!e.details.detector_buffer_hls_time||e.details.detector_buffer_hls_time===''){e.details.detector_buffer_hls_time='2'}
        if(!e.details.detector_buffer_hls_list_size||e.details.detector_buffer_hls_list_size===''){e.details.detector_buffer_hls_list_size='4'}
        if(!e.details.detector_buffer_start_number||e.details.detector_buffer_start_number===''){e.details.detector_buffer_start_number='0'}
        if(!e.details.detector_buffer_live_start_index||e.details.detector_buffer_live_start_index===''){e.details.detector_buffer_live_start_index='-3'}

        if(e.details.detector_buffer_vcodec.indexOf('_vaapi')>-1){
            if(x.hwaccel.indexOf('-vaapi_device')>-1){
                x.detector_buffer_filters.push('format=nv12')
                x.detector_buffer_filters.push('hwupload')
            }else{
                e.details.detector_buffer_vcodec='libx264'
            }
        }
        if(e.details.detector_buffer_vcodec!=='copy'){
            if(e.details.detector_buffer_fps&&e.details.detector_buffer_fps!==''){
                x.detector_buffer_fps=' -r '+e.details.detector_buffer_fps
            }else{
                x.detector_buffer_fps=' -r 30'
            }
        }else{
            x.detector_buffer_fps=''
        }
        if(x.detector_buffer_filters.length>0){
            x.pipe+=' -vf '+x.detector_buffer_filters.join(',')
        }
        x.pipe+=x.detector_buffer_fps+x.detector_buffer_acodec+' -c:v '+e.details.detector_buffer_vcodec+' -f hls -tune '+e.details.detector_buffer_tune+' -g '+e.details.detector_buffer_g+' -hls_time '+e.details.detector_buffer_hls_time+' -hls_list_size '+e.details.detector_buffer_hls_list_size+' -start_number '+e.details.detector_buffer_start_number+' -live_start_index '+e.details.detector_buffer_live_start_index+' -hls_allow_cache 0 -hls_flags +delete_segments+omit_endlist "'+e.sdir+'detectorStream.m3u8"'
    }
    //custom - output
    if(e.details.custom_output&&e.details.custom_output!==''){x.pipe+=' '+e.details.custom_output;}
    //custom - input flags
    if(e.details.cust_input&&e.details.cust_input!==''){x.cust_input+=' '+e.details.cust_input;}
    //logging - level
    if(e.details.loglevel&&e.details.loglevel!==''){x.loglevel='-loglevel '+e.details.loglevel;}else{x.loglevel='-loglevel error'}
    //build record string.
    if(e.mode==='record'){
        if(e.details.input_map_choices&&e.details.input_map_choices.record){
            //add input feed map
            x.record_string += createFFmpegMap(e.details.input_map_choices.record)
        }
        //if h264, hls, mp4, or local add the audio codec flag
        switch(e.type){
            case'h264':case'hls':case'mp4':case'local':
                x.record_string+=x.acodec;
            break;
        }
        //custom flags
        if(e.details.cust_record&&e.details.cust_record!==''){x.record_string+=' '+e.details.cust_record;}
        //preset flag
        if(e.details.preset_record&&e.details.preset_record!==''){x.record_string+=' -preset '+e.details.preset_record;}
        //main string write
        x.record_string+=x.vcodec+x.record_fps+x.record_video_filters+x.record_dimensions+x.segment;
    }
    //create executeable FFMPEG command
    x.ffmpegCommandString = x.loglevel+x.input_fps;
    //progress pipe
//    x.ffmpegCommandString += ' -progress pipe:5';
    //add main input
    if((e.type==='mp4'||e.type==='mjpeg')&&x.cust_input.indexOf('-re')===-1){
        x.cust_input += ' -re'
    }
    switch(e.type){
        case'dashcam':
            x.ffmpegCommandString += ' -i -';
        break;
        case'socket':case'jpeg':case'pipe':
            x.ffmpegCommandString += ' -pattern_type glob -f image2pipe'+x.record_fps+' -vcodec mjpeg'+x.cust_input+' -i -';
        break;
        case'mjpeg':
            x.ffmpegCommandString += ' -reconnect 1 -f mjpeg'+x.cust_input+' -i "'+e.url+'"';
        break;
        case'h264':case'hls':case'mp4':
            x.ffmpegCommandString += x.cust_input+x.hwaccel+' -i "'+e.url+'"';
        break;
        case'local':
            x.ffmpegCommandString += x.cust_input+' -i "'+e.path+'"';
        break;
    }
    //add extra input maps
    if(e.details.input_maps){
        e.details.input_maps.forEach(function(v,n){
            x.ffmpegCommandString += createInputMap(n+1,v)
        })
    }
    //add recording and stream outputs
    x.ffmpegCommandString += x.record_string+x.pipe
    //hold ffmpeg command for log stream
    s.group[e.ke].mon[e.mid].ffmpeg = x.ffmpegCommandString;
    //create additional pipes from ffmpeg
    x.stdioPipes = [];
    var times = config.pipeAddition;
    if(e.details.stream_channels){
        times+=e.details.stream_channels.length
    }
    for(var i=0; i < times; i++){
        x.stdioPipes.push('pipe')
    }
    x.ffmpegCommandString = s.splitForFFPMEG(x.ffmpegCommandString.replace(/\s+/g,' ').trim())
    return spawn(config.ffmpegDir,x.ffmpegCommandString,{detached: true,stdio:x.stdioPipes});
}
s.file=function(x,e){
    if(!e){e={}};
    switch(x){
        case'size':
             return fs.statSync(e.filename)["size"];
        break;
        case'delete':
            if(!e){return false;}
            return exec('rm -f '+e,{detached: true});
        break;
        case'delete_folder':
            if(!e){return false;}
            return exec('rm -rf '+e,{detached: true});
        break;
        case'delete_files':
            if(!e.age_type){e.age_type='min'};if(!e.age){e.age='1'};
            exec('find '+e.path+' -type f -c'+e.age_type+' +'+e.age+' -exec rm -f {} +',{detached: true});
        break;
    }
}
s.camera=function(x,e,cn,tx){
    if(x!=='motion'){
        var ee=s.init('noReference',e);
        if(!e){e={}};if(cn&&cn.ke&&!e.ke){e.ke=cn.ke};
        if(!e.mode){e.mode=x;}
        if(!e.id&&e.mid){e.id=e.mid}
    }
    if(e.details&&(e.details instanceof Object)===false){
        try{e.details=JSON.parse(e.details)}catch(err){}
    }
    //parse Objects
    (['detector_cascades','cords','input_map_choices']).forEach(function(v){
        if(e.details&&e.details[v]&&(e.details[v] instanceof Object)===false){
            try{
                if(e.details[v] === '') e.details[v] = '{}'
                e.details[v]=JSON.parse(e.details[v]);
                if(!e.details[v])e.details[v]={};
            }catch(err){
                
            }
        }
    });
    //parse Arrays
    (['stream_channels','input_maps']).forEach(function(v){
        if(e.details&&e.details[v]&&(e.details[v] instanceof Array)===false){
            try{
                e.details[v]=JSON.parse(e.details[v]);
                if(!e.details[v])e.details[v]=[];
            }catch(err){
                e.details[v]=[];
            }
        }
    });
    s.init(0,{ke:e.ke,mid:e.id})
    switch(x){
        case'buildOptionsFromUrl':
            var monitorConfig = cn
            URLobject=URL.parse(e)
            if(monitorConfig.details.control_url_method === 'ONVIF' && monitorConfig.details.control_base_url === ''){
                URLobject.port = 8000
            }else if(!URLobject.port){
                URLobject.port = 80
            }
            options = {
                host: URLobject.hostname,
                port: URLobject.port,
                method: monitorConfig.details.control_url_method,
                path: URLobject.pathname,
            };
            if(URLobject.query){
                options.path=options.path+'?'+URLobject.query
            }
            if(URLobject.username&&URLobject.password){
                options.username = URLobject.username
                options.password = URLobject.password
                options.auth=URLobject.username+':'+URLobject.password
            }else if(URLobject.auth){
                var auth = URLobject.auth.split(':')
                options.auth=URLobject.auth
                options.username = auth[0]
                options.password = auth[1]
            }
            return options
        break;
        case'control':
            if(!s.group[e.ke]||!s.group[e.ke].mon[e.id]){return}
            var monitorConfig = s.group[e.ke].mon_conf[e.id];
            if(monitorConfig.details.control!=="1"){s.log(e,{type:lang['Control Error'],msg:lang.ControlErrorText1});return}
            if(!monitorConfig.details.control_base_url||monitorConfig.details.control_base_url===''){
                e.base=s.init('url_no_path',monitorConfig);
            }else{
                e.base=monitorConfig.details.control_base_url;
            }
            if(!monitorConfig.details.control_url_stop_timeout || monitorConfig.details.control_url_stop_timeout === ''){
                monitorConfig.details.control_url_stop_timeout = 1000
            }
            if(!monitorConfig.details.control_url_method||monitorConfig.details.control_url_method===''){monitorConfig.details.control_url_method="GET"}
            var controlURL = e.base+monitorConfig.details['control_url_'+e.direction]
            var controlURLOptions = s.camera('buildOptionsFromUrl',controlURL,monitorConfig)
            if(monitorConfig.details.control_url_stop_timeout === '0' && monitorConfig.details.control_stop === '1' && s.group[e.ke].mon[e.id].ptzMoving === true){
                e.direction = 'stopMove'
                s.group[e.ke].mon[e.id].ptzMoving = false
            }else{
                s.group[e.ke].mon[e.id].ptzMoving = true
            }
            if(monitorConfig.details.control_url_method === 'ONVIF'){
                try{
                    var move = function(device){
                        var stopOptions = {ProfileToken : device.current_profile.token,'PanTilt': true,'Zoom': true}
                        switch(e.direction){
                            case'center':
//                                device.services.ptz.gotoHomePosition()
                                msg = {type:'Center button inactive'}
                                s.log(e,msg)
                                cn(msg)
                            break;
                            case'stopMove':
                                msg = {type:'Control Trigger Ended'}
                                s.log(e,msg)
                                cn(msg)
                                device.services.ptz.stop(stopOptions).then((result) => {
//                                    console.log(JSON.stringify(result['data'], null, '  '));
                                }).catch((error) => {
//                                    console.error(error);
                                });
                            break;
                            default:
                                var controlOptions = {
                                    ProfileToken : device.current_profile.token,
                                    Velocity : {}
                                }
                                var onvifDirections = {
                                    "left" : [-1.0,'x'],
                                    "right" : [1.0,'x'],
                                    "down" : [-1.0,'y'],
                                    "up" : [1.0,'y'],
                                    "zoom_in" : [1.0,'zoom'],
                                    "zoom_out" : [-1.0,'zoom']
                                }
                                var direction = onvifDirections[e.direction]
                                controlOptions.Velocity[direction[1]] = direction[0];
                                (['x','y','z']).forEach(function(axis){
                                    if(!controlOptions.Velocity[axis])
                                        controlOptions.Velocity[axis] = 0
                                })
                                if(monitorConfig.details.control_stop=='1'){
                                    device.services.ptz.continuousMove(controlOptions).then(function(err){
                                        s.log(e,{type:'Control Trigger Started'});
                                        if(monitorConfig.details.control_url_stop_timeout !== '0'){
                                            setTimeout(function(){
                                                msg = {type:'Control Trigger Ended'}
                                                s.log(e,msg)
                                                cn(msg)
                                                device.services.ptz.stop(stopOptions).then((result) => {
//                                                    console.log(JSON.stringify(result['data'], null, '  '));
                                                }).catch((error) => {
                                                    console.log(error);
                                                });
                                            },monitorConfig.details.control_url_stop_timeout)
                                        }
                                    }).catch(function(err){
                                        console.log(err)
                                    });
                                }else{
                                    device.services.ptz.absoluteMove(controlOptions).then(function(err){
                                        msg = {type:'Control Triggered'}
                                        s.log(e,msg);
                                        cn(msg)
                                    }).catch(function(err){
                                        console.log(err)
                                    });
                                }
                            break;
                        }
                    }
                    //create onvif connection
                    if(!s.group[e.ke].mon[e.id].onvifConnection){
                        s.group[e.ke].mon[e.id].onvifConnection = new onvif.OnvifDevice({
                            xaddr : 'http://' + controlURLOptions.host + ':' + controlURLOptions.port + '/onvif/device_service',
                            user : controlURLOptions.username,
                            pass : controlURLOptions.password
                        })
                        s.group[e.ke].mon[e.id].onvifConnection.init().then((info) => {
                            move(s.group[e.ke].mon[e.id].onvifConnection)
                        }).catch(function(error){
                            console.log(error)
                            s.log(e,{type:lang['Control Error'],msg:error})
                        })
                    }else{
                        move(s.group[e.ke].mon[e.id].onvifConnection)
                    }
                }catch(err){
                    console.log(err)
                    msg = {type:lang['Control Error'],msg:{msg:lang.ControlErrorText2,error:err,options:controlURLOptions,direction:e.direction}}
                    s.log(e,msg)
                    cn(msg)
                }
            }else{
                var stopCamera = function(){
                    var stopURL = e.base+monitorConfig.details['control_url_'+e.direction+'_stop']
                    var options = s.camera('buildOptionsFromUrl',stopURL,monitorConfig)
                    var requestOptions = {
                        url : stopURL,
                        method : options.method,
                        auth : {
                            user : options.username,
                            pass : options.password
                        }
                    }
                    if(monitorConfig.details.control_digest_auth === '1'){
                        requestOptions.sendImmediately = true
                    }
                    request(requestOptions,function(err,data){
                        if(err){
                            msg = {ok:false,type:'Control Error',msg:err}
                        }else{
                            msg = {ok:true,type:'Control Trigger Ended'}
                        }
                        cn(msg)
                        s.log(e,msg);
                    })
                }
                if(e.direction === 'stopMove'){
                    stopCamera()
                }else{
                    var requestOptions = {
                        url : controlURL,
                        method : controlURLOptions.method,
                        auth : {
                            user : controlURLOptions.username,
                            pass : controlURLOptions.password
                        }
                    }
                    if(monitorConfig.details.control_digest_auth === '1'){
                        requestOptions.sendImmediately = true
                    }
                    request(requestOptions,function(err,data){
                        if(err){
                            msg = {ok:false,type:'Control Error',msg:err};
                            cn(msg)
                            s.log(e,msg);
                            return
                        }
                        if(monitorConfig.details.control_stop=='1'&&e.direction!=='center'){
                            s.log(e,{type:'Control Triggered Started'});
                            if(monitorConfig.details.control_url_stop_timeout > 0){
                                setTimeout(function(){
                                    stopCamera()
                                },monitorConfig.details.control_url_stop_timeout)
                            }
                        }else{
                            msg = {ok:true,type:'Control Triggered'};
                            cn(msg)
                            s.log(e,msg);
                        }
                    })
                }
            }
        break;
        case'snapshot'://get snapshot from monitor URL
            if(config.doSnapshot===true){
                if(e.mon.mode!=='stop'){
                    if(e.mon.details.snap==='1'){
                        fs.readFile(s.dir.streams+e.ke+'/'+e.mid+'/s.jpg',function(err,data){
                            if(err){s.tx({f:'monitor_snapshot',snapshot:e.mon.name,snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke);return};
                            s.tx({f:'monitor_snapshot',snapshot:data,snapshot_format:'ab',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                        })
                    }else{
                        e.url=s.init('url',e.mon);
                        switch(e.mon.type){
                            case'mjpeg':case'h264':case'local':
                                if(e.mon.type==='local'){e.url=e.mon.path;}
                                e.spawn=spawn(config.ffmpegDir,('-loglevel quiet -i '+e.url+' -s 400x400 -r 25 -ss 1.8 -frames:v 1 -f singlejpeg pipe:1').split(' '),{detached: true})
                                e.spawn.stdout.on('data',function(data){
                                   e.snapshot_sent=true; s.tx({f:'monitor_snapshot',snapshot:data.toString('base64'),snapshot_format:'b64',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                                    e.spawn.kill();
                                });
                                e.spawn.on('close',function(data){
                                    if(!e.snapshot_sent){
                                        s.tx({f:'monitor_snapshot',snapshot:e.mon.name,snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                                    }
                                    delete(e.snapshot_sent);
                                });
                            break;
                            case'jpeg':
                                request({url:e.url,method:'GET',encoding:null},function(err,data){
                                    if(err){s.tx({f:'monitor_snapshot',snapshot:e.mon.name,snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke);return};
                                    s.tx({f:'monitor_snapshot',snapshot:data.body,snapshot_format:'ab',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                                })
                            break;
                            default:
                                s.tx({f:'monitor_snapshot',snapshot:'...',snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                            break;
                        }
                    }
                }else{
                    s.tx({f:'monitor_snapshot',snapshot:'Disabled',snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
                }
            }else{
                s.tx({f:'monitor_snapshot',snapshot:e.mon.name,snapshot_format:'plc',mid:e.mid,ke:e.ke},'GRP_'+e.ke)
            }
        break;
        case'record_off'://stop recording and start
            if(!s.group[e.ke].mon[e.id].record){s.group[e.ke].mon[e.id].record={}}
            s.group[e.ke].mon[e.id].record.yes=0;
            s.camera('start',e);
        break;
        case'watch_on'://live streamers - join
//            if(s.group[e.ke].mon[e.id].watch[cn.id]){s.camera('watch_off',e,cn,tx);return}
           if(!cn.monitor_watching){cn.monitor_watching={}}
           if(!cn.monitor_watching[e.id]){cn.monitor_watching[e.id]={ke:e.ke}}
           s.group[e.ke].mon[e.id].watch[cn.id]={};
//            if(Object.keys(s.group[e.ke].mon[e.id].watch).length>0){
//                s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND mid=?',[e.ke,e.id],function(err,r) {
//                    if(r&&r[0]){
//                        r=r[0];
//                        r.url=s.init('url',r);
//                        s.group[e.ke].mon.type=r.type;
//                    }
//                })
//            }
        break;
        case'watch_off'://live streamers - leave
           if(cn.monitor_watching){delete(cn.monitor_watching[e.id])}
            if(s.group[e.ke].mon[e.id]&&s.group[e.ke].mon[e.id].watch){
                delete(s.group[e.ke].mon[e.id].watch[cn.id]),e.ob=Object.keys(s.group[e.ke].mon[e.id].watch).length
                if(e.ob===0){
                   delete(s.group[e.ke].mon[e.id].watch)
                }
            }else{
                e.ob=0;
            }
            if(tx){tx({f:'monitor_watch_off',ke:e.ke,id:e.id,cnid:cn.id})};
            s.tx({viewers:e.ob,ke:e.ke,id:e.id},'MON_'+e.id);
        break;
        case'restart'://restart monitor
            s.camera('stop',e)
            setTimeout(function(){
                s.camera(e.mode,e)
            },1300)
        break;
        case'idle':case'stop'://stop monitor
            if(!s.group[e.ke]||!s.group[e.ke].mon[e.id]){return}
            if(config.childNodes.enabled === true && config.childNodes.mode === 'master' && s.group[e.ke].mon[e.id].childNode && s.childNodes[s.group[e.ke].mon[e.id].childNode].activeCameras[e.ke+e.id]){
                s.group[e.ke].mon[e.id].started = 0
                s.cx({
                    //function
                    f : 'cameraStop',
                    //data, options
                    d : s.group[e.ke].mon_conf[e.id]
                },s.group[e.ke].mon[e.id].childNodeId)
                s.cx({f:'sync',sync:s.group[e.ke].mon_conf[e.id],ke:e.ke,mid:e.id},s.group[e.ke].mon[e.id].childNodeId);
            }else{
                if(s.group[e.ke].mon[e.id].eventBasedRecording.process){
                    clearTimeout(s.group[e.ke].mon[e.id].eventBasedRecording.timeout)
                    s.group[e.ke].mon[e.id].eventBasedRecording.allowEnd=true;
                    s.group[e.ke].mon[e.id].eventBasedRecording.process.kill('SIGTERM');
                }
                if(s.group[e.ke].mon[e.id].fswatch){s.group[e.ke].mon[e.id].fswatch.close();delete(s.group[e.ke].mon[e.id].fswatch)}
                if(s.group[e.ke].mon[e.id].fswatchStream){s.group[e.ke].mon[e.id].fswatchStream.close();delete(s.group[e.ke].mon[e.id].fswatchStream)}
                if(s.group[e.ke].mon[e.id].last_frame){delete(s.group[e.ke].mon[e.id].last_frame)}
                if(s.group[e.ke].mon[e.id].started!==1){return}
                s.kill(s.group[e.ke].mon[e.id].spawn,e);
                if(e.neglectTriggerTimer===1){
                    delete(e.neglectTriggerTimer);
                }else{
                    clearTimeout(s.group[e.ke].mon[e.id].trigger_timer)
                    delete(s.group[e.ke].mon[e.id].trigger_timer)
                }
                clearInterval(s.group[e.ke].mon[e.id].running);
                clearInterval(s.group[e.ke].mon[e.id].detector_notrigger_timeout)
                clearTimeout(s.group[e.ke].mon[e.id].err_fatal_timeout);
                s.group[e.ke].mon[e.id].started=0;
                if(s.group[e.ke].mon[e.id].record){s.group[e.ke].mon[e.id].record.yes=0}
                s.tx({f:'monitor_stopping',mid:e.id,ke:e.ke,time:s.formattedTime()},'GRP_'+e.ke);
                s.camera('snapshot',{mid:e.id,ke:e.ke,mon:e})
                if(x==='stop'){
                    s.log(e,{type:lang['Monitor Stopped'],msg:lang.MonitorStoppedText});
                    clearTimeout(s.group[e.ke].mon[e.id].delete)
                    if(e.delete===1){
                        s.group[e.ke].mon[e.id].delete=setTimeout(function(){
                            delete(s.group[e.ke].mon[e.id]);
                            delete(s.group[e.ke].mon_conf[e.id]);
                        },1000*60);
                    }
                }else{
                    s.tx({f:'monitor_idle',mid:e.id,ke:e.ke,time:s.formattedTime()},'GRP_'+e.ke);
                    s.log(e,{type:lang['Monitor Idling'],msg:lang.MonitorIdlingText});
                }
            }
        break;
        case'start':case'record'://watch or record monitor url
            s.init(0,{ke:e.ke,mid:e.id})
            if(!s.group[e.ke].mon_conf[e.id]){s.group[e.ke].mon_conf[e.id]=s.init('noReference',e);}
            e.url = s.init('url',e);
            if(s.group[e.ke].mon[e.id].started===1){
                //stop action, monitor already started or recording
                return
            }
            //lock this function
            s.group[e.ke].mon[e.id].started = 1;
            //create host string without username and password
            e.hosty = e.host.split('@');
            if(e.hosty[1]){
                //username and password found
                e.hosty = e.hosty[1]
            }else{
                //no username or password in `host` string
                e.hosty = e.hosty[0]
            }
            //set recording status
            if(x==='record'){
                s.group[e.ke].mon[e.id].record.yes=1;
            }else{
                s.group[e.ke].mon[e.mid].record.yes=0;
            }
            //set the recording directory
            if(e.details && e.details.dir && e.details.dir !== '' && config.childNodes.mode !== 'child'){
                //addStorage choice
                e.dir=s.checkCorrectPathEnding(e.details.dir)+e.ke+'/';
                if (!fs.existsSync(e.dir)){
                    fs.mkdirSync(e.dir);
                }
                e.dir=e.dir+e.id+'/';
                if (!fs.existsSync(e.dir)){
                    fs.mkdirSync(e.dir);
                }
            }else{
                //MAIN videos dir
                e.dir=s.dir.videos+e.ke+'/';
                if (!fs.existsSync(e.dir)){
                    fs.mkdirSync(e.dir);
                }
                e.dir=s.dir.videos+e.ke+'/'+e.id+'/';
                if (!fs.existsSync(e.dir)){
                    fs.mkdirSync(e.dir);
                }
            }
            //set the temporary files directory
            var setStreamDir = function(){
                //stream dir
                e.sdir=s.dir.streams+e.ke+'/';
                if (!fs.existsSync(e.sdir)){
                    fs.mkdirSync(e.sdir);
                }
                e.sdir=s.dir.streams+e.ke+'/'+e.id+'/';
                if (!fs.existsSync(e.sdir)){
                    fs.mkdirSync(e.sdir);
                }else{
                    s.file('delete_folder',e.sdir+'*')
                }
            }
            setStreamDir()
            //set up fatal error handler
            if(e.details.fatal_max===''){
                e.details.fatal_max = 10
            }else{
                e.details.fatal_max = parseFloat(e.details.fatal_max)
            }
            var errorFatal = function(errorMessage){
                if(config.debugSystem === true){
                    console.log(errorMessage,(new Error()).stack)
                }
                clearTimeout(s.group[e.ke].mon[e.id].err_fatal_timeout);
                ++errorFatalCount;
                if(s.group[e.ke].mon[e.id].started===1){
                    s.group[e.ke].mon[e.id].err_fatal_timeout=setTimeout(function(){
                        if(e.details.fatal_max!==0&&errorFatalCount>e.details.fatal_max){
                            s.camera('stop',{id:e.id,ke:e.ke})
                        }else{
                            launchMonitorProcesses()
                        };
                    },5000);
                }else{
                    s.kill(s.group[e.ke].mon[e.id].spawn,e);
                }
            }
            errorFatalCount = 0;
            //set master based process launcher
            launchMonitorProcesses = function(){
                if(e.details.detector_trigger=='1'){
                    s.group[e.ke].mon[e.id].motion_lock=setTimeout(function(){
                        clearTimeout(s.group[e.ke].mon[e.id].motion_lock);
                        delete(s.group[e.ke].mon[e.id].motion_lock);
                    },30000)
                }
                //cutoff time and recording check interval
                if(!e.details.cutoff||e.details.cutoff===''){e.cutoff=15}else{e.cutoff=parseFloat(e.details.cutoff)};
                if(isNaN(e.cutoff)===true){e.cutoff=15}
                //start "no motion" checker
                if(e.details.detector=='1'&&e.details.detector_notrigger=='1'){
                    if(!e.details.detector_notrigger_timeout||e.details.detector_notrigger_timeout===''){
                        e.details.detector_notrigger_timeout=10
                    }
                    e.detector_notrigger_timeout=parseFloat(e.details.detector_notrigger_timeout)*1000*60;
                    s.sqlQuery('SELECT mail FROM Users WHERE ke=? AND details NOT LIKE ?',[e.ke,'%"sub"%'],function(err,r){
                        r=r[0];
                        s.group[e.ke].mon[e.id].detector_notrigger_timeout_function=function(){
                            if(config.mail&&e.details.detector_notrigger_mail=='1'){
                                e.mailOptions = {
                                    from: '"ShinobiCCTV" <no-reply@shinobi.video>', // sender address
                                    to: r.mail, // list of receivers
                                    subject: lang.NoMotionEmailText1+' '+e.name+' ('+e.id+')', // Subject line
                                    html: '<i>'+lang.NoMotionEmailText2+' '+e.details.detector_notrigger_timeout+' '+lang.minutes+'.</i>',
                                };
                                e.mailOptions.html+='<div><b>'+lang['Monitor Name']+' </b> : '+e.name+'</div>'
                                e.mailOptions.html+='<div><b>'+lang['Monitor ID']+' </b> : '+e.id+'</div>'
                                nodemailer.sendMail(e.mailOptions, (error, info) => {
                                    if (error) {
                                       s.systemLog('detector:notrigger:sendMail',error)
                                        s.tx({f:'error',ff:'detector_notrigger_mail',id:e.id,ke:e.ke,error:error},'GRP_'+e.ke);
                                        return ;
                                    }
                                    s.tx({f:'detector_notrigger_mail',id:e.id,ke:e.ke,info:info},'GRP_'+e.ke);
                                });
                            }
                        }
                        clearInterval(s.group[e.ke].mon[e.id].detector_notrigger_timeout)
                        s.group[e.ke].mon[e.id].detector_notrigger_timeout=setInterval(s.group[e.ke].mon[e.id].detector_notrigger_timeout_function,s.group[e.ke].mon[e.id].detector_notrigger_timeout)
                    })
                }
                var resetStreamCheck=function(){
                    clearTimeout(s.group[e.ke].mon[e.id].checkStream)
                    s.group[e.ke].mon[e.id].checkStream=setTimeout(function(){
                        if(s.group[e.ke].mon[e.id].started===1){
                            launchMonitorProcesses();
                            s.log(e,{type:lang['Camera is not streaming'],msg:{msg:lang['Restarting Process']}});
                        }
                    },60000*1);
                }
                if(config.childNodes.mode !== 'child' && s.platform!=='darwin' && (x==='record' || (x==='start'&&e.details.detector_record_method==='sip'))){
                    //check if ffmpeg is recording
                    s.group[e.ke].mon[e.id].fswatch = fs.watch(e.dir, {encoding : 'utf8'}, (event, filename) => {
                        switch(event){
                            case'rename':
                                s.group[e.ke].mon[e.id].open = filename.split('.')[0]
                            break;
                            case'change':
                                clearTimeout(s.group[e.ke].mon[e.id].checker)
                                clearTimeout(s.group[e.ke].mon[e.id].checkStream)
                                s.group[e.ke].mon[e.id].checker=setTimeout(function(){
                                    if(s.group[e.ke].mon[e.id].started===1){
                                        launchMonitorProcesses();
                                        s.log(e,{type:lang['Camera is not recording'],msg:{msg:lang['Restarting Process']}});
                                    }
                                },60000 * e.cutoff * 1.1);
                            break;
                        }
                    });
                }
                if(
                    //is MacOS
                    s.platform !== 'darwin' &&
                    //is Watch-Only or Record
                    (x === 'start' || x === 'record') &&
                    //if JPEG API enabled or Stream Type is HLS
                    (e.details.stream_type === 'jpeg' || e.details.stream_type === 'hls' || e.details.snap === '1')
                ){
                    s.group[e.ke].mon[e.id].fswatchStream = fs.watch(e.sdir, {encoding : 'utf8'}, () => {
                        resetStreamCheck()
                    })
                }
                s.camera('snapshot',{mid:e.id,ke:e.ke,mon:e})
                //check host to see if has password and user in it
                setStreamDir()
                clearTimeout(s.group[e.ke].mon[e.id].checker)
                if(s.group[e.ke].mon[e.id].started===1){
                e.error_count=0;
                s.group[e.ke].mon[e.id].error_socket_timeout_count=0;
                s.kill(s.group[e.ke].mon[e.id].spawn,e);
                startVideoProcessor=function(err,o){
                    if(o.success===true){
                        e.frames=0;
                        if(!s.group[e.ke].mon[e.id].record){s.group[e.ke].mon[e.id].record={yes:1}};
                        //launch ffmpeg (main)
                        s.group[e.ke].mon[e.id].spawn = s.ffmpeg(e);
                        //on unexpected exit restart
                        s.group[e.ke].mon[e.id].spawn_exit=function(){
                            if(s.group[e.ke].mon[e.id].started===1){
                                if(e.details.loglevel!=='quiet'){
                                    s.log(e,{type:lang['Process Unexpected Exit'],msg:{msg:lang['Process Crashed for Monitor']+' : '+e.id,cmd:s.group[e.ke].mon[e.id].ffmpeg}});
                                }
                                errorFatal('Process Unexpected Exit');
                            }
                        }
                        s.group[e.ke].mon[e.id].spawn.on('end',s.group[e.ke].mon[e.id].spawn_exit)
                        s.group[e.ke].mon[e.id].spawn.on('exit',s.group[e.ke].mon[e.id].spawn_exit)
                        //
//                            s.group[e.ke].mon[e.id].spawn.stdio[5].on('data',function(data){
//                                data = data.toString();
//                                console.log('---')
//                                var json = {}
//                                data.split('\n').forEach(function(v){
//                                    var vv = v.split('=')
//                                    json[vv[0]] = vv[1]
//                                })
//                                console.log(json)
//                            })
                        //emitter for mjpeg
                        if(!e.details.stream_mjpeg_clients||e.details.stream_mjpeg_clients===''||isNaN(e.details.stream_mjpeg_clients)===false){e.details.stream_mjpeg_clients=20;}else{e.details.stream_mjpeg_clients=parseInt(e.details.stream_mjpeg_clients)}
                        s.group[e.ke].mon[e.id].emitter = new events.EventEmitter().setMaxListeners(e.details.stream_mjpeg_clients);
                        s.log(e,{type:'FFMPEG Process Started',msg:{cmd:s.group[e.ke].mon[e.id].ffmpeg}});
                        s.tx({f:'monitor_starting',mode:x,mid:e.id,time:s.formattedTime()},'GRP_'+e.ke);
                        //start workers
                        if(e.type==='jpeg'){
                            if(!e.details.sfps||e.details.sfps===''){
                                var capture_fps=parseFloat(e.details.sfps);
                                if(isNaN(capture_fps)){capture_fps=1}
                            }
                            if(s.group[e.ke].mon[e.id].spawn){
                                s.group[e.ke].mon[e.id].spawn.stdin.on('error',function(err){
                                    if(err&&e.details.loglevel!=='quiet'){
                                        s.log(e,{type:'STDIN ERROR',msg:err});
                                    }
                                })
                            }else{
                                if(x==='record'){
                                    s.log(e,{type:lang.FFmpegCantStart,msg:lang.FFmpegCantStartText});
                                    return
                                }
                            }
                            e.captureOne=function(f){
                                s.group[e.ke].mon[e.id].record.request=request({url:e.url,method:'GET',encoding: null,timeout:15000},function(err,data){
                                    if(err){
                                        return;
                                    }
                                }).on('data',function(d){
                                      if(!e.buffer0){
                                          e.buffer0=[d]
                                      }else{
                                          e.buffer0.push(d);
                                      }
                                      if((d[d.length-2] === 0xFF && d[d.length-1] === 0xD9)){
                                          e.buffer0=Buffer.concat(e.buffer0);
                                          ++e.frames;
                                          if(s.group[e.ke].mon[e.id].spawn&&s.group[e.ke].mon[e.id].spawn.stdin){
                                            s.group[e.ke].mon[e.id].spawn.stdin.write(e.buffer0);
                                        }
                                        if(s.group[e.ke].mon[e.id].started===1){
                                            s.group[e.ke].mon[e.id].record.capturing=setTimeout(function(){
                                               e.captureOne()
                                            },1000/capture_fps);
                                        }
                                          e.buffer0=null;
                                    }
                                    if(!e.timeOut){
                                        e.timeOut=setTimeout(function(){e.error_count=0;delete(e.timeOut);},3000);
                                    }

                                }).on('error', function(err){
                                    ++e.error_count;
                                    clearTimeout(e.timeOut);delete(e.timeOut);
                                    if(e.details.loglevel!=='quiet'){
                                        s.log(e,{type:lang['JPEG Error'],msg:{msg:lang.JPEGErrorText,info:err}});
                                        switch(err.code){
                                            case'ESOCKETTIMEDOUT':
                                            case'ETIMEDOUT':
                                                ++s.group[e.ke].mon[e.id].error_socket_timeout_count
                                                if(e.details.fatal_max!==0&&s.group[e.ke].mon[e.id].error_socket_timeout_count>e.details.fatal_max){
                                                    s.log(e,{type:lang['Fatal Maximum Reached'],msg:{code:'ESOCKETTIMEDOUT',msg:lang.FatalMaximumReachedText}});
                                                    s.camera('stop',e)
                                                }else{
                                                    s.log(e,{type:lang['Restarting Process'],msg:{code:'ESOCKETTIMEDOUT',msg:lang.FatalMaximumReachedText}});
                                                    s.camera('restart',e)
                                                }
                                                return;
                                            break;
                                        }
                                    }
                                    if(e.details.fatal_max!==0&&e.error_count>e.details.fatal_max){
                                        clearTimeout(s.group[e.ke].mon[e.id].record.capturing);
                                        launchMonitorProcesses();
                                    }
                                });
                          }
                          e.captureOne()
                        }
                        if(!s.group[e.ke]||!s.group[e.ke].mon[e.id]){s.init(0,e)}
                        s.group[e.ke].mon[e.id].spawn.on('error',function(er){
                            s.log(e,{type:'Spawn Error',msg:er});errorFatal('Spawn Error')
                        });
                        if(e.details.detector==='1'){
                            s.ocvTx({f:'init_monitor',id:e.id,ke:e.ke})
                            //frames from motion detect
                            if(e.details.detector_pam==='1'){
                                var width,
                                    height,
                                    globalSensitivity,
                                    fullFrame = false
                                if(s.group[e.ke].mon_conf[e.id].details.detector_scale_x===''||s.group[e.ke].mon_conf[e.id].details.detector_scale_y===''){
                                    width = s.group[e.ke].mon_conf[e.id].details.detector_scale_x;
                                    height = s.group[e.ke].mon_conf[e.id].details.detector_scale_y;
                                }else{
                                    width = e.width
                                    height = e.height
                                }
                                if(e.details.detector_sensitivity===''){
                                    globalSensitivity = 10
                                }else{
                                    globalSensitivity = parseInt(e.details.detector_sensitivity)
                                }
                                if(e.details.detector_frame==='1'){
                                    fullFrame={
                                        name:'FULL_FRAME',
                                        sensitivity:globalSensitivity,
                                        points:[
                                            [0,0],
                                            [0,height],
                                            [width,height],
                                            [width,0]
                                        ]
                                    };
                                }
                                var regions = s.createPamDiffRegionArray(s.group[e.ke].mon_conf[e.id].details.cords,globalSensitivity,fullFrame);
                                if(!s.group[e.ke].mon[e.id].noiseFilterArray)s.group[e.ke].mon[e.id].noiseFilterArray = {}
                                var noiseFilterArray = s.group[e.ke].mon[e.id].noiseFilterArray
                                Object.keys(regions.notForPam).forEach(function(name){
                                    if(!noiseFilterArray[name])noiseFilterArray[name]=[];
                                })
                                s.group[e.ke].mon[e.id].pamDiff = new PamDiff({grayscale: 'luminosity', regions : regions.forPam});
                                s.group[e.ke].mon[e.id].p2p = new P2P();
                                var sendTrigger = function(trigger){
                                    var detectorObject = {
                                        f:'trigger',
                                        id:e.id,
                                        ke:e.ke,
                                        name:trigger.name,
                                        details:{
                                            plug:'built-in',
                                            name:trigger.name,
                                            reason:'motion',
                                            confidence:trigger.percent,
                                        },
                                        plates:[],
                                        imgHeight:height,
                                        imgWidth:width
                                    }
                                    detectorObject.doObjectDetection = (s.ocv && e.details.detector_use_detect_object === '1')
                                    s.camera('motion',detectorObject)
                                    if(detectorObject.doObjectDetection === true){
                                        s.ocvTx({f:'frame',mon:s.group[e.ke].mon_conf[e.id].details,ke:e.ke,id:e.id,time:s.formattedTime(),frame:s.group[e.ke].mon[e.id].lastJpegDetectorFrame});
                                    }
                                }
                                var filterTheNoise = function(trigger){
                                    if(noiseFilterArray[trigger.name].length > 2){
                                        var thePreviousTriggerPercent = noiseFilterArray[trigger.name][noiseFilterArray[trigger.name].length - 1];
                                        var triggerDifference = trigger.percent - thePreviousTriggerPercent;
                                        var noiseRange = e.details.detector_noise_filter_range
                                        if(!noiseRange || noiseRange === ''){
                                            noiseRange = 6
                                        }
                                        noiseRange = parseFloat(noiseRange)
                                        if(((trigger.percent - thePreviousTriggerPercent) < noiseRange)||(thePreviousTriggerPercent - trigger.percent) > -noiseRange){
                                            noiseFilterArray[trigger.name].push(trigger.percent);
                                        }
                                    }else{
                                        noiseFilterArray[trigger.name].push(trigger.percent);
                                    }
                                    if(noiseFilterArray[trigger.name].length > 10){
                                        noiseFilterArray[trigger.name] = noiseFilterArray[trigger.name].splice(1,10)
                                    }
                                    var theNoise = 0;
                                    noiseFilterArray[trigger.name].forEach(function(v,n){
                                        theNoise += v;
                                    })
                                    theNoise = theNoise / noiseFilterArray[trigger.name].length;
//                                    console.log(noiseFilterArray[trigger.name])
//                                    console.log(theNoise)
                                    var triggerPercentWithoutNoise = trigger.percent - theNoise;
                                    if(triggerPercentWithoutNoise > regions.notForPam[trigger.name].sensitivity){
                                        sendTrigger(trigger);
                                    }
                                }
                                if(e.details.detector_noise_filter==='1'){
                                    s.group[e.ke].mon[e.id].pamDiff.on('diff', (data) => {
                                        data.trigger.forEach(filterTheNoise)
                                    })
                                }else{
                                    s.group[e.ke].mon[e.id].pamDiff.on('diff', (data) => {
                                        data.trigger.forEach(sendTrigger)
                                    })
                                }

                                s.group[e.ke].mon[e.id].spawn.stdio[3].pipe(s.group[e.ke].mon[e.id].p2p).pipe(s.group[e.ke].mon[e.id].pamDiff)
                                if(e.details.detector_use_detect_object === '1'){
                                    s.group[e.ke].mon[e.id].spawn.stdio[4].on('data',function(d){
                                        s.group[e.ke].mon[e.id].lastJpegDetectorFrame = d
                                    })
                                }
                            }else{
                                s.group[e.ke].mon[e.id].spawn.stdio[3].on('data',function(d){
                                    s.ocvTx({f:'frame',mon:s.group[e.ke].mon_conf[e.id].details,ke:e.ke,id:e.id,time:s.formattedTime(),frame:d});
                                })
                            }
                        }
                        //frames to stream
                       switch(e.details.stream_type){
                           case'mp4':
                               s.group[e.ke].mon[e.id].mp4frag['MAIN'] = new Mp4Frag();
                               s.group[e.ke].mon[e.id].spawn.stdio[1].pipe(s.group[e.ke].mon[e.id].mp4frag['MAIN'])
                           break;
                           case'flv':
                               e.frame_to_stream=function(d){
                                   if(!s.group[e.ke].mon[e.id].firstStreamChunk['MAIN'])s.group[e.ke].mon[e.id].firstStreamChunk['MAIN'] = d;
                                   e.frame_to_stream=function(d){
                                       resetStreamCheck()
                                       s.group[e.ke].mon[e.id].emitter.emit('data',d);
                                   }
                                   e.frame_to_stream(d)
                               }
                           break;
                           case'mjpeg':
                               e.frame_to_stream=function(d){
                                   resetStreamCheck()
                                   s.group[e.ke].mon[e.id].emitter.emit('data',d);
                               }
                           break;
//                               case'pam':
//                                   s.group[e.ke].mon[e.id].p2pStream = new P2P();
//                                   s.group[e.ke].mon[e.id].spawn.stdout.pipe(s.group[e.ke].mon[e.id].p2pStream)
//                                   s.group[e.ke].mon[e.id].p2pStream.on('pam',function(d){
//                                       resetStreamCheck()
//                                       s.tx({f:'pam_frame',ke:e.ke,id:e.id,imageData:{
//                                           data : d.pixels,
//                                           height : d.height,
//                                           width : d.width
//                                       }},'MON_STREAM_'+e.id);
//                                    })
//                               break;
                           case'b64':case undefined:case null:case'':
                               var buffer
                               e.frame_to_stream=function(d){
                                  resetStreamCheck()
                                  if(!buffer){
                                      buffer=[d]
                                  }else{
                                      buffer.push(d);
                                  }
                                  if((d[d.length-2] === 0xFF && d[d.length-1] === 0xD9)){
                                      s.group[e.ke].mon[e.id].emitter.emit('data',Buffer.concat(buffer));
                                      buffer=null;
                                  }
                               }
                           break;
                       }
                        if(e.frame_to_stream){
                            s.group[e.ke].mon[e.id].spawn.stdout.on('data',e.frame_to_stream);
                        }
                        if(e.details.stream_channels&&e.details.stream_channels!==''){
                            var createStreamEmitter = function(channel,number){
                                var pipeNumber = number+config.pipeAddition;
                                if(!s.group[e.ke].mon[e.id].emitterChannel[pipeNumber]){
                                    s.group[e.ke].mon[e.id].emitterChannel[pipeNumber] = new events.EventEmitter().setMaxListeners(0);
                                }
                               var frame_to_stream
                               switch(channel.stream_type){
                                   case'mp4':
                                       s.group[e.ke].mon[e.id].mp4frag[pipeNumber] = new Mp4Frag();
                                       s.group[e.ke].mon[e.id].spawn.stdio[pipeNumber].pipe(s.group[e.ke].mon[e.id].mp4frag[pipeNumber])
                                   break;
                                   case'mjpeg':
                                       frame_to_stream=function(d){
                                           s.group[e.ke].mon[e.id].emitterChannel[pipeNumber].emit('data',d);
                                       }
                                   break;
                                   case'flv':
                                       frame_to_stream=function(d){
                                           if(!s.group[e.ke].mon[e.id].firstStreamChunk[pipeNumber])s.group[e.ke].mon[e.id].firstStreamChunk[pipeNumber] = d;
                                           frame_to_stream=function(d){
                                               s.group[e.ke].mon[e.id].emitterChannel[pipeNumber].emit('data',d);
                                           }
                                           frame_to_stream(d)
                                       }
                                   break;
                                   case'h264':
                                       frame_to_stream=function(d){
                                           s.group[e.ke].mon[e.id].emitterChannel[pipeNumber].emit('data',d);
                                       }
                                   break;
                               }
                                if(frame_to_stream){
                                    s.group[e.ke].mon[e.id].spawn.stdio[pipeNumber].on('data',frame_to_stream);
                                }
                            }
                            e.details.stream_channels.forEach(createStreamEmitter)
                        }
                        if(x==='record'||e.type==='mjpeg'||e.type==='h264'||e.type==='local'){
                            s.group[e.ke].mon[e.id].spawn.stderr.on('data',function(d){
                                d=d.toString();
                                e.chk=function(x){return d.indexOf(x)>-1;}
                                switch(true){
                                        //mp4 output with webm encoder chosen
                                    case e.chk('Could not find tag for vp8'):
                                    case e.chk('Only VP8 or VP9 Video'):
                                    case e.chk('Could not write header'):
//                                            switch(e.ext){
//                                                case'mp4':
//                                                    e.details.vcodec='libx264'
//                                                    e.details.acodec='none'
//                                                break;
//                                                case'webm':
//                                                    e.details.vcodec='libvpx'
//                                                    e.details.acodec='none'
//                                                break;
//                                            }
//                                            if(e.details.stream_type==='hls'){
//                                                e.details.stream_vcodec='libx264'
//                                                e.details.stream_acodec='no'
//                                            }
//                                            s.camera('restart',e)
                                        return s.log(e,{type:lang['Incorrect Settings Chosen'],msg:{msg:d}})
                                    break;
                                    case e.chk('NULL @'):
                                    case e.chk('RTP: missed'):
                                    case e.chk('deprecated pixel format used, make sure you did set range correctly'):
                                        return
                                    break;
//                                                case e.chk('av_interleaved_write_frame'):
                                    case e.chk('Connection refused'):
                                    case e.chk('Connection timed out'):
                                        //restart
                                        setTimeout(function(){
                                            s.log(e,{type:lang['Connection timed out'],msg:lang['Retrying...']});
                                            errorFatal('Connection timed out');
                                        },1000)
                                    break;
//                                        case e.chk('No such file or directory'):
//                                        case e.chk('Unable to open RTSP for listening'):
//                                        case e.chk('timed out'):
//                                        case e.chk('Invalid data found when processing input'):
//                                        case e.chk('Immediate exit requested'):
//                                        case e.chk('reset by peer'):
//                                           if(e.frames===0&&x==='record'){s.video('delete',e)};
//                                            setTimeout(function(){
//                                                if(!s.group[e.ke].mon[e.id].spawn){launchMonitorProcesses()}
//                                            },2000)
//                                        break;
                                    case e.chk('mjpeg_decode_dc'):
                                    case e.chk('bad vlc'):
                                    case e.chk('error dc'):
                                        launchMonitorProcesses()
                                    break;
                                    case /T[0-9][0-9]-[0-9][0-9]-[0-9][0-9]./.test(d):
                                        var filename = d.split('.')[0]+'.'+e.ext
                                        s.video('insertCompleted',e,{
                                            file : filename
                                        })
                                        s.log(e,{type:lang['Video Finished'],msg:{filename:d}})
                                        if(
                                            e.details.detector==='1'&&
                                            s.group[e.ke].mon[e.id].started===1&&
                                            e.details&&
                                            e.details.detector_record_method==='del'&&
                                            e.details.detector_delete_motionless_videos==='1'&&
                                            s.group[e.ke].mon[e.id].detector_motion_count===0
                                        ){
                                            if(e.details.loglevel!=='quiet'){
                                                s.log(e,{type:lang['Delete Motionless Video'],msg:filename});
                                            }
                                            s.video('delete',{
                                                filename : filename,
                                                ke : e.ke,
                                                id : e.id
                                            })
                                        }
                                        s.group[e.ke].mon[e.id].detector_motion_count = 0
                                        return;
                                    break;
                                }
                                s.log(e,{type:"FFMPEG STDERR",msg:d})
                            });
                        }
                      }else{
                          s.log(e,{type:lang["Ping Failed"],msg:lang.skipPingText1});
                          errorFatal("Ping Failed");return;
                    }
                }
                if(e.type!=='socket'&&e.type!=='dashcam'&&e.protocol!=='udp'&&e.type!=='local'||e.details.skip_ping === '1'){
                    connectionTester.test(e.hosty,e.port,2000,startVideoProcessor);
                }else{
                    startVideoProcessor(null,{success:true})
                }
            }else{
                s.kill(s.group[e.ke].mon[e.id].spawn,e);
            }
            }
            //start drawing files
            delete(s.group[e.ke].mon[e.id].childNode)
            if(config.childNodes.enabled === true && config.childNodes.mode === 'master'){
                var childNodeList = Object.keys(s.childNodes)
                if(childNodeList.length>0){
                    e.ch_stop = 0;
                    launchMonitorProcesses = function(){
                        startVideoProcessor = function(){
                            s.cx({
                                //function
                                f : 'cameraStart',
                                //mode
                                mode : x,
                                //data, options
                                d : s.group[e.ke].mon_conf[e.id]
                            },s.group[e.ke].mon[e.id].childNodeId)
                        }
                        if(e.type!=='socket'&&e.type!=='dashcam'&&e.protocol!=='udp'&&e.type!=='local' && e.details.skip_ping !== '1'){
                            console.log(e.hosty,e.port)
                            connectionTester.test(e.hosty,e.port,2000,function(err,o){
                                if(o.success===true){
                                    startVideoProcessor()
                                }else{
                                    s.log(e,{type:lang["Ping Failed"],msg:lang.skipPingText1});
                                    errorFatal("Ping Failed");return;
                                }
                            })
                        }else{
                            startVideoProcessor()
                        }
                    }
                    childNodeList.forEach(function(ip){
                        if(e.ch_stop===0&&s.childNodes[ip].cpu<80){
                            e.ch_stop=1;
                            s.childNodes[ip].activeCameras[e.ke+e.id] = s.init('noReference',s.group[e.ke].mon_conf[e.id]);
                            s.group[e.ke].mon[e.id].childNode = ip;
                            s.group[e.ke].mon[e.id].childNodeId = s.childNodes[ip].cnid;
                            s.cx({f:'sync',sync:s.group[e.ke].mon_conf[e.id],ke:e.ke,mid:e.id},s.group[e.ke].mon[e.id].childNodeId);
                            launchMonitorProcesses();
                        }
                    })
                }else{
                    launchMonitorProcesses();
                }
            }else{
                launchMonitorProcesses();
            }
        break;
        case'motion':
            var d=e;
            if(s.group[d.ke].mon[d.id].open){
                d.details.videoTime = s.group[d.ke].mon[d.id].open;
            }
            var detailString = JSON.stringify(d.details);
            if(!s.group[d.ke]||!s.group[d.ke].mon[d.id]){
                return s.systemLog(lang['No Monitor Found, Ignoring Request'])
            }
            d.mon=s.group[d.ke].mon_conf[d.id];
            if(!s.group[d.ke].mon[d.id].detector_motion_count){
                s.group[d.ke].mon[d.id].detector_motion_count=0
            }
            s.group[d.ke].mon[d.id].detector_motion_count+=1
            if(s.group[d.ke].mon[d.id].motion_lock){
                return
            }
            var detector_lock_timeout
            if(!d.mon.details.detector_lock_timeout||d.mon.details.detector_lock_timeout===''){
                detector_lock_timeout = 2000
            }
            detector_lock_timeout = parseFloat(d.mon.details.detector_lock_timeout);
            if(!s.group[d.ke].mon[d.id].detector_lock_timeout){
                s.group[d.ke].mon[d.id].detector_lock_timeout=setTimeout(function(){
                    clearTimeout(s.group[d.ke].mon[d.id].detector_lock_timeout)
                    delete(s.group[d.ke].mon[d.id].detector_lock_timeout)
                },detector_lock_timeout)
            }else{
                return
            }
            if(d.doObjectDetection !== true){
                //save this detection result in SQL, only coords. not image.
                if(d.mon.details.detector_save==='1'){
                    s.sqlQuery('INSERT INTO Events (ke,mid,details) VALUES (?,?,?)',[d.ke,d.id,detailString])
                }
                if(d.mon.details.detector_notrigger=='1'){
                    var detector_notrigger_timeout
                    if(!d.mon.details.detector_notrigger_timeout||d.mon.details.detector_notrigger_timeout===''){
                        detector_notrigger_timeout = 10
                    }
                    detector_notrigger_timeout = parseFloat(d.mon.details.detector_notrigger_timeout)*1000*60;
                    s.group[e.ke].mon[e.id].detector_notrigger_timeout = detector_notrigger_timeout;
                    clearInterval(s.group[d.ke].mon[d.id].detector_notrigger_timeout)
                    s.group[d.ke].mon[d.id].detector_notrigger_timeout = setInterval(s.group[d.ke].mon[d.id].detector_notrigger_timeout_function,detector_notrigger_timeout)
                }
                if(d.mon.details.detector_webhook=='1'){
                    var detector_webhook_url = d.mon.details.detector_webhook_url
                        .replace(/{{TIME}}/g,s.timeObject(new Date).format())
                        .replace(/{{MONITOR_ID}}/g,d.id)
                        .replace(/{{GROUP_KEY}}/g,d.ke)
                        .replace(/{{DETAILS}}/g,detailString)
                    http.get(detector_webhook_url, function(data) {
                          data.setEncoding('utf8');
                          var chunks='';
                          data.on('data', (chunk) => {
                              chunks+=chunk;
                          });
                          data.on('end', () => {

                          });

                    }).on('error', function(e) {

                    }).end();
                }
                var detector_timeout
                if(!d.mon.details.detector_timeout||d.mon.details.detector_timeout===''){
                    detector_timeout = 10
                }else{
                    detector_timeout = parseFloat(d.mon.details.detector_timeout)
                }
                if(d.mon.mode=='start'&&d.mon.details.detector_trigger==='1'&&d.mon.details.detector_record_method==='sip'){
                    //s.group[d.ke].mon[d.id].eventBasedRecording.timeout
    //                clearTimeout(s.group[d.ke].mon[d.id].eventBasedRecording.timeout)
                    s.group[d.ke].mon[d.id].eventBasedRecording.timeout = setTimeout(function(){
                        s.group[d.ke].mon[d.id].eventBasedRecording.allowEnd=true;
                    },detector_timeout * 950 * 60)
                    if(!s.group[d.ke].mon[d.id].eventBasedRecording.process){
                        if(!d.auth){
                            d.auth=s.gid();
                        }
                        if(!s.group[d.ke].users[d.auth]){
                            s.group[d.ke].users[d.auth]={system:1,details:{},lang:lang}
                        }
                        s.group[d.ke].mon[d.id].eventBasedRecording.allowEnd = false;
                        var runRecord = function(){
                            var filename = s.formattedTime()+'.mp4'
                            s.log(d,{type:"Traditional Recording",msg:"Started"})
                            //-t 00:'+s.timeObject(new Date(detector_timeout * 1000 * 60)).format('mm:ss')+'
                            s.group[d.ke].mon[d.id].eventBasedRecording.process = spawn(config.ffmpegDir,s.splitForFFPMEG(('-loglevel warning -analyzeduration 1000000 -probesize 1000000 -re -i http://'+config.ip+':'+config.port+'/'+d.auth+'/hls/'+d.ke+'/'+d.id+'/detectorStream.m3u8 -t 00:'+s.timeObject(new Date(detector_timeout * 1000 * 60)).format('mm:ss')+' -c:v copy -strftime 1 "'+s.video('getDir',d.mon) + filename + '"').replace(/\s+/g,' ').trim()))
                            var ffmpegError='';
                            var error
                            s.group[d.ke].mon[d.id].eventBasedRecording.process.stderr.on('data',function(data){
                                s.log(d,{type:"Traditional Recording",msg:data.toString()})
                            })
                            s.group[d.ke].mon[d.id].eventBasedRecording.process.on('close',function(){
                                if(!s.group[d.ke].mon[d.id].eventBasedRecording.allowEnd){
                                    s.log(d,{type:"Traditional Recording",msg:"Detector Recording Process Exited Prematurely. Restarting."})
                                    runRecord()
                                    return
                                }
                                s.video('insertCompleted',d.mon,{
                                    file : filename
                                })
                                s.log(d,{type:"Traditional Recording",msg:"Detector Recording Complete"})
                                delete(s.group[d.ke].users[d.auth])
                                s.log(d,{type:"Traditional Recording",msg:'Clear Recorder Process'})
                                delete(s.group[d.ke].mon[d.id].eventBasedRecording.process)
                                delete(s.group[d.ke].mon[d.id].eventBasedRecording.timeout)
                                clearTimeout(s.group[d.ke].mon[d.id].checker)
                            })
                        }
                        runRecord()
                    }
                }else if(d.mon.mode!=='stop'&&d.mon.details.detector_trigger=='1'&&d.mon.details.detector_record_method==='hot'){
                    if(!d.auth){
                        d.auth=s.gid();
                    }
                    if(!s.group[d.ke].users[d.auth]){
                        s.group[d.ke].users[d.auth]={system:1,details:{},lang:lang}
                    }
                    d.urlQuery=[]
                    d.url='http://'+config.ip+':'+config.port+'/'+d.auth+'/monitor/'+d.ke+'/'+d.id+'/record/'+detector_timeout+'/min';
                    if(d.mon.details.watchdog_reset!=='0'){
                        d.urlQuery.push('reset=1')
                    }
                    if(d.mon.details.detector_trigger_record_fps&&d.mon.details.detector_trigger_record_fps!==''&&d.mon.details.detector_trigger_record_fps!=='0'){
                        d.urlQuery.push('fps='+d.mon.details.detector_trigger_record_fps)
                    }
                    if(d.urlQuery.length>0){
                        d.url+='?'+d.urlQuery.join('&')
                    }
                    http.get(d.url, function(data) {
                        data.setEncoding('utf8');
                        var chunks='';
                        data.on('data', (chunk) => {
                            chunks+=chunk;
                        });
                        data.on('end', () => {
                            delete(s.group[d.ke].users[d.auth])
                            d.cx.f='detector_record_engaged';
                            d.cx.msg=JSON.parse(chunks);
                            s.tx(d.cx,'GRP_'+d.ke);
                        });

                    }).on('error', function(e) {

                    }).end();
                }
                //mailer
                if(config.mail&&!s.group[d.ke].mon[d.id].detector_mail&&d.mon.details.detector_mail==='1'){
                    s.sqlQuery('SELECT mail FROM Users WHERE ke=? AND details NOT LIKE ?',[d.ke,'%"sub"%'],function(err,r){
                        r=r[0];
                        var detector_mail_timeout
                        if(!d.mon.details.detector_mail_timeout||d.mon.details.detector_mail_timeout===''){
                            detector_mail_timeout = 1000*60*10;
                        }else{
                            detector_mail_timeout = parseFloat(d.mon.details.detector_mail_timeout)*1000*60;
                        }
                        //lock mailer so you don't get emailed on EVERY trigger event.
                        s.group[d.ke].mon[d.id].detector_mail=setTimeout(function(){
                            //unlock so you can mail again.
                            clearTimeout(s.group[d.ke].mon[d.id].detector_mail);
                            delete(s.group[d.ke].mon[d.id].detector_mail);
                        },detector_mail_timeout);
                        d.frame_filename='Motion_'+(d.mon.name.replace(/[^\w\s]/gi, ''))+'_'+d.id+'_'+d.ke+'_'+s.formattedTime()+'.jpg';
                        fs.readFile(s.dir.streams+'/'+d.ke+'/'+d.id+'/s.jpg',function(err, frame){
                            d.mailOptions = {
                                from: '"ShinobiCCTV" <no-reply@shinobi.video>', // sender address
                                to: r.mail, // list of receivers
                                subject: lang.Event+' - '+d.frame_filename, // Subject line
                                html: '<i>'+lang.EventText1+' '+s.timeObject(new Date).format()+'.</i>',
                            };
                            if(err){
                                s.systemLog(lang.EventText2+' '+d.ke+' '+d.id,err)
                            }else{
                                d.mailOptions.attachments=[
                                    {
                                        filename: d.frame_filename,
                                        content: frame
                                    }
                                ]
                                d.mailOptions.html='<i>'+lang.EventText3+'</i>'
                            }
                                Object.keys(d.details).forEach(function(v,n){
                                d.mailOptions.html+='<div><b>'+v+'</b> : '+d.details[v]+'</div>'
                            })
                            nodemailer.sendMail(d.mailOptions, (error, info) => {
                                if (error) {
                                    s.systemLog(lang.MailError,error)
                                    return ;
                                }
                            });
                        })
                    });
                }
                if(d.mon.details.detector_command_enable==='1'&&!s.group[d.ke].mon[d.id].detector_command){
                    var detector_command_timeout
                    if(!d.mon.details.detector_command_timeout||d.mon.details.detector_command_timeout===''){
                        detector_command_timeout = 1000*60*10;
                    }else{
                        detector_command_timeout = parseFloat(d.mon.details.detector_command_timeout)*1000*60;
                    }
                    s.group[d.ke].mon[d.id].detector_command=setTimeout(function(){
                        clearTimeout(s.group[d.ke].mon[d.id].detector_command);
                        delete(s.group[d.ke].mon[d.id].detector_command);

                    },detector_command_timeout);
                    var detector_command = d.mon.details.detector_command
                        .replace(/{{TIME}}/g,s.timeObject(new Date).format())
                        .replace(/{{MONITOR_ID}}/g,d.id)
                        .replace(/{{GROUP_KEY}}/g,d.ke)
                        .replace(/{{DETAILS}}/g,detailString)
                    if(d.details.confidence){
                        detector_command = detector_command
                        .replace(/{{CONFIDENCE}}/g,d.details.confidence)
                    }
                    exec(detector_command,{detached: true})
                }
            }
            //show client machines the event
            d.cx={f:'detector_trigger',id:d.id,ke:d.ke,details:d.details,doObjectDetection:d.doObjectDetection};
            s.tx(d.cx,'DETECTOR_'+d.ke+d.id);
        break;
    }
    if(typeof cn==='function'){setTimeout(function(){cn()},1000);}
}

//function for receiving detector data
s.pluginEventController=function(d){
    switch(d.f){
        case'trigger':
            s.camera('motion',d)
        break;
        case's.tx':
            s.tx(d.data,d.to)
        break;
        case'sql':
            sql.query(d.query,d.values);
        break;
        case'log':
            s.systemLog('PLUGIN : '+d.plug+' : ',d)
        break;
    }
}
//multi plugin connections
s.connectedPlugins={}
s.pluginInitiatorSuccess=function(mode,d,cn){
    s.systemLog('pluginInitiatorSuccess',d)
    if(mode==='client'){
        //is in client mode (camera.js is client)
        cn.pluginEngine=d.plug
        if(!s.connectedPlugins[d.plug]){
            s.connectedPlugins[d.plug]={plug:d.plug}
        }
        s.systemLog('Connected to plugin : Detector - '+d.plug+' - '+d.type)
        switch(d.type){
            default:case'detector':
                s.ocv={started:s.timeObject(),id:cn.id,plug:d.plug,notice:d.notice,isClientPlugin:true};
                cn.ocv=1;
                s.tx({f:'detector_plugged',plug:d.plug,notice:d.notice},'CPU')
            break;
        }
    }else{
        //is in host mode (camera.js is client)
        switch(d.type){
            default:case'detector':
                s.ocv={started:s.timeObject(),id:"host",plug:d.plug,notice:d.notice,isHostPlugin:true};
            break;
        }
    }
    s.connectedPlugins[d.plug].plugged=true
    s.tx({f:'readPlugins',ke:d.ke},'CPU')
    s.ocvTx({f:'api_key',key:d.plug})
    s.api[d.plug]={pluginEngine:d.plug,permissions:{},details:{},ip:'0.0.0.0'};
}
s.pluginInitiatorFail=function(mode,d,cn){
    s.connectedPlugins[d.plug].plugged=false
    if(mode==='client'){
        //is in client mode (camera.js is client)
        cn.disconnect()
    }else{
        //is in host mode (camera.js is client)
    }
}
if(config.plugins&&config.plugins.length>0){
    config.plugins.forEach(function(v){
        s.connectedPlugins[v.id]={plug:v.id}
        if(v.enabled===false){return}
        if(v.mode==='host'){
            //is in host mode (camera.js is client)
            if(v.https===true){
                v.https='https://'
            }else{
                v.https='http://'
            }
            if(!v.port){
                v.port=80
            }
            var socket = socketIOclient(v.https+v.host+':'+v.port)
            s.connectedPlugins[v.id].tx = function(x){return socket.emit('f',x)}
            socket.on('connect', function(cn){
                s.systemLog('Connected to plugin (host) : '+v.id)
                s.connectedPlugins[v.id].tx({f:'init_plugin_as_host',key:v.key})
            });
            socket.on('init',function(d){
                s.systemLog('Initialize Plugin : Host',d)
                if(d.ok===true){
                    s.pluginInitiatorSuccess("host",d)
                }else{
                    s.pluginInitiatorFail("host",d)
                }
            });
            socket.on('ocv',s.pluginEventController);
            socket.on('disconnect', function(){
                s.connectedPlugins[v.id].plugged=false
                delete(s.api[v.id])
                s.systemLog('Plugin Disconnected : '+v.id)
                s.connectedPlugins[v.id].reconnector = setInterval(function(){
                    if(socket.connected===true){
                        clearInterval(s.connectedPlugins[v.id].reconnector)
                    }else{
                        socket.connect()
                    }
                },1000*2)
            });
            s.connectedPlugins[v.id].ws = socket;
        }
    })
}
////socket controller
s.cn=function(cn){return{id:cn.id,ke:cn.ke,uid:cn.uid}}
io.on('connection', function (cn) {
var tx;
    //set "client" detector plugin event function
    cn.on('ocv',function(d){
        if(!cn.pluginEngine&&d.f==='init'){
            if(config.pluginKeys[d.plug]===d.pluginKey){
                s.pluginInitiatorSuccess("client",d,cn)
            }else{
                s.pluginInitiatorFail("client",d,cn)
            }
        }else{
            if(config.pluginKeys[d.plug]===d.pluginKey){
                s.pluginEventController(d)
            }else{
                cn.disconnect()
            }
        }
    })
    //unique Base64 socket stream
    cn.on('Base64',function(d){
        if(!s.group[d.ke]||!s.group[d.ke].mon||!s.group[d.ke].mon[d.id]){
            cn.disconnect();return;
        }
        cn.ip=cn.request.connection.remoteAddress;
        var toUTC = function(){
            return new Date().toISOString();
        }
        var tx=function(z){cn.emit('data',z);}
        d.failed=function(msg){
            tx({f:'stop_reconnect',msg:msg,token_used:d.auth,ke:d.ke});
            cn.disconnect();
        }
        d.success=function(r){
            r=r[0];
            var Emitter,chunkChannel
            if(!d.channel){
                Emitter = s.group[d.ke].mon[d.id].emitter
                chunkChannel = 'MAIN'
            }else{
                Emitter = s.group[d.ke].mon[d.id].emitterChannel[parseInt(d.channel)+config.pipeAddition]
                chunkChannel = parseInt(d.channel)+config.pipeAddition
            }
            if(!Emitter){
                cn.disconnect();return;
            }
            if(!d.channel)d.channel = 'MAIN';
            cn.ke=d.ke,
            cn.uid=d.uid,
            cn.auth=d.auth;
            cn.channel=d.channel;
            cn.removeListenerOnDisconnect=true;
            cn.socketVideoStream=d.id;
            var contentWriter
            cn.closeSocketVideoStream = function(){
                Emitter.removeListener('data', contentWriter);
            }
            Emitter.on('data',contentWriter = function(base64){
                tx(base64)
            })
         }
        //check if auth key is user's temporary session key
        if(s.group[d.ke]&&s.group[d.ke].users&&s.group[d.ke].users[d.auth]){
            d.success(s.group[d.ke].users[d.auth]);
        }else{
            s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND auth=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                if(r&&r[0]){
                    d.success(r)
                }else{
                    s.sqlQuery('SELECT * FROM API WHERE ke=? AND code=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                        if(r&&r[0]){
                            r=r[0]
                            r.details=JSON.parse(r.details)
                            if(r.details.auth_socket==='1'){
                                s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND uid=?',[r.ke,r.uid],function(err,r) {
                                    if(r&&r[0]){
                                        d.success(r)
                                    }else{
                                        d.failed('User not found')
                                    }
                                })
                            }else{
                                d.failed('Permissions for this key do not allow authentication with Websocket')
                            }
                        }else{
                            d.failed('Not an API key')
                        }
                    })
                }
            })
        }
    })
    //unique FLV socket stream
    cn.on('FLV',function(d){
        if(!s.group[d.ke]||!s.group[d.ke].mon||!s.group[d.ke].mon[d.id]){
            cn.disconnect();return;
        }
        cn.ip=cn.request.connection.remoteAddress;
        var toUTC = function(){
            return new Date().toISOString();
        }
        var tx=function(z){cn.emit('data',z);}
        d.failed=function(msg){
            tx({f:'stop_reconnect',msg:msg,token_used:d.auth,ke:d.ke});
            cn.disconnect();
        }
        d.success=function(r){
            r=r[0];
            var Emitter,chunkChannel
            if(!d.channel){
                Emitter = s.group[d.ke].mon[d.id].emitter
                chunkChannel = 'MAIN'
            }else{
                Emitter = s.group[d.ke].mon[d.id].emitterChannel[parseInt(d.channel)+config.pipeAddition]
                chunkChannel = parseInt(d.channel)+config.pipeAddition
            }
            if(!Emitter){
                cn.disconnect();return;
            }
            if(!d.channel)d.channel = 'MAIN';
            cn.ke=d.ke,
            cn.uid=d.uid,
            cn.auth=d.auth;
            cn.channel=d.channel;
            cn.removeListenerOnDisconnect=true;
            cn.socketVideoStream=d.id;
            var contentWriter
            cn.closeSocketVideoStream = function(){
                Emitter.removeListener('data', contentWriter);
            }
            tx({time:toUTC(),buffer:s.group[d.ke].mon[d.id].firstStreamChunk[chunkChannel]})
            Emitter.on('data',contentWriter = function(buffer){
                tx({time:toUTC(),buffer:buffer})
            })
         }
        if(s.group[d.ke]&&s.group[d.ke].users&&s.group[d.ke].users[d.auth]){
            d.success(s.group[d.ke].users[d.auth]);
        }else{
            s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND auth=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                if(r&&r[0]){
                    d.success(r)
                }else{
                    s.sqlQuery('SELECT * FROM API WHERE ke=? AND code=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                        if(r&&r[0]){
                            r=r[0]
                            r.details=JSON.parse(r.details)
                            if(r.details.auth_socket==='1'){
                                s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND uid=?',[r.ke,r.uid],function(err,r) {
                                    if(r&&r[0]){
                                        d.success(r)
                                    }else{
                                        d.failed('User not found')
                                    }
                                })
                            }else{
                                d.failed('Permissions for this key do not allow authentication with Websocket')
                            }
                        }else{
                            d.failed('Not an API key')
                        }
                    })
                }
            })
        }
    })
    //unique MP4 socket stream
    cn.on('MP4',function(d){
        if(!s.group[d.ke]||!s.group[d.ke].mon||!s.group[d.ke].mon[d.id]){
            cn.disconnect();return;
        }
        cn.ip=cn.request.connection.remoteAddress;
        var toUTC = function(){
            return new Date().toISOString();
        }
        var tx=function(z){cn.emit('data',z);}
        d.failed=function(msg){
            tx({f:'stop_reconnect',msg:msg,token_used:d.auth,ke:d.ke});
            cn.disconnect();
        }
        d.success=function(r){
            r=r[0];
            var Emitter,chunkChannel
            if(!d.channel){
                Emitter = s.group[d.ke].mon[d.id].emitter
                chunkChannel = 'MAIN'
            }else{
                Emitter = s.group[d.ke].mon[d.id].emitterChannel[parseInt(d.channel)+config.pipeAddition]
                chunkChannel = parseInt(d.channel)+config.pipeAddition
            }
            if(!Emitter){
                cn.disconnect();return;
            }
            if(!d.channel)d.channel = 'MAIN';
            cn.ke=d.ke,
            cn.uid=d.uid,
            cn.auth=d.auth;
            cn.channel=d.channel;
            cn.socketVideoStream=d.id;
            var mp4frag = s.group[d.ke].mon[d.id].mp4frag[d.channel];
            var onInitialized = () => {
                cn.emit('mime', mp4frag.mime);
                mp4frag.removeListener('initialized', onInitialized);
            };
            //event listener
            var onSegment = function(data){
                cn.emit('segment', data);
            };
            cn.closeSocketVideoStream = function(){
                mp4frag.removeListener('segment', onSegment)
                mp4frag.removeListener('initialized', onInitialized)
            }
            cn.on('MP4Command',function(msg){
                switch (msg) {
                    case 'mime' ://client is requesting mime
                        var mime = mp4frag.mime;
                        if (mime) {
                            cn.emit('mime', mime);
                        } else {
                            mp4frag.on('initialized', onInitialized);
                        }
                    break;
                    case 'initialization' ://client is requesting initialization segment
                        cn.emit('initialization', mp4frag.initialization);
                    break;
                    case 'segment' ://client is requesting a SINGLE segment
                        var segment = mp4frag.segment;
                        if (segment) {
                            cn.emit('segment', segment);
                        } else {
                            mp4frag.once('segment', onSegment);
                        }
                    break;
                    case 'segments' ://client is requesting ALL segments
                        //send current segment first to start video asap
                        var segment = mp4frag.segment;
                        if (segment) {
                            cn.emit('segment', segment);
                        }
                        //add listener for segments being dispatched by mp4frag
                        mp4frag.on('segment', onSegment);
                    break;
                    case 'pause' :
                        mp4frag.removeListener('segment', onSegment);
                    break;
                    case 'resume' :
                        mp4frag.on('segment', onSegment);
                    break;
                    case 'stop' ://client requesting to stop receiving segments
                        cn.closeSocketVideoStream()
                    break;
                }
            })
        }
        if(s.group[d.ke]&&s.group[d.ke].users&&s.group[d.ke].users[d.auth]){
            d.success(s.group[d.ke].users[d.auth]);
        }else{
            s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND auth=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                if(r&&r[0]){
                    d.success(r)
                }else{
                    s.sqlQuery('SELECT * FROM API WHERE ke=? AND code=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                        if(r&&r[0]){
                            r=r[0]
                            r.details=JSON.parse(r.details)
                            if(r.details.auth_socket==='1'){
                                s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND uid=?',[r.ke,r.uid],function(err,r) {
                                    if(r&&r[0]){
                                        d.success(r)
                                    }else{
                                        d.failed('User not found')
                                    }
                                })
                            }else{
                                d.failed('Permissions for this key do not allow authentication with Websocket')
                            }
                        }else{
                            d.failed('Not an API key')
                        }
                    })
                }
            })
        }
    })
    //main socket control functions
    cn.on('f',function(d){
        if(!cn.ke&&d.f==='init'){//socket login
            cn.ip=cn.request.connection.remoteAddress;
            tx=function(z){if(!z.ke){z.ke=cn.ke;};cn.emit('f',z);}
            d.failed=function(){tx({ok:false,msg:'Not Authorized',token_used:d.auth,ke:d.ke});cn.disconnect();}
            d.success=function(r){
                r=r[0];cn.join('GRP_'+d.ke);cn.join('CPU');
                cn.ke=d.ke,
                cn.uid=d.uid,
                cn.auth=d.auth;
                if(!s.group[d.ke])s.group[d.ke]={};
//                    if(!s.group[d.ke].vid)s.group[d.ke].vid={};
                if(!s.group[d.ke].users)s.group[d.ke].users={};
//                    s.group[d.ke].vid[cn.id]={uid:d.uid};
                s.group[d.ke].users[d.auth]={cnid:cn.id,uid:r.uid,mail:r.mail,details:JSON.parse(r.details),logged_in_at:s.timeObject(new Date).format(),login_type:'Dashboard'}
                try{s.group[d.ke].users[d.auth].details=JSON.parse(r.details)}catch(er){}
                if(s.group[d.ke].users[d.auth].details.get_server_log!=='0'){
                    cn.join('GRPLOG_'+d.ke)
                }
                s.group[d.ke].users[d.auth].lang=s.getLanguageFile(s.group[d.ke].users[d.auth].details.lang)
                s.log({ke:d.ke,mid:'$USER'},{type:s.group[d.ke].users[d.auth].lang['Websocket Connected'],msg:{mail:r.mail,id:d.uid,ip:cn.ip}})
                if(!s.group[d.ke].mon){
                    s.group[d.ke].mon={}
                    if(!s.group[d.ke].mon){s.group[d.ke].mon={}}
                }
                if(s.ocv){
                    tx({f:'detector_plugged',plug:s.ocv.plug,notice:s.ocv.notice})
                    s.ocvTx({f:'readPlugins',ke:d.ke})
                }
                tx({f:'users_online',users:s.group[d.ke].users})
                s.tx({f:'user_status_change',ke:d.ke,uid:cn.uid,status:1,user:s.group[d.ke].users[d.auth]},'GRP_'+d.ke)
                s.init('diskUsedEmit',d)
                s.init('apps',d)
                s.sqlQuery('SELECT * FROM API WHERE ke=? AND uid=?',[d.ke,d.uid],function(err,rrr) {
                    tx({
                        f:'init_success',
                        users:s.group[d.ke].vid,
                        apis:rrr,
                        os:{
                            platform:s.platform,
                            cpuCount:os.cpus().length,
                            totalmem:s.totalmem
                        }
                    })
                    try{
                        s.sqlQuery('SELECT * FROM Monitors WHERE ke=?', [d.ke], function(err,r) {
                            if(r && r[0]){
                                r.forEach(function(monitor){
                                    s.camera('snapshot',{mid:monitor.mid,ke:monitor.ke,mon:monitor})
                                })
                            }
                        })
                    }catch(err){
                        console.log(err)
                    }
                })
            }
            s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND auth=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                if(r&&r[0]){
                    d.success(r)
                }else{
                    s.sqlQuery('SELECT * FROM API WHERE ke=? AND code=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                        if(r&&r[0]){
                            r=r[0]
                            r.details=JSON.parse(r.details)
                            if(r.details.auth_socket==='1'){
                                s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND uid=?',[r.ke,r.uid],function(err,r) {
                                    if(r&&r[0]){
                                        d.success(r)
                                    }else{
                                        d.failed()
                                    }
                                })
                            }else{
                                d.failed()
                            }
                        }else{
                            d.failed()
                        }
                    })
                }
            })
            return;
        }
        if((d.id||d.uid||d.mid)&&cn.ke){
            try{
            switch(d.f){
                case'ocv_in':
                    s.ocvTx(d.data)
                break;
                case'monitorOrder':
                    if(d.monitorOrder&&d.monitorOrder instanceof Object){
                        s.sqlQuery('SELECT details FROM Users WHERE uid=? AND ke=?',[cn.uid,cn.ke],function(err,r){
                            if(r&&r[0]){
                                r=JSON.parse(r[0].details);
                                r.monitorOrder=d.monitorOrder;
                                s.sqlQuery('UPDATE Users SET details=? WHERE uid=? AND ke=?',[JSON.stringify(r),cn.uid,cn.ke])
                            }
                        })
                    }
                break;
                case'update':
                    if(!config.updateKey){
                        tx({error:lang.updateKeyText1});
                        return;
                    }
                    if(d.key===config.updateKey){
                        exec('chmod +x '+__dirname+'/UPDATE.sh&&'+__dirname+'/UPDATE.sh',{detached: true})
                    }else{
                        tx({error:lang.updateKeyText2});
                    }
                break;
                case'cron':
                    if(s.group[cn.ke]&&s.group[cn.ke].users[cn.auth].details&&!s.group[cn.ke].users[cn.auth].details.sub){
                        s.tx({f:d.ff},s.cron.id)
                    }
                break;
                case'api':
                    switch(d.ff){
                        case'delete':
                            d.set=[],d.ar=[];
                            d.form.ke=cn.ke;d.form.uid=cn.uid;delete(d.form.ip);
                            if(!d.form.code){tx({f:'form_incomplete',form:'APIs'});return}
                            d.for=Object.keys(d.form);
                            d.for.forEach(function(v){
                                d.set.push(v+'=?'),d.ar.push(d.form[v]);
                            });
                            s.sqlQuery('DELETE FROM API WHERE '+d.set.join(' AND '),d.ar,function(err,r){
                                if(!err){
                                    tx({f:'api_key_deleted',form:d.form});
                                    delete(s.api[d.form.code]);
                                }else{
                                    s.systemLog('API Delete Error : '+e.ke+' : '+' : '+e.mid,err)
                                }
                            })
                        break;
                        case'add':
                            d.set=[],d.qu=[],d.ar=[];
                            d.form.ke=cn.ke,d.form.uid=cn.uid,d.form.code=s.gid(30);
                            d.for=Object.keys(d.form);
                            d.for.forEach(function(v){
                                d.set.push(v),d.qu.push('?'),d.ar.push(d.form[v]);
                            });
                            s.sqlQuery('INSERT INTO API ('+d.set.join(',')+') VALUES ('+d.qu.join(',')+')',d.ar,function(err,r){
                                d.form.time=s.formattedTime(new Date,'YYYY-DD-MM HH:mm:ss');
                                if(!err){tx({f:'api_key_added',form:d.form});}else{s.systemLog(err)}
                            });
                        break;
                    }
                break;
                case'settings':
                    switch(d.ff){
                        case'filters':
                            switch(d.fff){
                                case'save':case'delete':
                                    s.sqlQuery('SELECT details FROM Users WHERE ke=? AND uid=?',[d.ke,d.uid],function(err,r){
                                        if(r&&r[0]){
                                            r=r[0];
                                            d.d=JSON.parse(r.details);
                                            if(d.form.id===''){d.form.id=s.gid(5)}
                                            if(!d.d.filters)d.d.filters={};
                                            //save/modify or delete
                                            if(d.fff==='save'){
                                                d.d.filters[d.form.id]=d.form;
                                            }else{
                                                delete(d.d.filters[d.form.id]);
                                            }
                                            s.sqlQuery('UPDATE Users SET details=? WHERE ke=? AND uid=?',[JSON.stringify(d.d),d.ke,d.uid],function(err,r){
                                                tx({f:'filters_change',uid:d.uid,ke:d.ke,filters:d.d.filters});
                                            });
                                        }
                                    })
                                break;
                            }
                        break;
                        case'edit':
                            s.sqlQuery('SELECT details FROM Users WHERE ke=? AND uid=?',[d.ke,d.uid],function(err,r){
                                if(r&&r[0]){
                                    r=r[0];
                                    d.d=JSON.parse(r.details);
                                    if(d.d.get_server_log==='1'){
                                        cn.join('GRPLOG_'+d.ke)
                                    }else{
                                        cn.leave('GRPLOG_'+d.ke)
                                    }
                                    ///unchangeable from client side, so reset them in case they did.
                                    d.form.details=JSON.parse(d.form.details)
                                    //admin permissions
                                    d.form.details.permissions=d.d.permissions
                                    d.form.details.edit_size=d.d.edit_size
                                    d.form.details.edit_days=d.d.edit_days
                                    d.form.details.use_admin=d.d.use_admin
                                    d.form.details.use_webdav=d.d.use_webdav
                                    d.form.details.use_ldap=d.d.use_ldap
                                    //check
                                    if(d.d.edit_days=="0"){
                                        d.form.details.days=d.d.days;
                                    }
                                    if(d.d.edit_size=="0"){
                                        d.form.details.size=d.d.size;
                                    }
                                    if(d.d.sub){
                                        d.form.details.sub=d.d.sub;
                                        if(d.d.monitors){d.form.details.monitors=d.d.monitors;}
                                        if(d.d.allmonitors){d.form.details.allmonitors=d.d.allmonitors;}
                                        if(d.d.video_delete){d.form.details.video_delete=d.d.video_delete;}
                                        if(d.d.video_view){d.form.details.video_view=d.d.video_view;}
                                        if(d.d.monitor_edit){d.form.details.monitor_edit=d.d.monitor_edit;}
                                        if(d.d.size){d.form.details.size=d.d.size;}
                                        if(d.d.days){d.form.details.days=d.d.days;}
                                        delete(d.form.details.mon_groups)
                                    }
                                    var newSize = d.form.details.size
                                    d.form.details=JSON.stringify(d.form.details)
                                    ///
                                    d.set=[],d.ar=[];
                                    if(d.form.pass&&d.form.pass!==''){d.form.pass=s.md5(d.form.pass);}else{delete(d.form.pass)};
                                    delete(d.form.password_again);
                                    d.for=Object.keys(d.form);
                                    d.for.forEach(function(v){
                                        d.set.push(v+'=?'),d.ar.push(d.form[v]);
                                    });
                                    d.ar.push(d.ke),d.ar.push(d.uid);
                                    s.sqlQuery('UPDATE Users SET '+d.set.join(',')+' WHERE ke=? AND uid=?',d.ar,function(err,r){
                                        if(!d.d.sub){
                                            s.group[d.ke].sizeLimit = parseFloat(newSize)
                                            delete(s.group[d.ke].webdav)
                                            s.init('apps',d)
                                        }
                                        tx({f:'user_settings_change',uid:d.uid,ke:d.ke,form:d.form});
                                    });
                                }
                            })
                        break;
                    }
                break;
                case'monitor':
                    switch(d.ff){
                        case'get':
                            switch(d.fff){
                                case'videos&events':
                                    if(!d.eventLimit){
                                        d.eventLimit=500
                                    }else{
                                        d.eventLimit = parseInt(d.eventLimit);
                                    }
                                    if(!d.eventStartDate&&d.startDate){
                                        d.eventStartDate=d.startDate
                                    }
                                    if(!d.eventEndDate&&d.endDate){
                                        d.eventEndDate=d.endDate
                                    }
                                    var monitorQuery = ''
                                    var monitorValues = []
                                    var permissions = s.group[d.ke].users[cn.auth].details;
                                    if(!d.mid){
                                        if(permissions.sub&&permissions.monitors&&permissions.allmonitors!=='1'){
                                            try{permissions.monitors=JSON.parse(permissions.monitors);}catch(er){}
                                            var or = [];
                                            permissions.monitors.forEach(function(v,n){
                                                or.push('mid=?');
                                                monitorValues.push(v)
                                            })
                                            monitorQuery += ' AND ('+or.join(' OR ')+')'
                                        }
                                    }else if(!permissions.sub||permissions.allmonitors!=='0'||permissions.monitors.indexOf(d.mid)>-1){
                                        monitorQuery += ' and mid=?';
                                        monitorValues.push(d.mid)
                                    }
                                    var getEvents = function(callback){
                                        var eventQuery = 'SELECT * FROM Events WHERE ke=?';
                                        var eventQueryValues = [cn.ke];
                                        if(d.eventStartDate&&d.eventStartDate!==''){
                                            d.eventStartDate=d.eventStartDate.replace('T',' ')
                                            if(d.eventEndDate&&d.eventEndDate!==''){
                                                d.eventEndDate=d.eventEndDate.replace('T',' ')
                                                eventQuery+=' AND `time` >= ? AND `time` <= ?';
                                                eventQueryValues.push(decodeURIComponent(d.eventStartDate))
                                                eventQueryValues.push(decodeURIComponent(d.eventEndDate))
                                            }else{
                                                eventQuery+=' AND `time` >= ?';
                                                eventQueryValues.push(decodeURIComponent(d.eventStartDate))
                                            }
                                        }
                                        if(monitorValues.length>0){
                                            eventQuery += monitorQuery;
                                            eventQueryValues = eventQueryValues.concat(monitorValues);
                                        }
                                        eventQuery+=' ORDER BY `time` DESC LIMIT '+d.eventLimit+'';
                                        s.sqlQuery(eventQuery,eventQueryValues,function(err,r){
                                            if(err){
                                                console.log(eventQuery)
                                                console.error('LINE 2428',err)
                                                setTimeout(function(){
                                                    getEvents(callback)
                                                },2000)
                                            }else{
                                                if(!r){r=[]}
                                                r.forEach(function(v,n){
                                                    r[n].details=JSON.parse(v.details);
                                                })
                                                callback(r)
                                            }
                                        })
                                    }
                                    if(!d.videoLimit&&d.limit){
                                        d.videoLimit=d.limit
                                        eventQuery.push()
                                    }
                                    if(!d.videoStartDate&&d.startDate){
                                        d.videoStartDate=d.startDate
                                    }
                                    if(!d.videoEndDate&&d.endDate){
                                        d.videoEndDate=d.endDate
                                    }
                                     var getVideos = function(callback){
                                        var videoQuery='SELECT * FROM Videos WHERE ke=?';
                                        var videoQueryValues=[cn.ke];
                                        if(d.videoStartDate||d.videoEndDate){
                                            if(!d.videoStartDateOperator||d.videoStartDateOperator==''){
                                                d.videoStartDateOperator='>='
                                            }
                                            if(!d.videoEndDateOperator||d.videoEndDateOperator==''){
                                                d.videoEndDateOperator='<='
                                            }
                                            switch(true){
                                                case(d.videoStartDate&&d.videoStartDate!==''&&d.videoEndDate&&d.videoEndDate!==''):
                                                    d.videoStartDate=d.videoStartDate.replace('T',' ')
                                                    d.videoEndDate=d.videoEndDate.replace('T',' ')
                                                    videoQuery+=' AND `time` '+d.videoStartDateOperator+' ? AND `end` '+d.videoEndDateOperator+' ?';
                                                    videoQueryValues.push(d.videoStartDate)
                                                    videoQueryValues.push(d.videoEndDate)
                                                break;
                                                case(d.videoStartDate&&d.videoStartDate!==''):
                                                    d.videoStartDate=d.videoStartDate.replace('T',' ')
                                                    videoQuery+=' AND `time` '+d.videoStartDateOperator+' ?';
                                                    videoQueryValues.push(d.videoStartDate)
                                                break;
                                                case(d.videoEndDate&&d.videoEndDate!==''):
                                                    d.videoEndDate=d.videoEndDate.replace('T',' ')
                                                    videoQuery+=' AND `end` '+d.videoEndDateOperator+' ?';
                                                    videoQueryValues.push(d.videoEndDate)
                                                break;
                                            }
                                        }
                                        if(monitorValues.length>0){
                                            videoQuery += monitorQuery;
                                            videoQueryValues = videoQueryValues.concat(monitorValues);
                                        }
                                        videoQuery+=' ORDER BY `time` DESC';
                                        if(!d.videoLimit||d.videoLimit==''){
                                            d.videoLimit='100'
                                        }
                                        if(d.videoLimit!=='0'){
                                            videoQuery+=' LIMIT '+d.videoLimit
                                        }
                                        s.sqlQuery(videoQuery,videoQueryValues,function(err,r){
                                            if(err){
                                                console.log(videoQuery)
                                                console.error('LINE 2416',err)
                                                setTimeout(function(){
                                                    getVideos(callback)
                                                },2000)
                                            }else{
                                                s.video('linkBuild',r,cn.auth)
                                                callback({total:r.length,limit:d.videoLimit,videos:r})
                                            }
                                        })
                                    }
                                    getVideos(function(videos){
                                        getEvents(function(events){
                                            tx({
                                                f:'drawPowerVideoMainTimeLine',
                                                videos:videos,
                                                events:events
                                            })
                                        })
                                    })
                                break;
                            }
                        break;
                        case'control':
                            s.camera('control',d,function(resp){
                                tx({f:'control',response:resp})
                            })
                        break;
                        case'jpeg_off':
                          delete(cn.jpeg_on);
                            if(cn.monitor_watching){
                              Object.keys(cn.monitor_watching).forEach(function(n,v){
                                  v=cn.monitor_watching[n];
                                  cn.join('MON_STREAM_'+n);
                              });
                            }
                            tx({f:'mode_jpeg_off'})
                        break;
                        case'jpeg_on':
                          cn.jpeg_on=true;
                            if(cn.monitor_watching){
                          Object.keys(cn.monitor_watching).forEach(function(n,v){
                              v=cn.monitor_watching[n];
                              cn.leave('MON_STREAM_'+n);
                          });
                            }
                          tx({f:'mode_jpeg_on'})
                        break;
                        case'watch_on':
                            if(!d.ke){d.ke=cn.ke}
                            s.init(0,{mid:d.id,ke:d.ke});
                            if(!s.group[d.ke]||!s.group[d.ke].mon[d.id]||s.group[d.ke].mon[d.id].started===0){return false}
                            s.camera(d.ff,d,cn,tx)
                            cn.join('MON_'+d.id);
                            cn.join('DETECTOR_'+d.ke+d.id);
                            if(cn.jpeg_on!==true){
                                cn.join('MON_STREAM_'+d.id);
                            } if(s.group[d.ke]&&s.group[d.ke].mon&&s.group[d.ke].mon[d.id]&&s.group[d.ke].mon[d.id].watch){

                                tx({f:'monitor_watch_on',id:d.id,ke:d.ke})
                                s.tx({viewers:Object.keys(s.group[d.ke].mon[d.id].watch).length,ke:d.ke,id:d.id},'MON_'+d.id)
                           }
                        break;
                        case'watch_off':
                            if(!d.ke){d.ke=cn.ke;};cn.leave('MON_'+d.id);s.camera(d.ff,d,cn,tx);
                            s.tx({viewers:d.ob,ke:d.ke,id:d.id},'MON_'+d.id)
                        break;
                        case'start':case'stop':
                    s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND mid=?',[cn.ke,d.id],function(err,r) {
                        if(r&&r[0]){r=r[0]
                            s.camera(d.ff,{type:r.type,url:s.init('url',r),id:d.id,mode:d.ff,ke:cn.ke});
                        }
                    })
                        break;
                    }
                break;
//                case'video':
//                    switch(d.ff){
//                        case'fix':
//                            s.video('fix',d)
//                        break;
//                    }
//                break;
                case'ffprobe':
                    if(s.group[cn.ke].users[cn.auth]){
                        switch(d.ff){
                            case'stop':
                                exec('kill -9 '+s.group[cn.ke].users[cn.auth].ffprobe.pid,{detatched: true})
                            break;
                            default:
                                if(s.group[cn.ke].users[cn.auth].ffprobe){
                                    return
                                }
                                s.group[cn.ke].users[cn.auth].ffprobe=1;
                                tx({f:'ffprobe_start'})
                                exec('ffprobe '+('-v quiet -print_format json -show_format -show_streams '+d.query),function(err,data){
                                    tx({f:'ffprobe_data',data:data.toString('utf8')})
                                    delete(s.group[cn.ke].users[cn.auth].ffprobe)
                                    tx({f:'ffprobe_stop'})
                                })
                                //auto kill in 30 seconds
                                setTimeout(function(){
                                    exec('kill -9 '+d.pid,{detached: true})
                                },30000)
                            break;
                        }
                    }
                break;
                case'onvif':
                    d.ip=d.ip.replace(/ /g,'');
                    d.port=d.port.replace(/ /g,'');
                    if(d.ip===''){
                        var interfaces = os.networkInterfaces();
                        var addresses = [];
                        for (var k in interfaces) {
                            for (var k2 in interfaces[k]) {
                                var address = interfaces[k][k2];
                                if (address.family === 'IPv4' && !address.internal) {
                                    addresses.push(address.address);
                                }
                            }
                        }
                        d.arr=[]
                        addresses.forEach(function(v){
                            if(v.indexOf('0.0.0')>-1){return false}
                            v=v.split('.');
                            delete(v[3]);
                            v=v.join('.');
                            d.arr.push(v+'1-'+v+'254')
                        })
                        d.ip=d.arr.join(',')
                    }
                    if(d.port===''){
                        d.port='80,8080,8000,7575,8081,554'
                    }
                    d.ip.split(',').forEach(function(v){
                        if(v.indexOf('-')>-1){
                            v=v.split('-');
                            d.IP_RANGE_START = v[0],
                            d.IP_RANGE_END = v[1];
                        }else{
                            d.IP_RANGE_START = v;
                            d.IP_RANGE_END = v;
                        }
                        if(!d.IP_LIST){
                            d.IP_LIST = s.ipRange(d.IP_RANGE_START,d.IP_RANGE_END);
                        }else{
                            d.IP_LIST=d.IP_LIST.concat(s.ipRange(d.IP_RANGE_START,d.IP_RANGE_END))
                        }
                        //check port
                        if(d.port.indexOf('-')>-1){
                            d.port=d.port.split('-');
                            d.PORT_RANGE_START = d.port[0];
                            d.PORT_RANGE_END = d.port[1];
                            d.PORT_LIST = s.portRange(d.PORT_RANGE_START,d.PORT_RANGE_END);
                        }else{
                            d.PORT_LIST=d.port.split(',')
                        }
                        //check user name and pass
                        d.USERNAME='';
                        if(d.user){
                            d.USERNAME = d.user
                        }
                        d.PASSWORD='';
                        if(d.pass){
                            d.PASSWORD = d.pass
                        }
                    })
                    d.cams=[]
                    d.IP_LIST.forEach(function(ip_entry,n) {
                        d.PORT_LIST.forEach(function(port_entry,nn) {
                            var device = new onvif.OnvifDevice({
                                xaddr : 'http://' + ip_entry + ':' + port_entry + '/onvif/device_service',
                                user : d.USERNAME,
                                pass : d.PASSWORD
                            })
                            device.init().then((info) => {
                                var data = {
                                    f : 'onvif',
                                    ip : ip_entry,
                                    port : port_entry,
                                    info : info
                                }
                                device.services.device.getSystemDateAndTime().then((date) => {
                                    data.date = date
                                    device.services.media.getStreamUri({
                                        ProfileToken : device.current_profile.token,
                                        Protocol : 'RTSP'
                                    }).then((stream) => {
                                        data.uri = stream.data.GetStreamUriResponse.MediaUri.Uri
                                        tx(data)
                                    }).catch((error) => {
//                                        console.log(error)
                                    });
                                }).catch((error) => {
//                                    console.log(error)
                                });
                            }).catch(function(error){
//                                console.log(error)
                            })
                        });
                    });
//                    tx({f:'onvif_end'})
                break;
            }
        }catch(er){
            s.systemLog('ERROR CATCH 1',er)
        }
        }else{
            tx({ok:false,msg:lang.NotAuthorizedText1});
        }
    });
    // admin page socket functions
    cn.on('super',function(d){
        if(!cn.init&&d.f=='init'){
            d.ok=s.superAuth({mail:d.mail,pass:d.pass},function(data){
                cn.uid=d.mail
                cn.join('$');
                cn.ip=cn.request.connection.remoteAddress
                s.log({ke:'$',mid:'$USER'},{type:lang['Websocket Connected'],msg:{for:lang['Superuser'],id:cn.uid,ip:cn.ip}})
                cn.init='super';
                cn.mail=d.mail;
                s.tx({f:'init_success',mail:d.mail},cn.id);
            })
            if(d.ok===false){
                cn.disconnect();
            }
        }else{
            if(cn.mail&&cn.init=='super'){
                switch(d.f){
                    case'logs':
                        switch(d.ff){
                            case'delete':
                                s.sqlQuery('DELETE FROM Logs WHERE ke=?',[d.ke])
                            break;
                        }
                    break;
                    case'system':
                        switch(d.ff){
                            case'update':
                                s.ffmpegKill()
                                s.systemLog('Shinobi ordered to update',{by:cn.mail,ip:cn.ip,distro:d.distro})
                                var updateProcess = spawn('sh',(__dirname+'/UPDATE.sh '+d.distro).split(' '),{detached: true})
                                updateProcess.stderr.on('data',function(data){
                                    s.systemLog('Update Info',data.toString())
                                })
                                updateProcess.stdout.on('data',function(data){
                                    s.systemLog('Update Info',data.toString())
                                })
                            break;
                            case'restart':
                                d.check=function(x){return d.target.indexOf(x)>-1}
                                if(d.check('system')){
                                    s.systemLog('Shinobi ordered to restart',{by:cn.mail,ip:cn.ip})
                                    s.ffmpegKill()
                                    exec('pm2 restart '+__dirname+'/camera.js')
                                }
                                if(d.check('cron')){
                                    s.systemLog('Shinobi CRON ordered to restart',{by:cn.mail,ip:cn.ip})
                                    exec('pm2 restart '+__dirname+'/cron.js')
                                }
                                if(d.check('logs')){
                                    s.systemLog('Flush PM2 Logs',{by:cn.mail,ip:cn.ip})
                                    exec('pm2 flush')
                                }
                            break;
                            case'configure':
                                s.systemLog('conf.json Modified',{by:cn.mail,ip:cn.ip,old:jsonfile.readFileSync(location.config)})
                                jsonfile.writeFile(location.config,d.data,{spaces: 2},function(){
                                    s.tx({f:'save_configuration'},cn.id)
                                })
                            break;
                        }
                    break;
                    case'accounts':
                        switch(d.ff){
                            case'register':
                                if(d.form.mail!==''&&d.form.pass!==''){
                                    if(d.form.pass===d.form.password_again){
                                        s.sqlQuery('SELECT * FROM Users WHERE mail=?',[d.form.mail],function(err,r) {
                                            if(r&&r[0]){
                                                //found address already exists
                                                d.msg='Email address is in use.';
                                                s.tx({f:'error',ff:'account_register',msg:d.msg},cn.id)
                                            }else{
                                                //create new
                                                //user id
                                                d.form.uid=s.gid();
                                                //check to see if custom key set
                                                if(!d.form.ke||d.form.ke===''){
                                                    d.form.ke=s.gid()
                                                }
                                                //write user to db
                                                s.sqlQuery('INSERT INTO Users (ke,uid,mail,pass,details) VALUES (?,?,?,?,?)',[d.form.ke,d.form.uid,d.form.mail,s.md5(d.form.pass),d.form.details])
                                                s.tx({f:'add_account',details:d.form.details,ke:d.form.ke,uid:d.form.uid,mail:d.form.mail},'$');
                                                //init user
                                                s.init('group',d.form)
                                            }
                                        })
                                    }else{
                                        d.msg=lang["Passwords Don't Match"];
                                    }
                                }else{
                                    d.msg=lang['Fields cannot be empty'];
                                }
                                if(d.msg){
                                    s.tx({f:'error',ff:'account_register',msg:d.msg},cn.id)
                                }
                            break;
                            case'edit':
                                if(d.form.pass&&d.form.pass!==''){
                                   if(d.form.pass===d.form.password_again){
                                       d.form.pass=s.md5(d.form.pass);
                                   }else{
                                       s.tx({f:'error',ff:'account_edit',msg:lang["Passwords Don't Match"]},cn.id)
                                       return
                                   }
                                }else{
                                    delete(d.form.pass);
                                }
                                delete(d.form.password_again);
                                d.keys=Object.keys(d.form);
                                d.set=[];
                                d.values=[];
                                d.keys.forEach(function(v,n){
                                    if(d.set==='ke'||d.set==='password_again'||!d.form[v]){return}
                                    d.set.push(v+'=?')
                                    d.values.push(d.form[v])
                                })
                                d.values.push(d.account.mail)
                                s.sqlQuery('UPDATE Users SET '+d.set.join(',')+' WHERE mail=?',d.values,function(err,r) {
                                    if(err){
                                        s.tx({f:'error',ff:'account_edit',msg:lang.AccountEditText1},cn.id)
                                        return
                                    }
                                    s.tx({f:'edit_account',form:d.form,ke:d.account.ke,uid:d.account.uid},'$');
                                    delete(s.group[d.account.ke].init);
                                    s.init('apps',d.account)
                                })
                            break;
                            case'delete':
                                s.sqlQuery('DELETE FROM Users WHERE uid=? AND ke=? AND mail=?',[d.account.uid,d.account.ke,d.account.mail])
                                s.sqlQuery('DELETE FROM API WHERE uid=? AND ke=?',[d.account.uid,d.account.ke])
                                s.tx({f:'delete_account',ke:d.account.ke,uid:d.account.uid,mail:d.account.mail},'$');
                            break;
                        }
                    break;
                }
            }
        }
    })
    // admin page socket functions
    cn.on('a',function(d){
        if(!cn.init&&d.f=='init'){
            s.sqlQuery('SELECT * FROM Users WHERE auth=? AND uid=?',[d.auth,d.uid],function(err,r){
                if(r&&r[0]){
                    r=r[0];
                    if(!s.group[d.ke]){s.group[d.ke]={users:{}}}
                    if(!s.group[d.ke].users[d.auth]){s.group[d.ke].users[d.auth]={cnid:cn.id}}
                    try{s.group[d.ke].users[d.auth].details=JSON.parse(r.details)}catch(er){}
                    cn.join('ADM_'+d.ke);
                    cn.ke=d.ke;
                    cn.uid=d.uid;
                    cn.auth=d.auth;
                    cn.init='admin';
                }else{
                    cn.disconnect();
                }
            })
        }else{
            s.auth({auth:d.auth,ke:d.ke,id:d.id,ip:cn.request.connection.remoteAddress},function(user){
                if(!user.details.sub){
                    switch(d.f){
                        case'accounts':
                            switch(d.ff){
                                case'edit':
                                    d.keys=Object.keys(d.form);
                                    d.condition=[];
                                    d.value=[];
                                    d.keys.forEach(function(v){
                                        d.condition.push(v+'=?')
                                        d.value.push(d.form[v])
                                    })
                                    d.value=d.value.concat([d.ke,d.$uid])
                                    s.sqlQuery("UPDATE Users SET "+d.condition.join(',')+" WHERE ke=? AND uid=?",d.value)
                                    s.tx({f:'edit_sub_account',ke:d.ke,uid:d.$uid,mail:d.mail,form:d.form},'ADM_'+d.ke);
                                break;
                                case'delete':
                                    s.sqlQuery('DELETE FROM Users WHERE uid=? AND ke=? AND mail=?',[d.$uid,d.ke,d.mail])
                                    s.sqlQuery('DELETE FROM API WHERE uid=? AND ke=?',[d.$uid,d.ke])
                                    s.tx({f:'delete_sub_account',ke:d.ke,uid:d.$uid,mail:d.mail},'ADM_'+d.ke);
                                break;
                            }
                        break;
                    }
                }
            })
        }
    })
    //functions for webcam recorder
    cn.on('r',function(d){
        if(!cn.ke&&d.f==='init'){
            s.sqlQuery('SELECT ke,uid,auth,mail,details FROM Users WHERE ke=? AND auth=? AND uid=?',[d.ke,d.auth,d.uid],function(err,r) {
                if(r&&r[0]){
                    r=r[0]
                    cn.ke=d.ke,cn.uid=d.uid,cn.auth=d.auth;
                    if(!s.group[d.ke])s.group[d.ke]={};
                    if(!s.group[d.ke].users)s.group[d.ke].users={};
                    s.group[d.ke].users[d.auth]={cnid:cn.id,uid:r.uid,mail:r.mail,details:JSON.parse(r.details),logged_in_at:s.timeObject(new Date).format(),login_type:'Streamer'}
                }
            })
        }else{
            switch(d.f){
                case'monitor_chunk':
                    if(!s.group[d.ke]||!s.group[d.ke].mon[d.mid]){return}
                    if(s.group[d.ke].mon[d.mid].started!==1){s.tx({error:'Not Started'},cn.id);return false};
                    s.group[d.ke].mon[d.mid].spawn.stdin.write(new Buffer(d.chunk, "binary"));
                break;
                case'monitor_frame':
                    if(!s.group[d.ke]||!s.group[d.ke].mon[d.mid]){return}
                    if(s.group[d.ke].mon[d.mid].started!==1){s.tx({error:'Not Started'},cn.id);return false};
                    s.group[d.ke].mon[d.mid].spawn.stdin.write(d.frame);
                break;
            }
        }
    })
    //embed functions
    cn.on('e', function (d) {
        tx=function(z){if(!z.ke){z.ke=cn.ke;};cn.emit('f',z);}
        switch(d.f){
            case'init':
                    if(!s.group[d.ke]||!s.group[d.ke].mon[d.id]||s.group[d.ke].mon[d.id].started===0){return false}
                s.auth({auth:d.auth,ke:d.ke,id:d.id,ip:cn.request.connection.remoteAddress},function(user){
                    cn.embedded=1;
                    cn.ke=d.ke;
                    if(!cn.mid){cn.mid={}}
                    cn.mid[d.id]={};
//                    if(!s.group[d.ke].embed){s.group[d.ke].embed={}}
//                    if(!s.group[d.ke].embed[d.mid]){s.group[d.ke].embed[d.mid]={}}
//                    s.group[d.ke].embed[d.mid][cn.id]={}

                    s.camera('watch_on',d,cn,tx)
                    cn.join('MON_'+d.id);
                    cn.join('MON_STREAM_'+d.id);
                    cn.join('DETECTOR_'+d.ke+d.id);
                    cn.join('STR_'+d.ke);
                    if(s.group[d.ke]&&s.group[d.ke].mon[d.id]&&s.group[d.ke].mon[d.id].watch){

                        tx({f:'monitor_watch_on',id:d.id,ke:d.ke},'MON_'+d.id)
                        s.tx({viewers:Object.keys(s.group[d.ke].mon[d.id].watch).length,ke:d.ke,id:d.id},'MON_'+d.id)
                   }
                });
            break;
        }
    })
    cn.on('disconnect', function () {
        if(cn.socketVideoStream){
            cn.closeSocketVideoStream()
            return
        }
        if(cn.ke){
            if(cn.monitor_watching){
                cn.monitor_count=Object.keys(cn.monitor_watching)
                if(cn.monitor_count.length>0){
                    cn.monitor_count.forEach(function(v){
                        s.camera('watch_off',{id:v,ke:cn.monitor_watching[v].ke},s.cn(cn))
                    })
                }
            }else if(!cn.embedded){
                if(s.group[cn.ke].users[cn.auth].login_type==='Dashboard'){
                    s.tx({f:'user_status_change',ke:cn.ke,uid:cn.uid,status:0})
                }
                s.log({ke:cn.ke,mid:'$USER'},{type:lang['Websocket Disconnected'],msg:{mail:s.group[cn.ke].users[cn.auth].mail,id:cn.uid,ip:cn.ip}})
                delete(s.group[cn.ke].users[cn.auth]);
            }
        }
        if(cn.pluginEngine){
            s.connectedPlugins[cn.pluginEngine].plugged=false
            s.tx({f:'plugin_engine_unplugged',plug:cn.pluginEngine},'CPU')
            delete(s.api[cn.pluginEngine])
        }
        if(cn.ocv){
            s.tx({f:'detector_unplugged',plug:s.ocv.plug},'CPU')
            delete(s.ocv);
            delete(s.api[cn.id])
        }
    })
});
//Authenticator functions
s.api={};
//auth handler
//params = parameters
//cb = callback
//res = response, only needed for express (http server)
//request = request, only needed for express (http server)
s.checkChildProxy = function(params,cb,res,req){
    if(s.group[params.ke] && s.group[params.ke].mon[params.id] && s.group[params.ke].mon[params.id].childNode){
        var url = 'http://' + s.group[params.ke].mon[params.id].childNode// + req.originalUrl
        proxy.web(req, res, { target: url })
    }else{
        cb()
    }
}
//auth handler
//params = parameters
//cb = callback
//res = response, only needed for express (http server)
//request = request, only needed for express (http server)
s.auth = function(params,cb,res,req){
    if(req){
        //express (http server) use of auth function
        params.ip=req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var failed=function(){
            if(!req.ret){req.ret={ok:false}}
            req.ret.msg=lang['Not Authorized'];
            res.end(s.s(req.ret, null, 3));
        }
    }else{
        //socket.io use of auth function
        var failed=function(){
            //maybe log
        }
    }
    var clearAfterTime=function(){
        //remove temp key from memory
        clearTimeout(s.api[params.auth].timeout)
        s.api[params.auth].timeout=setTimeout(function(){
            delete(s.api[params.auth])
        },1000*60*5)
    }
    //check IP address of connecting user
    var finish=function(user){
        if(s.api[params.auth].ip.indexOf('0.0.0.0')>-1||s.api[params.auth].ip.indexOf(params.ip)>-1){
            cb(user);
        }else{
            failed();
        }
    }
    //check if auth key is user's temporary session key
    if(s.group[params.ke]&&s.group[params.ke].users&&s.group[params.ke].users[params.auth]){
        s.group[params.ke].users[params.auth].permissions={};
        cb(s.group[params.ke].users[params.auth]);
    }else{
        //check if key is already in memory to save query time
        if(s.api[params.auth]&&s.api[params.auth].details){
            finish(s.api[params.auth]);
            if(s.api[params.auth].timeout){
               clearAfterTime()
            }
        }else{
            //no key in memory, query db to see if key exists
            //check if using username and password in plain text or md5
            if(params.username&&params.username!==''&&params.password&&params.password!==''){
                s.sqlQuery('SELECT * FROM Users WHERE mail=? AND (pass=? OR pass=?)',[params.username,params.password,s.md5(params.password)],function(err,r){
                    if(r&&r[0]){
                        r=r[0];
                        r.ip='0.0.0.0';
                        r.auth = s.gid(20);
                        params.auth = r.auth;
                        r.details=JSON.parse(r.details);
                        r.permissions = {};
                        s.api[r.auth]=r;
                        clearAfterTime();
                        finish(r);
                    }else{
                        failed();
                    }
                })
            }else{
                //not using plain login
                s.sqlQuery('SELECT * FROM API WHERE code=? AND ke=?',[params.auth,params.ke],function(err,r){
                    if(r&&r[0]){
                        r=r[0];
                        s.api[params.auth]={ip:r.ip,uid:r.uid,ke:r.ke,permissions:JSON.parse(r.details),details:{}};
                        s.sqlQuery('SELECT details FROM Users WHERE uid=? AND ke=?',[r.uid,r.ke],function(err,rr){
                            if(rr&&rr[0]){
                                rr=rr[0];
                                try{
                                    s.api[params.auth].mail=rr.mail
                                    s.api[params.auth].details=JSON.parse(rr.details)
                                    s.api[params.auth].lang=s.getLanguageFile(s.api[params.auth].details.lang)
                                }catch(er){}
                            }
                            finish(s.api[params.auth]);
                        })
                    }else{
                        s.sqlQuery('SELECT * FROM Users WHERE auth=? AND ke=?',[params.auth,params.ke],function(err,r){
                            if(r&&r[0]){
                                r=r[0];
                                r.ip='0.0.0.0'
                                s.api[params.auth]=r
                                s.api[params.auth].details=JSON.parse(r.details)
                                s.api[params.auth].permissions={}
                                clearAfterTime()
                                finish(r)
                            }else{
                                failed();
                            }
                        })
                    }
                })
            }
        }
    }
}
//super user authentication handler
s.superAuth=function(x,callback){
    req={};
    req.super=require(location.super);
    req.super.forEach(function(v,n){
        if(x.md5===true){
            x.pass=s.md5(x.pass);
        }
        if(x.mail.toLowerCase()===v.mail.toLowerCase()&&x.pass===v.pass){
            req.found=1;
            if(x.users===true){
                s.sqlQuery('SELECT * FROM Users WHERE details NOT LIKE ?',['%"sub"%'],function(err,r) {
                    callback({$user:v,users:r,config:config,lang:lang})
                })
            }else{
                callback({$user:v,config:config,lang:lang})
            }
        }
    })
    if(req.found!==1){
        return false;
    }else{
        return true;
    }
}
////Pages
app.enable('trust proxy');
app.use('/libs',express.static(__dirname + '/web/libs'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', __dirname + '/web');
app.set('view engine','ejs');
//add template handler
if(config.renderPaths.handler!==undefined){require(__dirname+'/web/'+config.renderPaths.handler+'.js').addHandlers(s,app,io)}

//readme
app.get('/:auth/logout/:ke/:id', function (req,res){
    if(s.group[req.params.ke]&&s.group[req.params.ke].users[req.params.auth]){
        delete(s.api[req.params.auth]);
        delete(s.group[req.params.ke].users[req.params.auth]);
        s.sqlQuery("UPDATE Users SET auth=? WHERE auth=? AND ke=? AND uid=?",['',req.params.auth,req.params.ke,req.params.id])
        res.end(s.s({ok:true,msg:'You have been logged out, session key is now inactive.'}, null, 3))
    }else{
        res.end(s.s({ok:false,msg:'This group key does not exist or this user is not logged in.'}, null, 3))
    }
});
//main page
app.get(config.webPaths.index, function (req,res){
    res.render(config.renderPaths.index,{lang:lang,config:config,screen:'dashboard'},function(err,html){
        if(err){
            s.systemLog(err)
        }
        res.end(html)
    })
});
//admin page
app.get(config.webPaths.admin, function (req,res){
    res.render(config.renderPaths.index,{lang:lang,config:config,screen:'admin'},function(err,html){
        if(err){
            s.systemLog(err)
        }
        res.end(html)
    })
});
//super page
app.get(config.webPaths.super, function (req,res){
    res.render(config.renderPaths.index,{lang:lang,config:config,screen:'super'},function(err,html){
        if(err){
            s.systemLog(err)
        }
        res.end(html)
    })
});
//update server
app.get('/:auth/update/:key', function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    req.fn=function(user){
        if(!config.updateKey){
            req.ret.msg=user.lang.updateKeyText1;
            return;
        }
        if(req.params.key===config.updateKey){
            req.ret.ok=true;
            exec('chmod +x '+__dirname+'/UPDATE.sh&&'+__dirname+'/UPDATE.sh',{detached: true})
        }else{
            req.ret.msg=user.lang.updateKeyText2;
        }
        res.end(s.s(req.ret, null, 3));
    }
    s.auth(req.params,req.fn,res,req);
});
//get user details by API key
app.get('/:auth/userInfo/:ke',function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        req.ret.ok=true
        req.ret.user=user
        res.end(s.s(req.ret, null, 3));
    },res,req);
})
//register function
app.post('/:auth/register/:ke/:uid',function (req,res){
    req.resp={ok:false};
    res.setHeader('Content-Type', 'application/json');
    s.auth(req.params,function(user){
        s.sqlQuery('SELECT * FROM Users WHERE uid=? AND ke=? AND details NOT LIKE ? LIMIT 1',[req.params.uid,req.params.ke,'%"sub"%'],function(err,u) {
            if(u&&u[0]){
                if(req.body.mail!==''&&req.body.pass!==''){
                    if(req.body.pass===req.body.password_again){
                        s.sqlQuery('SELECT * FROM Users WHERE mail=?',[req.body.mail],function(err,r) {
                            if(r&&r[0]){//found one exist
                                req.resp.msg='Email address is in use.';
                            }else{//create new
                                req.resp.msg='New Account Created';req.resp.ok=true;
                                req.gid=s.gid();
                                req.body.details='{"sub":"1","allmonitors":"1"}';
                                s.sqlQuery('INSERT INTO Users (ke,uid,mail,pass,details) VALUES (?,?,?,?,?)',[req.params.ke,req.gid,req.body.mail,s.md5(req.body.pass),req.body.details])
                                s.tx({f:'add_sub_account',details:req.body.details,ke:req.params.ke,uid:req.gid,mail:req.body.mail},'ADM_'+req.params.ke);
                            }
                            res.end(s.s(req.resp,null,3));
                        })
                    }else{
                        req.resp.msg=user.lang['Passwords Don\'t Match'];
                    }
                }else{
                    req.resp.msg=user.lang['Fields cannot be empty'];
                }
            }else{
                req.resp.msg=user.lang['Not an Administrator Account'];
            }
            if(req.resp.msg){
                res.end(s.s(req.resp,null,3));
            }
        })
    },res,req);
})
//login function
s.deleteFactorAuth=function(r){
    delete(s.factorAuth[r.ke][r.uid])
    if(Object.keys(s.factorAuth[r.ke]).length===0){
        delete(s.factorAuth[r.ke])
    }
}
app.post(['/','/:screen'],function (req,res){
    req.ip=req.headers['cf-connecting-ip']||req.headers["CF-Connecting-IP"]||req.headers["'x-forwarded-for"]||req.connection.remoteAddress;
    if(req.query.json=='true'){
        res.header("Access-Control-Allow-Origin",req.headers.origin);
    }
    req.renderFunction=function(focus,data){
        if(req.query.json=='true'){
            delete(data.config)
            data.ok=true;
            res.setHeader('Content-Type', 'application/json');
            res.end(s.s(data, null, 3))
        }else{
            data.screen=req.params.screen
            res.render(focus,data,function(err,html){
                if(err){
                    s.systemLog(err)
                }
                res.end(html)
            });
        }
    }
    req.failed=function(board){
        if(req.query.json=='true'){
            res.setHeader('Content-Type', 'application/json');
            res.end(s.s({ok:false}, null, 3))
        }else{
            res.render(config.renderPaths.index,{failedLogin:true,lang:lang,config:config,screen:req.params.screen},function(err,html){
                if(err){
                    s.systemLog(err)
                }
                res.end(html);
            });
        }
        req.logTo={ke:'$',mid:'$USER'}
        req.logData={type:lang['Authentication Failed'],msg:{for:board,mail:req.body.mail,ip:req.ip}}
        if(board==='super'){
            s.log(req.logTo,req.logData)
        }else{
            s.sqlQuery('SELECT ke,uid,details FROM Users WHERE mail=?',[req.body.mail],function(err,r) {
                if(r&&r[0]){
                    r=r[0]
                    r.details=JSON.parse(r.details);
                    r.lang=s.getLanguageFile(r.details.lang)
                    req.logData.id=r.uid
                    req.logData.type=r.lang['Authentication Failed']
                    req.logTo.ke=r.ke
                }
                s.log(req.logTo,req.logData)
            })
        }
    }
    req.fn=function(r){
        switch(req.body.function){
            case'cam':
                s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND type=?',[r.ke,"dashcam"],function(err,rr){
                    req.resp.mons=rr;
                    req.renderFunction(config.renderPaths.dashcam,{$user:req.resp,lang:r.lang,define:s.getDefinitonFile(r.details.lang)});
                })
            break;
            case'streamer':
                s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND type=?',[r.ke,"socket"],function(err,rr){
                    req.resp.mons=rr;
                    req.renderFunction(config.renderPaths.streamer,{$user:req.resp,lang:r.lang,define:s.getDefinitonFile(r.details.lang)});
                })
            break;
            case'admin':
                if(!r.details.sub){
                    s.sqlQuery('SELECT uid,mail,details FROM Users WHERE ke=? AND details LIKE \'%"sub"%\'',[r.ke],function(err,rr) {
                        s.sqlQuery('SELECT * FROM Monitors WHERE ke=?',[r.ke],function(err,rrr) {
                            req.renderFunction(config.renderPaths.admin,{$user:req.resp,$subs:rr,$mons:rrr,lang:r.lang,define:s.getDefinitonFile(r.details.lang)});
                        })
                    })
                }else{
                    //not admin user
                    req.renderFunction(config.renderPaths.home,{$user:req.resp,config:config,lang:r.lang,define:s.getDefinitonFile(r.details.lang),addStorage:s.dir.addStorage,fs:fs,__dirname:__dirname});
                }
            break;
            default:
                req.renderFunction(config.renderPaths.home,{$user:req.resp,config:config,lang:r.lang,define:s.getDefinitonFile(r.details.lang),addStorage:s.dir.addStorage,fs:fs,__dirname:__dirname});
            break;
        }
        s.log({ke:r.ke,mid:'$USER'},{type:r.lang['New Authentication Token'],msg:{for:req.body.function,mail:r.mail,id:r.uid,ip:req.ip}})
    //    res.end();
    }
    if(req.body.mail&&req.body.pass){
        req.default=function(){
            s.sqlQuery('SELECT * FROM Users WHERE mail=? AND pass=?',[req.body.mail,s.md5(req.body.pass)],function(err,r) {
                req.resp={ok:false};
                if(!err&&r&&r[0]){
                    r=r[0];r.auth=s.md5(s.gid());
                    s.sqlQuery("UPDATE Users SET auth=? WHERE ke=? AND uid=?",[r.auth,r.ke,r.uid])
                    req.resp={ok:true,auth_token:r.auth,ke:r.ke,uid:r.uid,mail:r.mail,details:r.details};
                    r.details=JSON.parse(r.details);
                    r.lang=s.getLanguageFile(r.details.lang)
                    req.factorAuth=function(cb){
                        if(r.details.factorAuth==="1"){
                            if(!r.details.acceptedMachines||!(r.details.acceptedMachines instanceof Object)){
                                r.details.acceptedMachines={}
                            }
                            if(!r.details.acceptedMachines[req.body.machineID]){
                                req.complete=function(){
                                    s.factorAuth[r.ke][r.uid].info=req.resp;
                                    clearTimeout(s.factorAuth[r.ke][r.uid].expireAuth)
                                    s.factorAuth[r.ke][r.uid].expireAuth=setTimeout(function(){
                                        s.deleteFactorAuth(r)
                                    },1000*60*15)
                                    req.renderFunction(config.renderPaths.factorAuth,{$user:req.resp,lang:r.lang})
                                }
                                if(!s.factorAuth[r.ke]){s.factorAuth[r.ke]={}}
                                if(!s.factorAuth[r.ke][r.uid]){
                                    s.factorAuth[r.ke][r.uid]={key:s.nid(),user:r}
                                    r.mailOptions = {
                                        from: '"ShinobiCCTV" <no-reply@shinobi.video>',
                                        to: r.mail,
                                        subject: r.lang['2-Factor Authentication'],
                                        html: r.lang['Enter this code to proceed']+' <b>'+s.factorAuth[r.ke][r.uid].key+'</b>. '+r.lang.FactorAuthText1,
                                    };
                                    nodemailer.sendMail(r.mailOptions, (error, info) => {
                                        if (error) {
                                            s.systemLog(r.lang.MailError,error)
                                            req.fn(r)
                                            return
                                        }
                                        req.complete()
                                    });
                                }else{
                                    req.complete()
                                }
                            }else{
                               req.fn(r)
                            }
                        }else{
                           req.fn(r)
                        }
                    }
                    if(r.details.sub){
                        s.sqlQuery('SELECT details FROM Users WHERE ke=? AND details NOT LIKE ?',[r.ke,'%"sub"%'],function(err,rr) {
                            rr=rr[0];
                            rr.details=JSON.parse(rr.details);
                            r.details.mon_groups=rr.details.mon_groups;
                            req.resp.details=JSON.stringify(r.details);
                            req.factorAuth()
                        })
                    }else{
                        req.factorAuth()
                    }
                }else{
                    req.failed(req.body.function)
                }
            })
        }
        if(LdapAuth&&req.body.function==='ldap'&&req.body.key!==''){
            s.sqlQuery('SELECT * FROM Users WHERE  ke=? AND details NOT LIKE ?',[req.body.key,'%"sub"%'],function(err,r) {
                if(r&&r[0]){
                    r=r[0]
                    r.details=JSON.parse(r.details)
                    r.lang=s.getLanguageFile(r.details.lang)
                    if(r.details.use_ldap!=='0'&&r.details.ldap_enable==='1'&&r.details.ldap_url&&r.details.ldap_url!==''){
                        req.mailArray={}
                        req.body.mail.split(',').forEach(function(v){
                            v=v.split('=')
                            req.mailArray[v[0]]=v[1]
                        })
                        if(!r.details.ldap_bindDN||r.details.ldap_bindDN===''){
                            r.details.ldap_bindDN=req.body.mail
                        }
                        if(!r.details.ldap_bindCredentials||r.details.ldap_bindCredentials===''){
                            r.details.ldap_bindCredentials=req.body.pass
                        }
                        if(!r.details.ldap_searchFilter||r.details.ldap_searchFilter===''){
                            r.details.ldap_searchFilter=req.body.mail
                            if(req.mailArray.cn){
                                r.details.ldap_searchFilter='cn='+req.mailArray.cn
                            }
                            if(req.mailArray.uid){
                                r.details.ldap_searchFilter='uid='+req.mailArray.uid
                            }
                        }else{
                            r.details.ldap_searchFilter=r.details.ldap_searchFilter.replace('{{username}}',req.body.mail)
                        }
                        if(!r.details.ldap_searchBase||r.details.ldap_searchBase===''){
                            r.details.ldap_searchBase='dc=test,dc=com'
                        }
                        req.auth = new LdapAuth({
                            url:r.details.ldap_url,
                            bindDN:r.details.ldap_bindDN,
                            bindCredentials:r.details.ldap_bindCredentials,
                            searchBase:r.details.ldap_searchBase,
                            searchFilter:'('+r.details.ldap_searchFilter+')',
                            reconnect:true
                        });
                        req.auth.on('error', function (err) {
                            console.error('LdapAuth: ', err);
                        });

                        req.auth.authenticate(req.body.mail, req.body.pass, function(err, user) {
                            if(user){
                                //found user
                                if(!user.uid){
                                    user.uid=s.gid()
                                }
                                req.resp={
                                    ke:req.body.key,
                                    uid:user.uid,
                                    auth:s.md5(s.gid()),
                                    mail:user.mail,
                                    pass:s.md5(req.body.pass),
                                    details:JSON.stringify({
                                        sub:'1',
                                        ldap:'1',
                                        allmonitors:'1',
					filter: {}
                                    })
                                }
                                user.post=[]
                                Object.keys(req.resp).forEach(function(v){
                                    user.post.push(req.resp[v])
                                })
                                s.log({ke:req.body.key,mid:'$USER'},{type:r.lang['LDAP Success'],msg:{user:user}})
                                s.sqlQuery('SELECT * FROM Users WHERE  ke=? AND mail=?',[req.body.key,user.cn],function(err,rr){
                                    if(rr&&rr[0]){
                                        //already registered
                                        rr=rr[0]
                                        req.resp=rr;
                                        rr.details=JSON.parse(rr.details)
                                        req.resp.lang=s.getLanguageFile(rr.details.lang)
                                        s.log({ke:req.body.key,mid:'$USER'},{type:r.lang['LDAP User Authenticated'],msg:{user:user,shinobiUID:rr.uid}})
                                        s.sqlQuery("UPDATE Users SET auth=? WHERE ke=? AND uid=?",[req.resp.auth,req.resp.ke,rr.uid])
                                    }else{
                                        //new ldap login
                                        s.log({ke:req.body.key,mid:'$USER'},{type:r.lang['LDAP User is New'],msg:{info:r.lang['Creating New Account'],user:user}})
                                        req.resp.lang=r.lang
                                        s.sqlQuery('INSERT INTO Users (ke,uid,auth,mail,pass,details) VALUES (?,?,?,?,?,?)',user.post)
                                    }
                                    req.resp.details=JSON.stringify(req.resp.details)
                                    req.resp.auth_token=req.resp.auth
                                    req.resp.ok=true
                                    req.fn(req.resp)
                                })
                                return
                            }
                            s.log({ke:req.body.key,mid:'$USER'},{type:r.lang['LDAP Failed'],msg:{err:err}})
                            //no user
                            req.default()
                        });

                        req.auth.close(function(err) {

                        })
                    }else{
                        req.default()
                    }
                }else{
                    req.default()
                }
            })
        }else{
            if(req.body.function==='super'){
                if(!fs.existsSync(location.super)){
                    res.end(lang.superAdminText)
                    return
                }
                req.ok=s.superAuth({mail:req.body.mail,pass:req.body.pass,users:true,md5:true},function(data){
                    s.sqlQuery('SELECT * FROM Logs WHERE ke=? ORDER BY `time` DESC LIMIT 30',['$'],function(err,r) {
                        if(!r){
                            r=[]
                        }
                        data.Logs=r;
                        fs.readFile(location.config,'utf8',function(err,file){
                            data.plainConfig=JSON.parse(file)
                            req.renderFunction(config.renderPaths.super,data);
                        })
                    })
                })
                if(req.ok===false){
                    req.failed(req.body.function)
                }
            }else{
                req.default()
            }
        }
    }else{
        if(req.body.machineID&&req.body.factorAuthKey){
            if(s.factorAuth[req.body.ke]&&s.factorAuth[req.body.ke][req.body.id]&&s.factorAuth[req.body.ke][req.body.id].key===req.body.factorAuthKey){
                if(s.factorAuth[req.body.ke][req.body.id].key===req.body.factorAuthKey){
                    if(req.body.remember==="1"){
                        req.details=JSON.parse(s.factorAuth[req.body.ke][req.body.id].info.details)
                        req.lang=s.getLanguageFile(req.details.lang)
                        if(!req.details.acceptedMachines||!(req.details.acceptedMachines instanceof Object)){
                            req.details.acceptedMachines={}
                        }
                        if(!req.details.acceptedMachines[req.body.machineID]){
                            req.details.acceptedMachines[req.body.machineID]={}
                            s.sqlQuery("UPDATE Users SET details=? WHERE ke=? AND uid=?",[s.s(req.details),req.body.ke,req.body.id])
                        }
                    }
                    req.resp=s.factorAuth[req.body.ke][req.body.id].info
                    req.fn(s.factorAuth[req.body.ke][req.body.id].user)
                }else{
                    req.renderFunction(config.renderPaths.factorAuth,{$user:s.factorAuth[req.body.ke][req.body.id].info,lang:req.lang});
                    res.end();
                }
            }else{
                req.failed(lang['2-Factor Authentication'])
            }
        }else{
            req.failed(lang['2-Factor Authentication'])
        }
    }
});
// Get HLS stream (m3u8)
app.get(['/:auth/hls/:ke/:id/:file','/:auth/hls/:ke/:id/:channel/:file'], function (req,res){
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
        s.checkChildProxy(req.params,function(){
            req.dir=s.dir.streams+req.params.ke+'/'+req.params.id+'/'
            if(req.params.channel){
                req.dir+='channel'+(parseInt(req.params.channel)+config.pipeAddition)+'/'+req.params.file;
            }else{
                req.dir+=req.params.file;
            }
            res.on('finish',function(){res.end();});
            if (fs.existsSync(req.dir)){
                fs.createReadStream(req.dir).pipe(res);
            }else{
                res.end(lang['File Not Found'])
            }
        },res,req)
    }
    s.auth(req.params,req.fn,res,req);
});
//Get JPEG snap
app.get('/:auth/jpeg/:ke/:id/s.jpg', function(req,res){
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        s.checkChildProxy(req.params,function(){
            if(user.details.sub&&user.details.allmonitors!=='1'&&user.details.monitors&&user.details.monitors.indexOf(req.params.id)===-1){
                res.end(user.lang['Not Permitted'])
                return
            }
            req.dir=s.dir.streams+req.params.ke+'/'+req.params.id+'/s.jpg';
                res.writeHead(200, {
                'Content-Type': 'image/jpeg',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
                });
            res.on('finish',function(){res.end();delete(res)});
            if (fs.existsSync(req.dir)){
                fs.createReadStream(req.dir).pipe(res);
            }else{
                fs.createReadStream(config.defaultMjpeg).pipe(res);
            }
        },res,req);
    },res,req);
});
//Get FLV stream
app.get(['/:auth/flv/:ke/:id/s.flv','/:auth/flv/:ke/:id/:channel/s.flv'], function(req,res) {
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        s.checkChildProxy(req.params,function(){
            var Emitter,chunkChannel
            if(!req.params.channel){
                Emitter = s.group[req.params.ke].mon[req.params.id].emitter
                chunkChannel = 'MAIN'
            }else{
                Emitter = s.group[req.params.ke].mon[req.params.id].emitterChannel[parseInt(req.params.channel)+config.pipeAddition]
                chunkChannel = parseInt(req.params.channel)+config.pipeAddition
            }
            if(s.group[req.params.ke].mon[req.params.id].firstStreamChunk[chunkChannel]){
                //variable name of contentWriter
                var contentWriter
                //set headers
                res.setHeader('Content-Type', 'video/x-flv');
                res.setHeader('Access-Control-Allow-Origin','*');
                //write first frame on stream
                res.write(s.group[req.params.ke].mon[req.params.id].firstStreamChunk[chunkChannel])
                //write new frames as they happen
                Emitter.on('data',contentWriter=function(buffer){
                    res.write(buffer)
                })
                //remove contentWriter when client leaves
                res.on('close', function () {
                    Emitter.removeListener('data',contentWriter)
                })
            }else{
                res.setHeader('Content-Type', 'application/json');
                res.end(s.s({ok:false,msg:'FLV not started or not ready'},null,3))
            }
        },res,req)
    },res,req)
})
//montage - stand alone squished view with gridstackjs
app.get(['/:auth/grid/:ke','/:auth/grid/:ke/:group'], function(req,res) {
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.get_monitors==="0"){
            res.end(user.lang['Not Permitted'])
            return
        }
        
        req.params.protocol=req.protocol;
        req.sql='SELECT * FROM Monitors WHERE mode!=? AND mode!=? AND ke=?';req.ar=['stop','idle',req.params.ke];
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }else{
                res.end(user.lang['There are no monitors that you can view with this account.']);
                return;
            }
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(req.params.group){
                var filteredByGroupCheck = {};
                var filteredByGroup = [];
                r.forEach(function(v,n){
                    var details = JSON.parse(r[n].details);
                    try{
                        req.params.group.split('|').forEach(function(group){
                            var groups = JSON.parse(details.groups);
                            if(groups.indexOf(group) > -1 && !filteredByGroupCheck[v.mid]){
                                filteredByGroupCheck[v.mid] = true;
                                filteredByGroup.push(v)
                            }
                        })
                    }catch(err){
                        
                    }
                })
                r = filteredByGroup;
            }
            r.forEach(function(v,n){
                if(s.group[v.ke]&&s.group[v.ke].mon[v.mid]&&s.group[v.ke].mon[v.mid].watch){
                    r[n].currentlyWatching=Object.keys(s.group[v.ke].mon[v.mid].watch).length
                }
                r[n].subStream={}
                var details = JSON.parse(r[n].details)
                if(details.snap==='1'){
                    r[n].subStream.jpeg = '/'+req.params.auth+'/jpeg/'+v.ke+'/'+v.mid+'/s.jpg'
                }
                if(details.stream_channels&&details.stream_channels!==''){
                    try{
                        details.stream_channels=JSON.parse(details.stream_channels)
                        r[n].channels=[]
                        details.stream_channels.forEach(function(b,m){
                            var streamURL
                            switch(b.stream_type){
                                case'mjpeg':
                                    streamURL='/'+req.params.auth+'/mjpeg/'+v.ke+'/'+v.mid+'/'+m
                                break;
                                case'hls':
                                    streamURL='/'+req.params.auth+'/hls/'+v.ke+'/'+v.mid+'/'+m+'/s.m3u8'
                                break;
                                case'h264':
                                    streamURL='/'+req.params.auth+'/h264/'+v.ke+'/'+v.mid+'/'+m
                                break;
                                case'flv':
                                    streamURL='/'+req.params.auth+'/flv/'+v.ke+'/'+v.mid+'/'+m+'/s.flv'
                                break;
                                case'mp4':
                                    streamURL='/'+req.params.auth+'/mp4/'+v.ke+'/'+v.mid+'/'+m+'/s.mp4'
                                break;
                            }
                            r[n].channels.push(streamURL)
                        })
                    }catch(err){
                        s.log(req.params,{type:'Broken Monitor Object',msg:'Stream Channels Field is damaged. Skipping.'})
                    }
                }
            })
            res.render(config.renderPaths.grid,{
                data:Object.assign(req.params,req.query),
                baseUrl:req.protocol+'://'+req.hostname,
                config:config,
                lang:user.lang,
                $user:user,
                monitors:r
            });
        })
    },res,req)
});
//MJPEG feed
// if query string `full=true` is not present then it will load the MJPEG data directly and not the iframe ready page.
app.get(['/:auth/mjpeg/:ke/:id','/:auth/mjpeg/:ke/:id/:channel'], function(req,res) {
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    if(req.query.full=='true'){
        res.render(config.renderPaths.mjpeg,{url:'/'+req.params.auth+'/mjpeg/'+req.params.ke+'/'+req.params.id});
        res.end()
    }else{
        s.auth(req.params,function(user){
            s.checkChildProxy(req.params,function(){
                if(s.group[req.params.ke]&&s.group[req.params.ke].mon[req.params.id]){
                    if(user.permissions.watch_stream==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.monitors.indexOf(req.params.id)===-1){
                        res.end(user.lang['Not Permitted'])
                        return
                    }

                    var Emitter
                    if(!req.params.channel){
                        Emitter = s.group[req.params.ke].mon[req.params.id].emitter
                    }else{
                        Emitter = s.group[req.params.ke].mon[req.params.id].emitterChannel[parseInt(req.params.channel)+config.pipeAddition]
                    }
                    res.writeHead(200, {
                    'Content-Type': 'multipart/x-mixed-replace; boundary=shinobi',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Pragma': 'no-cache'
                    });
                    var contentWriter,content = fs.readFileSync(config.defaultMjpeg,'binary');
                    res.write("--shinobi\r\n");
                    res.write("Content-Type: image/jpeg\r\n");
                    res.write("Content-Length: " + content.length + "\r\n");
                    res.write("\r\n");
                    res.write(content,'binary');
                    res.write("\r\n");
                    Emitter.on('data',contentWriter=function(d){
                        content = d;
                        res.write(content,'binary');
                    })
                    res.on('close', function () {
                        Emitter.removeListener('data',contentWriter)
                    });
                }else{
                    res.end();
                }
            },res,req);
        },res,req);
    }
});
//embed monitor
app.get(['/:auth/embed/:ke/:id','/:auth/embed/:ke/:id/:addon'], function (req,res){
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.params.protocol=req.protocol;
    s.auth(req.params,function(user){
        if(user.permissions.watch_stream==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.monitors.indexOf(req.params.id)===-1){
            res.end(user.lang['Not Permitted'])
            return
        }
        if(s.group[req.params.ke]&&s.group[req.params.ke].mon[req.params.id]){
            if(s.group[req.params.ke].mon[req.params.id].started===1){
                req.params.uid=user.uid;
                res.render(config.renderPaths.embed,{data:req.params,baseUrl:req.protocol+'://'+req.hostname,config:config,lang:user.lang,mon:CircularJSON.parse(CircularJSON.stringify(s.group[req.params.ke].mon_conf[req.params.id]))});
                res.end()
            }else{
                res.end(user.lang['Cannot watch a monitor that isn\'t running.'])
            }
        }else{
            res.end(user.lang['No Monitor Exists with this ID.'])
        }
    },res,req);
});
// Get TV Channels (Monitor Streams) json
app.get(['/:auth/tvChannels/:ke','/:auth/tvChannels/:ke/:id','/get.php'], function (req,res){
    req.ret={ok:false};
    if(req.query.username&&req.query.password){
        req.params.username = req.query.username
        req.params.password = req.query.password
    }
    var output = ['h264','hls','mp4']
    if(req.query.output&&req.query.output!==''){
        output = req.query.output.split(',')
        output.forEach(function(type,n){
            if(type==='ts'){
                output[n]='h264'
                if(output.indexOf('hls')===-1){
                    output.push('hls')
                }
            }
        })
    }
    var isM3u8 = false;
    if(req.query.type==='m3u8'||req.query.type==='m3u_plus'){
        //is m3u8
        isM3u8 = true;
    }else{
        res.setHeader('Content-Type', 'application/json');
    }
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
        if(user.permissions.get_monitors==="0"){
            res.end(s.s([]))
            return
        }
        if(!req.params.ke){
            req.params.ke = user.ke;
        }
        if(req.query.id&&!req.params.id){
            req.params.id = req.query.id;
        }
        req.sql='SELECT * FROM Monitors WHERE mode!=? AND ke=?';req.ar=['stop',req.params.ke];
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }else{
                res.end('[]');
                return;
            }
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            var tvChannelMonitors = [];
            r.forEach(function(v,n){
                var buildStreamURL = function(channelRow,type,channelNumber){
                    var streamURL
                    if(channelNumber){channelNumber = '/'+channelNumber}else{channelNumber=''}
                    switch(type){
                        case'mjpeg':
                            streamURL='/'+req.params.auth+'/mjpeg/'+v.ke+'/'+v.mid+channelNumber
                        break;
                        case'hls':
                            streamURL='/'+req.params.auth+'/hls/'+v.ke+'/'+v.mid+channelNumber+'/s.m3u8'
                        break;
                        case'h264':
                            streamURL='/'+req.params.auth+'/h264/'+v.ke+'/'+v.mid+channelNumber
                        break;
                        case'flv':
                            streamURL='/'+req.params.auth+'/flv/'+v.ke+'/'+v.mid+channelNumber+'/s.flv'
                        break;
                        case'mp4':
                            streamURL='/'+req.params.auth+'/mp4/'+v.ke+'/'+v.mid+channelNumber+'/s.ts'
                        break;
                    }
                    if(streamURL){
                        if(!channelRow.streamsSortedByType[type]){
                            channelRow.streamsSortedByType[type]=[]
                        }
                        channelRow.streamsSortedByType[type].push(streamURL)
                        channelRow.streams.push(streamURL)
                    }
                    return streamURL
                }
                var details = JSON.parse(r[n].details);
                if(!details.tv_channel_id||details.tv_channel_id==='')details.tv_channel_id = 'temp_'+s.gid(5)
                var channelRow = {
                    ke:v.ke,
                    mid:v.mid,
                    type:v.type,
                    groupTitle:details.tv_channel_group_title,
                    channel:details.tv_channel_id,
                };
                if(details.snap==='1'){
                    channelRow.snapshot = '/'+req.params.auth+'/jpeg/'+v.ke+'/'+v.mid+'/s.jpg'
                }
                channelRow.streams=[]
                channelRow.streamsSortedByType={}
                buildStreamURL(channelRow,details.stream_type)
                if(details.stream_channels&&details.stream_channels!==''){
                    details.stream_channels=JSON.parse(details.stream_channels)
                    details.stream_channels.forEach(function(b,m){
                        buildStreamURL(channelRow,b.stream_type,m.toString())
                    })
                }
                if(details.tv_channel==='1'){
                    tvChannelMonitors.push(channelRow)
                }
            })
            if(isM3u8){
                var m3u8 = '#EXTM3U'+'\n'
                tvChannelMonitors.forEach(function(channelRow,n){
                  output.forEach(function(type){
                    if(channelRow.streamsSortedByType[type]){
                        if(req.query.type==='m3u_plus'){
                            m3u8 +='#EXTINF-1 tvg-id="'+channelRow.mid+'" tvg-name="'+channelRow.channel+'" tvg-logo="'+req.protocol+'://'+req.headers.host+channelRow.snapshot+'" group-title="'+channelRow.groupTitle+'",'+channelRow.channel+'\n'
                        }else{
                            m3u8 +='#EXTINF:-1,'+channelRow.channel+' ('+type.toUpperCase()+') \n'
                        }
                        m3u8 += req.protocol+'://'+req.headers.host+channelRow.streamsSortedByType[type][0]+'\n'
                    }
                  })
                })
                res.end(m3u8)
            }else{
                if(tvChannelMonitors.length===1){tvChannelMonitors=tvChannelMonitors[0];}
                res.end(s.s(tvChannelMonitors, null, 3));
            }
        })
    }
    s.auth(req.params,req.fn,res,req);
});
// Get monitors json
app.get(['/:auth/monitor/:ke','/:auth/monitor/:ke/:id'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
    if(user.permissions.get_monitors==="0"){
        res.end(s.s([]))
        return
    }
        req.sql='SELECT * FROM Monitors WHERE ke=?';req.ar=[req.params.ke];
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }else{
                res.end('[]');
                return;
            }
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            r.forEach(function(v,n){
                if(s.group[v.ke]&&s.group[v.ke].mon[v.mid]&&s.group[v.ke].mon[v.mid].watch){
                    r[n].currentlyWatching=Object.keys(s.group[v.ke].mon[v.mid].watch).length
                }
                var buildStreamURL = function(type,channelNumber){
                    var streamURL
                    if(channelNumber){channelNumber = '/'+channelNumber}else{channelNumber=''}
                    switch(type){
                        case'mjpeg':
                            streamURL='/'+req.params.auth+'/mjpeg/'+v.ke+'/'+v.mid+channelNumber
                        break;
                        case'hls':
                            streamURL='/'+req.params.auth+'/hls/'+v.ke+'/'+v.mid+channelNumber+'/s.m3u8'
                        break;
                        case'h264':
                            streamURL='/'+req.params.auth+'/h264/'+v.ke+'/'+v.mid+channelNumber
                        break;
                        case'flv':
                            streamURL='/'+req.params.auth+'/flv/'+v.ke+'/'+v.mid+channelNumber+'/s.flv'
                        break;
                        case'mp4':
                            streamURL='/'+req.params.auth+'/mp4/'+v.ke+'/'+v.mid+channelNumber+'/s.mp4'
                        break;
                    }
                    if(streamURL){
                        if(!r[n].streamsSortedByType[type]){
                            r[n].streamsSortedByType[type]=[]
                        }
                        r[n].streamsSortedByType[type].push(streamURL)
                        r[n].streams.push(streamURL)
                    }
                    return streamURL
                }
                var details = JSON.parse(r[n].details);
                if(!details.tv_channel_id||details.tv_channel_id==='')details.tv_channel_id = 'temp_'+s.gid(5)
                if(details.snap==='1'){
                    r[n].snapshot = '/'+req.params.auth+'/jpeg/'+v.ke+'/'+v.mid+'/s.jpg'
                }
                r[n].streams=[]
                r[n].streamsSortedByType={}
                buildStreamURL(details.stream_type)
                if(details.stream_channels&&details.stream_channels!==''){
                    details.stream_channels=JSON.parse(details.stream_channels)
                    details.stream_channels.forEach(function(b,m){
                        buildStreamURL(b.stream_type,m.toString())
                    })
                }
            })
            if(r.length===1){r=r[0];}
            res.end(s.s(r, null, 3));
        })
    }
    s.auth(req.params,req.fn,res,req);
});
// Get videos json
app.get(['/:auth/videos/:ke','/:auth/videos/:ke/:id'], function (req,res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.watch_videos==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.video_view.indexOf(req.params.id)===-1){
            res.end(s.s([]))
            return
        }
        req.sql='SELECT * FROM Videos WHERE ke=?';req.ar=[req.params.ke];
        req.count_sql='SELECT COUNT(*) FROM Videos WHERE ke=?';req.count_ar=[req.params.ke];
        if(req.query.archived=='1'){
            req.sql+=' AND details LIKE \'%"archived":"1"\''
            req.count_sql+=' AND details LIKE \'%"archived":"1"\''
        }
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
                req.count_sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
                req.count_sql+=' and mid=?';req.count_ar.push(req.params.id)
            }else{
                res.end('[]');
                return;
            }
        }
        if(req.query.start||req.query.end){
            if(!req.query.startOperator||req.query.startOperator==''){
                req.query.startOperator='>='
            }
            if(!req.query.endOperator||req.query.endOperator==''){
                req.query.endOperator='<='
            }
            switch(true){
                case(req.query.start&&req.query.start!==''&&req.query.end&&req.query.end!==''):
                    req.query.start=req.query.start.replace('T',' ')
                    req.query.end=req.query.end.replace('T',' ')
                    req.sql+=' AND `time` '+req.query.startOperator+' ? AND `end` '+req.query.endOperator+' ?';
                    req.count_sql+=' AND `time` '+req.query.startOperator+' ? AND `end` '+req.query.endOperator+' ?';
                    req.ar.push(req.query.start)
                    req.ar.push(req.query.end)
                    req.count_ar.push(req.query.start)
                    req.count_ar.push(req.query.end)
                break;
                case(req.query.start&&req.query.start!==''):
                    req.query.start=req.query.start.replace('T',' ')
                    req.sql+=' AND `time` '+req.query.startOperator+' ?';
                    req.count_sql+=' AND `time` '+req.query.startOperator+' ?';
                    req.ar.push(req.query.start)
                    req.count_ar.push(req.query.start)
                break;
                case(req.query.end&&req.query.end!==''):
                    req.query.end=req.query.end.replace('T',' ')
                    req.sql+=' AND `end` '+req.query.endOperator+' ?';
                    req.count_sql+=' AND `end` '+req.query.endOperator+' ?';
                    req.ar.push(req.query.end)
                    req.count_ar.push(req.query.end)
                break;
            }
        }
        req.sql+=' ORDER BY `time` DESC';
        if(!req.query.limit||req.query.limit==''){
            req.query.limit='100'
        }
        if(req.query.limit!=='0'){
            req.sql+=' LIMIT '+req.query.limit
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(!r){
                res.end(s.s({total:0,limit:req.query.limit,skip:0,videos:[]}, null, 3));
                return
            }
        s.sqlQuery(req.count_sql,req.count_ar,function(err,count){
            s.video('linkBuild',r,req.params.auth)
            if(req.query.limit.indexOf(',')>-1){
                req.skip=parseInt(req.query.limit.split(',')[0])
                req.query.limit=parseInt(req.query.limit.split(',')[0])
            }else{
                req.skip=0
                req.query.limit=parseInt(req.query.limit)
            }
            res.end(s.s({isUTC:config.useUTC,total:count[0]['COUNT(*)'],limit:req.query.limit,skip:req.skip,videos:r}, null, 3));
        })
        })
    },res,req);
});
// Get events json (motion logs)
app.get(['/:auth/events/:ke','/:auth/events/:ke/:id','/:auth/events/:ke/:id/:limit','/:auth/events/:ke/:id/:limit/:start','/:auth/events/:ke/:id/:limit/:start/:end'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.watch_videos==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.video_view.indexOf(req.params.id)===-1){
            res.end(s.s([]))
            return
        }
        req.sql='SELECT * FROM Events WHERE ke=?';req.ar=[req.params.ke];
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }else{
                res.end('[]');
                return;
            }
        }
        if(req.params.start&&req.params.start!==''){
            req.params.start=req.params.start.replace('T',' ')
            if(req.params.end&&req.params.end!==''){
                req.params.end=req.params.end.replace('T',' ')
                req.sql+=' AND `time` >= ? AND `time` <= ?';
                req.ar.push(decodeURIComponent(req.params.start))
                req.ar.push(decodeURIComponent(req.params.end))
            }else{
                req.sql+=' AND `time` >= ?';
                req.ar.push(decodeURIComponent(req.params.start))
            }
        }
        if(!req.params.limit||req.params.limit==''){req.params.limit=100}
        req.sql+=' ORDER BY `time` DESC LIMIT '+req.params.limit+'';
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(err){
                err.sql=req.sql;
                res.end(s.s(err, null, 3));
                return
            }
            if(!r){r=[]}
            r.forEach(function(v,n){
                r[n].details=JSON.parse(v.details);
            })
            res.end(s.s(r, null, 3));
        })
    },res,req);
});
// Get logs json
app.get(['/:auth/logs/:ke','/:auth/logs/:ke/:id'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.get_logs==="0"){
            res.end(s.s([]))
            return
        }
        req.sql='SELECT * FROM Logs WHERE ke=?';req.ar=[req.params.ke];
        if(!req.params.id){
            if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
                try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
                req.or=[];
                user.details.monitors.forEach(function(v,n){
                    req.or.push('mid=?');req.ar.push(v)
                })
                req.sql+=' AND ('+req.or.join(' OR ')+')'
            }
        }else{
            if(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1||req.params.id.indexOf('$')>-1){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }else{
                res.end('[]');
                return;
            }
        }
        if(!req.query.limit||req.query.limit==''){req.query.limit=50}
        req.sql+=' ORDER BY `time` DESC LIMIT '+req.query.limit+'';
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(err){
                err.sql=req.sql;
                res.end(s.s(err, null, 3));
                return
            }
            if(!r){r=[]}
            r.forEach(function(v,n){
                r[n].info=JSON.parse(v.info)
            })
            res.end(s.s(r, null, 3));
        })
    },res,req);
});
// Get monitors online json
app.get('/:auth/smonitor/:ke', function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
        if(user.permissions.get_monitors==="0"){
            res.end(s.s([]))
            return
        }
        req.sql='SELECT * FROM Monitors WHERE ke=?';req.ar=[req.params.ke];
        if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
            try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
            req.or=[];
            user.details.monitors.forEach(function(v,n){
                req.or.push('mid=?');req.ar.push(v)
            })
            req.sql+=' AND ('+req.or.join(' OR ')+')'
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(r&&r[0]){
                req.ar=[];
                r.forEach(function(v){
                    if(s.group[req.params.ke]&&s.group[req.params.ke].mon[v.mid]&&s.group[req.params.ke].mon[v.mid].started===1){
                        req.ar.push(v)
                    }
                })
            }else{
                req.ar=[];
            }
            res.end(s.s(req.ar, null, 3));
        })
    }
    s.auth(req.params,req.fn,res,req);
});
// Monitor Add,Edit,Delete
app.all(['/:auth/configureMonitor/:ke/:id','/:auth/configureMonitor/:ke/:id/:f'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(req.params.f!=='delete'){
            if(!req.body.data&&!req.query.data){
                req.ret.msg='No Monitor Data found.'
                res.end(s.s(req.ret, null, 3))
                return
            }
            try{
                if(req.query.data){
                    req.monitor=JSON.parse(req.query.data)
                }else{
                    req.monitor=JSON.parse(req.body.data)
                }
            }catch(er){
                if(!req.monitor){
                    req.ret.msg=user.lang.monitorEditText1;
                    res.end(s.s(req.ret, null, 3))
                }
                return
            }
            if(!user.details.sub||user.details.allmonitors==='1'||user.details.monitor_edit.indexOf(req.monitor.mid)>-1){
                    if(req.monitor&&req.monitor.mid&&req.monitor.name){
                        req.set=[],req.ar=[];
                        req.monitor.mid=req.params.id.replace(/[^\w\s]/gi,'').replace(/ /g,'');
                        try{
                            JSON.parse(req.monitor.details)
                        }catch(er){
                            if(!req.monitor.details||!req.monitor.details.stream_type){
                                req.ret.msg=user.lang.monitorEditText2;
                                res.end(s.s(req.ret, null, 3))
                                return
                            }else{
                                req.monitor.details=JSON.stringify(req.monitor.details)
                            }
                        }
                        req.monitor.ke=req.params.ke
                        req.logObject={details:JSON.parse(req.monitor.details),ke:req.params.ke,mid:req.params.id}
                        s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND mid=?',[req.monitor.ke,req.monitor.mid],function(er,r){
                            req.tx={f:'monitor_edit',mid:req.monitor.mid,ke:req.monitor.ke,mon:req.monitor};
                            if(r&&r[0]){
                                req.tx.new=false;
                                Object.keys(req.monitor).forEach(function(v){
                                    if(req.monitor[v]&&req.monitor[v]!==''){
                                        req.set.push(v+'=?'),req.ar.push(req.monitor[v]);
                                    }
                                })
                                req.set=req.set.join(',');
                                req.ar.push(req.monitor.ke),req.ar.push(req.monitor.mid);
                                s.log(req.monitor,{type:'Monitor Updated',msg:'by user : '+user.uid});
                                req.ret.msg=user.lang['Monitor Updated by user']+' : '+user.uid;
                                s.sqlQuery('UPDATE Monitors SET '+req.set+' WHERE ke=? AND mid=?',req.ar)
                                req.finish=1;
                            }else{
                                if(!s.group[req.monitor.ke].init.max_camera||s.group[req.monitor.ke].init.max_camera==''||Object.keys(s.group[req.monitor.ke].mon).length <= parseInt(s.group[req.monitor.ke].init.max_camera)){
                                    req.tx.new=true;
                                    req.st=[];
                                    Object.keys(req.monitor).forEach(function(v){
                                        if(req.monitor[v]&&req.monitor[v]!==''){
                                            req.set.push(v),req.st.push('?'),req.ar.push(req.monitor[v]);
                                        }
                                    })
        //                                        req.set.push('ke'),req.st.push('?'),req.ar.push(req.monitor.ke);
                                    req.set=req.set.join(','),req.st=req.st.join(',');
                                    s.log(req.monitor,{type:'Monitor Added',msg:'by user : '+user.uid});
                                    req.ret.msg=user.lang['Monitor Added by user']+' : '+user.uid;
                                    s.sqlQuery('INSERT INTO Monitors ('+req.set+') VALUES ('+req.st+')',req.ar)
                                    req.finish=1;
                                }else{
                                    req.tx.f='monitor_edit_failed';
                                    req.tx.ff='max_reached';
                                    req.ret.msg=user.lang.monitorEditFailedMaxReached;
                                }
                            }
                            if(req.finish===1){
                                req.monitor.details=JSON.parse(req.monitor.details)
                                req.ret.ok=true;
                                s.init(0,{mid:req.monitor.mid,ke:req.monitor.ke});
                                s.group[req.monitor.ke].mon_conf[req.monitor.mid]=s.init('noReference',req.monitor);
                                if(req.monitor.mode==='stop'){
                                    s.camera('stop',req.monitor);
                                }else{
                                    s.camera('stop',req.monitor);setTimeout(function(){s.camera(req.monitor.mode,req.monitor);},5000)
                                };
                                s.tx(req.tx,'STR_'+req.monitor.ke);
                            };
                            s.tx(req.tx,'GRP_'+req.monitor.ke);
                            res.end(s.s(req.ret, null, 3))
                        })
                    }else{
                        req.ret.msg=user.lang.monitorEditText1;
                        res.end(s.s(req.ret, null, 3))
                    }
            }else{
                    req.ret.msg=user.lang['Not Permitted'];
                    res.end(s.s(req.ret, null, 3))
            }
        }else{
            if(!user.details.sub||user.details.allmonitors==='1'||user.details.monitor_edit.indexOf(req.params.id)>-1){
                s.log(s.group[req.params.ke].mon_conf[req.params.id],{type:'Monitor Deleted',msg:'by user : '+user.uid});
                req.params.delete=1;s.camera('stop',req.params);
                s.tx({f:'monitor_delete',uid:user.uid,mid:req.params.id,ke:req.params.ke},'GRP_'+req.params.ke);
                s.sqlQuery('DELETE FROM Monitors WHERE ke=? AND mid=?',[req.params.ke,req.params.id])
                req.ret.ok=true;
                req.ret.msg='Monitor Deleted by user : '+user.uid
                res.end(s.s(req.ret, null, 3))
            }
        }
    })
})
app.get(['/:auth/monitor/:ke/:id/:f','/:auth/monitor/:ke/:id/:f/:ff','/:auth/monitor/:ke/:id/:f/:ff/:fff'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.control_monitors==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.monitor_edit.indexOf(req.params.id)===-1){
            res.end(user.lang['Not Permitted'])
            return
        }
        if(req.params.f===''){req.ret.msg=user.lang.monitorGetText1;res.end(s.s(req.ret, null, 3));return}
        if(req.params.f!=='stop'&&req.params.f!=='start'&&req.params.f!=='record'){
            req.ret.msg='Mode not recognized.';
            res.end(s.s(req.ret, null, 3));
            return;
        }
        s.sqlQuery('SELECT * FROM Monitors WHERE ke=? AND mid=?',[req.params.ke,req.params.id],function(err,r){
            if(r&&r[0]){
                r=r[0];
                if(req.query.reset==='1'||(s.group[r.ke]&&s.group[r.ke].mon_conf[r.mid].mode!==req.params.f)||req.query.fps&&(!s.group[r.ke].mon[r.mid].currentState||!s.group[r.ke].mon[r.mid].currentState.trigger_on)){
                    if(req.query.reset!=='1'||!s.group[r.ke].mon[r.mid].trigger_timer){
                        if(!s.group[r.ke].mon[r.mid].currentState)s.group[r.ke].mon[r.mid].currentState={}
                        s.group[r.ke].mon[r.mid].currentState.mode=r.mode.toString()
                        s.group[r.ke].mon[r.mid].currentState.fps=r.fps.toString()
                        if(!s.group[r.ke].mon[r.mid].currentState.trigger_on){
                           s.group[r.ke].mon[r.mid].currentState.trigger_on=true
                        }else{
                            s.group[r.ke].mon[r.mid].currentState.trigger_on=false
                        }
                        r.mode=req.params.f;
                        try{r.details=JSON.parse(r.details);}catch(er){}
                        if(req.query.fps){
                            r.fps=parseFloat(r.details.detector_trigger_record_fps)
                            s.group[r.ke].mon[r.mid].currentState.detector_trigger_record_fps=r.fps
                        }
                        r.id=r.mid;
                        s.sqlQuery('UPDATE Monitors SET mode=? WHERE ke=? AND mid=?',[r.mode,r.ke,r.mid]);
                        s.group[r.ke].mon_conf[r.mid]=r;
                        s.tx({f:'monitor_edit',mid:r.mid,ke:r.ke,mon:r},'GRP_'+r.ke);
                        s.tx({f:'monitor_edit',mid:r.mid,ke:r.ke,mon:r},'STR_'+r.ke);
                        s.camera('stop',s.init('noReference',r));
                        if(req.params.f!=='stop'){
                            s.camera(req.params.f,s.init('noReference',r));
                        }
                        req.ret.msg=user.lang['Monitor mode changed']+' : '+req.params.f;
                    }else{
                        req.ret.msg=user.lang['Reset Timer'];
                    }
                    req.ret.cmd_at=s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss');
                    req.ret.ok=true;
                    if(req.params.ff&&req.params.f!=='stop'){
                        req.params.ff=parseFloat(req.params.ff);
                        clearTimeout(s.group[r.ke].mon[r.mid].trigger_timer)
                        switch(req.params.fff){
                            case'day':case'days':
                                req.timeout=req.params.ff*1000*60*60*24
                            break;
                            case'hr':case'hour':case'hours':
                                req.timeout=req.params.ff*1000*60*60
                            break;
                            case'min':case'minute':case'minutes':
                                req.timeout=req.params.ff*1000*60
                            break;
                            default://seconds
                                req.timeout=req.params.ff*1000
                            break;
                        }
                        s.group[r.ke].mon[r.mid].trigger_timer=setTimeout(function(){
                            delete(s.group[r.ke].mon[r.mid].trigger_timer)
                            s.sqlQuery('UPDATE Monitors SET mode=? WHERE ke=? AND mid=?',[s.group[r.ke].mon[r.mid].currentState.mode,r.ke,r.mid]);
                            r.neglectTriggerTimer=1;
                            r.mode=s.group[r.ke].mon[r.mid].currentState.mode;
                            r.fps=s.group[r.ke].mon[r.mid].currentState.fps;
                            s.camera('stop',s.init('noReference',r),function(){
                                if(s.group[r.ke].mon[r.mid].currentState.mode!=='stop'){
                                    s.camera(s.group[r.ke].mon[r.mid].currentState.mode,s.init('noReference',r));
                                }
                                s.group[r.ke].mon_conf[r.mid]=r;
                            });
                            s.tx({f:'monitor_edit',mid:r.mid,ke:r.ke,mon:r},'GRP_'+r.ke);
                            s.tx({f:'monitor_edit',mid:r.mid,ke:r.ke,mon:r},'STR_'+r.ke);
                        },req.timeout);
//                        req.ret.end_at=s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss').add(req.timeout,'milliseconds');
                    }
                 }else{
                    req.ret.msg=user.lang['Monitor mode is already']+' : '+req.params.f;
                }
            }else{
                req.ret.msg=user.lang['Monitor or Key does not exist.'];
            }
            res.end(s.s(req.ret, null, 3));
        })
    },res,req);
})
//get file from fileBin bin
app.get(['/:auth/fileBin/:ke','/:auth/fileBin/:ke/:id'],function (req,res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
        req.sql='SELECT * FROM Files WHERE ke=?';req.ar=[req.params.ke];
        if(user.details.sub&&user.details.monitors&&user.details.allmonitors!=='1'){
            try{user.details.monitors=JSON.parse(user.details.monitors);}catch(er){}
            req.or=[];
            user.details.monitors.forEach(function(v,n){
                req.or.push('mid=?');req.ar.push(v)
            })
            req.sql+=' AND ('+req.or.join(' OR ')+')'
        }else{
            if(req.params.id&&(!user.details.sub||user.details.allmonitors!=='0'||user.details.monitors.indexOf(req.params.id)>-1)){
                req.sql+=' and mid=?';req.ar.push(req.params.id)
            }
        }
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(!r){
                r=[]
            }else{
                r.forEach(function(v){
                    v.details=JSON.parse(v.details)
                    v.href='/'+req.params.auth+'/fileBin/'+req.params.ke+'/'+req.params.id+'/'+v.details.year+'/'+v.details.month+'/'+v.details.day+'/'+v.name;
                })
            }
            res.end(s.s(r, null, 3));
        })
    }
    s.auth(req.params,req.fn,res,req);
});
//get file from fileBin bin
app.get('/:auth/fileBin/:ke/:id/:year/:month/:day/:file', function (req,res){
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    req.fn=function(user){
        req.failed=function(){
            res.end(user.lang['File Not Found'])
        }
        if (!s.group[req.params.ke].fileBin[req.params.id+'/'+req.params.file]){
            s.sqlQuery('SELECT * FROM Files WHERE ke=? AND mid=? AND name=?',[req.params.ke,req.params.id,req.params.file],function(err,r){
                if(r&&r[0]){
                    r=r[0]
                    r.details=JSON.parse(r.details)
                    req.dir=s.dir.fileBin+req.params.ke+'/'+req.params.id+'/'+r.details.year+'/'+r.details.month+'/'+r.details.day+'/'+req.params.file;
                    if(fs.existsSync(req.dir)){
                        res.on('finish',function(){res.end();});
                        fs.createReadStream(req.dir).pipe(res);
                    }else{
                        req.failed()
                    }
                }else{
                    req.failed()
                }
            })
        }else{
            res.end(user.lang['Please Wait for Completion'])
        }
    }
    s.auth(req.params,req.fn,res,req);
});
// Get video file
app.get('/:auth/videos/:ke/:id/:file', function (req,res){
    s.auth(req.params,function(user){
        if(user.permissions.watch_videos==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.monitors.indexOf(req.params.id)===-1){
            res.end(user.lang['Not Permitted'])
            return
        }
        var filename = s.nameToTime(req.params.file)
        if(req.query.isUTC === 'true'){
            filename = s.utcToLocal(filename)
        }
        s.sqlQuery('SELECT * FROM Videos WHERE ke=? AND mid=? AND time=?',[req.params.ke,req.params.id,filename],function(err,r){
            if(r&&r[0]){
                req.dir=s.video('getDir',r[0])+req.params.file
                if (fs.existsSync(req.dir)){
                    req.ext=req.params.file.split('.')[1];
                    var total = fs.statSync(req.dir).size;
                    if (req.headers['range']) {
                        var range = req.headers.range;
                        var parts = range.replace(/bytes=/, "").split("-");
                        var partialstart = parts[0];
                        var partialend = parts[1];

                        var start = parseInt(partialstart, 10);
                        var end = partialend ? parseInt(partialend, 10) : total-1;
                        var chunksize = (end-start)+1;
                        var file = fs.createReadStream(req.dir, {start: start, end: end});
                        req.headerWrite={ 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Accept-Ranges': 'bytes', 'Content-Length': chunksize, 'Content-Type': 'video/'+req.ext }
                        req.writeCode=206
                    } else {
                        req.headerWrite={ 'Content-Length': total, 'Content-Type': 'video/'+req.ext};
                        var file=fs.createReadStream(req.dir)
                        req.writeCode=200
                    }
                    if(req.query.downloadName){
                        req.headerWrite['content-disposition']='attachment; filename="'+req.query.downloadName+'"';
                    }
                    res.writeHead(req.writeCode,req.headerWrite);
                    file.on('close',function(){
                        res.end();
                    })
                    file.pipe(res);
                }else{
                    res.end(user.lang['File Not Found in Filesystem'])
                }
            }else{
                res.end(user.lang['File Not Found in Database'])
            }
        })
    },res,req);
});
//motion trigger
app.get('/:auth/motion/:ke/:id', function (req,res){
    s.auth(req.params,function(user){
        if(req.query.data){
            try{
                var d={id:req.params.id,ke:req.params.ke,details:JSON.parse(req.query.data)};
            }catch(err){
                res.end('Data Broken',err);
                return;
            }
        }else{
            res.end('No Data');
            return;
        }
        if(!d.ke||!d.id||!s.group[d.ke]){
            res.end(user.lang['No Group with this key exists']);
            return;
        }
        s.camera('motion',d,function(){
            res.end(user.lang['Trigger Successful'])
        });
    },res,req);
})
//hookTester trigger
app.get('/:auth/hookTester/:ke/:id', function (req,res){
    res.setHeader('Content-Type', 'application/json');
    s.auth(req.params,function(user){
        s.log(req.params,{type:'Test',msg:'Hook Test'})
        res.end(s.s({ok:true},null,3))
    },res,req);
})
//control trigger
app.get('/:auth/control/:ke/:id/:direction', function (req,res){
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        s.camera('control',req.params,function(resp){
            res.end(s.s(resp,null,3))
        });
    },res,req);
})
//modify video file
app.get(['/:auth/videos/:ke/:id/:file/:mode','/:auth/videos/:ke/:id/:file/:mode/:f'], function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        if(user.permissions.watch_videos==="0"||user.details.sub&&user.details.allmonitors!=='1'&&user.details.video_delete.indexOf(req.params.id)===-1){
            res.end(user.lang['Not Permitted'])
            return
        }
        var filename = s.nameToTime(req.params.file)
        if(req.query.isUTC === 'true'){
            filename = s.utcToLocal(filename)
        }
        req.sql='SELECT * FROM Videos WHERE ke=? AND mid=? AND time=?';
        req.ar=[req.params.ke,req.params.id,filename];
        s.sqlQuery(req.sql,req.ar,function(err,r){
            if(r&&r[0]){
                r=r[0];r.filename=s.formattedTime(r.time)+'.'+r.ext;
                switch(req.params.mode){
                    case'fix':
                        req.ret.ok=true;
                        s.video('fix',r)
                    break;
                    case'status':
                        req.params.f=parseInt(req.params.f)
                        if(isNaN(req.params.f)||req.params.f===0){
                            req.ret.msg='Not a valid value.';
                        }else{
                            req.ret.ok=true;
                            s.sqlQuery('UPDATE Videos SET status=? WHERE ke=? AND mid=? AND time=?',[req.params.f,req.params.ke,req.params.id,filename])
                            s.tx({f:'video_edit',status:req.params.f,filename:r.filename,mid:r.mid,ke:r.ke,time:s.nameToTime(r.filename),end:s.formattedTime(new Date,'YYYY-MM-DD HH:mm:ss')},'GRP_'+r.ke);
                        }
                    break;
                    case'delete':
                        req.ret.ok=true;
                        s.video('delete',r)
                    break;
                    default:
                        req.ret.msg=user.lang.modifyVideoText1;
                    break;
                }
            }else{
                req.ret.msg=user.lang['No such file'];
            }
            res.end(s.s(req.ret, null, 3));
        })
    },res,req);
})
//ffmpeg pushed stream in here to make a pipe
app.all(['/streamIn/:ke/:id','/streamIn/:ke/:id/:feed'], function (req, res) {
    var checkOrigin = function(search){return req.headers.host.indexOf(search)>-1}
    if(checkOrigin('127.0.0.1')){
        if(!req.params.feed){req.params.feed='1'}
        if(!s.group[req.params.ke].mon[req.params.id].streamIn[req.params.feed]){
            s.group[req.params.ke].mon[req.params.id].streamIn[req.params.feed] = new events.EventEmitter().setMaxListeners(0)
        }
        //req.params.feed = Feed Number
        res.connection.setTimeout(0);
        req.on('data', function(buffer){
            s.group[req.params.ke].mon[req.params.id].streamIn[req.params.feed].emit('data',buffer)
        });
        req.on('end',function(){
//            console.log('streamIn closed',req.params);
        });
    }else{
        res.end('Local connection is only allowed.')
    }
})
//MP4 Stream
app.get(['/:auth/mp4/:ke/:id/:channel/s.mp4','/:auth/mp4/:ke/:id/s.mp4','/:auth/mp4/:ke/:id/:channel/s.ts','/:auth/mp4/:ke/:id/s.ts'], function (req, res) {
    s.auth(req.params,function(user){
        if(!s.group[req.params.ke] || !s.group[req.params.ke].mon[req.params.id]){
            res.status(404);
            res.end('404 : Monitor not found');
            return
        }
        s.checkChildProxy(req.params,function(){
                var Channel = 'MAIN'
                if(req.params.channel){
                    Channel = parseInt(req.params.channel)+config.pipeAddition
                }
                var mp4frag = s.group[req.params.ke].mon[req.params.id].mp4frag[Channel];
                var errorMessage = 'MP4 Stream is not enabled'
                if(!mp4frag){
                    res.status(503);
                    res.end('503 : initialization : '+errorMessage);
                }else{
                    var init = mp4frag.initialization;
                    if (!init) {
                        res.status(503);
                        res.end('404 : Not Found : '+errorMessage);
                    } else {
                        res.locals.mp4frag = mp4frag
                        res.set('Access-Control-Allow-Origin', '*')
                        res.set('Connection', 'close')
                        res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate')
                        res.set('Expires', '-1')
                        res.set('Pragma', 'no-cache')
                        res.set('Content-Type', 'video/mp4')
                        res.status(200);
                        res.write(init);
                        mp4frag.pipe(res);
                        res.on('close', () => {
                            mp4frag.unpipe(res);
                        });
                    }
                }
        },res,req);
    },res,req);
});
//simulate RTSP over HTTP
app.get([
    '/:auth/mpegts/:ke/:id/:feed/:file',
    '/:auth/mpegts/:ke/:id/:feed/',
    '/:auth/h264/:ke/:id/:feed/:file',
    '/:auth/h264/:ke/:id/:feed',
    '/:auth/h264/:ke/:id'
], function (req, res) {
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        s.checkChildProxy(req.params,function(){
            if(!req.query.feed){req.query.feed='1'}
            var Emitter
            if(!req.params.feed){
                Emitter = s.group[req.params.ke].mon[req.params.id].streamIn[req.query.feed]
            }else{
                Emitter = s.group[req.params.ke].mon[req.params.id].emitterChannel[parseInt(req.params.feed)+config.pipeAddition]
            }
            s.init('streamIn',req.params)
            var contentWriter
            var date = new Date();
            res.writeHead(200, {
                'Date': date.toUTCString(),
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Content-Type': 'video/mp4',
                'Server': 'Shinobi H.264 Test Stream',
            });
            Emitter.on('data',contentWriter=function(buffer){
                res.write(buffer)
            })
            res.on('close', function () {
                Emitter.removeListener('data',contentWriter)
            })
        },res,req);
    },res,req);
});
//FFprobe by API
app.get('/:auth/probe/:ke',function (req,res){
    req.ret={ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        switch(req.query.action){
//            case'stop':
//                exec('kill -9 '+user.ffprobe.pid,{detatched: true})
//            break;
            default:
                if(!req.query.url){
                    req.ret.error = 'Missing URL'
                    res.end(s.s(req.ret, null, 3));
                    return
                }
                if(user.ffprobe){
                    req.ret.error = 'Account is already probing'
                    res.end(s.s(req.ret, null, 3));
                    return
                }
                user.ffprobe=1;
                if(req.query.flags==='default'){
                    req.query.flags = '-v quiet -print_format json -show_format -show_streams'
                }else{
                    if(!req.query.flags){
                        req.query.flags = ''
                    }
                }
                req.probeCommand = s.splitForFFPMEG(req.query.flags+' -i '+req.query.url).join(' ')
                exec('ffprobe '+req.probeCommand+' | echo ',function(err,stdout,stderr){
                    delete(user.ffprobe)
                    if(err){
                       req.ret.error=(err)
                    }else{
                        req.ret.ok=true
                        req.ret.result = stdout+stderr
                    }
                    req.ret.probe = req.probeCommand
                    res.end(s.s(req.ret, null, 3));
                })
            break;
        }
    },res,req);
})
//ONVIF requesting with Shinobi API structure
app.all(['/:auth/onvif/:ke/:id/:action','/:auth/onvif/:ke/:id/:service/:action'],function (req,res){
    var response = {ok:false};
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin",req.headers.origin);
    s.auth(req.params,function(user){
        var errorMessage = function(msg,error){
            response.ok = false
            response.msg = msg
            response.error = error
            res.end(s.s(response,null,3))
        }
        var actionCallback = function(onvifActionResponse){
            response.ok = true
            if(onvifActionResponse.data){
                response.responseFromDevice = onvifActionResponse.data
            }else{
                response.responseFromDevice = onvifActionResponse
            }
            if(onvifActionResponse.soap)response.soap = onvifActionResponse.soap
            res.end(s.s(response,null,3))
        }
        var isEmpty = function(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        }
        var doAction = function(Camera){
            var completeAction = function(command){
                if(command.then){
                    command.then(actionCallback).catch(function(error){
                        errorMessage('Device responded with an error',error)
                    })
                }else if(command){
                    response.ok = true
                    response.repsonseFromDevice = command
                    res.end(s.s(response,null,3))
                }else{
                    response.error = 'Big Errors, Please report it to Shinobi Development'
                    res.end(s.s(response,null,3))
                }
            }
            var action
            if(req.params.service){
                if(Camera.services[req.params.service] === undefined){
                    return errorMessage('This is not an available service. Please use one of the following : '+Object.keys(Camera.services).join(', '))
                }
                if(Camera.services[req.params.service] === null){
                    return errorMessage('This service is not activated. Maybe you are not connected through ONVIF. You can test by attempting to use the "Control" feature with ONVIF in Shinobi.')
                }
                action = Camera.services[req.params.service][req.params.action]
            }else{
                action = Camera[req.params.action]
            }
            if(!action || typeof action !== 'function'){
                errorMessage(req.params.action+' is not an available ONVIF function. See https://github.com/futomi/node-onvif for functions.')
            }else{
                var argNames = s.getFunctionParamNames(action)
                var options
                var command
                if(argNames[0] === 'options' || argNames[0] === 'params'){
                    options = {}
                    if(req.query.options){
                        var jsonRevokedText = 'JSON not formated correctly'
                        try{
                            options = JSON.parse(req.query.options)
                        }catch(err){
                            return errorMessage(jsonRevokedText,err)
                        }
                    }else if(req.body.options){
                        try{
                            options = JSON.parse(req.body.options)
                        }catch(err){
                            return errorMessage(jsonRevokedText,err)
                        }
                    }else if(req.query.params){
                        try{
                            options = JSON.parse(req.query.params)
                        }catch(err){
                            return errorMessage(jsonRevokedText,err)
                        }
                    }else if(req.body.params){
                        try{
                            options = JSON.parse(req.body.params)
                        }catch(err){
                            return errorMessage(jsonRevokedText,err)
                        }
                    }
                }
                if(req.params.service){
                    command = Camera.services[req.params.service][req.params.action](options)
                }else{
                    command = Camera[req.params.action](options)
                }
                completeAction(command)
            }
        }
        if(!s.group[req.params.ke].mon[req.params.id].onvifConnection){
            //prepeare onvif connection
            var controlURL
            var monitorConfig = s.group[req.params.ke].mon_conf[req.params.id]
            if(!monitorConfig.details.control_base_url||monitorConfig.details.control_base_url===''){
                controlURL = s.init('url_no_path',monitorConfig)
            }else{
                controlURL = monitorConfig.details.control_base_url
            }
            var controlURLOptions = s.camera('buildOptionsFromUrl',controlURL,monitorConfig)
            //create onvif connection
            s.group[req.params.ke].mon[req.params.id].onvifConnection = new onvif.OnvifDevice({
                xaddr : 'http://' + controlURLOptions.host + ':' + controlURLOptions.port + '/onvif/device_service',
                user : controlURLOptions.username,
                pass : controlURLOptions.password
            })
            var device = s.group[req.params.ke].mon[req.params.id].onvifConnection
            device.init().then((info) => {
                if(info)doAction(device)
            }).catch(function(error){
                return errorMessage('Device responded with an error',error)
            })
        }else{
            doAction(s.group[req.params.ke].mon[req.params.id].onvifConnection)
        }
    },res,req);
})
s.cpuUsage=function(e){
    k={}
    switch(s.platform){
        case'win32':
            k.cmd="@for /f \"skip=1\" %p in ('wmic cpu get loadpercentage') do @echo %p%"
        break;
        case'darwin':
            k.cmd="ps -A -o %cpu | awk '{s+=$1} END {print s}'";
        break;
        case'linux':
            k.cmd='LANG=C top -b -n 2 | grep "^'+config.cpuUsageMarker+'" | awk \'{print $2}\' | tail -n1';
        break;
    }
    if(config.customCpuCommand){
      exec(config.customCpuCommand,{encoding:'utf8',detached: true},function(err,d){
          if(s.isWin===true) {
              d = d.replace(/(\r\n|\n|\r)/gm, "").replace(/%/g, "")
          }
          e(d)
      });
    } else if(k.cmd){
         exec(k.cmd,{encoding:'utf8',detached: true},function(err,d){
             if(s.isWin===true){
                 d=d.replace(/(\r\n|\n|\r)/gm,"").replace(/%/g,"")
             }
             e(d)
         });
    } else{
        e(0)
    }
}
s.ramUsage=function(e){
    k={}
    switch(s.platform){
        case'win32':
            k.cmd = "wmic OS get FreePhysicalMemory /Value"
        break;
        case'darwin':
            k.cmd = "vm_stat | awk '/^Pages free: /{f=substr($3,1,length($3)-1)} /^Pages active: /{a=substr($3,1,length($3-1))} /^Pages inactive: /{i=substr($3,1,length($3-1))} /^Pages speculative: /{s=substr($3,1,length($3-1))} /^Pages wired down: /{w=substr($4,1,length($4-1))} /^Pages occupied by compressor: /{c=substr($5,1,length($5-1)); print ((a+w)/(f+a+i+w+s+c))*100;}'"
        break;
        default:
            k.cmd = "LANG=C free | grep Mem | awk '{print $4/$2 * 100.0}'";
        break;
    }
    if(k.cmd){
         exec(k.cmd,{encoding:'utf8',detached: true},function(err,d){
             if(s.isWin===true){
                 d=(parseInt(d.split('=')[1])/(s.totalmem/1000))*100
             }
             e(d)
         });
    }else{
        e(0)
    }
}
//check disk space every 20 minutes
if(config.autoDropCache===true){
    setInterval(function(){
        exec('echo 3 > /proc/sys/vm/drop_caches',{detached: true})
    },60000*20);
}
s.beat=function(){
    setTimeout(s.beat, 8000);
    io.sockets.emit('ping',{beat:1});
}
s.beat();
s.processReady = function(){
    s.systemLog(lang.startUpText5)
    process.send('ready')
}
//setup Master for childNodes
if(config.childNodes.enabled === true && config.childNodes.mode === 'master'){
    s.childNodes = {};
    var childNodeHTTP = express();
    var childNodeServer = http.createServer(app);
    var childNodeWebsocket = new (require('socket.io'))()
    childNodeServer.listen(config.childNodes.port,config.bindip,function(){
        console.log(lang.Shinobi+' - CHILD NODE PORT : '+config.childNodes.port);
    });
    childNodeWebsocket.attach(childNodeServer);
    //send data to child node function (experimental)
    s.cx = function(z,y,x){if(!z.mid && !z.d){
            var err = new Error();
    console.log(err.stack);
    };if(x){return x.broadcast.to(y).emit('c',z)};childNodeWebsocket.to(y).emit('c',z);}
    //child Node Websocket
    childNodeWebsocket.on('connection', function (cn) {
        //functions for dispersing work to child servers;
        cn.on('c',function(d){
            if(config.childNodes.key.indexOf(d.socketKey) > -1){
                if(!cn.shinobi_child&&d.f=='init'){
                    cn.ip = cn.request.connection.remoteAddress.replace('::ffff:','')+':'+d.port
                    cn.shinobi_child = 1
                    tx = function(z){
                        cn.emit('c',z)
                    }
                    if(!s.childNodes[cn.ip]){
                        s.childNodes[cn.ip] = {}
                    };
                    s.childNodes[cn.ip].cnid = cn.id
                    s.childNodes[cn.ip].cpu = 0
                    s.childNodes[cn.ip].activeCameras = {}
                    tx({
                        f : 'init_success',
                        childNodes : s.childNodes
                    });
                }else{
                    switch(d.f){
                        case'cpu':
                            s.childNodes[cn.ip].cpu = d.cpu;
                        break;
                        case'sql':
                            s.sqlQuery(d.query,d.values,function(err,rows){
                                cn.emit('c',{f:'sqlCallback',rows:rows,err:err,callbackId:d.callbackId});
                            });
                        break;
                        case'camera':
                            s.camera(d.mode,d.data)
                        break;
                        case's.tx':
                            s.tx(d.data,d.to)
                        break;
                        case's.log':
                            if(!d.mon || !d.data)return console.log('LOG DROPPED',d.mon,d.data);
                            s.log(d.mon,d.data)
                        break;
                        case'created_file_chunk':
                            if(!s.group[d.ke].mon[d.mid].childNodeStreamWriters[d.filename]){
                                d.dir = s.video('getDir',s.group[d.ke].mon_conf[d.mid])
                                s.group[d.ke].mon[d.mid].childNodeStreamWriters[d.filename] = fs.createWriteStream(d.dir+d.filename)
                            }
                            s.group[d.ke].mon[d.mid].childNodeStreamWriters[d.filename].write(d.chunk)
                        break;
                        case'created_file':
                            if(!s.group[d.ke].mon[d.mid].childNodeStreamWriters[d.filename]){
                                return console.log('FILE NOT EXIST')
                            }
                            s.group[d.ke].mon[d.mid].childNodeStreamWriters[d.filename].end();
                            tx({
                                f:'delete',
                                file:d.filename,
                                ke:d.ke,
                                mid:d.mid
                            });
                            s.txWithSubPermissions({
                                f:'video_build_success',
                                hrefNoAuth:'/videos/'+d.ke+'/'+d.mid+'/'+d.filename,
                                filename:d.filename,
                                mid:d.mid,
                                ke:d.ke,
                                time:s.timeObject(d.startTime).format(),
                                size:d.filesize,
                                end:s.timeObject(d.endTime).format()
                            },'GRP_'+d.ke,'video_view');
                            clearTimeout(s.group[d.ke].mon[d.mid].checker)
                            clearTimeout(s.group[d.ke].mon[d.mid].checkStream)
                        break;
                    }
                }
            }
        })
        cn.on('disconnect',function(){
            if(s.childNodes[cn.ip]){
                var activeCameraKeys = Object.keys(s.childNodes[cn.ip].activeCameras)
                activeCameraKeys.forEach(function(key){
                    var monitor = s.childNodes[cn.ip].activeCameras[key]
                    s.camera('stop',s.init('noReference',monitor))
                    delete(s.group[monitor.ke].mon[monitor.mid].childNode)
                    delete(s.group[monitor.ke].mon[monitor.mid].childNodeId)
                    setTimeout(function(){
                        s.camera(monitor.mode,s.init('noReference',monitor))
                    },1300)
                })
                delete(s.childNodes[cn.ip]);
            }
        })
    })
}else
//setup Child for childNodes    
if(config.childNodes.enabled === true && config.childNodes.mode === 'child' && config.childNodes.host){
    s.connected = false;
    childIO = require('socket.io-client')('ws://'+config.childNodes.host);
    s.cx = function(x){x.socketKey = config.childNodes.key;childIO.emit('c',x)}
    s.tx = function(x,y){s.cx({f:'s.tx',data:x,to:y})}
    s.log = function(x,y){s.cx({f:'s.log',mon:x,data:y})}
    s.queuedSqlCallbacks = {}
    s.sqlQuery = function(query,values,onMoveOn){
        var callbackId = s.gid()
        if(!values){values=[]}
        if(typeof values === 'function'){
            var onMoveOn = values;
            var values = [];
        }
        if(typeof onMoveOn !== 'function'){onMoveOn=function(){}}
        s.queuedSqlCallbacks[callbackId] = onMoveOn
        s.cx({f:'sql',query:query,values:values,callbackId:callbackId});
    }
    setInterval(function(){
        s.cpuUsage(function(cpu){
            io.emit('c',{f:'cpu',cpu:parseFloat(cpu)});
        })
    },2000);
    childIO.on('connect', function(d){
        console.log('CHILD CONNECTION SUCCESS')
        s.cx({
            f : 'init',
            port : config.port
        })
    })
    childIO.on('c', function (d) {
        switch(d.f){
            case'sqlCallback':
                if(s.queuedSqlCallbacks[d.callbackId]){
                    s.queuedSqlCallbacks[d.callbackId](d.err,d.rows)
                    delete(s.queuedSqlCallbacks[d.callbackId])
                }
            break;
            case'init_success':
                s.connected=true;
                s.other_helpers=d.child_helpers;
            break;
            case'kill':
                s.init(0,d.d);
                s.kill(s.group[d.d.ke].mon[d.d.id].spawn,d.d)
            break;
            case'sync':
                s.init(0,d.sync);
                Object.keys(d.sync).forEach(function(v){
                    s.group[d.sync.ke].mon[d.sync.mid][v]=d.sync[v];
                });
            break;
            case'delete'://delete video
                s.file('delete',s.dir.videos+d.ke+'/'+d.mid+'/'+d.file)
            break;
            case'insertCompleted'://close video
                s.video('insertCompleted',d.d,d.k)
            break;
            case'cameraStop'://start camera
                s.camera('stop',d.d)
            break;
            case'cameraStart'://start or record camera
                s.camera(d.mode,d.d)
            break;
        }
    })
    childIO.on('disconnect',function(d){
        s.connected = false;
    })
}
if(config.childNodes.mode === 'child'){
    //child node - startup functions
//    fs.readdir(s.dir.videos, function(err,groupKeys) {
//        groupKeys.forEach(function(groupKey){
//            fs.readdir(s.dir.videos+groupKey, function(err,monitorIds) {
//                monitorIds.forEach(function(monitorId){
//                    fs.readdir(s.dir.videos+groupKey+'/'+monitorId, function(err,files) {
//                        files.forEach(function(file){
//                            if(/T[0-9][0-9]-[0-9][0-9]-[0-9][0-9]./.test(file)){
//                                var filePath = s.dir.videos+groupKey+'/'+monitorId+'/'+file
//                                var stat = fs.statSync(filePath)
//                                var filesize = stat.size
//                                var filesizeMB = parseFloat((filesize/1000000).toFixed(2))
//                                var startTime = s.nameToTime(file)
//                                var endTime = s.formattedTime(stat.mtime,'YYYY-MM-DD HH:mm:ss')
//                                fs.createReadStream(filePath)
//                                .on('data',function(data){
//                                    s.cx({
//                                        f:'created_file_chunk',
//                                        mid:monitorId,
//                                        ke:groupKey,
//                                        chunk:data,
//                                        filename:file,
//                                        filesize:filesize,
//                                        time:s.timeObject(startTime).format(),
//                                        end:s.timeObject(endTime).format()
//                                    })
//                                })
//                                .on('close',function(){
//                                    s.cx({
//                                        f:'created_file',
//                                        mid:monitorId,
//                                        ke:groupKey,
//                                        filename:file,
//                                        filesize:filesize,
//                                        time:s.timeObject(startTime).format(),
//                                        end:s.timeObject(endTime).format()
//                                    })
//                                })
//                                .on('error',function(){
//                                    console.log('File Read Error',file)
//                                });
//                            }else{
//                                console.log('Not Video',file)
//                            }
//                        })
//                    })
//                })
//            })
//        })
//    })
}else{
    //master node - startup functions
    setInterval(function(){
        s.cpuUsage(function(cpu){
            s.ramUsage(function(ram){
                s.tx({f:'os',cpu:cpu,ram:ram},'CPU');
            })
        })
    },10000);
    setTimeout(function(){
        //get current disk used for each isolated account (admin user) on startup
        s.sqlQuery('SELECT * FROM Users WHERE details NOT LIKE ?',['%"sub"%'],function(err,r){
            if(r&&r[0]){
                var count = r.length
                var countFinished = 0
                r.forEach(function(v,n){
                    v.size=0;
                    v.limit=JSON.parse(v.details).size
                    s.sqlQuery('SELECT * FROM Videos WHERE ke=? AND status!=?',[v.ke,0],function(err,rr){
                        ++countFinished
                        if(r&&r[0]){
                            rr.forEach(function(b){
                                v.size+=b.size
                            })
                        }
                        s.systemLog(v.mail+' : '+lang.startUpText0+' : '+rr.length,v.size)
                        s.init('group',v)
                        s.systemLog(v.mail+' : '+lang.startUpText1,countFinished+'/'+count)
                        if(countFinished===count){
                            s.systemLog(lang.startUpText4)
                            //preliminary monitor start
                            s.sqlQuery('SELECT * FROM Monitors', function(err,r) {
                                if(err){s.systemLog(err)}
                                if(r&&r[0]){
                                    r.forEach(function(v){
                                        s.init(0,v);
                                        r.ar={};
                                        r.ar.id=v.mid;
                                        Object.keys(v).forEach(function(b){
                                            r.ar[b]=v[b];
                                        })
                                        if(!s.group[v.ke]){
                                            s.group[v.ke]={}
                                            s.group[v.ke].mon_conf={}
                                        }
                                        v.details=JSON.parse(v.details);
                                        s.group[v.ke].mon_conf[v.mid]=v;
                                        s.camera(v.mode,r.ar);
                                    });
                                }
                                s.processReady()
                            });
                        }
                    })
                })
            }else{
                s.processReady()
            }
        })
    },1500)
}