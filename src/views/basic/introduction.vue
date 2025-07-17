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
          class="introcontent"
          v-for="(item, index) in companyinfo"
          :key="index"
          v-if="
            index != 'ID' &&
            index != 'key' &&
            !loading &&
            showinfo.indexOf(index) >= 0
          "
        >
          <el-col class="name" :span="5">{{ show_list[index] }}</el-col>
          <el-col class="value" :span="16">
            <span v-if="format_info.indexOf(index) >= 0">{{
              format_show(index, item)
            }}</span>

            <span v-else>{{ item }}</span>
          </el-col>
        </el-row>
        <div class="echarts-foot"></div>
        <div>
          <el-button class="editIntroduction" type="text" @click="editinfo"
            >编辑</el-button
          >
          <el-button
            class="editReport"
            type="primary"
            @click="reportinfo"
            style="margin-left: 5px"
            >上报</el-button
          >
        </div>
        <Editbasicinfo
          :editrow="companyinfo"
          ref="editbasicinfo"
          v-if="!loading"
          @editIntroduction="editIntroduction"
          :show_list="show_list"
          :showinfo="showinfo"
          :productionMode="productionMode"
          :administrativeSubOrdination="administrativeSubOrdination"
          :registrationType="registrationType"
          :companyScale="companyScale"
        ></Editbasicinfo>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/api";
import reportapi from "@/api/reportapi.js";
import Editbasicinfo from "./component/editbasicinfo.vue";
export default {
  data() {
    return {
      loading: true,
      companyinfo: {},
      showinfo: [
        //   "createBy",
        //   "createTime",
        //   "updateBy",
        //   "updateTime",
        //   "remark",
        "enterpriseName",
        "productionMode",
        "administrativeSubOrdination",
        "registrationType",
        "registrationAddress",
        "addressOperating",
        "legalRepresentative",
        "areaCode",
        "contactNumber",
        "safetyProductionManagementName",
        "safetyProductionManagementNumbe",
        "opScope",
        "companyScale",
        "businessStatus",
        "mainProduct",
        //   "creatorName",
        //   "updatorName",
        //   "id",
        "uniscid",
        "longitude",
        "latitude",
        //   "createTimeStr",
        //   "updateTimeStr",
      ],
      show_list: {
        enterpriseName: "企业名称",
        productionMode: "生产经营方式",
        uniscid: "统一社会信用代码",
        administrativeSubOrdination: "行政隶属关系",
        registrationType: "国民经济类型",
        registrationAddress: "注册地址",
        addressOperating: "经营地址",
        legalRepresentative: "实际控制人",
        areaCode: "行政区域编码",
        contactNumber: "实际控制人电话",
        safetyProductionManagementName: "安全生产管理负责人",
        safetyProductionManagementNumbe: "安全生产管理负责人电话",
        opScope: "主营业务",
        companyScale: "企业规模",
        businessStatus: "营业状态",
        longitude: "经度",
        latitude: "纬度",
        mainProduct: "主要产品",
      },
      businessStatus: ["营业", "停业", "关闭"],
      productionMode: [
        "生产（制造）",
        "批发经营",
        "零售经营",
        "储存",
        "使用",
        "其他",
      ],
      administrativeSubOrdination: ["中央级", "省级", "地市级", "区县级"],
      registrationType: [
        "国有",
        "集体联营",
        "私营",
        "有限责任",
        "股份有限",
        "股份合作",
        "港澳台",
        "外商投资",
        "分公司",
        "其他",
      ],
      companyScale: ["规上", "规下"],
      format_info: [
        "businessStatus",
        "productionMode",
        "administrativeSubOrdination",
        "registrationType",
        "companyScale",
      ],
    };
  },
  components: { Editbasicinfo },
  computed: {},
  methods: {
    format_show(index, item) {
      //   console.log(index, item);
      //   console.log(this[index]);
      if (this[index] && this[index].find((items) => items.value == item)) {
        // console.log(this[index]);
        return this[index].find((items) => items.value == item).label;
      } else {
        return item;
      }
      // return this[index].find((items) => items.value == index).value;
      //   return this.format_info
    },
    cancelImg(column) {
      this.newRow[column] = "";
    },
    reportinfo() {
      this.$functionConfrim(this.companyinfo).then((res) => {
        console.log(res);
        if (res.status == "yes") {
          // console.log(result);
          reportapi.reportCompany({ id: res.value.id }).then((res) => {
            if (res.data.code == 2000) {
              this.$message.success("上报成功！");
            } else {
              this.$message.error("上报失败！" + res.data.msg);
            }
          });
        }
      });
    },
    editinfo() {
      this.$refs.editbasicinfo.addRowDialogVisible = true;
      this.$refs.editbasicinfo.formatRow()
    },
    editIntroduction(info) {
      console.log(info);
      this.$refs.editbasicinfo.loadingbtn = true;
      delete info.ID;
      delete info.key;
      let pa_info = JSON.parse(JSON.stringify(info));
    //   pa_info.businessStatus =
    //     info.businessStatus == "营业"
    //       ? 1
    //       : info.businessStatus == "停业"
    //       ? 2
    //       : 3;
      //   console.log(pa_info.businessStatus);
      //   console.log(pa_info.productionMode);
      //   console.log(pa_info.administrativeSubOrdination);
      //   console.log(pa_info.registrationType);
      //   console.log(pa_info.companyScale);
      //   api.writecompanyinfo({ data: Object.values(info).join(",") });
      reportapi
        .updateCompany(pa_info)
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

      reportapi
        .readCompany()
        //   api
        //     .companyinfo()
        .then((res) => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.companyinfo = res.data.data;
            // console.log(Object.keys(res.data.data[0]));
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
    formatData() {
      this.businessStatus = this.businessStatus.map((item, index) => {
        return {
          label: item,
          value: (index + 1).toString(),
        };
      });
      this.productionMode = this.productionMode.map((item, index) => {
        return {
          label: item,
          value: (index + 1).toString(),
        };
      });
      this.administrativeSubOrdination = this.administrativeSubOrdination.map(
        (item, index) => {
          return {
            label: item,
            value: (index + 1).toString(),
          };
        }
      );
      this.registrationType = this.registrationType.map((item, index) => {
        return {
          label: item,
          value: (index + 1).toString(),
        };
      });
      this.companyScale = this.companyScale.map((item, index) => {
        return {
          label: item,
          value: (index + 1).toString(),
        };
      });
    },
  },
  mounted() {
    this.getData();
    this.formatData();
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
