<template>
    <div
      style="
        padding-top: 0px;
        color: white;
        overflow-y: auto;
        overflow-x: hidden;
        height: calc(100% - 0px);
        background-color: black;
        padding-bottom: 1rem;
      "
    >
      <el-row
        type="flex"
        class=""
        style="padding: 0px; height: 100%; color: #6cc9d3; margin: 0px 0"
      >
        <el-col :span="15" class="title highlight">
          <h1>2#转炉参数</h1>
          <watchlist :deviceId="deviceId" :widthval="[15, 3]"></watchlist>
        </el-col>
        <el-col :span="9" style="position: relative">
          <img
            src="../../assets/images/rotatebottle.jpg"
            alt="High Bottle Image"
            class="highbottle-image"
          />
        </el-col>
      </el-row>
      <div class="echarts-foot"></div>
    </div>
  </template>
  
  <script>
  import watchlist from "./watchlist.vue";
  
  export default {
    components: { watchlist },
    data() {
      return {
        deviceId: 4, //设备类型为高炉
      };
    },
    mounted() {},
    watch: {
      $route: (val) => {
            console.log(val);
        let that=this
        if (val.name == "2#转炉") {
          that.deviceId = 4;
        }
      },
    },
  };
  </script>
  
  <style lang="less" scoped>
  .highlight-corner {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .highlight-corner::before,
  .highlight-corner::after {
    content: "";
    position: absolute;
    width: 20px; /* 根据需要调整宽度 */
    height: 20px; /* 根据需要调整高度 */
    background-color: #6cc9d3; /* 高亮颜色 */
  }
  
  .highlight-corner::before {
    top: -10px; /* 向上偏移一半的高度 */
    left: -10px; /* 向左偏移一半的宽度 */
  }
  
  .highlight-corner::after {
    bottom: -10px; /* 向下偏移一半的高度 */
    right: -10px; /* 向右偏移一半的宽度 */
  }
  
  .highbottle-image {
    width: calc(100% - 0px);
    position: absolute;
    top: 60%;
    left: 28%;
    transform: translate(-50%, -50%);
    // height: calc(100% - 0px);
    // margin-left: -2.5rem;
  }
  .title {
    font-size: 14px;
    background-color: black;
    padding: 20px;
  }
  .title h1 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  </style>
  