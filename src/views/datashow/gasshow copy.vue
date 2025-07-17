<template>
  <div style="padding-top: 20px" class="base_list highlight">
    <el-select
      v-model="value"
      filterable
      placeholder="请选择"
      style="margin: 0 0.25rem 0.1rem"
      class="areaselect"
      @change="changedata"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-row style="height: calc(100% - 0.8rem)">
      <el-col
        :span="3"
        class="warninginfo"
        v-for="(item, index) in paginatedArray"
        :key="item.id"
      >
        <el-popconfirm
          class="confrimwarning"
          v-if="item.statuscode == '1'"
          placement="top-start"
          title="处理工单？"
          @confirm="confirm"
          @cancel="cancel"
        >
          <div slot="reference">
            <div style="text-align: center; margin-bottom: 5px">
              {{ item.title }}
            </div>
            <div style="display: flex; justify-content: space-between">
              <div>
                <div>一氧化碳： {{ item.num }}</div>
                <div>
                  状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：
                  <span
                    :style="{
                      color: item.statuscode == '0' ? '#0af20a' : 'yellow',
                    }"
                  >
                    {{ item.statuscode == "0" ? "正常" : "报警" }}
                  </span>
                </div>
              </div>
              <div>
                <img
                  :src="getImageUrl(item)"
                  width="30px"
                  :class="{ 'warning-animation': item.statuscode === '1' }"
                />
              </div>
            </div>
          </div>
        </el-popconfirm>
        <div v-else>
          <div style="text-align: center; margin-bottom: 5px">
            {{ item.title }}
          </div>
          <div style="display: flex; justify-content: space-between">
            <div>
              <div>一氧化碳： {{ item.num }}</div>
              <div>
                状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：
                <span
                  :style="{
                    color: item.statuscode == '0' ? '#0af20a' : 'yellow',
                  }"
                >
                  {{ item.statuscode == "0" ? "正常" : "报警" }}
                </span>
              </div>
            </div>
            <div>
              <img
                :src="getImageUrl(item)"
                width="30px"
                :class="{ 'warning-animation': item.statuscode === '1' }"
              />
            </div>
          </div>
        </div>
      </el-col>
      <!-- <el-col> -->
      <!-- class="el-pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, sizes"
      :page-sizes="pageSizes"
      ref="pangination_n" -->
      <el-pagination
        class="e-pagin-gas"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        layout="total, prev, pager, next, sizes"
      ></el-pagination>
      <!-- </el-col> -->
    </el-row>
    <div class="echarts-foot"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 25,
      array: this.generateData(),
      options: [
        {
          value: "炼铁厂",
          label: "炼铁厂",
        },
        {
          value: "炼钢厂",
          label: "炼钢厂",
        },
        {
          value: "石灰厂",
          label: "石灰厂",
        },
        {
          value: "渣厂",
          label: "渣厂",
        },
        {
          value: "动力厂",
          label: "动力厂",
        },
        {
          value: "烧结厂",
          label: "烧结厂",
        },
        {
          value: "发电厂",
          label: "发电厂",
        },
        {
          value: "轧钢厂",
          label: "轧钢厂",
        },
        {
          value: "球团厂",
          label: "球团厂",
        },
        {
          value: "轧钢厂",
          label: "轧钢厂",
        },
      ],
      value: "炼铁厂",
      loading: false,
    };
  },
  computed: {
    totalItems() {
      return this.array.length;
    },
    paginatedArray() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.array.slice(start, start + this.pageSize);
    },
  },
  methods: {
    confirm() {},
    cancel() {},
    changedata() {
      let loadingInstance = this.$loading({
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 0)",
        color: "white",
        customClass: "loadingclass",
      });
      // 模拟异步操作
      setTimeout(() => {
        loadingInstance.close();
      }, 2000);
    },
    generateData() {
      const data = [];
      for (let i = 0; i < 40; i++) {
        data.push({
          title: "煤气" + (i + 1),
          statuscode: i === 2 ? "1" : "0",
          num: i + 20,
          id: i,
        });
      }
      return data;
    },
    getImageUrl(item) {
      return item.statuscode == "0"
        ? require("../../assets/images/greenlight.png")
        : require("../../assets/images/orangelight.png");
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>

<style lang="less"></style>
