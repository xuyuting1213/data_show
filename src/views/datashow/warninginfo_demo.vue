<template>
  <div style="height: 100%; padding-top: 20px">
    <el-row style="height: 100%">
      <el-col
        :span="3"
        class="warninginfo"
        v-for="item in paginatedArray"
        :key="item.id"
      >
        <div style="text-align: center; margin-bottom: 5px">
          {{ item.title }}
        </div>
        <div style="display: flex; justify-content: space-between">
          <div>
            <div>数值：{{ item.num }}</div>
            <div>
              状态：
              <span
                :style="{ color: item.statuscode == '0' ? '#0af20a' : 'red' }"
              >
                {{ item.statuscode == "0" ? "正常" : "超上限" }}
              </span>
            </div>
          </div>
          <div>
            <i
              class="iconfont icon-lights"
              :style="{ color: item.statuscode == '0' ? '#0af20a' : 'red' }"
            ></i>
          </div>
        </div>
      </el-col>
      <el-col>
        <el-pagination
          class="el-pagin"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="totalItems"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentPage: 1,
      pageSize: 24,
      array: this.generateData(),
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
    generateData() {
      const data = [];
      for (let i = 0; i < 40; i++) {
        data.push({
          title: i === 2 ? "氧气压力" : "冷却水进出水流差",
          statuscode: i === 2 ? "1" : "0",
          num: i + 20,
          id: i,
        });
      }
      return data;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
    },
  },
};
</script>

<style lang="less"></style>
