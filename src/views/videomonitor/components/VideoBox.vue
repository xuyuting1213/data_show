<template>
  <div>
    <hkVideo
      v-if="protocol == 'hkvideo'"
      ref="video1"
      :data="hkData"
      :newId="divId"
      :visible="videoVisible"
      :loading_time="loading_time"
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
  name: "VideoBox",
  props: {
    data: {
      //视频数据是一个结构体
      type: Object || Array,
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
      divId: "divABC",
      //需要传递的海康的视频,摄像头信息
      protocol: "hkvideo", //通讯协议类型
      hkData: {}, //海康数据的数据
      rtspData: {}, //rtsp数据,
      videoVisible: true,
      loading_time: "",
    };
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        //设置视频盒子的数据
        // console.log("VideoBox:", newVal);
        if (newVal) {
          this.protocol = newVal.protocol; //设置通讯协议
            this.loading_time = newVal.loadingtime; //设置通讯协议
        //   console.log('ooooop÷ooo', this.loading_time );
          if (newVal.hkData) this.hkData = newVal.hkData;
          else this.hkData = undefined;
          if (newVal.rtspData) this.rtspData = newVal.rtspData;
          else this.rtspData = undefined;
        }
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
    //this.hkData = JSON.parse(JSON.stringify(this.hkData_info));
    // this.makeHkData(this.hkData_info);
  },
  created() {},
  destroyed() {
    this.closeVideo();
  },
  methods: {
    //关闭视频
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
      that.videoVisible = flag;
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
