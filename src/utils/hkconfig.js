var g_oLocalConfig = null; //本地配置

//错误码        
//通用错误
var ERROR_CODE_UNKNOWN = 1000; //未知错误
var ERROR_CODE_NETWORKERROR = 1001; //网络错误
var ERROR_CODE_PARAMERROR = 1002; //缺少插件元素

//登录模块
var ERROR_CODE_LOGIN_NOLOGIN = 2000; // 未登录
var ERROR_CODE_LOGIN_REPEATLOGIN = 2001; //设备已登录，重复登录
var ERROR_CODE_LOGIN_NOSUPPORT = 2002; //当前设备不支持Digest登录

//预览播放
var ERROR_CODE_PLAY_PLUGININITFAIL = 3000; //插件初始化失败
var ERROR_CODE_PLAY_NOREPEATPLAY = 3001; //当前窗口已经在预览
var ERROR_CODE_PLAY_PLAYBACKABNORMAL = 3002; //回放异常
var ERROR_CODE_PLAY_PLAYBACKSTOP = 3003; //回放停止
var ERROR_CODE_PLAY_NOFREESPACE = 3004; //录像过程中，硬盘容量不足

//对讲
var ERROR_CODE_TALK_FAIL = 5000; //语音对讲失败

var version="V3.3.0build20230322"

export function getHKData(parameters) {
    var result = {analogMode: false};
    for(var i = 0;i < parameters.length;i++){
        var parameter = parameters[i];        
        if(parameter.name =='rtsp_port'){
            result.rtspPort = parameter.value; //rtsp端口
        }
        else if(parameter.name == 'nvr_address'){
            result.nvrAddress = parameter.value; //nvr地址    
        }
        else if(parameter.name == 'user_name'){ //用户名
            result.userName = parameter.value; //用户名
        }
        else if(parameter.name == 'pass_word'){ //密码
            result.passWord = parameter.value; //密码
        }
        else if(parameter.name == 'port') //端口
        {
            result.port = parameter.value; //访问端口
        }
        else if(parameter.name == 'channel_id'){
            result.channelID = parameter.value;
        }
        else if(parameter.name == 'trans_stream'){
            result.transStream = parameter.value;
        }
        else if(parameter.name == 'stream_type'){
            result.streamType = parameter.value;
        }
        else if(parameter.name == 'analog_mode'){
            result.analogMode = parameter.value;
        }
    }
    return result;
}

/**
 * 根据参数信息获得海康视频的播放数据
 */
export function getRTSPData(parameters) {
    var result = {};
    for(var i = 0;i < parameters.length;i++){
        var parameter = parameters[i];        
        if(parameter.name =='rtsp_port'){
            result.rtspPort = parameter.value; //rtsp端口
        }
        else if(parameter.name =='rtsp_url'){
            result.rtspUrl = parameter.value; //rtsp端口
        }
    }
    return result;
}
