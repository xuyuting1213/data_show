<template>
  <div class="introdunction">
    <div class="base_list highlight">
      <img
        src="../../assets/images/loading.gif"
        class="loadgif"
        v-if="loading"
      />
      <div
        style="
          padding: 0.3rem;
          padding-top: 0.15rem;
          overflow-y: auto;
          height: calc(100% - 0.02rem);
        "
      >
        <el-row
          class="introcontent personalrecord"
          v-for="(item, index) in companyinfo"
          :key="item"
          v-if="
            index != 'ID' &&
            index != 'key' &&
            !loading &&
            showinfo.indexOf(index) >= 0
          "
        >
          <el-col class="name" :span="12">{{ show_list[index] }}</el-col>
          <el-col class="value" :span="7">
            <span
              v-if="
                show_list[index] != '企业应有的设备设施类型' &&
                show_list[index].indexOf('承诺书') < 0
              "
            >
              <span v-if="show_list[index] == '工艺类型'">
                {{ item == 1 ? "长流程" : "短流程" }}
              </span>
              <span v-else> {{ item }} </span>
            </span>
            <span v-else-if="show_list[index].indexOf('承诺书') < 0">
              {{ item.replaceAll("|", "、") }}
            </span>
            <span v-if="show_list[index].indexOf('承诺书') >= 0">
              <!-- <img :src="getshowimg(item)" style="width: 1rem; height: 1rem" /> -->
              <img :src="item" style="width: 2rem" @click="showbigimg(item)" />
            </span>
          </el-col>
        </el-row>
        <div class="echarts-foot"></div>
        <el-button class="editIntroduction" type="text" @click="editinfo"
          >编辑</el-button
        >
        <el-button class="editReport" type="primary" @click="reportinfo"
          >上报</el-button
        >
        <Editbasicinfo
          :editrow="companyinfo"
          ref="editbasicinfo"
          v-if="!loading"
          @editIntroduction="editIntroduction"
          :numberinfo="[
            '粗钢(粗铁)设计产能(万吨/年)',
            '公司范围内煤气主输配管道长度(km)',
            '金属冶炼单元从业人员总数（分厂内部员工、生产劳务人员，不含检维修外包人员）',
          ]"
          :showinfo="showinfo"
          :show_list="show_list"
        ></Editbasicinfo>
      </div>
      <el-dialog
        :modal="false"
        title="文件查看"
        :visible.sync="imgdialog"
        @close="imgdialog = false"
        custom-class="imgdialog"
        top="1rem"
      >
        <div style="width: 100%">
          <img :src="currimgsrc" style="width: 100%" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";

