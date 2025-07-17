<template>
  <div style="padding-top: 0px; color: white; height: 100%">
    <el-row
      type="flex"
      class="highlight-corner highlight"
      style="padding: 0px; height: 100%; color: #6cc9d3; margin: 0px 0.1rem"
    >
      <el-col :span="12" class="title highlight">
        <h1>液氧储槽参数</h1>
        <watchlist :deviceType="deviceType" :widthval="[11, 5]"></watchlist>
      </el-col>
      <el-col
        :span="12"
        style="background: black; position: relative"
        class="back_device"
      >
        <img
          src="../../assets/images/O2.png"
          alt="High Bottle Image"
          class="highbottle-image"
        />
      </el-col>
      <div class="echarts-foot"></div>
    </el-row>
  </div>
</template>

<script>
import watchlist from "./watchlist.vue";

export default {
  components: { watchlist },
  data() {
    return {
      deviceType: "14", //设备类型为液氧
    };
  },
};
</script>

<style lang="less" scoped>
.highlight-corner {
  position: relative;
  overflow: hidden;
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
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  // height: 54%;
  width: 100%;
}
.title {
  font-size: 14px;
  background-color: black;
  padding: 20px;
}
.title h1 {
  font-size: 20px;
  margin-bottom: 20px;
}
.back_device {
  background: url("../../assets/images/O2.png");

  background-repeat: no-repeat;

  background-position: center center;

  background-size: cover;
}
</style>
