<template>

    <div class="base_list highlight"
        style="padding: 20px;overflow-y: hidden;margin-top:0.25rem;height: calc(100% - 0.9rem);">
        <div>
            <el-date-picker style="margin-left: 3px; width: 7rem" value-format="yyyy-MM-dd HH:mm:ss" v-model="timeRange"
                type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                :append-to-body="false" />
            <el-button type="primary" icon="el-icon-search" @click="getvideoTimeRange()">搜索</el-button>
        </div>
        <el-row class="videoListwarning" v-loading="loading">
            <el-col :span="4" v-for="(o, index) in alertList" :key="o.url + index" class="warninglist"
                @click.native="showWarninginfo(o)">
                <el-card :body-style="{ padding: '0px', }" shadow="hover">
                    <!-- <img :src="https://5b0988e595225.cdn.sohucs.com/images/20180206/e0cda08a97574f098f06dccfc51e7821.jpeg" -->
                    <img :src="o.url" style="height:2rem;min-Height:147px">
                    <div style="padding: 14px;color: white;">
                        <span> {{ o.cameraName }}</span></br>
                        <span> {{ o.alertType }}</span>
                        <div class="bottom clearfix">
                            <time class="time" style="color: grey;">{{ o.createdAt }}</time>
                            <!-- <el-button type="text" class="button">操作按钮</el-button> -->
                        </div>
                    </div>
                </el-card>
            </el-col>

        </el-row>
        <el-col>
            <el-pagination class="e-pagin-gas" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-size="pageSize" :total="totalItems" layout="total, prev, pager, next, jumper"></el-pagination>
        </el-col>
        <div style="width: 50%; text-align: center; position: fixed; bottom: 0.1rem">
            <Navbar></Navbar>
        </div>
        <div class="echarts-foot"></div>
        <el-dialog :modal="false" title="报警详情" :visible.sync="dialogshow" @close="closeChart" width="900px"
            v-if="dialogshow" custom-class="warndialogshow" :bodyStyle="{ 'padding-top': 0, 'min-height': '300px' }"
            top="0.6rem">

            <div style="width: 100%">
                <videowarnmodal :taskInfo="taskInfo"></videowarnmodal>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Navbar from "@/views/components/Navbar.vue";
import videowarnmodal from "./videowarnmodal.vue";
import api from "@/api/api";
export default {
  components: { Navbar, videowarnmodal },
  data() {
    return {
      timeRange: [], //控件对应的时间
      alertList: [],
      currentPage: 1,
      pageSize: 10,
      dialogshow: false,
      crkey: "",
      alldata: {},
      loading: true,
      taskInfo:{}
    };
  },
  methods: {
    closeChart() {},
    showWarninginfo(o) {
      console.log(o);
      this.taskInfo=o
      this.dialogshow = true;
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.getvideoTimeRange();
    },
    getvideoTimeRange() {
      // this.alertList = []
      this.loading = true;
      api
        .getvideologlist({
          crKey: this.crkey,
          keyword: "",
          alertType: "",
          startDate:
            this.timeRange && this.timeRange[0] ? this.timeRange[0] : "",
          endDate: this.timeRange && this.timeRange[1] ? this.timeRange[1] : "",
          page: this.currentPage,
          size: this.pageSize,
          id: "",
        })
        .then((res) => {
          if (res.data.data.alertList) {
            this.alldata = res.data.data;
            console.log(this.alldata);

            this.alertList = res.data.data.alertList;
            // console.log( this.alldata);
          }
          // console.log(res.data);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getKey() {
      api
        .getVideoKey({
          appId: "LXFRdqTOu5Sp",
          appSecret: "dc8z82UeUDy7unOlblqU2w",
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.data.accessKey) {
            this.crkey = res.data.data.accessKey;
            this.getvideoTimeRange();
          } else {
            this.$message.error("获取key失败！");
          }
        });
    },
  },
  mounted() {
    this.getKey();
    this.alertList = [];
  },
  computed: {
    totalItems() {
      return this.alldata.pageVO?this.alldata.pageVO.total:0;
    },
    paginatedArray() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.alertList.slice(start, start + this.pageSize);
    },
  },
};
</script>

<style></style>