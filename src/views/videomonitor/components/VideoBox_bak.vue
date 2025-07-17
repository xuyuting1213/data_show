<template>
    <div>
      <hkVideo
        v-if="protocol == 'hkvideo'"
        ref="video1"
        :props-data="hkData"
        :newId="divId"
        :mode_info="hkData.mode"
      />
      <!-- <rtspVideo
        v-if="protocol == 'rtsp'"
        width="100%"
        class="video-img1"
        ref="video1"
        :props-data="rtspData"
        :newId="divId"
      /> -->
      <!-- <flvVideo :flv="flvList.camera1"></flvVideo> -->
    </div>
  </template>
  
  <script>
  import hkVideo from "./hkvideo.vue";
  //import rtspVideo from "./rtspVideo.vue";
  //import flvVideo from "flvideo.vue";
  export default {
    name: "videoBox",
    props: {
      hkData_info: {
        //视频数据是一个结构体
        type: Object || Array,
        require: true,
      },
      mode: {
        //模式
        type: String,
        require: true,
      },
      muted: {
        type: Boolean,
        require: false,
      },
      newId: {
        //id
        type: String,
        require: true,
      },
    },
    components: {
      hkVideo,
     // rtspVideo,
      //flvVideo
    },
    data() {
      return {
        myMode: "playback",
        protocol: "hkvideo", //通讯协议类型
        divId: "divABC",
        //需要传递的海康的视频,摄像头信息
        hkData: {
          // ip: "200.150.100.252",
          // userName: "admin",
          // passWord: "ZG20241019", //密码
          // rtspPort: 554,
          // transStream: false, //转码标志
          // port: 80, //访问端口
          // channelID: 1, //通道
          // loadingTime: "3000",
          // streamType: 1,
          // videoWidth: 300,
          // videoHeight: 100,
          // title: "camera 01",
        },
        rtspData: {
          rtsp: "rtsp://admin:ZG20241019@200.150.100.251:554/Streaming/Channels/101",
          spareId: "div111",
          isOn: false,
          webRtcUrl: "http://200.150.100.70:8000", //转码服务的url
        },
      };
    },
    watch: {
      // hkData_info: {
      //   deep: true,
      //   immediate: true,
      //   handler(newVal, oldVal) {
      //     console.log("VideoBox:propsData1111111", newVal);
  
      //     if (newVal) {
      //       console.log("VideoBox:propsData", newVal);
      //       if (newVal.url) {
      //         this.rtsp = this.makeRtspData(newVal);
      //       }
      //       this.hkData = this.makeHkData(newVal);
      //     }
      //   },
      // },
      mode: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          if (newVal) {
            console.log("VideoBox:mode", newVal);
          }
          this.myMode = newVal;
        },
      },
      newId: {
        deep: true,
        immediate: true,
        handler(newVal, oldVal) {
          this.divId = "divABC" + newVal; //设置新的id
        },
      },
    },
    mounted() {
      this.hkData = JSON.parse(JSON.stringify(this.hkData_info));
      // this.makeHkData(this.hkData_info);
    },
    created() {},
    destroyed() {
      this.closeVideo();
    },
    methods: {
      // video1
  
      
      // makeHkData(input) {
      //获得rtsp的数据信息
  
      //   let videoHeight = input.videoHeight;
      //   let videoWidth = input.videoWidth;
      //   if (!videoHeight || !videoWidth) {
      //     if (this.$refs.video1) {
      //       const element = this.$refs.video1.$el;
      //       if (!videoWidth) videoWidth = element.offsetWidth;
      //       if (!videoHeight) videoHeight = element.offsetHeight;
      //     }
      //   }
      //   return input;
      //   return {
      //     ip: "200.150.100.252",
      //     userName: "admin",
      //     passWord: "ZG20241019", //密码
      //     rtspPort: 554,
      //     transStream: true, //转码标志
      //     port: 80, //访问端口
      //     channelID: 1, //通道
      //     loadingTime: "3000",
      //     streamType: 1,
      //     videoWidth: videoWidth,
      //     videoHeight: videoHeight,
      //     title: "camera 01",
      //   };
      // },
      // makeRtspData(input) {
      //   //获得海康nvr需要的数据信息
      //   let videoHeight = input.videoHeight;
      //   let videoWidth = input.videoWidth;
      //   if (!videoHeight || !videoWidth) {
      //     if (this.$refs.video1) {
      //       const element = this.$refs.video1.$el;
      //       if (!videoWidth) videoWidth = element.offsetWidth - 10;
      //       if (!videoHeight) videoHeight = element.offsetHeight - 10;
      //     }
      //   }
      //   return {
      //     rtsp: "rtsp://admin:ZG20241019@200.150.100.251:554/Streaming/Channels/101",
      //     spareId: "",
      //     videoWidth: videoWidth,
      //     videoHeight: videoHeight,
      //     isOn: false,
      //     webRtcUrl: "http://200.150.100.70:8000", //转码服务的url
      //   };
      // },
      closeVideo() {
        //关闭视频
        var that = this;
        that.$nextTick(() => {
          if (that.$refs) {
            console.log("refs:", that.$refs);
            if (that.$refs.video1) {
              that.$refs.video1.closeVideo();
            }
          }
        });
      },
      fitVideo() {
        //自适应调整视频的大小
        var that = this;
        this.$nextTick(() => {
          if (that.$refs) {
            console.log("refs:", that.$refs);
            if (that.$refs.video1) {
              that.$refs.video1.fitVideo(); //自适应调整视频大小
            }
          }
        });
      },
      showVideo(flag) {
        //自适应调整视频的大小
        var that = this;
        that.$nextTick(() => {
          if (that.$refs) {
            console.log("refs:", that.$refs);
            if (that.$refs.video1) {
              if (that.$refs.video1.showVideo) that.$refs.video1.showVideo(flag); //自适应调整视频大小
            }
          }
        });
      },
      closedSound() {
        this.$nextTick(() => {
          this.$refs.video1.volume = 0;
          this.$refs.video2.volume = 0;
        });
      },
    },
  };
  </script>
  
  <style lang="less"></style>
  