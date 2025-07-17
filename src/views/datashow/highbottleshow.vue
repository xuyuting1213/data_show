<template>
  <div style="padding-top: 0px; color: white; height: 100%">
    <el-row
      type="flex"
      class="highlight-corner highlight"
      style="padding: 0px; height: 100%; color: #6cc9d3; margin: 0px 0.1rem"
    >
      <el-col :span="12" class="title highlight">
        <h1>高炉参数</h1>
        <watchlist :deviceType="deviceType" :widthval="[12, 4]"></watchlist>
      </el-col>
      <el-col :span="8">
        <img
          src="../../assets/images/highbottle.jpg"
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
      deviceType: "01", //设备类型为高炉
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
  width: calc(150% - 0px);
  height: calc(100% - 0px);
  margin-left: 0rem;
}
.block1 {
  width: 40px;
  height: 39px;
  border-top: 1px solid rgb(26, 190, 192);
  position: absolute;
  z-index: -1;
  left: 19px;
  border-radius: 1px;
  top: 19px;
  border-left: 1px solid rgb(26, 190, 192);
  // box-shadow: -5px -2px 10px #1abec094; /* 水平偏移-5px，垂直偏移-5px，模糊5px */
}
.block2 {
  width: 40px;
  height: 39px;
  border-top: 1px solid #1abec0;
  position: absolute;
  z-index: -1;
  right: 88px;
  border-radius: 1px;
  top: 18px;
  border-right: 1px solid #1abec0;
}
.block3 {
  width: 40px;
  height: 39px;
  border-bottom: 1px solid #1abec0;
  position: absolute;
  z-index: -1;
  left: 19px;
  border-radius: 1px;
  bottom: 18px;
  border-left: 1px solid #1abec0;
}
.block4 {
  width: 40px;
  height: 39px;
  border-bottom: 1px solid #1abec0;
  position: absolute;
  z-index: -1;
  right: 88px;
  border-radius: 1px;
  bottom: 18px;
  border-right: 1px solid #1abec0;
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
</style>
