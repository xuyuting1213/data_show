<template>
    <div>
      <div class="mb8">
        <div
          v-loading="loading"
          :id="myNewId"
          class="plugin"
          style="width: 500px; height: 300px"
        ></div>
        <el-button type="primary" size="mini" @click="clickStopPlayback"
          >停止回放</el-button
        >
        <el-button type="primary" size="mini" @click="clickReversePlayback"
          >倒放</el-button
        > 
        <el-button type="primary" size="mini" @click="clickPause">暂停</el-button>
        <el-button type="primary" size="mini" @click="clickResume"
          >继续</el-button
        >
        <el-button type="primary" size="mini" @click="clickPlayFast"
          >加速</el-button
        >
        <el-button type="primary" size="mini" @click="clickPlaySlow"
          >减速</el-button
        >
        <el-button type="primary" size="mini" @click="clickFullScreen"
          >全屏</el-button
        >
  
        <el-row style="margin-top: 10px">
          <div style="float: left">
            <el-date-picker
              style="margin-left: 3px;width:7rem"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              @change="getTimeRange"
              :append-to-body="false"
            />
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="clickRecordSearch()"
              >搜索</el-button
            >
          </div>
          <el-table
            bordered
            row-class-name="rowstyle"
            style="width: 100%; background: transparent;minHeight:4rem"
            :data="searchList"
            @selection-change="handleSelectionChange"
            v-loading="tableloading"
            height="4rem"
          >
            <el-table-column
              label="搜索序号"
              align="left"
              key="index"
              prop="index"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="开始时间"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.startTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="结束时间"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.endTime }}
              </template>
            </el-table-column>
            <el-table-column
              label="文件名"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.fileName }}
              </template>
            </el-table-column>
            <el-table-column
              label="播放"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-view"
                  @click="handlePlayBack(scope.row)"
                  >播放...</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </div>
      <!-- <el-dialog
          :modal="false"
          title="操作"
          :visible.sync="imgdialog"
          @close="closeModal"
          custom-class="imgdialog2"
          top="1rem"
          width="10rem"
          v-if="imgdialog"
        >
          <div
            v-loading="loading"
            :id="myNewId"
            class="plugin"
            style="width: 600px; height: 400px"
          ></div>
          <el-col>
            <el-button type="primary" size="mini" @click="clickStopPlayback"
              >停止回放</el-button
            >
            <el-button type="primary" size="mini" @click="clickReversePlayback"
              >倒放</el-button
            >
            <el-button type="primary" size="mini" @click="clickPause"
              >暂停</el-button
            >
            <el-button type="primary" size="mini" @click="clickResume"
              >继续</el-button
            >
            <el-button type="primary" size="mini" @click="clickPlayFast"
              >加速</el-button
            >
            <el-button type="primary" size="mini" @click="clickPlaySlow"
              >减速</el-button
            >
            <el-button type="primary" size="mini" @click="clickFullScreen"
              >全屏</el-button
            >
          </el-col>
        </el-dialog> -->
    </div>
  </template>
  
  <script>
  export default {
    name: "hkVideo",
    inheritAttrs: false,
    props: {
      propsData: {
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
        default: "divABC02",
      },
    },
    watch: {
      // newId: {
      //   deep: true,
      //   immediate: true,
      //   handler(newVal, oldVal) {
      //     if (newVal) {
      //       this.myNewId = newVal;
      //     }
      //   },
      // },
      // propsData: {
      //   deep: true,
      //   immediate: true,
      //   handler(newVal, oldVal) {
      //     if (newVal) {
      //       this.ip = newVal.ip; //新的IP
      //       this.userName = newVal.userName; //访问nvr的用户名
      //       this.passWord = newVal.passWord; //访问密码
      //       if (newVal.rtspPort) this.rtspPort = newVal.rtspPort;
      //       else this.rtspPort = 554; //默认的端口
      //       if (newVal.transStream) this.transStream = true;
      //       else this.transStream = false;
      //       if (newVal.port) this.port = newVal.port; //访问端口
      //       else this.port = 80; //80端口
      //       this.iChannelID = !newVal.channelID ? 1 : newVal.channelID; //通道ID
      //       this.loadingTime = newVal.loadingTime;
      //       if (newVal.title) this.title = newVal.title; //标题
      //       else this.title = "camera 01";
      //       if (newVal.streamType) this.streamType = newVal.streamType;
      //       else this.streamType = 1;
      //       if (newVal.videoWidth) this.videoWidth = newVal.videoWidth; //视频宽度
      //       if (newVal.videoHeight) this.videoHeight = newVal.videoHeight;
      //       this.title = newVal.title; //标题
      //       var t = this.loadingTime / 1000;
      //     //   setTimeout(() => {
      //     //     this.initS(); //重新执行初始化
      //     //   }, t);
      //     //   console.log("1111111", this.ip);
      //     }
      //     //else{
      //     //  this.initS();
      //     //}
      //   },
      // },
    },
    data() {
      return {
        tableloading: false,
        mode: this.mode_info,
        imgdialog: false,
        myNewId: "divABC02",
        visible: true, //是否隐藏
        showSearch: true, //是否显示搜索
        advanceMode: true, //是否是高级模式
        queryParams: {}, //查询参数，用来检索视频文件
        ip: "200.150.100.252", //当前的IP地址
        transStream: true, //转码标志
        rtspPort: 554, //rtsp的端口
        userName: "admin", //默认用户admin
        passWord: "ZG20241019", //密码
        port: 80, //录像机的默认端口是80
        iChannelID: 1, //通道id
        windowCount: 1, //1X1
        loadingTime: 2000, //加载时间
        timeOut: 2000, //加载的超时时间
        videoWidth: 500, //视频宽度
        videoHeight: 300, //视频高度
        fullSize: false, //是否自适应控件的大小
        title: "camera01", //视频监控的标题
        startTime: "", //回放的开始时间
        endTime: "", //回放的结束时间
        g_iWndIndex: 0, //选中的窗口k
        timeRange: [], //控件对应的时间
        streamType: 1, //1主码流, 子码流
        bZeroChannel: false, //是否零通道
        streamTypeList: [
          { id: 1, label: "主码流" },
          { id: 2, label: "子码流" },
          { id: 3, label: "第三码流" },
          { id: 4, label: "转码码流" },
        ],
        startTime: "",
        endTime: "",
        g_iSearchTimes: 0, //搜索位置
        currentRow : {}, //当前行
        searchList: [], //搜索到的视频列表
        currentRow: {}, //当前行的信息
        plugInInitialized: false, //差价是否成功初始化
        loading: true,
      };
    },
    mounted() {
      console.log("插件下载地址：webSDKPlugin/HCWebSDKPlugin.exe");
      this.timeRange = [this.getStartDate(), this.getEndDate()];
      this.getTimeRange();
      this.initS();
      // this.clickLogin();
    },
    methods: {
      closeModal() {
        this.imgdialog = false;
        this.breakDom();
      },
      handleSelectionChange(row) {
        this.currentRow = row;
        console.log("currentRow", this.currentRow);
      },
      // 点击表格播放按钮
      handlePlayBack(row) {
        // 调出弹框显示当前video
        this.imgdialog = true;
        this.currentRow = row;
        //播放对应的行
        var szDeviceIdentify = this.ip + "_" + this.port;
        var playbackURI = row.playbackURI; //得到播放的uri
        var iWndIndex = 0;
        if (this.g_iWndIndex) iWndIndex = this.g_iWndIndex;
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(iWndIndex),
          iRtspPort = this.rtspPort, //回放端口
          iStreamType = !this.streamType ? 1 : this.streamType,
          bZeroChannel = this.bZeroChannel;
        var szInfo = "",
          bChecked = this.transStream, //转码标志
          iRet = -1;
        //console.log('start play back...');
        var szStartTime = row.startTime0;
        var szEndTime = row.endTime0;
  
        if (bZeroChannel) {
          // 零通道不支持回放
          console.warn("zero channel, can not play back.");
          return;
        }
        //根据回放链接进行回放
        var that = this;
        var startPlay = function () {
          var options = {
            iWndIndex: iWndIndex,
            szUrl: playbackURI,
            szStartTime: szStartTime,
            szEndTime: szEndTime,
            iPort: iRtspPort,
            success: function () {
              szInfo = "开始回放成功！";
              console.log(szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "开始回放失败！";
              console.log(
                szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          };
          console.log("playback with url options:", options);
          WebVideoCtrl.I_StartPlay(szDeviceIdentify, options);
        };
  
        if (oWndInfo != null) {
          // 已经在播放了，先停止
          WebVideoCtrl.I_Stop({
            success: function () {
              console.log("start play back with url...");
              startPlay();
            },
          });
        } else {
          console.log("start play back with url...");
          startPlay();
        }
        //this.initS();
      },
      getTimeRange() {
        if (this.timeRange.length) {
          this.queryParams.startTime = this.timeRange[0];
          this.queryParams.endTime = this.timeRange[1];
        } else {
          this.queryParams.startTime = this.getStartDate();
          this.queryParams.endTime = this.getEndDate();
        }
      },
      loadXML(szXml) {
        if (null == szXml || "" == szXml) {
          return null;
        }
  
        var oXmlDoc = null;
  
        if (window.DOMParser) {
          var oParser = new DOMParser();
          oXmlDoc = oParser.parseFromString(szXml, "text/xml");
        } else {
          oXmlDoc = new ActiveXObject("Microsoft.XMLDOM");
          oXmlDoc.async = false;
          oXmlDoc.loadXML(szXml);
        }
  
        return oXmlDoc;
      },
      toXMLStr(oXmlDoc) {
        var szXmlDoc = "";
  
        try {
          var oSerializer = new XMLSerializer();
          szXmlDoc = oSerializer.serializeToString(oXmlDoc);
        } catch (e) {
          try {
            szXmlDoc = oXmlDoc.xml;
          } catch (e) {
            return "";
          }
        }
        if (szXmlDoc.indexOf("<?xml") == -1) {
          szXmlDoc = "<?xml version='1.0' encoding='utf-8'?>" + szXmlDoc;
        }
        return szXmlDoc;
      },
      encodeString(str) {
        if (str) {
          return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        } else {
          return "";
        }
      },
      handleXXX() {
        var szDeviceIdentify = this.ip;
        this.$emit("desPlug", szDeviceIdentify);
      },
      async initS() {
        let that = this;
        console.log("回放组件！", this);
        this.loading = true;
        //   if (!that.newId) {
        //     console.warn("hk video id empty, can not create hk video plugin.");
        //     return;
        //   }
        //   if (!that.ip || !that.port) {
        //     console.warn("hk video ip/port empty, can not init plugin.");
        //     return;
        //   }
        if (!this.plugInInitialized) {
          console.log("初始化");
          // 初始化
          await WebVideoCtrl.I_InitPlugin({
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
              console.log(that.newId);
              WebVideoCtrl.I_InsertOBJECTPlugin(that.newId).then(
                () => {
                  console.log("init ok.");
                  // 检查插件是否最新
                  WebVideoCtrl.I_CheckPluginVersion().then((bFlag) => {
                    if (bFlag) {
                      let str =
                        "检测到新的插件版本，双击开发包目录里的HCWebSDKPlugin.exe升级！";
                      that.$message.error(str);
                      console.log(str);
                    }
                  });
                },
                (err) => {
                  console.log("err", err);
                  let str1 =
                    "插件初始化失败，请确认是否已安装插件；如果未安装，请双击开发包目录里的HCWebSDKPlugin.exe安装！";
                  that.$message.error(str1);
                  console.log(str1);
                }
              );
              this.loading = false;
            },
          });
        }
        setTimeout(() => {
          // let cw = Math.round(document.body.clientWidth / 1920);
          // let ch = Math.round(document.body.clientHeight / 1080);
          // let width = parseInt(this.videoWidth * cw, 10);
          // let height = parseInt(this.videoHeight * ch, 10);
          // if (height <= 200) {
          //   height = 200;
          // }
          // if (height <= 200) {
          //   height = 200;
          // }
          // //let w1 = (window.innerWidth - document.getElementById(this.newId).offsetLeft) - 1500;
          // //let w2 = document.getElementById(this.newId).clientHeight;
          // console.log("00000===>", width, height);
          // // 对窗口大小重新规划
          // WebVideoCtrl.I_Resize(width, height);
          this.setVideoWindowResize(this.newId, "500", "300");
          this.clickLogin();
        }, 500);
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
        let hasLogin = false;
        var szDeviceIdentify = this.ip + "_" + this.port;
        const iRet = WebVideoCtrl.I_Login(
          this.ip,
          this.windowCount,
          this.port,
          this.userName,
          this.passWord,
          {
            timeout: this.timeOut,
            success: function (xmlDoc) {
              console.log(szDeviceIdentify + " 已登录！");
              setTimeout(function () {
                setTimeout(function () {
                  that.getChannelInfo();
                }, 1000);
                that.getDevicePort();
              }, 10);
            },
            error: function (err) {
              console.log("登录-err===>", err);
              if (err.errorCode == 2001) {
                hasLogin = true;
                console.log(szDeviceIdentify + " 已登录过！");
              }
            },
          }
        );
  
        if (iRet === -1) {
          console.log(szDeviceIdentify + " 已登录过！");        
        }
      },
  
      // 获取端口
      getDevicePort() {
        if (null == this.ip) {
          return;
        }
        WebVideoCtrl.I_GetDevicePort(this.ip).then((oPort) => {
          console.log("152获取端口", oPort);
        });
      },
      // 获取通道
      async getChannelInfo() {
        let that = this;
        var szDeviceIdentify = this.ip + "_" + this.port;
        if (null == szDeviceIdentify) {
          return;
        }
        console.log("szDeviceIdentify==============>", szDeviceIdentify);
        // 模拟通道
        WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
          success: function (xmlDoc) {
            that.autoStartPlayback();
            console.log(xmlDoc);
          },
          error: function (oError) {
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
            console.log(xmlDoc);
            that.autoStartPlayback();
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
      // 开始预览
      clickStartRealPlay(iStreamType) {
        let that = this;
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
        var startRealPlay = function () {
          WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
            iStreamType: that.streamType,
            iChannelID: that.iChannelID,
            bZeroChannel: that.bZeroChannel,
            success: function () {
              WebVideoCtrl.I_Logout(szDeviceIdentify);
              console.log("开始预览成功！");
            },
            error: function (oError) {
              that.$message.error(szDeviceIdentify + "开始预览失败！");
              console.log(szDeviceIdentify + "开始预览失败！");
              console.log("oError", oError);
            },
          });
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
  
      // 抓图
      async clickCapturePic(iChannelID) {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          var oLocalConfig = await WebVideoCtrl.I_GetLocalCfg();
          var szCaptureFileFormat = "0";
          if (oLocalConfig) {
            szCaptureFileFormat = oLocalConfig.captureFileFormat;
          }
  
          var szChannelID = iChannelID;
          var szPicName =
            oWndInfo.szDeviceIdentify +
            "_" +
            szChannelID +
            "_" +
            new Date().getTime();
          //如果是回放抓图，需要增加如下前缀："playback_"
          if ("playback" === mode) {
            szPicName =
              "playback_" +
              oWndInfo.szDeviceIdentify +
              "_" +
              szChannelID +
              "_" +
              new Date().getTime();
          }
  
          szPicName += "0" === szCaptureFileFormat ? ".jpg" : ".bmp";
  
          WebVideoCtrl.I_CapturePic(szPicName, {
            bDateDir: true, //是否生成日期文件
          }).then(
            function () {
              szInfo = "抓图成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            function (oError) {
              szInfo = " 抓图失败！";
              console.log(
                oWndInfo.szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            }
          );
        }
      },
      // 抓图
      clickCapturePicData() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
        if (oWndInfo != null) {
          WebVideoCtrl.I_CapturePicData()
            .then(function (data) {
              console.log(data);
              szInfo = "抓图上传成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            })
            .catch(() => {
              szInfo = "抓图失败！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            });
        }
      },
    
      // 搜索
      clickRecordSearch(iType) {
        if (this.queryParams.startTime)
          this.startTime = this.queryParams.startTime
        else this.startTime = this.getStartDate();
        if (this.queryParams.endTime)
          // this.endTime = this.getDateString(this.queryParams.endTime);
          this.endTime = this.queryParams.endTime
        else this.endTime = this.getEndDate();
        var that = this;
        console.log("starttime", this.startTime);
        console.log("endTime", this.endTime);
        var szDeviceIdentify = this.ip + "_" + this.port,
          iChannelID = this.iChannelID,
          iStreamType = !this.streamType ? 1 : this.streamType, //码流类型
          szStartTime = this.startTime,
          szEndTime = this.endTime;
        if (
          Date.parse(szEndTime.replace(/-/g, "/")) -
            Date.parse(szStartTime.replace(/-/g, "/")) <
          0
        ) {
          ("开始时间大于结束时间");
          return;
        }
        if (null == szDeviceIdentify) {
          return;
        }
  
        if (this.bZeroChannel) {
          // 零通道不支持录像搜索
          return;
        }
        if(!iType){
           that.g_iSearchTimes = 0;
           that.searchList = [];
           that.currentRow = {}; //当前行为空 
        }
        console.log('g_iSearchTimes', that.g_iSearchTimes)
        console.log('recordcount', that.searchList.length)
        that.loading = true;
        //console.log("搜索参数", iChannelID, szStartTime, szEndTime);
        that.tableloading = true;
        //如果是前端设备，需要将搜索时间转换为UTC时间
        WebVideoCtrl.I_RecordSearch(
          szDeviceIdentify,
          iChannelID,
          szStartTime,
          szEndTime,
          {
            iStreamType: iStreamType,
            iSearchPos: that.g_iSearchTimes,
            success: function (xmlDoc) {
              console.log("xmlDoc", xmlDoc);
              console.log("responseStatusStrg", $(xmlDoc).find("responseStatusStrg"));
              if ("MORE" === $(xmlDoc).find("responseStatusStrg").eq(0).text()) {
                
                for (
                  var i = 0, nLen = $(xmlDoc).find("searchMatchItem").length;
                  i < nLen;
                  i++
                ) {
                  var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                  var myStartTime = $(xmlDoc).find("startTime").eq(i).text();
                  var myEndTime = $(xmlDoc).find("endTime").eq(i).text();
                  var myFileName = szPlaybackURI.substring(
                    szPlaybackURI.indexOf("name=") + 5,
                    szPlaybackURI.indexOf("&size=")
                  );
                  
                  //添加搜索结果
                  var searchItem = {
                    index: that.g_iSearchTimes + 1,
                    startTime0 : myStartTime,
                    endTime0 : myEndTime,
                    startTime: myStartTime.replace("T", " ").replace("Z", ""),
                    endTime: myEndTime.replace("T", " ").replace("Z", ""),
                    fileName: myFileName,
                    playbackURI: szPlaybackURI,
                  };
                  that.searchList.push(searchItem);
                  that.g_iSearchTimes++;
                }
                that.clickRecordSearch(1); // 继续搜索
              } else if (
                "OK" === $(xmlDoc).find("responseStatusStrg").eq(0).text()
              ) {
                var iLength = $(xmlDoc).find("searchMatchItem").length;
                console.log("iLength", iLength);
                for (var i = 0; i < iLength; i++) {
                  var szPlaybackURI = $(xmlDoc).find("playbackURI").eq(i).text();
                  var myStartTime = $(xmlDoc).find("startTime").eq(i).text();
                  var myEndTime = $(xmlDoc).find("endTime").eq(i).text();
                  var myFileName = szPlaybackURI.substring(
                    szPlaybackURI.indexOf("name=") + 5,
                    szPlaybackURI.indexOf("&size=")
                  );
                  //添加搜索结果
                  var searchItem = {
                    index: that.g_iSearchTimes + 1,
                    startTime: myStartTime.replace("T", " ").replace("Z", ""),
                    endTime: myEndTime.replace("T", " ").replace("Z", ""),
                    startTime0 : myStartTime,
                    endTime0 : myEndTime,                  
                    fileName: myFileName,
                    playbackURI: szPlaybackURI,
                  };
                  that.searchList.push(searchItem);
                  that.g_iSearchTimes++;
                }
                //that.clickRecordSearch(1); // 继续搜索
                console.log(szDeviceIdentify + " 搜索录像文件成功！");
              } else if (
                "NO MATCHES" === $(xmlDoc).find("responseStatusStrg").eq(0).text()
              ) {
                //that.searchList = [];
                //that.g_iSearchTimes = 0;
                setTimeout(function () {
                  console.log(szDeviceIdentify + " 没有录像文件！");
                }, 50);
              }
              that.tableloading = false;
            },
            error: function (oError) {
              console.log(
                szDeviceIdentify + " 搜索录像文件失败！",
                oError.errorCode,
                oError.errorMsg
              );
              
              that.tableloading = false;
            },
          }
        );
      },
      getDateString(date) {
        const yesterday = new Date(date);
        //yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = ("0" + (yesterday.getMonth() + 1)).slice(-2);
        const day = ("0" + yesterday.getDate()).slice(-2);
        return `${year}-${month}-${day} 00:00:00`;
      },
      getStartDate() {
        const today = new Date();
        const yesterday = new Date(today);
        //yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = ("0" + (yesterday.getMonth() + 1)).slice(-2);
        const day = ("0" + yesterday.getDate()).slice(-2);
        return `${year}-${month}-${day} 00:00:00`;
      },
      getStartDateZ() {
        const today = new Date();
        const yesterday = new Date(today);
        //yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = ("0" + (yesterday.getMonth() + 1)).slice(-2);
        const day = ("0" + yesterday.getDate()).slice(-2);
        return `${year}${month}${day}T000000Z`;
      },
      getEndDate() {
        const today = new Date();
        const yesterday = new Date(today);
        //yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = ("0" + (yesterday.getMonth() + 1)).slice(-2);
        const day = ("0" + yesterday.getDate()).slice(-2);
        return `${year}-${month}-${day} 23:59:59`;
      },
      getEndDateZ() {
        const today = new Date();
        const yesterday = new Date(today);
        //yesterday.setDate(yesterday.getDate() - 1);
        const year = yesterday.getFullYear();
        const month = ("0" + (yesterday.getMonth() + 1)).slice(-2);
        const day = ("0" + yesterday.getDate()).slice(-2);
        return `${year}${month}${day}T235959Z`;
      },
      autoStartPlayback() {
        //开始回放
        var iWndIndex = 0;
        if (this.g_iWndIndex) iWndIndex = this.g_iWndIndex;
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(iWndIndex),
          szDeviceIdentify = this.ip + "_" + this.port,
          iRtspPort = this.rtspPort, //回放端口
          iStreamType = !this.streamType ? 1 : this.streamType,
          bZeroChannel = this.bZeroChannel;
        var szInfo = "",
          bChecked = this.transStream, //转码标志
          iRet = -1;
        //console.log('start play back...');
        var szStartTime, szEndTime;
        if (null == szDeviceIdentify) {
          return;
        }
  
        if (bZeroChannel) {
          // 零通道不支持回放
          console.warn("zero channel, can not play back.");
          return;
        }
  
        szStartTime = this.getStartDate();
        szEndTime = this.getEndDate();
  
        var that = this;
        var startPlayback = function () {
          if(that.transStream) {
            // that.transStream 启用转码回放
            var oTransCodeParam = {
              TransFrameRate: "14", // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
              TransResolution: "1", // 255：Auto，3：4CIF，2：QCIF，1：CIF
              TransBitrate: "19", // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
            };
            var options = {
              iWndIndex: iWndIndex,
              iStreamType: iStreamType,
              iChannelID: that.iChannelID,
              szStartTime: szStartTime,
              szEndTime: szEndTime,
              
              oTransCodeParam: oTransCodeParam,
              success: function () {
                szInfo = "开始回放成功！";
                console.log(szDeviceIdentify + " " + szInfo);
              },
              error: function (oError) {
                szInfo = "开始回放失败！";
                console.log(
                  szDeviceIdentify + szInfo,
                  oError.errorCode,
                  oError.errorMsg
                );
              },
            };
            console.log("playback options:", options);
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, options);
          } else {
            var options = {
              iWndIndex: iWndIndex,
              iStreamType: iStreamType,
              iChannelID: that.iChannelID,
              szStartTime: szStartTime,
              szEndTime: szEndTime,
              success: function () {
                szInfo = "开始回放成功！";
                console.log(szDeviceIdentify + " " + szInfo);
              },
              error: function (oError) {
                szInfo = "开始回放失败！";
                console.log(
                  szDeviceIdentify + szInfo,
                  oError.errorCode,
                  oError.errorMsg
                );
              },
            };
            console.log("playback options:", options);
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, options);
          }
        };
  
        if (oWndInfo != null) {
          // 已经在播放了，先停止
          WebVideoCtrl.I_Stop({
            success: function () {
              console.log("start play back...");
              startPlayback();
            },
          });
        } else {
          console.log("start play back...");
          startPlayback();
        }
      },
      clickStartPlayback(row) {
        //开始回放
        var iWndIndex = 0;
        if (this.g_iWndIndex) iWndIndex = this.g_iWndIndex;
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(iWndIndex),
          szDeviceIdentify = this.ip + "_" + this.port,
          iRtspPort = this.rtspPort, //回放端口
          iStreamType = !this.streamType ? 1 : this.streamType,
          bZeroChannel = this.bZeroChannel;
        var szInfo = "",
          bChecked = this.transStream, //转码标志
          iRet = -1;
        //console.log('start play back...');
        var szStartTime, szEndTime;
        if (null == szDeviceIdentify) {
          return;
        }
  
        if (bZeroChannel) {
          // 零通道不支持回放
          console.warn("zero channel, can not play back.");
          return;
        }
  
        szStartTime = row.startTime;
        szEndTime = row.endTime;
  
        var that = this;
        var startPlayback = function () {
          if(that.transStream) {
            // that.transStream 启用转码回放
            var oTransCodeParam = {
              TransFrameRate: "14", // 0：全帧率，5：1，6：2，7：4，8：6，9：8，10：10，11：12，12：16，14：15，15：18，13：20，16：22
              TransResolution: "1", // 255：Auto，3：4CIF，2：QCIF，1：CIF
              TransBitrate: "19", // 2：32K，3：48K，4：64K，5：80K，6：96K，7：128K，8：160K，9：192K，10：224K，11：256K，12：320K，13：384K，14：448K，15：512K，16：640K，17：768K，18：896K，19：1024K，20：1280K，21：1536K，22：1792K，23：2048K，24：3072K，25：4096K，26：8192K
            };
            var options = {
              iWndIndex: iWndIndex,
              iStreamType: iStreamType,
              iChannelID: that.iChannelID,
              szStartTime: szStartTime,
              szEndTime: szEndTime,          
              iStreamType : iStreamType,  
              oTransCodeParam: oTransCodeParam,
              success: function () {
                szInfo = "开始回放成功！";
                console.log(szDeviceIdentify + " " + szInfo);
              },
              error: function (oError) {
                szInfo = "开始回放失败！";
                console.log(
                  szDeviceIdentify + szInfo,
                  oError.errorCode,
                  oError.errorMsg
                );
              },
            };
            console.log("playback options:", options);
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, options);
          } else {
            var options = {
              iWndIndex: iWndIndex,
              iStreamType: iStreamType,
              iChannelID: that.iChannelID,
              szStartTime: szStartTime,
              szEndTime: szEndTime,
              success: function () {
                szInfo = "开始回放成功！";
                console.log(szDeviceIdentify + " " + szInfo);
              },
              error: function (oError) {
                szInfo = "开始回放失败！";
                console.log(
                  szDeviceIdentify + szInfo,
                  oError.errorCode,
                  oError.errorMsg
                );
              },
            };
            console.log("playback options:", options);
            WebVideoCtrl.I_StartPlayback(szDeviceIdentify, options);
          }
        };
  
        if (oWndInfo != null) {
          // 已经在播放了，先停止
          WebVideoCtrl.I_Stop({
            success: function () {
              console.log("start play back...");
              startPlayback();
            },
          });
        } else {
          console.log("start play back...");
          startPlayback();
        }
      },
      // 停止回放
      clickStopPlayback() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
        var that = this;
        if (oWndInfo != null) {
          WebVideoCtrl.I_Stop({
            success: function () {
              szInfo = "停止回放成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "停止回放失败！";
              console.log(
                szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
              if (oError.errorCode == 3001) {
                that.clickStopRealPlay();
              }
            },
          });
        }
      },
      // 开始倒放
      clickReversePlayback() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szDeviceIdentify = this.ip + "_" + this.port,
          iRtspPort = this.rtspPort,
          szStartTime = currentRow.startTime,
          szEndTime = currentRow.endTime,
          szInfo = "";
  
        if (null == szDeviceIdentify) {
          return;
        }
  
        if (this.bZeroChannel) {
          // 零通道不支持倒放
          return;
        }
        var that = this;
        var reversePlayback = function () {
          WebVideoCtrl.I_ReversePlayback(szDeviceIdentify, {
            iPort: iRtspPort,
            iStreamType: that.streamType,
            iChannelID: that.iChannelID,
            szStartTime: szStartTime,
            szEndTime: szEndTime,
          }).then(
            () => {
              szInfo = "开始倒放成功！";
              console.log(szDeviceIdentify + " " + szInfo);
            },
            (oError) => {
              szInfo = "开始倒放失败！";
              console.log(oError);
              console.log(
                szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            }
          );
        };
  
        if (oWndInfo != null) {
          // 已经在播放了，先停止
          WebVideoCtrl.I_Stop({
            success: function () {
              reversePlayback();
            },
          });
        } else {
          reversePlayback();
        }
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
      // 单帧
      clickFrame() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          WebVideoCtrl.I_Frame({
            success: function () {
              szInfo = "单帧播放成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "单帧播放失败！";
              console.log(
                szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          });
        }
      },
      //暂停
      clickPause() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          WebVideoCtrl.I_Pause({
            success: function () {
              szInfo = "暂停成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "暂停失败！";
              console.log(
                oWndInfo.szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          });
        }
      },
      // 恢复
      clickResume() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          WebVideoCtrl.I_Resume({
            success: function () {
              szInfo = "恢复成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "恢复失败！";
              console.log(
                oWndInfo.szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          });
        }
      },
      //慢放
      clickPlaySlow() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          WebVideoCtrl.I_PlaySlow({
            success: function () {
              szInfo = "慢放成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "慢放失败！";
              console.log(
                oWndInfo.szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          });
        }
      },
      //快放
      clickPlayFast() {
        var oWndInfo = WebVideoCtrl.I_GetWindowStatus(this.g_iWndIndex),
          szInfo = "";
  
        if (oWndInfo != null) {
          WebVideoCtrl.I_PlayFast({
            success: function () {
              szInfo = "快放成功！";
              console.log(oWndInfo.szDeviceIdentify + " " + szInfo);
            },
            error: function (oError) {
              szInfo = "快放失败！";
              console.log(
                oWndInfo.szDeviceIdentify + szInfo,
                oError.errorCode,
                oError.errorMsg
              );
            },
          });
        }
      },
      closeVideo() {
        console.log("plugInInitialized", this.plugInInitialized);
  
        if (this.plugInInitialized) {
          WebVideoCtrl.I_DestroyPlugin(this.ip); // 如果销毁的只是最后一个视频，前面视频没有销毁
          WebVideoCtrl.I_StopAllPlay(); //停止全部播放
          var szDeviceIdentify = this.ip + "_" + this.port;
          WebVideoCtrl.I_Logout(szDeviceIdentify); //退出
          this.plugInInitialized = false;
          //window.location.reload();//销毁失败强制重载
        }
      },
      // fitVideo() {
      //   let cw = Math.round(document.body.clientWidth / 1920);
      //   let ch = Math.round(document.body.clientHeight / 1080);
      //   let width = parseInt(this.videoWidth * cw, 10);
      //   let height = parseInt(this.videoHeight * ch, 10);
      //   if (width <= 200) {
      //     height = 200;
      //   }
      //   if (height <= 200) {
      //     height = 200;
      //   }
      //   let w1 =
      //     window.innerWidth -
      //     document.getElementById(that.newId).offsetLeft -
      //     1500;
      //   let w2 = document.getElementById(that.newId).clientHeight;
      //   console.log("00000===>", width, height);
      //   // 对窗口大小重新规划
      //   WebVideoCtrl.I_Resize(width, height);
      //   this.setVideoWindowResize(that.newId, width, height);
      // },
      showVideo(flag) {
        this.visible = flag; //设置视频隐藏标志
      },
      loginOut() {
        WebVideoCtrl.I_Logout(this.ip + "_" + this.port);
      },
      stopAllPlay() {
        WebVideoCtrl.I_StopAllPlay();
      },
      breakDom() {
        // console.log('aaaaa',this.plugInInitialized)
        // if (this.plugInInitialized) {
        WebVideoCtrl.I_DestroyPlugin();
        this.plugInInitialized = false;
        // }
      },
      viewReload() {
        window.location.reload();
      },
    },
    beforeDestroy() {
      console.log("回放before destroy...");
      this.closeVideo();
      // console.log('vvvvvvvvvv',document.querySelector('#divABC01'))
      // console.log('vvvvvvvvvv',document.querySelector('#divABC02'))
      // console.log('vvvvvvvvvv',  WebVideoCtrl.I_DestroyPlugin())
      // console.log('vvvvvvvvvv',  WebVideoCtrl.I_GetDevicePort)
  
      // this.loginOut();
      // this.stopAllPlay();
      setTimeout(() => {
        // this.breakDom();
      }, 100);
      //window.removeEventListener(this.viewReload);
    },
    destroyed() {
      // setTimeout(() => {
      // console.log(document.querySelector('#divABC02'))
      //   this.breakDom();
      // }, 100);
    },
  };
  </script>
  
  <style></style>
  