<template>
    <div id="video-container">
      <video
        class="video"
        ref="video"
        preload="auto"
        autoplay="autoplay"
        muted
        width="videoWidth"
        height="videoHeight"
      />
      <div
        class="mask"
        @click="handleClickVideo"
        :class="{ 'active-video-border': selectStatus }"
      ></div>
    </div>
  </template>
  
  <script>
  import WebRtcStreamer from "@/utils/webCtrlVideo";
  
  export default {
    name: "videoCom",
    props: {
      propsData: {
        type: Object || Array,
        require: true,
      },
    },
    data() {
      return {
        socket: null,
        result: null, // 返回值
        pic: null,
        rtsp: null, //访问的流地址
        spareId: null,
        isOn: false,
        webRtcServer: null,
        clickCount: 0, // 用来计数点击次数
        videoWidth: 300,
        videoHeight: 200,
      };
    },
    watch: {
      propsData: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            this.rtsp = newVal.rtsp; //设置rtsp的流地址
            this.spareId = newVal.spareId; //spareId
            this.isOn = newVal.isOn;
            if (newVal.videoWidth) this.videoWidth = newVal.videoWidth;
            if (newVal.videoHeight) this.videoHeight = newVal.videoHeight;
            if (this.webRtcServer) this.webRtcServer.disconnect();
            setTimeout(() => {
              this.initVideo(); //重新执行初始化
            }, 2000);
          } else {
            this.initVideo();
          }
        },
      },
    },
    destroyed() {
      if (this.webRtcServer) {
        this.webRtcServer.disconnect();
        this.webRtcServer = null;
      }
    },
    beforeCreate() {
      window.onbeforeunload = () => {
        if (this.webRtcServer) {
          this.webRtcServer.disconnect();
        }
      };
    },
    created() {},
    mounted() {
      this.initVideo();
    },
    methods: {
      initVideo() {
        try {
          console.log("rtspvideo", this);
          //连接后端的IP地址和端口
          this.webRtcServer = new WebRtcStreamer(
            this.$refs.video,
            "http://200.150.100.70:8000"
          );
          //向后端发送rtsp地址
          if (this.rtsp) this.webRtcServer.connect(this.rtsp);
        } catch (error) {
          console.log(error);
        }
      },
      /* 处理双击 单机 */
      dbClick() {
        this.clickCount++;
        if (this.clickCount === 2) {
          this.btnFull(); // 双击全屏
          this.clickCount = 0;
        }
        setTimeout(() => {
          if (this.clickCount === 1) {
            this.clickCount = 0;
          }
        }, 250);
      },
      /* 视频全屏 */
      btnFull() {
        const elVideo = this.$refs.video;
        if (elVideo.webkitRequestFullScreen) {
          elVideo.webkitRequestFullScreen();
        } else if (elVideo.mozRequestFullScreen) {
          elVideo.mozRequestFullScreen();
        } else if (elVideo.requestFullscreen) {
          elVideo.requestFullscreen();
        }
      },
      /* 
          ison用来判断是否需要更换视频流
          dbclick函数用来双击放大全屏方法
          */
      handleClickVideo() {
        if (this.isOn) {
          this.$emit("selectVideo", this.spareId);
          this.dbClick();
        } else {
          this.btnFull();
        }
      },
      closeVideo() {
        //关闭视频
        if (this.webRtcServer) {
          this.webRtcServer.disconnect();
          this.webRtcServer = null;
        }
      },
      fitVideo() {
        //自定义大小
      },
      showVideo(flag) {},
    },
  };
  </script>
  
  <style scoped lang="less">
  .active-video-border {
    border: 2px salmon solid;
  }
  
  #video-contianer {
    position: relative;
  
    // width: 100%;
    // height: 100%;
    .video {
      // width: 100%;
      // height: 100%;
      // object-fit: cover;
    }
  
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
  }
  </style>
  