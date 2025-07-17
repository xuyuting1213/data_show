<template>
  <el-row type="flex" justify="end">
    <el-col
      :span="2"
      v-for="item in show_filterinfo"
      :key="item.name"
      :style="{
        minWidth:
          item.name == '运行状态'
            ? '1.5rem'
            : item.name.indexOf('日期') >= 0
            ? '1.94rem'
            : '1.97rem',
      }"
    >
      <!-- <span>{{ item.name }}</span> -->
      <component
        :is="item.type"
        style="margin: 0 0.05rem; width: calc(100% - 0.1rem)"
        :selectvalue="item"
        @selectval="(data) => selectvalFunc(data, item.value)"
        :disabled="disabled"
      ></component>
    </el-col>
    <el-button
      type="primary"
      @click="searchFunc"
      icon="el-icon-search"
      class="plusicon"
      style="float: right"
      >查询</el-button
    >
  </el-row>
</template>

<script>
import Filterdate from "./filterdate.vue";
import Filterselect from "./filterselect.vue";

export default {
  props: ["filterinfo", "disabled"],
  data() {
    return {
      all_filterinfo: [
        { name: "所属分厂", type: "filterselect", value: "org" },
        { name: "所属车间", type: "filterselect", value: "workshop" },
        { name: "安装地点", type: "filterselect", value: "install_location" },
        { name: "设备名称", type: "filterselect", value: "device_name" },
        { name: "运行状态", type: "filterselect", value: "device_status" },
        { name: "检验日期", type: "filterdate", value: "check_date" },
        { name: "再检日期", type: "filterdate", value: "next_check_date" },
        // { name: "日期", type: "filterdate" },
      ],
      show_filterinfo: [],
      filterparams: {},
    };
  },
  components: { Filterselect, Filterdate },
  mounted() {
    this.show_filterinfo = this.all_filterinfo.filter(
      (item) => this.filterinfo.indexOf(item.name) >= 0
    );
  },
  methods: {
    searchFunc() {
      this.$emit("searchFunc");
    },
    isObjectEmpty(obj) {
      return Object.keys(obj).every(
        (key) => obj[key] == null || obj[key].length == 0
      );
    },
    selectvalFunc(selectval, name) {
      this.filterparams[name] = selectval;
      console.log(this.isObjectEmpty(this.filterparams));
      if (this.isObjectEmpty(this.filterparams)) {
        this.filterparams = {};
      }
    },
  },
};
</script>

<style></style>
