let express = require('express');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
let webSocketStream = require('websocket-stream/stream');
let WebSocket = require('websocket-stream');
let http = require('http');
let expressWebSocket = require('express-ws');

let app = express();
app.use(express.static(__dirname));
expressWebSocket(app, null, {
    perMessageDeflate: true
});
app.ws("/rtsp/:id/", rtspRequestHandle)
app.listen(8888);
console.log("express listened")

function rtspRequestHandle(ws, req) {
    console.log("rtsp request handle");
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });
    //let url = req.query.url + '?device=' + req.params.device + '&channel=' + req.params.channel + '&streamtype=' + req.params.streamtype + '&token=' + req.params.token + '&type=' + req.params.type;
    let url = req.query.url;
    console.log("rtsp url:", url);
    console.log("rtsp params:", req.params);
    try {
        ffmpeg(url)
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "0")  // 这里可以添加一些 RTSP 优化的参数
            .on("start", function () {
                console.log(url, "Stream started.");
            })
            .on("codecData", function () {
                console.log(url, "Stream codecData.")
                // 摄像机在线处理
            })
            .on("error", function (err) {
                console.log(url, "An error occured: ", err);
            })
            .on("end", function () {
                console.log(url, "Stream end!");
                // 摄像机断线的处理
            })
            .outputFormat("flv").videoCodec("copy").noAudio().pipe(stream);
    } catch (error) {
        console.log(error);
    }
}