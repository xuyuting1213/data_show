<template>
  <el-dialog
    :title="'修改'"
    :visible.sync="addRowDialogVisible"
    :modal="false"
    top="0.8rem"
  >
    <div class="dialog-content" v-if="addRowDialogVisible">
      <el-form
        :model="newRow"
        label-position="top"
        ref="newRow"
        :rules="rules_data"
      >
        <el-form-item
          :rules="[{ required: true }]"
          v-for="(column, index) in newRow"
          :key="index"
          :label="show_list[index]"
          :prop="index"
          v-if="index != 'ID' && index != 'key' && showinfo.indexOf(index) >= 0"
        >
          <el-select
            v-if="show_list[index] == '营业状态'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option label="营业" value="1"></el-option>
            <el-option label="停业" value="2"></el-option>
            <el-option label="关闭" value="3"></el-option>
          </el-select>
          <el-select
            v-if="index == 'productionMode'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option
              v-for="item in productionMode"
              :label="item.label"
              :value="item.value"
              :key="item.label"
            ></el-option>
          </el-select>
          <el-select
            v-if="index == 'administrativeSubOrdination'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option
              v-for="item in administrativeSubOrdination"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="index == 'registrationType'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option
              v-for="item in registrationType"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="index == 'companyScale'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option
              v-for="item in companyScale"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <el-select
            v-if="show_list[index] == '工艺类型'"
            v-model="newRow[index]"
            style="width: 8rem"
          >
            <el-option
              v-for="item in deviceKind"
              :label="item.label"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
          <div v-if="index == 'enterpriseEquipment'">
            <el-checkbox
              :indeterminate="isIndeterminate1"
              v-model="checkAll1"
              @change="handleCheckAllChange1"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="newRow['enterpriseEquipment']"
              @change="handleCheckedCitiesChange1"
            >
              <el-checkbox
                v-for="city in checkdata1"
                :label="city"
                :key="city"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
          <div
            v-if="
              index == 'topbvCommitmentletter' ||
              index == 'facilitiesCommitmentletter'
            "
          >
            <Uploadocom
              v-if="!newRow[index]"
              :uploadAction="'/api/function/upload'"
              @imageshow="(data) => imageshowFunc(data, index)"
              :showloading2="showloading2"
              ref="uploadocom"
              :referType="index == 'topbvCommitmentletter' ? '2' : '1'"
              @imgrelativeId="(r_id) => imgrelativeId(index, r_id)"
            ></Uploadocom>
            <div style="width: 1rem" v-else>
              <!-- <el-button @click="showImg(newRow[index])">查看图片</el-button> -->
              <img :src="newRow[index]" style="width: 1rem; height: 1rem" />
              <div style="width: 1rem">
                <span
                  style="color: #247cc3; cursor: pointer"
                  @click="cancelImg(index)"
                  >取消</span
                >
              </div>
            </div>
          </div>

          <el-input
            v-if="index == '主营业务'"
            v-model="newRow[index]"
            :placeholder="'请输入' + column"
            style="width: 8rem"
            type="textarea"
            :rows="5"
          ></el-input>
          <el-input
            v-else-if="
              show_list[index] != '营业状态' &&
              index != 'productionMode' &&
              index != 'administrativeSubOrdination' &&
              index != 'registrationType' &&
              index != 'companyScale' &&
              index != 'productionProcess' &&
              index != 'enterpriseEquipment' &&
              index != 'topbvCommitmentletter' &&
              index != 'facilitiesCommitmentletter'
            "
            v-model="newRow[index]"
            :placeholder="'请输入' + column"
            style="width: 8rem"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="editrowFunc" type="primary" :loading="loadingbtn"
        >保存</el-button
      >
      <el-button @click="resetform">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Uploadocom from "../../components/upload.vue";
import reportapi from "@/api/reportapi";
export default {
  props: [
    "editrow",
    "numberinfo",
    "show_list",
    "showinfo",
    "productionMode",
    "administrativeSubOrdination",
    "registrationType",
    "companyScale",
  ],
  data() {
    return {
      addRowDialogVisible: false,
      rules_data: {},
      loadingbtn: false,
      newRow: {},
      deviceKind: [
        { label: "长流程", value: "1" },
        { label: "短流程", value: "2" },
      ],
      isIndeterminate1: true,
      checkdata1: [
        "高炉",
        "转炉",
        "AOD精炼炉",
        "LF精炼炉",
        "VOD精炼炉",
        "CAS精炼炉",
        "IR精炼炉",
        "RH精炼炉",
        "电弧炉",
        "Consteel炼钢炉",
        "一氧化碳浓度报警器",
      ],
      checkedData1: [],
      checkAll1: false,
      showloading2: "show_loading2",
    };
  },
  components: { Uploadocom },
  methods: {
    showImg(id) {
      console.log(id);
      reportapi.getFile({ relativeId: id }).then((res) => {
        console.log(res.data);
        return res.data;
      });
    },
    imgrelativeId(index, r_id) {
      this.newRow[index] = r_id;
      console.log(this.newRow[index]);
      //   this.$emit("editIntroduction", this.newRow);
    },
    cancelImg(column) {
      console.log(this.newRow[column]);
      reportapi.deleteuploadFile({ id: this.newRow[column] }).then((res) => {
        console.log(res.data);
        return res.data;
      });
      this.newRow[column] = "";
    },
    imageshowFunc(msg, column) {
      this.newRow[column] = msg;
    },
    handleCheckAllChange1(val) {
      this.newRow["enterpriseEquipment"] = val ? this.checkdata1 : [];
      this.isIndeterminate1 = false;
    },
    handleCheckedCitiesChange1(value) {
      let checkedCount = value.length;
      // console.log(checkedCount)
      // console.log(this.newRow['水冷氧枪监测指标'])
      this.checkAll1 = checkedCount === this.checkdata1.length;
      this.isIndeterminate1 =
        checkedCount > 0 && checkedCount < this.checkdata1.length;
    },
    editrowFunc() {
      this.$refs.newRow.validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.$emit("editIntroduction", this.newRow);
        } else {
          this.$message({
            message: "请完成所有必填项！",
            type: "error",
          });
          return false;
        }
      });
    },
    resetform() {
      this.addRowDialogVisible = false;
    },

    formatRow() {
      this.newRow = JSON.parse(JSON.stringify(this.editrow));
      if (this.newRow.hasOwnProperty("productionProcess")) {
        //   this.newRow["productionProcess"] = this.editrow["productionProcess"] == "长流程" ? 1 : 2;
        this.newRow["enterpriseEquipment"] =
          this.editrow["enterpriseEquipment"].split("|");
      }
    },
  },
  mounted() {
    // this.rules_data = this.$formatFormRules(
    //   this.numberinfo ? this.numberinfo : [],
    //   this.newRow
    // );
  },
};
</script>

<style></style>