import reportapi from "@/api/reportapi";
import Editbasicinfo from "./component/editbasicinfo.vue";
export default {
  data() {
    return {
      loading: true,
      companyinfo: {},
      imgdialog: false,
      currimgsrc: false,
      showinfo: [
        //   "createBy",
        //   "createTime",
        //   "updateBy",
        //   "updateTime",
        //   "remark",
        //   "dataId",
        "metalsmeltingWorkerNumber",
        "gaspipelineLength",
        "productionCapacity",
        "productionProcess",
        "facilitiesCommitmentletter",
        "topbvCommitmentletter",
        "enterpriseEquipment",
        // "creatorName",
        // "updatorName",
        //   "id",
        //   "actived",
        //   "createTimeStr",
        //   "updateTimeStr",
      ],
      show_list: {
        gaspipelineLength: "企业内部煤气输配管道长度(km)",
        productionCapacity: "粗钢设计产能(万吨/年)",
        productionProcess: "工艺类型",
        facilitiesCommitmentletter:
          "炼钢连铸（模铸）生产过程熔融金属紧急排放和应急储存设施承诺书",
        topbvCommitmentletter: "高炉炉顶放散阀联锁放散压力值设定承诺书",
        enterpriseEquipment: "企业应有的设备设施类型",
        // 金属冶炼单元从业人员总数
        metalsmeltingWorkerNumber: "金属冶炼单元从业人员总数",

        // creatorName: "",
        // updatorName: "",
      },
    };
  },
  components: { Editbasicinfo },
  methods: {
    // async getshowimg(newRow) {
    //   console.log(newRow);
    //   const response = await fetch(newRow);
    //   console.log(response.blob());
    // },
    showbigimg(src) {
      this.imgdialog = true;
      this.currimgsrc = src;
    },
    // 上报图片
    async reportimginfo() {
      let res1 = await this.$reportimginfo(
        this.companyinfo["topbvCommitmentletter"],
        "2"
      );
      // console.log(res1)
      
      if (res1.data&&res1.data.code != 2000&&res1.length) {
        this.$message.error("高炉炉顶放散阀联锁放散压力值设定承诺书上报失败");
      }
      // console.log(img1);
      let res2 =await this.$reportimginfo(
        this.companyinfo["facilitiesCommitmentletter"],
        "1"
      );
      if (res2.data&&res2.data.code != 2000&&res2.length) {
        this.$message.error(
          "炼钢连铸（模铸）生产过程熔融金属紧急排放和应急储存设施的承诺书上报失败"
        );
      }
    },
    reportinfo() {
      this.$functionConfrim(this.companyinfo).then((res) => {
        console.log(res);
        this.loading = true;

        if (res.status == "yes") {
          // console.log(result);
          reportapi
            .reportPersonal({ id: res.value.id, saveOrUpdate: 2 })
            .then((res) => {
              if (res.data.code == 2000) {
                this.$message.success("上报成功！");
              } else {
                this.$message.error("上报失败！" + res.data.message);
              }
              this.reportimginfo();
              this.loading = false;
            });
        }else{
              this.loading = false;

        }
      });
    },
    editinfo() {
      this.$refs.editbasicinfo.addRowDialogVisible = true;
      this.$refs.editbasicinfo.formatRow();
    },
    editIntroduction(info) {
      console.log(info["topbvCommitmentletter"]);
      this.$refs.editbasicinfo.loadingbtn = true;
      delete info.ID;
      delete info.key;
      let editparams = JSON.parse(JSON.stringify(info));
      //       facilitiesCommitmentletter
      // :
      // "http://200.150.100.70:8000/statics/1864488577203093504_1733363813.png"
      editparams["enterpriseEquipment"] = info["enterpriseEquipment"].join("|");
      editparams["topbvCommitmentletter"] = info["topbvCommitmentletter"]
        ? info["topbvCommitmentletter"]
        : "";
      editparams["facilitiesCommitmentletter"] = info[
        "facilitiesCommitmentletter"
      ]
        ? info["facilitiesCommitmentletter"]
        : "";

      console.log(editparams);
      api.writecompanyspecialinfo({
        data: Object.values(editparams).join(","),
      });
      reportapi
        .updatePersonal(editparams)
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.$refs.editbasicinfo.addRowDialogVisible = false;
            this.$refs.editbasicinfo.loadingbtn = false;
            this.getData();
          } else {
            this.$message({
              message: "修改失败！",
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: "网络错误！修改失败！",
            type: "error",
          });
          this.$refs.editbasicinfo.addRowDialogVisible = false;
          this.$refs.editbasicinfo.loadingbtn = false;
          this.getData();
        });
    },
    getData() {
      this.loading = true;

      //   api
      //     .companyspecialinfo()
      reportapi
        .readPersonal()
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.companyinfo = res.data.data;
            console.log(Object.keys(this.companyinfo));
            // this.companyinfo["高炉炉顶放散阀联锁放散压力值设定承诺书"] =
            //   this.companyinfo["高炉炉顶放散阀联锁放散压力值设定承诺书"];
            // this.companyinfo[
            //   "炼钢连铸（模铸）生产过程熔融金属紧急排放和应急储存设施承诺书"
            // ] = this.companyinfo["炼钢连铸（模铸）生产过程熔融金属紧急排放和应急储存设施承诺书"];
            // delete this.companyinfo["高炉炉顶放散阀联锁放散压力值设定承诺书"];
            // delete this.companyinfo["炼钢连铸（模铸）生产过程熔融金属紧急排放和应急储存设施承诺书"];
          } else {
            this.$message({
              message: "网络错误！查询失败！",
              type: "error",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="less">
.introdunction {
  height: fit-content;
  padding-top: 20px;
  .introcontent {
    display: flex;
    // margin: 5px 0px;
    .name,
    .value {
      //     width: 20%;
      color: rgb(255, 255, 255);
      font-size: 14px;
    }
  }
  // }
}
</style>
