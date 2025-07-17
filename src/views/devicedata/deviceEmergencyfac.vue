<template>
    <div class="deviceinfocontainer intor_list highlight">
        <!-- <img
          src="../../assets/images/loading.gif"
          class="loadgif"
          v-if="loading"
          id="loadgif"
        /> -->
        <BaseTable :column="tabledata.columns" :tabledata="tabledata.data" :operate="['', 'delete', 'add']"
            ref="basetable" @addinfo="addinfo" @deleterow="deleterow" @searchparams="searchparams"></BaseTable>

        <div class="echarts-foot"></div>
    </div>
</template>

<script>
import api from "@/api/api";
import BaseTable from "./table/emergencyfacTable.vue";

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
        };
    },
    methods: {
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
            //   console.log("1223", this.current_newinfo);

            //参数分为两个部分 assignValues函数返回数组，第一个对象为基础参数，第二，三个为页面特有参数,
            let base_pa = this.$assignValues(undefined, this.current_newinfo);
            delete base_pa[1].系统ID;
            delete base_pa[1].ID

            console.log(base_pa[1]);
            for (let i in base_pa[1]) {
                if (i.indexOf("图片") >= 0) {
                    //   base_pa[1][i] = "";
                    base_pa[1][i] = base_pa[1][i] ? base_pa[1][i].join("|") : "";
                }
            }
            this.editinfo(info, base_pa, info.write_flag);
            //   console.log(base_pa[1]);
        },
        // 增加或编辑一条数据
        editinfo(info, base_pa, flag) {
            this.$refs.basetable.loadingbtn = true;
            let params = {},
                apifunc;

            //   判断当前所有需要的参数是否都为null,若为null则说明该设备没有上传过信息，则调用的是write接口
            //   否则调用update接口
            if (flag) {
                params = {
                    data: JSON.stringify(Object.values(base_pa[1])),
                    system_id: info.rowinfo.系统ID,
                };
                apifunc = api.writeEmergencyfac({ ...params });
            } else {
                params = {
                    data: JSON.stringify(Object.values(base_pa[1])),
                    system_id: info.rowinfo.系统ID,
                };
                apifunc = api.updateEmergencyfac({ ...params });
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
                    this.$refs.basetable.write_flag = false;
                    this.getdata(this.filter_params);
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
                    this.$refs.basetable.write_flag = false;
                    //   this.$store.commit("changeDevice");
                });
        },
        deleterow(info) {
            console.log("删除", info);
            delete info.rowinfo["检验日期预报警状态"];
            // delete info['DATEDIFF(`NEXT_CHECK_DATE`,curdate())']
            // console.log(Object.values(info).slice(1));
            console.log(info.rowinfo.ID);
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
        openAddRowDialog() {
            this.$refs.basetable.addRowDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.basetable.initialform();
            });
        },
        getdata(params) {
            //   console.log({ filter: [{ ...params }] });
            this.$set(this.tabledata, "data", []);
            if (this.$refs.basetable) {
                this.$refs.basetable.loading = true;
            }
            params = { "device_name": ["3#方坯连铸机", "1#方坯连铸机", "2#方坯连铸机", "板坯连铸机"] }

            api
                .readEmergencyfac(
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
                        this.$set(this.tabledata, "data", res.data.data);
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
    },
};
</script>

<style></style>