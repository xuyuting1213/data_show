<template>
    <div class="deviceinfocontainer intor_list highlight">
      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        v-if="loading"
        id="loadgif"
      />
      <!--
      <el-button
        type="primary"
        @click="openAddRowDialog"
        icon="el-icon-plus"
        class="plusicon"
        >添加信息</el-button
      > -->
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
      ></BaseTable>
  
      <div class="echarts-foot"></div>
    </div>
  </template>
  
  <script>
  import api from "@/api/api";
  import BaseTable from "./table/checkoutTable.vue";
  import reportapi from "@/api/reportapi";
  import { data } from "jquery";
  
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
      };
    },
    methods: {
      // 点击新增或者修改上报
      chooseReport(msg) {
        // 先把已经上报过的设备筛选出来
        this.tabledata.data = this.tabledata.data.filter((item) => {
          return item.base_addFlag == "1" && item.ID != null;
        });
        console.log(this.tabledata.data);
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
        //   console.log(this.tabledata.data);
      },
      async reportfuncimginfo(selectval) {
        // console.log(selectval.checkevalue);
  
        let report_images = selectval.checkevalue.map((item) => item["图片描述"]);
        // console.log(report_images);
        for (const item of report_images) {
          try {
            let res1 = await this.$reportimginfo(item, "3");
            console.log(res1)
            if (res1.data&&res1.data.code != 2000) {
              this.$message.error("图片描述上报失败");
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
          reportapi.checkreportDevice(params).then((res) => {
            //   console.log(res.data);
            if (res.data.code == 200) {
              let su_status = [],
                su_msg = [],
                err_status = [];
              res.data.data.map((item) => {
                console.log(item);
                let success_info =
                  (item.supervisionCheckRecordDetailMessage.code === 2000 &&
                    item.supervisionCheckRecordMessage.code === 2000) ||
                  item.supervisionCheckRecordDetailMessage.message.includes(
                    "表中数据已存在"
                  ) ||
                  item.supervisionCheckRecordMessage.message.includes(
                    "表中数据已存在"
                  );
                su_status.push(success_info);
                if (success_info) {
                  su_msg.push(item);
                }
                if (
                  item.supervisionCheckRecordDetailMessage.code !== 2000 &&
                  item.supervisionCheckRecordMessage.code !== 2000
                ) {
                  err_status.push(item);
                } else if (
                  !item.supervisionCheckRecordDetailMessage.message.includes(
                    "表中数据已存在"
                  ) &&
                  !item.supervisionCheckRecordMessage.message.includes(
                    "表中数据已存在"
                  )
                ) {
                  err_status.push(item);
                }
              });
              console.log(su_status);
              console.log(err_status);
              //   let errinfo = su_status.find((item) => item === false);
              //   console.log(su_status.includes(false));
  
              if (!su_status.includes(false)) {
                this.$message.success("所有记录上报成功！");
              } else {
                if (err_status) {
                  this.$message({
                    type: "error",
                    dangerouslyUseHTMLString: true,
                    message: `<div style="height:fit-content;max-height:320px;">以下数据上报失败！<br>${err_status
                      .map(
                        (item) =>
                          `<div>ID:${item.id}_错误信息${
                            item.supervisionCheckRecordDetailMessage.code == 2000
                              ? ""
                              : item.supervisionCheckRecordDetailMessage.message
                          }_${
                            item.supervisionCheckRecordMessage.code == 2000
                              ? ""
                              : item.supervisionCheckRecordMessage.message
                          }</div>`
                      )
                      .join("")}</div>`,
                    showClose: true,
                    duration: 0,
                  });
                }
  
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
      searchparams(parmas) {
        console.log(parmas);
        //   每次筛选，记住当前筛选参数，用于编辑，新增，删除的加载表格数据
        this.filter_params = JSON.parse(JSON.stringify(parmas));
        this.getdata();
      },
      addinfo(info) {
        this.current_newinfo = JSON.parse(JSON.stringify(info.rowinfo));
        this.current_newinfo["运行状态"] =
          this.current_newinfo["运行状态"] == "在用"
            ? 1
            : this.current_newinfo["运行状态"] == "停用"
            ? 2
            : 3;
        if (
          this.current_newinfo["点检标准"] == "回转溜槽内部应无杂物、无堵塞现象"
        ) {
          this.current_newinfo["点检事项"] = "0101";
          this.current_newinfo["点检序号"] = "1";
        } else if (this.current_newinfo["点检标准"] == "回转溜槽内部应保持干燥") {
          this.current_newinfo["点检事项"] = "0102";
          this.current_newinfo["点检序号"] = "2";
        } else if (
          this.current_newinfo["点检标准"] ==
          "回转溜槽前端应在事故钢水罐(坑、槽) 上方，应能满足事故钢水顺利流入"
        ) {
          this.current_newinfo["点检事项"] = "0103";
          this.current_newinfo["点检序号"] = "3";
        }
        //参数分为两个部分 assignValues函数返回数组，第一个对象为基础参数，第二，三个为页面特有参数,
        let base_pa = this.$assignValues(undefined, this.current_newinfo);
        delete base_pa[1].系统ID;
        delete base_pa[1].ID;
        delete base_pa[1].id;
        delete base_pa[1].报废证明;
        delete base_pa[1].停用证明;
        delete base_pa[1].检验日期预报警状态;
        delete base_pa[1].设备编码;
        delete base_pa[1].systemId;
        delete base_pa[1].updateFlag;
        delete base_pa[1].addFlag;
        delete base_pa[1].base_addFlag;
        delete base_pa[1].base_updateFlag;
        delete base_pa[1].点检结果;
  
        //   let speci_pa = this.$assignValues(undefined, this.current_newinfo);
        //   //   console.log(base_pa, speci_pa);
        //   speci_pa[1]["检验日期"] = speci_pa[1]["检验日期"]
        //     ? speci_pa[1]["检验日期"]
        //     : "";
        //   speci_pa[1]["再检日期"] = speci_pa[1]["再检日期"]
        //     ? speci_pa[1]["再检日期"]
        //     : "";
        //   console.log(base_pa);
        //   console.log(speci_pa[0]);
        console.log(base_pa[1]);
        this.editinfo(info, base_pa);
      },
      // 增加或编辑一条数据
      async editinfo(info, base_pa) {
        this.$refs.basetable.loadingbtn = true;
        let params = {},
          apifunc;
        //   base_pa[0]["设备类型"] = "吊运熔融金属起重机";
  
        if (info.operate == "编辑") {
          params = {
            record_id: this.current_newinfo.ID,
            system_id: this.current_newinfo.系统ID,
            check_data: JSON.stringify(Object.values(base_pa[1])),
          };
  
          apifunc = api.updateCheckout({ ...params });
        } else if (info.operate == "添加设备点检记录") {
          let getid = await this.$getId();
          let getid2 = await this.$getId();
  
          base_pa[1]["getId"] = getid;
          base_pa[1]["getId2"] = getid2;
          console.log(base_pa[0]);
          console.log(base_pa[1]);
          params = {
            system_id: this.current_newinfo.系统ID,
            check_data: JSON.stringify(Object.values(base_pa[1])),
          };
          apifunc = api.writeCheckout({ ...params });
        }
        console.log("info.operate ", params);
        apifunc
          .then((res) => {
            //   console.log(res.data);
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
            this.$refs.basetable.loadingbtn = false;
            this.$refs.basetable.addRowDialogVisible = false;
            this.getdata();
            // this.formatFormRules();
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
            //   this.$store.commit("changeDevice");
          });
      },
      deleterow(info) {
        console.log("删除", info);
        delete info.rowinfo["检验/校准日期预报警状态"];
        // delete info['DATEDIFF(`NEXT_CHECK_DATE`,curdate())']
        // console.log(Object.values(info).slice(1));
        //   console.log(info.rowinfo.ID);
        api
          .deleteCheckout({
            system_id: info.rowinfo.系统ID,
            record_id: info.rowinfo.ID,
          })
          .then((res) => {
            console.log(res.data);
  
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
            this.$refs.basetable.confirmDeleteDialogVisible = false;
            this.getdata();
          })
          .catch((err) => {
            this.$message({
              message: "删除失败稍后重试！",
              type: "error",
            });
          });
      },
      openAddRowDialog() {
        this.$refs.basetable.addRowDialogVisible = true;
        this.$nextTick(() => {
          this.$refs.basetable.initialform();
        });
      },
      normalizeData(dataArray, columnsInit) {
        // console.log("dataArray", dataArray);
  
        return dataArray.map((item) => {
          // 创建一个新的对象，基于 columnsInit 的结构
          let normalizedItem = { ...columnsInit };
          // console.log(normalizedItem)
          // 遍历当前项的属性，保留存在的值
          for (let key in item) {
            if (item.hasOwnProperty(key)) {
              normalizedItem[key] = item[key];
            }
          }
  
          // 特别处理 "点检结果" 字段，根据 "问题描述" 是否为空设置其值
          normalizedItem["点检结果"] = item["问题描述"] ? "异常" : "正常";
          // console.log(normalizedItem)
  
          return normalizedItem;
        });
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
          .readCheckout(params ? { filter: JSON.stringify({ ...params }) } : "")
          .then((res) => {
            let columns_init = {
              ID: null,
              系统ID: "",
              所属分厂: "",
              所属车间: "",
              设备名称: "",
              企业内部编号: "",
              安装地点: "",
              运行状态: "",
              // 设备编码: null,
              点检日期: "",
              点检序号: "",
              点检事项: "",
              点检标准: "",
              点检结果: "正常",
              问题描述: "",
              图片描述: "",
              再检日期: "",
              检验日期预报警状态: "",
              停用证明: null,
              报废证明: null,
            };
            //   console.log(res.data.data);
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
  
              let ids = res.data.data.map((item) => item.ID);
              let sysids = res.data.data.map((item) => item.系统ID);
              // console.log(ids);
              // 根据ID搜索点检设备的上报状态
              reportapi
                .idscheckReportStatus({ ids: ids })
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
  
                      let arr = this.normalizeData(
                        mergedTabledata2,
                        columns_init
                      );
                         let arr1 = this.normalizeData(
                        res.data.data.slice(0,1),
                        columns_init
                      );
                      this.$set(this.tabledata, "data", arr);
                      console.log(arr);
  
                      this.tabledata.columns = Object.keys(arr1[0])
                        .filter((item) => item != "key")
                        .map((item, index) => {
                          return {
                            prop: item,
                            label: item,
                          };
                        });
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
      this.getdata();
    },
  };
  </script>
  
  <style></style>
  