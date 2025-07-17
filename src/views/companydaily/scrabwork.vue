<template>
  <div class="deviceinfocontainer intor_list highlight">
    <!-- <img src="../../assets/images/loading.gif" class="loadgif" v-if="loading" /> -->
    <img
      src="../../assets/images/loading.gif"
      class="loadgif"
      v-if="loading"
      id="loadgif"
    />
    <BaseTable
      :column="tabledata.columns"
      :tabledata="tabledata.data"
      :operate="['edit', 'delete', 'add']"
      ref="basetable"
      @addinfo="addinfo"
      @deleterow="deleterow"
      @searchparams="searchparams"
      @reportInfo="reportInfo"
      @chooseReport="chooseReport"
    ></BaseTable>

    <div class="echarts-foot"></div>
  </div>
</template>

<script>
import api from "@/api/api";
import BaseTable from "./table/scrabworkTable.vue";
import reportapi from "@/api/reportapi";
export default {
  components: { BaseTable },
  data() {
    return {
      tabledata: {
        columns: [],
        data: [],
      },
      loading: false,
      current_newinfo: {},
      filter_params: {},
    };
  },

  methods: {
    // 点击新增或者修改上报
    chooseReport(msg) {
      this.tabledata.data = this.tabledata.data.filter((item) => {
        return item.base_addFlag == "1" && item.ID != null;
      });
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
        (item) => item["报废证明资料"]
      );
      // console.log(report_images);
      for (const item of report_images) {
        try {
          let res1 = await this.$reportimginfo(item, "6");
          if (res1.data&&res1.data.code != 2000)  {
            this.$message.error("报废证明资料上报失败");
          }
        } catch (error) {
          console.error(`上报失败: ${error.message}`);
        }
      }
    },
    // 点击确认更新
    reportInfo(selectval) {
      console.log(selectval);
      let ids = selectval.checkevalue.map((item) => item.ID);
      let params = {
        saveOrUpdate: selectval.operate == "新增" ? 1 : 2, //新增更新标识
        ids: ids, //id数组
      };
      this.$refs.basetable.loading_report = true;

      if (ids.length) {
        this.loading = true;
        reportapi.scrabreportDevice(params).then((res) => {
          //   console.log(res.data);
          if (res.data.code == 200) {
            let su_status = [],
              su_msg = [],
              err_status = [];
            res.data.data.map((item) => {
              console.log(item);
              let success_info =
                item.deviceScrapRecord.code === 2000 ||
                item.deviceScrapRecord.message.includes("表中数据已存在");
              su_status.push(success_info);
              if (success_info) {
                su_msg.push(item);
              }
              if (item.deviceScrapRecord.code != 2000) {
                err_status.push(item);
              }
            });
            //   console.log(su_status);
            //   console.log(err_status);
            //   let errinfo = su_status.find((item) => item === false);
            //   console.log(su_status.includes(false));

            if (!su_status.includes(false)) {
              this.$message.success("所有记录上报成功！");
            } else {
              this.$message({
                type: "error",
                dangerouslyUseHTMLString: true,
                message: `<div style="height:fit-content;max-height:320px;">以下数据上报失败！<br>${err_status
                  .map(
                    (item) =>
                      `<div>ID:${item.id}_错误信息${
                        item.deviceScrapRecord.code == 2000
                          ? ""
                          : item.deviceScrapRecord.message
                      }</div>`
                  )
                  .join("")}</div>`,
                showClose: true,
                duration: 0,
              });
              if (su_msg.length) {
                this.$message({
                  type: "success",
                  dangerouslyUseHTMLString: true,
                  offset: 200,
                  message: `以下数据上报成功！<br>${su_msg
                    .map((item) => `<div>ID:${item.id}</div>`)
                    .join("")}`,
                  showClose: true,
                  duration: 0,
                });
              }
            }
            this.$refs.basetable.showSelectvalue = [];
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
    // 添加高炉信息
    addinfo(info) {
      delete info.rowinfo["key"];
      this.current_newinfo = JSON.parse(JSON.stringify(info.rowinfo));

      //参数分为两个部分 assignValues函数返回数组，第一个对象为基础参数，第二个为页面特有参数
      let base_pa = this.$assignValues(undefined, this.current_newinfo);
      delete base_pa[1].ID;
      delete base_pa[1].id;
      delete base_pa[1].系统ID;
      delete base_pa[1].设备编码;
      delete base_pa[1].systemId;
      delete base_pa[1].updateFlag;
      delete base_pa[1].addFlag;
      delete base_pa[1].base_addFlag;
      delete base_pa[1].base_updateFlag;
      //   console.log(base_pa[1]);
      this.editinfo(info, base_pa);
    },
    // 增加或编辑一条数据
    async editinfo(info, base_pa) {
      this.$refs.basetable.loadingbtn = true;
      let params = {},
        apifunc;
      //   base_pa[0]["设备类型"] = "高炉";
      if (info.operate == "编辑") {
        params = {
          scrap_data: JSON.stringify(Object.values(base_pa[1])),
          system_id: info.rowinfo.系统ID,
          record_id: info.rowinfo.ID,
        };
        apifunc = api.updateScrapwork({ ...params });
      } else if (info.operate == "添加报废信息") {
        let getid = await this.$getId();
        console.log(base_pa[0]);
        console.log(base_pa[1]);
        base_pa[1]["getId"] = getid;
        params = {
          scrap_data: JSON.stringify(Object.values(base_pa[1])),
          system_id: info.rowinfo.系统ID,
        };
        apifunc = api.writeScrapwork({ ...params });
      }
      console.log("info.operate ", params);
      apifunc
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
          } else {
            this.$message({
              message: info.operate + "失败稍后重试！",
              type: "error",
            });
          }
          this.$refs.basetable.loadingbtn = false;
          this.$refs.basetable.addRowDialogVisible = false;
          //   if (info.operate == "报废") {
          //     this.$refs.basetable.loading_status.close();
          //   }
          this.getdata();
          //   this.formatFormRules();
          //   if (this.change_base) {
          //   console.log("1223");
          this.$store.commit("changeDevice");
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
    // 删除
    deleterow(info) {
      //   console.log("删除", info);
      // delete info['DATEDIFF(`NEXT_CHECK_DATE`,curdate())']
      // console.log(Object.values(info).slice(1));
      //   console.log(info.rowinfo.ID);
      //   let writestr = Object.values(info.rowinfo).slice(1).join(",");
      api
        .deleteScrapwork({
          system_id: info.rowinfo.系统ID,
          record_id: info.rowinfo.ID,
        })
        .then((res) => {
          console.log(res.data);
          if (info.operate == "编辑") {
            this.addnewdata(info);
          } else {
            if (res.data.code == 200) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
            } else {
              this.$message({
                message: "操作失败稍后重试！",
                type: "error",
              });
            }
            this.$refs.basetable.addRowDialogVisible = false;
            this.$refs.basetable.confirmDeleteDialogVisible = false;

            this.getdata();
            // this.$refs.basetable.loading_status.close();
          }
        })
        .catch((err) => {
          this.$message({
            message: "操作失败稍后重试！",
            type: "error",
          });
          //   this.$refs.basetable.loading_status.close();
        });
    },
    searchparams(parmas) {
      //   console.log(parmas);
      //   每次筛选，记住当前筛选参数，用于编辑，新增，删除的加载表格数据
      this.filter_params = JSON.parse(JSON.stringify(parmas));
      this.getdata();
    },
    getdata() {
      //   console.log({ filter: [{ ...params }] });
      let params = {};
      this.$set(this.tabledata, "data", []);
      if (this.$refs.basetable) {
        this.$refs.basetable.loading = true;
        if (this.$refs.basetable.showsearch) {
          params = this.filter_params;
        }
      }
      api
        .readScrapwork(params ? { filter: JSON.stringify({ ...params }) } : "")
        .then((res) => {
          console.log(res.data.data);
          if (res.data.data[0]) {
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
            let ids = res.data.data.map((item) => item.ID);
            let sysids = res.data.data.map((item) => item.系统ID);
            // console.log(ids);
            // 根据ID搜索点检设备的上报状态
            reportapi
              .idsscrabReportStatus({ ids: ids })
              .then((res1) => {
                //   console.log(res1.data);
                const mergedTabledata = res.data.data.map((item) => {
                  const match = res1.data.data.find((d) => d.id === item.ID); // 查找 data2 中 ID 相同的对象
                  return {
                    ...item,
                    ...(match || {}), // 将匹配到的对象合并到当前对象
                  };
                });
                // console.log(mergedTabledata);
                // 根据systemID搜索设备本身的上报状态，只有设备本身已经上报了（base_addFlag=1）才可以进行点检上报
                reportapi
                  .listReportStatus({ systemIds: sysids })
                  .then((res2) => {
                    // // console.log("res2", res2.data);
                    let sys_info = res2.data.data.map((item) => {
                      return {
                        systemId: item.systemId,
                        base_addFlag: item.addFlag,
                        base_updateFlag: item.updateFlag,
                      };
                    });
                    const mergedTabledata2 = mergedTabledata.map((item) => {
                      const match2 = sys_info.find(
                        (d) => d.systemId === item.系统ID
                      ); // 查找 data2 中 ID 相同的对象
                      return {
                        ...item,
                        ...(match2 || {}), // 将匹配到的对象合并到当前对象
                      };
                    });
                    console.log("mergedTabledata", mergedTabledata2);
                    this.$set(this.tabledata, "data", mergedTabledata2);
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
              })
              .catch((err) => {
                if (this.$refs.basetable) {
                  this.$refs.basetable.loading = false;
                }
              });
          } else {
            if (this.$refs.basetable) {
              this.$refs.basetable.loading = false;
            }
          }
        });
    },
  },
  mounted() {
    this.getdata("");
  },
};
</script>

<style></style>
