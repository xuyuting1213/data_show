<template>
    <div style="width: 100%; height: 100%">
        <div class="loadgif" v-if="loading" style="top: -10%">
            <img src="../../../assets/images/loading.gif" id="show_loading" /><span style="color: white">摄像头数据获取中</span>
        </div>

        <div :id="myNewId" class="plugin" style="height: 100%; width: 100%" v-loading="loading"></div>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <div class="mb8">
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button icon="el-icon-view" size="mini" @click="clickStartRealPlay(undefined, hasLogin)"
                                type="primary">播放</el-button>
                            <!-- <el-button
                        icon="el-icon-view"
                        size="mini"
                        @click="changemode"
                        type="warning"
                        >回放</el-button
                      > -->
                            <el-button icon="el-icon-view" size="mini" @click="clickFullScreen"
                                type="info">全屏</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "hkVideo",
    inheritAttrs: false,
    props: {
        data: {
            type: Object || Array,
            require: true,
        },
        mode_info: {
            type: String,
            require: true,
        },
        newId: {
            type: String,
            require: true,
            default: "div123",
        },
        loading_time: {
            type: Number,
            require: true,
            default: 2000,
        },
    },
    computed: {
        activeIndex() {
            return this.$route.path;
        },
    },
    watch: {
        newId: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.myNewId = newVal;
                }
            },
        },
        loading_time: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    this.loadingtime = newVal;
                }
            },
        },
        data: {
            deep: true,
            immediate: true,
            handler(newVal, oldVal) {
                if (newVal) {
                    console.log("assign value", newVal);
                    this.ip = newVal.nvrAddress; //新的IP
                    if (this.activeIndex == "/videomonit/bottle/1") {
                        this.ip = "200.150.100.252";
                        // console.log("11111", newVal);
                    }
                    this.userName = newVal.userName; //访问nvr的用户名
                    this.passWord = newVal.passWord; //访问密码


                    switch (true) {
                        case this.ip.indexOf("200.150.100.252") >= 0: {
                            this.passWord = "ZG20241019";
                            break;
                        }
                    }
                    console.log(this.ip);

                    console.log('aaaaa', this.passWord);

                    if (newVal.rtspPort) this.rtspPort = newVal.rtspPort;
                    else this.rtspPort = 554; //默认的端口
                    if (newVal.transStream) this.transStream = true;
                    else this.transStream = false;
                    // this.analogMode =newVal.nvrAddress.indexOf('192.168.20.248')<0? true:false;
                    //else this.analogMode = false;
                    // analogMode
                    if (newVal.analogMode) this.analogMode = true;
                    else this.analogMode = false;


                    console.log("analogMode", this.analogMode);
                    if (newVal.port) this.port = newVal.port; //访问端口
                    else this.port = 80; //80端口
                    this.iChannelID = !newVal.channelID ? 1 : newVal.channelID; //通道ID

                    //this.loadingTime = newVal.loadingTime;
                    if (newVal.title) this.title = newVal.title; //标题
                    else this.title = "监控摄像头";

                    if (newVal.streamType) this.streamType = newVal.streamType;
                    else this.streamType = 1;
                    if (newVal.videoWidth) this.videoWidth = newVal.videoWidth; //视频宽度
                    if (newVal.videoHeight) this.videoHeight = newVal.videoHeight;
                    if (this.ip && this.port) {
                        // console.log("hkvideo", this.loadingTime);
                        if (!this.plugInInitialized) {
                            setTimeout(() => {
                                this.initS(); //重新执行初始化
                                console.log("摄像头加载延迟时间", this.loading_time);
                            }, this.loading_time);
                        } else {
                            //直接点击播放的按钮
                            this.clickLogin();
                        }
                    }
                }
            },
        },
    },
    data() {
        return {
            mode: this.mode_info,
            imgdialog: false,
            myNewId: "divccf",
            visible: true, //是否隐藏
            showSearch: true, //是否显示搜索
            advanceMode: true, //是否是高级模式
            queryParams: {}, //查询参数，用来检索视频文件
            ip: "", //当前摄像头IP地址
            transStream: true, //转码标志
            rtspPort: 554, //rtsp的端口
            userName: "", //默认用户admin
            passWord: "", //密码
            port: 80, //录像机的默认端口是80
            iChannelID: 1, //通道id
            windowCount: 1, //1X1
            loadingTime: 2000, //加载时间
            timeOut: 2000, //加载的超时时间
            videoWidth: 600, //视频宽度
            videoHeight: 400, //视频高度
            fullSize: false, //是否自适应控件的大小
            title: "", //视频监控的标题
            rtsp: "", //"rtsp://admin:ZG20241019@200.150.100.251:554/Streaming/Channels/101",
            startTime: "", //回放的开始时间
            endTime: "", //回放的结束时间
            g_iWndIndex: 0, //选中的窗口k
            timeRange: [], //控件对应的时间
            streamType: 1, //1主码流, 子码流
            bZeroChannel: false, //是否零通道
            analogMode: false, //是否通过模拟通道播放
            streamTypeList: [
                { id: 1, label: "主码流" },
                { id: 2, label: "子码流" },
                { id: 3, label: "第三码流" },
                { id: 4, label: "转码码流" },
            ],
            startTime: "",
            endTime: "",
            plugInInitialized: false, //插件是否成功初始化
            loading: true,
            hasLogin: false, //插件是否成功登录
        };
    },
    mounted() {
        console.log("插件下载地址：webSDKPlugin/HCWebSDKPlugin.exe");
        // this.initS();
    },
    methods: {
        initS() {
            let that = this;
            if (!that.newId) {
                console.warn("hk video id empty, can not create hk video plugin.");
                return;
            }
            if (!that.ip || !that.port) {
                console.warn("hk video ip/port empty, can not init plugin.");
                return;
            }
            if (!this.plugInInitialized) {
                console.log("plugin initialized.");
                // 初始化
                WebVideoCtrl.I_InitPlugin({
                    bWndFull: true, //是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
                    iWndowType: 1, // 画面分割数 1 就是1*1   2就是2*2
                    cbSelWnd: function (xmlDoc) {
                        //此属性是窗口分割切换窗口时触发
                        this.g_iWndIndex = parseInt(
                            $(xmlDoc).find("SelectWnd").eq(0).text(),
                            10
                        );
                        var szInfo = "当前选择的窗口编号：" + this.g_iWndIndex;
                        console.log(szInfo);
                    },
                    cbDoubleClickWnd: function (iWndIndex, bFullScreen) {
                        this.iWndIndex = iWndIndex;
                        var szInfo = "当前放大的窗口编号：" + iWndIndex;
                        if (!bFullScreen) {
                            szInfo = "当前还原的窗口编号：" + iWndIndex;
                        }
                        console.log(szInfo);
                    },
                    cbEvent: function (iEventType, iParam1, iParam2) {
                        console.log(
                            "收到事件消息, eventType=" +
                            iEventType +
                            ",param1=" +
                            iParam1 +
                            ",p2=" +
                            iParam2
                        );
                        if (2 == iEventType) {
                            // 回放正常结束
                            console.log("窗口" + iParam1 + "回放结束！");
                        } else if (-1 == iEventType) {
                            console.log("设备" + iParam1 + "网络错误！");
                        } else if (3001 == iEventType) {
                            this.clickStopRealPlay();
                            //this.clickStopRecord(g_szRecordType, iParam1);
                        }
                    },
                    cbInitPluginComplete: function () {
                        that.plugInInitialized = true;
                        WebVideoCtrl.I_InsertOBJECTPlugin(that.newId).then(
                            () => {
                                console.log("init ok.");
                                // setTimeout(() => {
                                //登录做一个延迟
                                that.clickLogin();
                                that.setVideoWindowResize(this.newId, "700", "500");
                                // }, 7000);
                                // 检查插件是否最新
                                WebVideoCtrl.I_CheckPluginVersion().then((bFlag) => {
                                    if (bFlag) {
                                    }
                                    //   this.loading = false;
                                });
                            },
                            () => {
                                let str1 =
                                    "插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！";
                                that.$message.error(str1);
                                console.log(str1);
                                this.loading = false;
                            }
                        );
                    },
                });
            }
            //   setTimeout(() => {
            //     //   let cw = Math.round(document.body.clientWidth / 1920);
            //     //   let ch = Math.round(document.body.clientHeight / 1080);
            //     //   let width = parseInt(this.videoWidth * cw, 10);
            //     //   let height = parseInt(this.videoHeight * ch, 10);
            //     //   if (height <= 200) {
            //     //     height = 200;
            //     //   }
            //     //   if (height <= 200) {
            //     //     height = 200;
            //     //   }
            //     //   //let w1 = (window.innerWidth - document.getElementById(this.newId).offsetLeft) - 1700;
            //     //   //let w2 = document.getElementById(this.newId).clientHeight;
            //     //   console.log("00000===>", width, height);
            //     //   // 对窗口大小重新规划
            //     //   WebVideoCtrl.I_Resize(width, height);
            //     //   this.setVideoWindowResize(this.newId, width, height);
            //     this.clickLogin();
            //   }, 700);
        },
        clickFullScreen() {
            WebVideoCtrl.I_FullScreen(true).then(
                () => {
                    console.log("全屏成功");
                },
                (oError) => {
                    console.log("全屏失败！", oError.errorCode, oError.errorMsg);
                }
            );
        },
        // 根据设备宽高和windowchange设置窗口大小
        setVideoWindowResize(pid, width, height) {
            if (!pid) return;
            var elment = document.getElementById(pid);
            if (elment) {
                elment.style.width = width + "px";
                elment.style.height = height + "px";
            }
        },
        // 登录
        clickLogin() {
            let that = this;
            that.hasLogin = false;
            // this.hasLogin = false;
            this.loading = true;
            var szDeviceIdentify = this.ip + "_" + this.port;
            WebVideoCtrl.I_Login(
                this.ip,
                1,
                this.port,
                this.userName,
                this.passWord,
                {
                    timeout: this.timeOut,
                    success: function (xmlDoc) {
                        that.hasLogin = true;
                        console.log(szDeviceIdentify + " 已登录！");
                        // if (that.mode == "preview") {
                        console.log(" this.hasLogin", that.hasLogin);
                        console.log("do start realplay...");
                        // setTimeout(function () {
                        // 登录过直接进行预览
                        // setTimeout(function () {
                        //   setTimeout(function () {
                        // 先获取端口，再回去通道
                        // that.getChannelInfo();
                        //   }, 1000);
                        that.getDevicePort(that.hasLogin);
                        // }, 10);
                    },
                    error: function (err) {
                        console.log("登录-err===>", err);
                        if (err.errorCode == 2001) {
                            that.hasLogin = true;
                            console.log(szDeviceIdentify + " 已登录过！");
                            console.log("do start realplay...");
                            // 登录过直接进行预览
                            that.getDevicePort(that.hasLogin);
                        } else {
                            that.$message.error(
                                "设备登录失败，请检查登陆密码/访问地址的配置是否正确！"
                            );
                            // that.hasLogin = false;
                        }
                        that.loading = false;
                    },
                }
            );
        },

        // 获取端口
        getDevicePort(hasLogin) {
            if (null == this.ip) {
                return;
            }
            WebVideoCtrl.I_GetDevicePort(this.ip).then((oPort) => {
                console.log("152获取端口", oPort);
                // 这里执行了channel了就不用再掉一遍了
                this.getChannelInfo(hasLogin);
            });
        },
        // 获取通道
        getChannelInfo(hasLogin) {
            let that = this;
            var szDeviceIdentify = this.ip + "_" + this.port;
            if (null == szDeviceIdentify) {
                return;
            }
            console.log("获取通道", szDeviceIdentify);

            // 模拟通道
            WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
                success: function (xmlDoc) {
                    setTimeout(() => {
                        that.clickStartRealPlay(undefined, hasLogin);
                        console.log("走模拟通道");

                        // console.log("szDeviceIdentify==============>", hasLogin);
                        //that.clickStartRealPlay(undefined, hasLogin);
                    }, that.loadingTime);
                },
                error: function (oError) {
                    // setTimeout(() => {
                    // console.log("szDeviceIdentify==============>", hasLogin);
                    //that.clickStartRealPlay(undefined, hasLogin);
                    // }, 3000);
                    console.log("模拟通道");

                    console.log(
                        szDeviceIdentify + "模拟通道",
                        oError.errorCode,
                        oError.errorMsg
                    );
                },
            });

            // 数字通道
            WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
                success: function (xmlDoc) {
                    var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
                    console.log("走数字通道");

                    // const that = this;
                    // console.log("xmlDoc", xmlDoc);
                    // $.each(oChannels, function (i) {
                    //   const id = $(this).find("id").eq(0).text();

                    //   let name = $(this).find("name").eq(0).text();
                    //   const online = $(this).find("online").eq(0).text();
                    //   if (online === "false") {
                    //     // 过滤禁用的数字通道
                    //     return true;
                    //   }
                    //   if (name === "") {
                    //     name = "IPCamera " + (i < 9 ? "0" + (i + 1) : i + 1);
                    //   }
                    //   console.log(id, name);
                    //   console.log(online);

                    //   // that.channelsList.push({ id, name, bZero: false });
                    //   //   console.log(that.channelsList + " 获取数字通道成功！");
                    // });

                    setTimeout(() => {
                        if (!that.analogMode) that.clickStartRealPlay(undefined, hasLogin);
                        // console.log("szDeviceIdentify==============>", hasLogin);
                        //that.clickStartRealPlay(undefined, hasLogin);
                    }, that.loadingTime);
                },
                error: function (oError) {
                    console.log(
                        szDeviceIdentify + " 数字通道",
                        oError.errorCode,
                        oError.errorMsg
                    );
                },
            });
        },
        // 开始预览(按钮点击)
        clickStartRealPlay(iStreamType, hasLogin) {
            console.log("是否登陆", hasLogin);
            if (this.plugInInitialized && hasLogin) {
                let that = this;
                that.loading = true;
                var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex) || null;
                if (!this.ip || !this.port) return;

                var szDeviceIdentify = this.ip + "_" + this.port;

                if ("undefined" === iStreamType) {
                    this.streamType = 1;
                } else {
                    this.streamType = iStreamType;
                }
                if (null == szDeviceIdentify) {
                    return;
                }
                var option = {
                    iStreamType: that.streamType,
                    iChannelID: that.iChannelID,
                    bZeroChannel: that.bZeroChannel,
                    // iRtspPort: 10311, // RTSP端口
                    success: function () {
                        //WebVideoCtrl.I_Logout(szDeviceIdentify);
                        console.log("开始预览成功！");
                        that.loading = false;
                    },
                    error: function (oError) {
                        that.$message.error(
                            szDeviceIdentify + "开始预览失败！请点击播放按钮重试！"
                        );
                        console.log(szDeviceIdentify + "开始预览失败！");
                        console.log("oError", oError);
                        that.loading = false;
                    },
                };
                console.log("start real play with option:", option);
                option.iStreamType = 1;
                var startRealPlay = function () {
                    WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, option);
                };

                if (oWndInfo != null) {
                    // 已经在播放了，先停止
                    WebVideoCtrl.I_Stop({
                        success: function () {
                            startRealPlay();
                        },
                    });
                } else {
                    startRealPlay();
                }
            } else if (!hasLogin) {
                this.$message.error("设备登录失败，请刷新页面重新登录！");
            }
            if (!this.plugInInitialized) {
                this.$message.error(
                    "插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！"
                );
            }
        },
        // 停止预览
        clickStopRealPlay() {
            WebVideoCtrl.I_Stop({
                success: function () {
                    console.log("停止预览成功！");
                },
                error: function (oError) {
                    console.log(" 停止预览失败！");
                },
            });
        },
        closeVideo() {
            console.log("plugInInitialized", this.plugInInitialized);
            if (this.plugInInitialized) {
                try {
                    WebVideoCtrl.I_StopAllPlay(); //停止全部播放
                    var szDeviceIdentify = this.ip + "_" + this.port;
                    WebVideoCtrl.I_Logout(szDeviceIdentify); //退出
                    WebVideoCtrl.I_DestroyPlugin(szDeviceIdentify); // 如果销毁的只是最后一个视频，前面视频没有销毁
                } catch (e) {
                    console.log(e.$message);
                }
                this.plugInInitialized = false;
                window.location.reload(); //销毁失败强制重载
            }
        },

        loginOut() {
            WebVideoCtrl.I_Logout(this.ip + "_" + this.port).then(
                () => {
                    console.log("退出成功");
                    WebVideoCtrl.I_DestroyPlugin();
                },
                () => {
                    console.log("退出失败！");
                }
            );
        },
        stopAllPlay() {
            WebVideoCtrl.I_StopAllPlay();
        },
        breakDom() {
            // console.log('aaaaa',this.plugInInitialized)
            // if (this.plugInInitialized) {
            //   WebVideoCtrl.I;
            WebVideoCtrl.I_DestroyPlugin();
            // this.plugInInitialized = false;
            // }
        },
        viewReload() {
            window.location.reload();
        },
    },
    beforeDestroy() {
        this.loginOut();
        this.stopAllPlay();
        window.removeEventListener(this.viewReload);
    },
    destroyed() {
        // setTimeout(() => {
        //   this.breakDom();
        // }, 1000);
    },
};
</script>

<style></style>