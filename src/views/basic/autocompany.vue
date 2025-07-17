<template>
  <div class="introdunction">
    <div class="deviceinfocontainer intor_list highlight">
      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        v-if="loading"
      />

      <BaseTable
        v-if="tabledata.columns.length && !loading"
        :column="tabledata.columns"
        :tabledata="tabledata.data"
        :operate="['edit', 'delete', 'add']"
        ref="basetable"
        @addinfo="addinfo"
        @deleterow="deleterow"
      ></BaseTable>

      <div class="echarts-foot"></div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import BaseTable from "./component/autocompanyTable.vue";
export default {
  components: { BaseTable },
  data() {
    return {
      tabledata: {
        columns: [],
        data: [],
      },
      loading: true,
      current_newinfo: {},
    };
  },
  methods: {
    // 添加高炉信息
    addinfo(info) {
      console.log(info);
      delete info.rowinfo["key"];
      this.current_newinfo = JSON.parse(JSON.stringify(info.rowinfo));

      if (info.operate == "添加") {
        this.addnewdata(info);
      } else if (info.operate == "编辑") {
        this.deleterow(info);
      }
    },
    //新添加一行
    addnewdata(info) {
      let writestr = Object.values(this.current_newinfo).slice(1).join(",");
      this.$refs.basetable.loadingbtn=true

      console.log("添加数据", writestr);
      api
        .writeAutocompanyInfo({ data: writestr })
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: info.operate + "成功",
              type: "success",
            });
          } else {
            this.$message({
              message: info.operate + "失败稍后重试！",
              type: "error",
            });
          }
          this.$refs.basetable.loadingbtn=false
          this.$refs.basetable.addRowDialogVisible = false;
          this.getdata();
        })
        .catch((err) => {
          this.$message({
            message: info.operate + "失败稍后重试！",
            type: "error",
          });
          this.$refs.basetable.loadingbtn;
        });
    },
    deleterow(info) {
      console.log("删除", info);
      // delete info['DATEDIFF(`NEXT_CHECK_DATE`,curdate())']
      // console.log(Object.values(info).slice(1));
      console.log(info.rowinfo.ID);
      let writestr = Object.values(info.rowinfo).slice(1).join(",");
      this.$refs.basetable.loadingbtn;

      api
        .deleteAutocompanyInfo({ id: info.rowinfo.ID })
        .then((res) => {
          console.log(res.data);
          if (info.operate == "编辑") {
            this.addnewdata(info);
          } else {
            if (res.data.code == 200) {
              this.$message({
                message: "删除成功",
                type: "success",
              });
            } else {
              this.$message({
                message: "删除失败稍后重试！",
                type: "error",
              });
            }
            this.$refs.basetable.loadingbtn;
            this.$refs.basetable.addRowDialogVisible = false;

            this.getdata();
          }
        })
        .catch((err) => {
          this.$message({
            message: "删除失败稍后重试！",
            type: "error",
          });
          this.$refs.basetable.loadingbtn;
        });
    },
    openAddRowDialog() {
      this.$refs.basetable.addRowDialogVisible = true;
      this.$nextTick(() => {
        this.$refs.basetable.formatRow();
        this.$refs.basetable.initialform();
      });
    },
    getdata() {
      this.tabledata = {
        columns: [],
        data: [],
      };
      this.loading = true;
      api.autocompanyInfo().then((res) => {
        console.log(res.data.data);
        if (res.data.data[0]) {
          this.tabledata.columns = Object.keys(res.data.data[0])
            .filter((item) => item != "key")
            .map((item, index) => {
              return {
                prop: item,
                label: item,
              };
            });
          this.tabledata.data = res.data.data;
          // console.log(this.tabledata)
        } else {
          this.$message({
            message: "查询列表为空",
            type: "success",
          });
        }
        this.loading = false;
      });
    },
  },
  mounted() {
    this.getdata();
  },
};
</script>

<style></style>
