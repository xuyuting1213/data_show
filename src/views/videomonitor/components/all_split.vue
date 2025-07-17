<template>
    <div class="video_wrapper_box" :id="pluginId"></div>
  </template>
  
  <script>
  // import WebVideoCtrl from 'WebVideoCtrl';
  // import { Modal } from 'view-design';
  import $ from "jquery"; // 使用JQ操作XML，获取信息
  export default {
    props: {
      loginIp: {
        type: String,
        // default: '192.168.90.xx',
        default: "200.150.100.252",
      },
      port: {
        type: String,
        default: "80",
        
      },
      username: {
        type: String,
        default: "admin",
  
      },
      password: {
        type: String,
        default: "ZG20241019",
  
      },
      iChannelIDIndex: {
        // 通道编号的索引，用来获取通道
        type: Number,
        default: 1,
      },
      iChannelIDList: {
        type: Array,
      },
    },
    watch: {
      iChannelIDList: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          //设置视频盒子的数据
          if (newVal) {
            this.iChannelIDIndexList = newVal;
          //   // 计算 num 除以 2 的结果
            const result = this.iChannelIDIndexList.length / 2;
            // 如果结果是整数，直接返回
            if (result % 1 === 0) {
              this.iWndowType = result;
            } else {
              // 否则，向上取整
              this.iWndowType = Math.ceil(result);
            }
            console.log(" this.iChannelIDIndexList:", this.iChannelIDIndexList);
          }
        },
      },
    },
    data() {
      return {
        pluginId: "video_" + this.generateUUID(), // 标识渲染的dom
        channelsList: [], // 通道列表
        currChannels: {},
        iDevicePort: "",
        iRtspPort: "",
        szDeviceIdentify: "", // ip_端口
        iWndowType: 1, // 窗口分割的数量 2*2
        g_iWndIndex: 0, // 窗口
        iChannelIDIndexList: [], // 选择的通道列表
      };
    },
    methods: {
      // 初始化
      initVideoCtrl() {
        // 检查插件是否已经安装过
        var iRet = WebVideoCtrl.I_CheckPluginInstall();
        //   console.log(iRet, "检测是否安装了WebComponentsKit.exe插件");
        if (iRet === -1) {
          alert("您还未安装过插件，双击开发包目录里的WebComponentsKit.exe安装！");
          return false;
        }
        // 初始化插件参数及插入插件
        WebVideoCtrl.I_InitPlugin({
          bWndFull: true, // 是否支持单窗口双击全屏，默认支持 true:支持 false:不支持
          iPackageType: 2, // 2:PS 11:MP4
          iWndowType: this.iWndowType,
          bNoPlugin: true,
          cbSelWnd: (xmlDoc) => {
            // 选择窗口
            this.g_iWndIndex = parseInt(
              $(xmlDoc).find("SelectWnd").eq(0).text(),
              10
            );
            console.log("窗口ID-当前选择的窗口编号：", this.g_iWndIndex);
          },
          cbInitPluginComplete: () => {
            WebVideoCtrl.I_InsertOBJECTPlugin(this.pluginId).then(
              () => {
                console.log("嵌入插件");
                this.$nextTick(() => {
                  //先调用窗口分割方法
                  this.changeWndNum(this.iWndowType);
                  //调用登录方法
                  this.clickLogin();
                });
                // 检查插件是否最新
                if (WebVideoCtrl.I_CheckPluginVersion() === -1) {
                  alert(
                    "检测到新的插件版本，双击开发包目录里的WebComponentsKit.exe升级！"
                  );
                  return false;
                }
              },
              () => {
                let str1 =
                  "插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！";
                this.$message.error(str1);
                console.log(str1);
                this.loading = false;
              }
            );
          },
        });
      },
  
      // 窗口分割
      changeWndNum(iType) {
        iType = parseInt(iType, 10);
        WebVideoCtrl.I_ChangeWndNum(iType);
      },
  
      // 登录
      clickLogin() {
        if (this.loginIp === "" || this.port === "") {
          return;
        }
        this.szDeviceIdentify = this.loginIp + "_" + this.port;
        console.log(
          "登录所需参数",
          this.loginIp,
          1,
          this.port,
          this.username,
          this.password
        );
  
        const iRet = WebVideoCtrl.I_Login(
          this.loginIp,
          1,
          this.port,
          this.username,
          this.password,
          {
            success: (xmlDoc) => {
              console.log(" 登录成功！", xmlDoc);
              setTimeout(() => {
                // 获取通道信息
                this.getChannelInfo();
                // 获取端口
                this.getDevicePort();
              }, 10);
  
              // 异步请求，当通道和端口都获取到的时候，开始预览
  
              setTimeout(() => {
                this.setIChannelID();
              }, 1000);
            },
            error: (status, xmlDoc) => {
              console.log(" 登录失败！", status, xmlDoc);
            },
          }
        );
  
        if (iRet === -1) {
          console.log(this.szDeviceIdentify + " 已登录过！");
          // 登录过直接进行预览
          this.setIChannelID();
        }
      },
      // 设置预览不同的通道
      setIChannelID() {
        if (this.channelsList.length === 0) {
          return false;
        }
        console.log("开始设置通道");
        // 因为界面调控只能看到通道的名称，为了方便后期维护，所以需要通过通道名称获取通道id
        let arr = [];
        this.iChannelIDIndexList.map((iChannelID, iWndIndex) => {
          console.log(iChannelID, iWndIndex, "通道编号和窗口编号");
          setTimeout(() => {
            // 多个同时播放的时候，g_iWndIndex应该设置上，不能不用，因为在clickStartRealPlay方法中已经在播放了，先停止
            this.g_iWndIndex = iWndIndex;
            this.clickStartRealPlay(iChannelID, iWndIndex); // iChannelID为通道号,  iWndIndex为窗口编号
          }, 200 * iWndIndex);
        });
        // 开始设置通道
        // for (let i = 0; i < 4; i++) { //i+1为通道号,  i 为窗口
        //     setTimeout(() => {
        //         // 多个同时播放的时候，g_iWndIndex应该设置上，不能不用，因为在clickStartRealPlay方法中已经在播放了，先停止
        //         this.g_iWndIndex = i;
        //         this.clickStartRealPlay(i, i++);
        //     }, 300 * i);
        // }
      },
      // 开始预览
      clickStartRealPlay(iChannelID, iWndIndex) {
        console.log("开始预览");
  
        if (!this.channelsList.length) {
          console.log("通道信息获取异常！");
          return false;
        }
        if (!this.iRtspPort) {
          console.log("RTSP端口获取异常！");
          return false;
        }
  
        const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
  
        const startRealPlay = () => {
          console.log("预览参数iRtspPort:" + this.iRtspPort);
          console.log("预览参数-通道列表:" + JSON.stringify(this.channelsList));
          console.log("预览参数-通道号iChannelID:" + ChannelMergerNode);
  
          if (this.channelsList.length <= this.iChannelIDIndex) {
            console.log(
              "当前通道长度小于传入的通道索引",
              this.channelsList.length,
              this.iChannelIDIndex
            );
            return false;
          }
  
          WebVideoCtrl.I_StartRealPlay(this.szDeviceIdentify, {
            iRtspPort: this.iRtspPort,
            iStreamType: 2, // 码流类型  1:主码流 2:子码流 3:第三码流 4:转码码流
            iChannelID: iChannelID, // 通道 ID 播放通道号，默认通道
            bZeroChannel: false, // 是否播放零通道，默认为 false
            iWndIndex: iWndIndex,
            success: () => {
              console.log("开始预览成功");
            },
            error: (status, xmlDoc) => {
              if (status === 403) {
                console.log("设备不支持Websocket取流！");
              } else {
                console.log("开始预览失败！");
              }
              console.log("预览失败", status + " " + xmlDoc);
            },
          });
        };
  
        if (oWndInfo !== null) {
          // 已经在播放了，先停止，多个的时候也需要处理
          console.log("已经在播放了，先停止！");
          console.log("停止窗口编号：" + this.g_iWndIndex);
          WebVideoCtrl.I_Stop({
            iWndIndex: this.g_iWndIndex,
            success: () => {
              console.log("停止成功，开始播放！");
              startRealPlay();
            },
            error: () => {
              console.log("停止播放异常！");
            },
          });
        } else {
          console.log("开始播放！");
          startRealPlay();
        }
      },
      // // 开始预览
      // clickStartRealPlay() {
      //   console.log("开始预览");
  
      //   if (!this.channelsList.length) {
      //     console.log("通道信息获取异常！");
      //     return false;
      //   }
      //   if (!this.iRtspPort) {
      //     console.log("RTSP端口获取异常！");
      //     return false;
      //   }
  
      //   const oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex);
      //   console.log("aaaa", this.g_iWndIndex);
  
      //   const startRealPlay = () => {
      //     console.log("预览参数iRtspPort:" + this.iRtspPort);
      //     console.log("预览参数-通道列表:" + JSON.stringify(this.channelsList));
      //     console.log("预览参数-通道号iChannelID:" + this.channelsList[0].id);
  
      //     WebVideoCtrl.I_StartRealPlay(this.szDeviceIdentify, {
      //       iRtspPort: this.iRtspPort,
      //       iStreamType: 2, // 码流类型  1:主码流 2:子码流 3:第三码流 4:转码码流
      //       iChannelID: this.iChannelIDIndex, // 通道 ID 播放通道号，默认通道 1
      //       bZeroChannel: false, // 是否播放零通道，默认为 false
      //       iWndIndex: this.g_iWndIndex,
      //       success: () => {
      //         console.log("开始预览成功");
      //       },
      //       error: (status, xmlDoc) => {
      //         if (status === 403) {
      //           console.log("设备不支持Websocket取流！");
      //         } else {
      //           console.log("开始预览失败！");
      //         }
      //         console.log("预览失败", status + " " + xmlDoc);
      //       },
      //     });
      //   };
      //   console.log(
      //     "窗口信息：" + this.g_iWndIndex + "号" + JSON.stringify(oWndInfo)
      //   );
  
      //   if (oWndInfo !== null) {
      //     // 已经在播放了，先停止
      //     console.log("已经在播放了，先停止！");
      //     console.log("停止窗口编号：" + this.g_iWndIndex);
      //     WebVideoCtrl.I_Stop({
      //       iWndIndex: this.g_iWndIndex,
      //       success: () => {
      //         console.log("停止成功，开始播放！");
      //         startRealPlay();
      //       },
      //       error: () => {
      //         console.log("停止播放异常！");
      //       },
      //     });
      //   } else {
      //     console.log("开始播放！");
      //     startRealPlay();
      //   }
      // },
      // 获取通道信息
      getChannelInfo() {
        this.channelsList = [];
  
        if (this.szDeviceIdentify === "") {
          return false;
        }
  
        // 数字通道
        WebVideoCtrl.I_GetDigitalChannelInfo(this.szDeviceIdentify, {
          async: false,
          success: (xmlDoc) => {
            var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
            console.log(oChannels);
  
            const that = this;
            $.each(oChannels, function (i) {
              const id = $(this).find("id").eq(0).text();
  
              let name = $(this).find("name").eq(0).text();
              const online = $(this).find("online").eq(0).text();
              if (online === "false") {
                // 过滤禁用的数字通道
                return true;
              }
              if (name === "") {
                name = "IPCamera " + (i < 9 ? "0" + (i + 1) : i + 1);
              }
              // console.log(id,name)
  
              that.channelsList.push({ id, name, bZero: false });
              //   console.log(that.channelsList + " 获取数字通道成功！");
            });
            console.log(this.szDeviceIdentify + " 获取数字通道成功！");
            return true;
          },
          error: (status, xmlDoc) => {
            console.log(
              this.szDeviceIdentify + " 获取数字通道失败！",
              status,
              xmlDoc
            );
            return false;
          },
        });
      },
      // 获取端口
      async getDevicePort() {
        if (this.szDeviceIdentify === "") {
          return false;
        }
        const oPort = await WebVideoCtrl.I_GetDevicePort(this.szDeviceIdentify);
        if (oPort != null) {
          this.iDevicePort = oPort.iDevicePort; // 设备 SDK 端口号，不传的话，插件会自动向设备获取
          this.iRtspPort = oPort.iRtspPort;
          console.log(this.szDeviceIdentify);
          console.log(oPort);
  
          console.log(JSON.stringify(oPort) + " 获取端口成功！");
          return true;
        } else {
          console.log(JSON.stringify(oPort) + " 获取端口失败！");
          return false;
        }
      },
  
      // 退出登录
      async clickLogout() {
        //   // 退出登录
        //   let szInfo = "";
  
        //   var iRet =await WebVideoCtrl.I_Logout(this.szDeviceIdentify);
        //   console.log(iRet)
        //   if (iRet === 0) {
        //     szInfo = "退出成功！";
        //     this.getChannelInfo();
        //     this.getDevicePort();
        //   } else {
        //     szInfo = "退出失败！";
        //   }
        console.log(this.loginIp + "_" + this.port + " ");
        console.log(this.szDeviceIdentify);
  
        WebVideoCtrl.I_Logout(this.szDeviceIdentify).then(
          () => {
            console.log("退出成功");
            WebVideoCtrl.I_DestroyPlugin(this.szDeviceIdentify);
          },
          () => {
            console.log("退出失败！");
          }
        );
      },
      // 生成uuid
      generateUUID() {
        let d = new Date().getTime();
        let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          (c) => {
            let r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
          }
        );
        return uuid;
      },
    },
    mounted() {
      setTimeout(() => {
        this.initVideoCtrl();
      }, 200);
    },
    beforeDestroy() {
      this.clickLogout();
    },
  };
  </script>
  
  <style lang="less" scoped>
  .video_wrapper_box {
    width: 100%;
    height: 100%;
  
    /deep/ .parent-wnd {
      > div {
        background: none !important;
      }
    }
    /deep/ canvas {
      border: none !important;
    }
  }
  </style>
  