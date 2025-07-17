<template>
  <div class="deviceinfocontainer intor_list highlight">
    <!-- <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        v-if="loading"
        id="loadgif"
      /> -->
    <BaseTable
      :column="tabledata.columns"
      :tabledata="tabledata.data"
      :operate="['', 'delete', 'add']"
      ref="basetable"
      @addinfo="addinfo"
      @deleterow="deleterow"
      @searchparams="searchparams"
      @reportInfo="reportInfo"
      @chooseReport="chooseReport"
      :tankType="tankType"
    ></BaseTable>

    <div class="echarts-foot"></div>
  </div>
</template>

<script>
import api from "@/api/api";
import BaseTable from "./table/moltentanlTable.vue";
import reportapi from "@/api/reportapi";

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
      filter_params: {},
      tankType: ["钢水罐", "铁水罐", "中间罐", "渣罐"],
    };
  },
  methods: {
    // 点击新增或者修改上报
    chooseReport(msg) {
      if (msg == "新增") {
        this.tabledata.data = this.tabledata.data.filter((item) => {
          return item.addFlag == "0";
        });
      }
      if (msg == "修改") {
        this.tabledata.data = this.tabledata.data.filter((item) => {
          return item.addFlag != "0";
        });
      }
      if (msg == "取消") {
        this.$refs.basetable.showsearch = false;
        this.getdata();
      }
      console.log(this.tabledata.data);
    },
    // 上报图片
    async reportfuncimginfo(selectval) {
      // console.log(selectval.checkevalue);

      let report_images = selectval.checkevalue.map(
        (item) => item["检验报告上传"]
      );
      // console.log(report_images);
      for (const item of report_images) {
        try {
          let res1 = await this.$reportimginfo(item, "4");
          if (res1.data&&res1.data.code != 2000)  {
            this.$message.error("检验报告上报失败");
          }
        } catch (error) {
          console.error(`上报失败: ${error.message}`);
        }
      }
    },
    // 点击确认更新
    reportInfo(selectval) {
      //   console.log(selectval);
      let ids = selectval.checkevalue.map((item) => item.ID);
      let params = {
        deviceType: "12", //设备类型编号
        saveOrUpdate: selectval.operate == "新增" ? 1 : 2, //新增更新标识
        ids: ids, //id数组
      };
      this.$refs.basetable.loading_report = true;

      if (ids.length) {
        this.loading = true;
        reportapi.reportDevice(params).then((res) => {
          console.log(res.data);
          if (res.data.code == 2000) {
            this.$message.success("上报成功！" + res.data.message);
          } else {
            this.$message.error("上报失败！" + res.data.message);
          }
          this.reportfuncimginfo(selectval);

          this.loading = false;
          this.$refs.basetable.loading_report = false;
        });
        console.log(params);
      }
    },
    searchparams(parmas) {
      console.log(parmas);
      //   每次筛选，记住当前筛选参数，用于编辑，新增，删除的加载表格数据
      this.filter_params = JSON.parse(JSON.stringify(parmas));
      this.getdata({ ...parmas });
    },
    // 添加高炉信息
    addinfo(info) {
      this.current_newinfo = JSON.parse(JSON.stringify(info.rowinfo));
      this.current_newinfo["运行状态"] =
        this.current_newinfo["运行状态"] == "在用"
          ? 1
          : this.current_newinfo["运行状态"] == "停用"
          ? 2
          : 3;
      //参数分为两个部分 assignValues函数返回数组，第一个对象为基础参数，第二，三个为页面特有参数,
      let base_pa = this.$assignValues(undefined, this.current_newinfo);
      delete base_pa[1].系统ID;
      delete base_pa[1].ID;
      delete base_pa[1].报废证明;
      delete base_pa[1].停用证明;
      delete base_pa[1].检验日期预报警状态;
      delete base_pa[1].systemId;
      delete base_pa[1].updateFlag;
      delete base_pa[1].addFlag;
      let speci_pa = this.$assignValues("金属熔融", base_pa[1]);
      //   console.log(base_pa, speci_pa);
      speci_pa[1]["检验日期"] = speci_pa[1]["检验日期"]
        ? speci_pa[1]["检验日期"] + " 00:00:00"
        : "";
      speci_pa[1]["再检日期"] = speci_pa[1]["再检日期"]
        ? speci_pa[1]["再检日期"] + " 00:00:00"
        : "";
        // console.log(base_pa[0]);
        // console.log(speci_pa[0]);
        // console.log(speci_pa[1]);
      this.editinfo(info, base_pa, speci_pa);
    },
    // 增加或编辑一条数据
    async editinfo(info, base_pa, speci_pa) {
      this.$refs.basetable.loadingbtn = true;
      let params = {},
        apifunc;
      base_pa[0]["设备类型"] = "熔融金属罐体";

      if (info.operate == "编辑") {
        params = {
          dimension_data: JSON.stringify(Object.values(base_pa[0])),
          data: JSON.stringify(Object.values(speci_pa[0])),
          regular_check_data: JSON.stringify(Object.values(speci_pa[1])),
          system_id: info.rowinfo.系统ID,
        };
        apifunc = api.updatemoltentaltank({ ...params });
      } else {
        let getid = await this.$getId();
        let getid2 = await this.$getId();
        console.log(base_pa[0]);
        console.log(base_pa[1]);
        base_pa[0]["getId"] = getid;
        speci_pa[1]["getId"] = getid2;
        params = {
          dimension_data: JSON.stringify(Object.values(base_pa[0])),
          data: JSON.stringify(Object.values(speci_pa[0])),
          regular_check_data: JSON.stringify(Object.values(speci_pa[1])),
          //   system_id: info.rowinfo.系统ID,
        };
        // console.log(params);
        apifunc = api.writemoltentaltank({ ...params });

        // params = {
        //   dimension_data: JSON.stringify(Object.values(base_pa[0])),
        //   data: JSON.stringify(Object.values(speci_pa[0])),
        //   regular_check_data: JSON.stringify(Object.values(speci_pa[1])),
        //   system_id: info.rowinfo.系统ID,
        // };
        // apifunc = api.writemoltentaltank({ ...params });
      }
      //   console.log("info.operate ", params);
      apifunc
        .then((res) => {
          //   console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: info.operate + "成功",
              type: "success",
            });
            this.$refs.basetable.addRowDialogVisible = false;
          } else {
            this.$message({
              message: info.operate + "失败稍后重试！",
              type: "error",
            });
          }
          this.$refs.basetable.loadingbtn = false;
          //   this.$refs.basetable.addRowDialogVisible = false;
          this.getdata(this.filter_params);
          //   this.formatFormRules();
          //   if (this.change_base) {
          //   console.log("1223");
          //   this.$store.commit("changeDevice");
          //   }
        })
        .catch((err) => {
          this.$message({
            message: "修改失败稍后重试！",
            type: "error",
          });
          this.$refs.basetable.loadingbtn = false;
          this.$store.commit("changeDevice");
        });
    },
    deleterow(info) {
      console.log("删除", info);
      delete info.rowinfo["检验日期预报警状态"];
      // delete info['DATEDIFF(`NEXT_CHECK_DATE`,curdate())']
      // console.log(Object.values(info).slice(1));
      //   console.log(info.rowinfo.ID);
      this.$refs.basetable.loadingbtn = true;

      api
        .deleteDeviceinfo({ system_id: info.rowinfo.系统ID })
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
            this.$refs.basetable.loadingbtn = false;
            this.$refs.basetable.addRowDialogVisible = false;
            this.$refs.basetable.confirmDeleteDialogVisible = false;

            this.getdata();
          }
        })
        .catch((err) => {
          this.$message({
            message: "删除失败稍后重试！",
            type: "error",
          });
          this.$refs.basetable.loadingbtn = false;
        });
    },
    getdata(params) {
      //   console.log({ filter: [{ ...params }] });
      this.$set(this.tabledata, "data", []);
      if (this.$refs.basetable) {
        this.$refs.basetable.loading = true;
      }
      api
        .readmoltentaltank(
          params ? { filter: JSON.stringify({ ...params }) } : ""
        )
        .then((res) => {
          console.log(res.data.data);
          if (res.data.code == "200" && res.data.data[0]) {
            if (!params) {
              //初始状态
              this.tabledata.columns = Object.keys(res.data.data[0])
                .filter((item) => item != "key")
                .map((item, index) => {
                  return {
                    prop: item,
                    label: item,
                  };
                });
            } else {
            }
            this.tabledata.columns = Object.keys(res.data.data[0])
              .filter((item) => item != "key")
              .map((item, index) => {
                return {
                  prop: item,
                  label: item,
                };
              });
            if (this.$refs.basetable) {
              this.$refs.basetable.loading = true;
            }
            let ids = res.data.data.map((item) => item.系统ID);
            // console.log(ids);
            reportapi
              .listReportStatus({ systemIds: ids })
              .then((res1) => {
                //   console.log(res1.data);
                const mergedTabledata = res.data.data.map((item) => {
                  const match = res1.data.data.find(
                    (d) => d.systemId === item.系统ID
                  ); // 查找 data2 中 ID 相同的对象
                  return {
                    ...item,
                    ...(match || {}), // 将匹配到的对象合并到当前对象
                  };
                });
                console.log(mergedTabledata);
                this.$set(this.tabledata, "data", mergedTabledata);
                if (this.$refs.basetable) {
                  this.$refs.basetable.loading = false;
                  if (this.$refs.basetable.showSelect) {
                    this.chooseReport(this.$refs.basetable.messageinfo);
                  }
                }
              })
              .catch((err) => {
                if (this.$refs.basetable) {
                  this.$refs.basetable.loading = false;
                }
              });
          } else {
          }
          if (this.$refs.basetable) {
            this.$refs.basetable.loading = false;
          }
        });
    },
  },
  mounted() {
    this.getdata();
    this.tankType = this.tankType.map((item, index) => {
      return {
        label: item,
        value: (index + 1).toString(),
      };
    });
  },
};
</script>

<style></style>
