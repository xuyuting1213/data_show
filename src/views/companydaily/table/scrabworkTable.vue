<template>
  <div>
    <div class="machineTable">
      <img
        src="../../../assets/images/loading.gif"
        class="loadgif"
        id="show_loading2"
      />
      <p>正在上传报告。。。</p>
    </div>
    <el-row justify="space-between">
      <el-col style="width: 2rem" v-if="!showSelect"> </el-col>
      <el-col :span="18">
        <el-popconfirm
          confirm-button-text="新增上报"
          cancel-button-text="修改上报"
          icon="el-icon-info"
          title="选择上报类型"
          cancel-button-type="primary"
          @confirm="showSelectFunc('新增')"
          @cancel="showSelectFunc('修改')"
          :disabled="loading"
        >
          <el-button
            type="primary"
            class="plusicon"
            v-if="!showSelect"
            slot="reference"
            :disabled="loading"
          >
            <span>上报</span>
          </el-button>
        </el-popconfirm>
        <span style="color: white"
          >仅满足以下条件的数据可上报：1、已经新增上报成功的设备
          2、已经进行报废操作过的设备</span
        >

        <div v-if="showSelect" style="width: 5rem">
          <el-button
            type="text"
            @click="confirmSelectFunc"
            class="plusicon"
            v-if="showSelect"
            style="margin-right: 0.1rem"
          >
            <span>确认</span>
          </el-button>
          <el-button
            type="text"
            @click="showSelectFunc('取消')"
            class="plusicon"
            v-if="showSelect"
            style="margin-right: 0.1rem; color: grey"
          >
            <span>取消</span>
          </el-button>
          <span class="report_msg"
            >以下为可
            <span style="font-weight: bold"> {{ messageinfo }}上报 </span
            >数据</span
          >
        </div>
      </el-col>
      <el-button
        v-if="!showsearch && !showSelect"
        type="primary"
        @click="
          showsearch = true;
          heightValue = 'calc(100vh - 3.8rem)';
        "
        icon="el-icon-search"
        class="plusicon"
        title="筛选"
        style="float: right"
      ></el-button>
      <el-col :span="24" v-else-if="!showSelect">
        <filtercom
          :filterinfo="[
            '所属分厂',
            '所属车间',
            '设备名称',
            '安装地点',
            '运行状态',
            '检验日期',
            '再检日期',
          ]"
          ref="filtercom"
          @searchFunc="searchFunc"
        ></filtercom>
      </el-col>
    </el-row>

    <div class="table-container">
      <el-table
        bordered
        row-class-name="rowstyle"
        :data="paginatedData"
        style="width: 100%; background: transparent"
        :cell-class-name="getCellClassName"
        :height="!showsearch ? 'calc(100vh - 3.3rem)' : 'calc(100vh - 3.3rem)'"
        v-loading="loading"
        :key="showSelect"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="操作" v-if="!showSelect" minWidth="100rem">
          <template #default="scope">
            <!-- <el-button
                v-if="scope.row['运行状态'] != '报废'"
                @click="confirmDeleteRow(scope.row)"
                type="text"
                size="small"
                class="deletebtn"
              >
                删除
              </el-button> -->
            <el-button
              v-if="scope.row['运行状态'] == '报废'"
              @click="editRow(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row['ID'] == null"
              :style="{
                'font-size': '0.175rem',
                'margin-right':
                  scope.row['运行状态'] != '在用' ? '0rem' : '0.125rem',
              }"
            >
              编辑
            </el-button>
            <el-button
              @click="modifyStatus(scope.row)"
              type="text"
              size="small"
              :style="{
                'font-size': '0.175rem',
                'margin-right':
                  scope.row['运行状态'] != '在用' ? '0rem' : '0.125rem',
              }"
            >
              <span v-if="scope.row['运行状态'] == '在用'" style="color: yellow"
                >报废</span
              >
              <span
                v-if="scope.row['运行状态'] == '报废'"
                style="color: #1dc51d"
                >恢复在用</span
              >
            </el-button>
            <el-button
              @click="viewhistory(scope.row)"
              type="text"
              size="small"
              style="
                font-size: 0.175rem;
                color: rgb(212 158 78);
                margin-left: 0;
              "
            >
              历史
            </el-button>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" v-if="showSelect">
        </el-table-column>
        <el-table-column label="上报状态">
          <template #default="scope">
            {{ scope.row["addFlag"] == 1 ? "已上报" : "未上报" }}
          </template>
        </el-table-column>
        <el-table-column
          fit
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
          v-if="column.label != '系统ID' && column.label != 'ID'"
        >
          <template #default="scope">
            <div v-if="!scope.row.editing">
              <div
                v-if="
                  column.prop == '检验报告上传' || column.prop == '报废证明资料'
                "
                @click="showbigimg(scope.row[column.prop])"
              >
                <img
                  :src="scope.row[column.prop]"
                  style="width: 0.5rem"
                  v-if="scope.row[column.prop]"
                />
                <span v-else>未上传</span>
              </div>
              <div v-if="column.prop == '检验日期预报警状态'">
                <img
                  :src="
                    scope.row[column.prop] != 'grey'
                      ? require(`../../../assets/images/${
                          scope.row[column.prop]
                        }light.png`)
                      : require(`../../../assets/images/greenlight.png`)
                  "
                  class="lightimage"
                  :style="
                    scope.row[column.prop] != 'grey'
                      ? ''
                      : 'filter: grayscale(100%)'
                  "
                />
              </div>
              <span
                v-else-if="
                  column.prop != '检验日期预报警状态' &&
                  column.prop != '检验报告上传' &&
                  column.prop != '报废证明资料'
                "
              >
                <span v-if="column.prop.indexOf('日期') >= 0">{{
                  String(scope.row[column.prop]).replace("T00:00:00", "")
                }}</span>
                <span v-else>
                  {{ scope.row[column.prop] }}
                </span>
              </span>
            </div>

            <!-- <div v-else>
                  <el-input
                    v-model="scope.row[column.prop]"
                    
                  ></el-input>
                </div> -->
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="
          $downloadExcel({
            tableData: tabledata,
            title: '设备报废记录',
          })
        "
        class="plusicon"
        size="small"
        >导出数据</el-button
      >
    </div>

    <el-dialog
      :title="operatetitle"
      :visible="addRowDialogVisible"
      :modal="false"
      top="0.8rem"
      :close-on-click-modal="false"
      @close="closeDialog"
    >
      <div class="dialog-content">
        <el-form
          :model="newRow"
          label-position="top"
          ref="newRow"
          :rules="rules_data"
        >
          <el-form-item
            v-for="column in columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            v-if="column.label != '系统ID' && column.prop != 'ID'"
          >
            <div v-if="column.prop == '运行状态'">
              <el-radio-group v-model="newRow[column.prop]" disabled>
                <el-radio
                  v-for="city in checkdata1"
                  :label="city"
                  :key="city"
                  >{{ city }}</el-radio
                >
              </el-radio-group>
            </div>
            <el-select
              v-if="column.prop == '停用类型'"
              v-model="newRow[column.prop]"
              style="width: 8rem"
            >
              <el-option
                v-for="item in deviceKind"
                :label="item"
                :value="item"
                :key="item"
              ></el-option>
            </el-select>
            <el-date-picker
              v-if="column.prop.indexOf('日期') >= 0"
              v-model="newRow[column.prop]"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <div
              v-if="
                column.prop == '检验报告上传' || column.prop == '报废证明资料'
              "
            >
              <Uploadocom
                v-if="!newRow[column.prop]"
                :uploadAction="'/api/function/upload'"
                :showloading2="showloading2"
                @upload="listenUpload"
                @imageshow="(data) => imageshowFunc(data, column.prop)"
                ref="uploadocom"
              ></Uploadocom>
              <div style="width: 1rem" v-else>
                <img
                  :src="newRow[column.prop]"
                  style="width: 1rem; height: 1rem"
                />
                <div style="width: 1rem">
                  <span
                    style="color: #247cc3; cursor: pointer"
                    @click="cancelImg(column.prop)"
                    >取消</span
                  >
                </div>
              </div>
            </div>
            <el-input
              v-else-if="
                column.prop != '停用类型' &&
                column.prop != '炉顶放散阀联锁投入状态' &&
                column.prop != '运行状态' &&
                column.prop.indexOf('日期') < 0
              "
              v-model="newRow[column.prop]"
              :placeholder="'请输入' + column.label"
              style="width: 8rem"
              @change="changeBasic(column.prop)"
              :disabled="check_datas.indexOf(column.prop) < 0"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="addRow('newRow')"
          type="primary"
          :loading="loadingbtn"
          >保存</el-button
        >
        <el-button @click="closeDialog">取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :modal="false"
      title="确认删除"
      :visible.sync="confirmDeleteDialogVisible"
      @close="cancelDelete"
      width="5rem"
    >
      <span>您确定要删除本行？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete">取消</el-button>
        <el-button type="danger" @click="deleteRow(confirmedRow)"
          >确认删除</el-button
        >
      </span>
    </el-dialog>

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

    <el-pagination
      v-if="tableData.length > pageSize"
      class="el-pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, sizes"
      :page-sizes="pageSizes"
      ref="pangination_n"
    />
    <el-dialog
      :modal="false"
      :visible.sync="his_visible"
      title="本设备报废历史数据"
      fullscreen
      custom-class="historydialog"
    >
      <historyDialog
        ref="history"
        :current_info="newRow"
        v-if="his_visible"
      ></historyDialog>
    </el-dialog>
  </div>
</template>

<script>
import Filtercom from "@/views/components/filtercom.vue";
import Uploadocom from "../../components/upload.vue";
import historyDialog from "./scrabDialog.vue";

export default {
  props: ["column", "tabledata", "operate", "historyDialog"],

  components: { Uploadocom, Filtercom, historyDialog },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      pageSizes: [],
      total: 0,
      columns: [],
      addRowDialogVisible: false,
      newRow: {},
      confirmDeleteDialogVisible: false,
      confirmedRow: null,
      value: "",
      loadingbtn: false,
      deviceKind: [
        {
          label: "正常计划停用",
          value: 1,
        },
        {
          label: "非计划临时停用",
          value: 2,
        },
      ],
      deviceKind2: ["已锁", "未锁"],
      showloading2: "show_loading2",
      imgdialog: false,
      currimgsrc: false,
      checkdata1: ["在用", "停用", "报废"],
      checkedData1: "",
      operatetitle: "添加",
      rules_data: {},
      showsearch: false,
      change_base: false,
      loading: false,
      loading_status: false,
      check_datas: [
        "报废日期",
        "停用类型",
        "报废说明",
        "报废证明资料",
        "备注",
        "运行状态",
      ],
      his_visible: false,
      showSelect: false,
      showSelectvalue: [],
      pre_currentPage: 1,
      messageinfo: "",
    };
  },
  methods: {
      showSelectFunc(msg) {
        this.currentPage=1
        this.messageinfo = msg;
        this.$emit("chooseReport", msg);
        this.showSelect = !this.showSelect;
         if(msg=='取消'){
          this.showSelectvalue=[]
         }
        this.$nextTick(() => {
          this.$forceUpdate(); // 确保 Vue 检测到变化
        });
      },
    confirmSelectFunc(msg) {
      this.$functionConfrim(this.showSelectvalue).then((result) => {
        console.log(result);
        if (result.status == "yes") {
          this.$emit("reportInfo", {
            checkevalue: this.showSelectvalue,
            operate: this.messageinfo,
          });
          //   this.$refs.multipleTable.clearSelection();
        }
      });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.showSelectvalue = val;
    },
    viewhistory(row) {
      this.his_visible = true;
      this.newRow = Object.assign({}, row);
    },
    // 点击停用，恢复按钮两种状态
    modifyStatus(row) {
      //   this.loading_status = this.$loading({
      //     lock: false,
      //     text: "更改状态中",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.2)",
      //     target: document.querySelector(".table-container"),
      //     customClass: "status_loading",
      //   });
      this.newRow = JSON.parse(JSON.stringify(row));

      if (row["运行状态"] == "在用") {
        // this.$emit("addinfo", {
        //   rowinfo: this.newRow,
        //   operate: "报废",
        // });
        this.addRowDialogVisible = true;
        //   this.newRow = JSON.parse(JSON.stringify(row));
        this.$nextTick(() => {
          this.newRow = Object.assign({}, row);
          let check = ["报废日期", "报废证明资料", "备注"];
          for (let i = 0; i < check.length; i++) {
            this.newRow[check[i]] = "";
          }
          this.newRow["运行状态"] = "报废";
          this.rules_data = this.$formatFormRules([], this.newRow, {});

          this.operatetitle = "添加报废信息";
        });
      } else if (row["运行状态"] == "报废") {
        this.$emit("deleterow", {
          rowinfo: this.newRow,
          operate: "恢复在用",
        });
      }
    },
    changeBasic(prop) {
      //   console.log(prop);
      if (
        ["所属分厂", "所属车间", "安装地点", "设备名称", "状态"].indexOf(
          prop
        ) >= 0
      ) {
        this.change_base = true;
      }
    },
    searchFunc() {
      let params = Object.assign({}, this.$refs.filtercom.filterparams);
      this.$emit("searchparams", params);
    },
    openAddRowDialog() {
      this.addRowDialogVisible = true;
      this.operatetitle = "添加";
      this.$nextTick(() => {
        this.formatRow();
        this.newRow["运行状态"] = "在用";

        this.rules_data = this.$formatFormRules([], this.newRow, {});
      });
    },
    // 动态设置 pageSizes 根据总数据量
    setPageSizes() {
      const totalItems = this.tableData.length;
      this.pageSizes = [];

      // 动态生成 [10, 20, 30, ...] 直到超过总数据量
      for (let i = 10; i <= totalItems; i += 10) {
        this.pageSizes.push(i);
      }

      // 确保至少有一个默认分页选项（如总数据小于10）
      if (this.pageSizes.length === 0) {
        this.pageSizes.push(10);
      }
    },
    closeDialog() {
      this.addRowDialogVisible = false;
      //   this.operatetitle = "添加";
    },
    cancelImg(column) {
      this.newRow[column] = "";
    },
    imageshowFunc(msg, column) {
      this.newRow[column] = msg;
    },
    showbigimg(src) {
      this.imgdialog = true;
      this.currimgsrc = src;
    },
    // 监听update
    listenUpload() {
      // this.getSAPTable();
    },

    handleCurrentChange(page) {
      // console.log(this.showSelectvalue);
      if (this.showSelectvalue.length) {
        this.$alert("当前页尚有未完成的上报信息，请先完成上报功能", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          // this.pageSize=0
          // console.log(this.$refs.pangination_n.internalCurrentPage);
          this.$nextTick(() => {
            // this.pageSize=10
            this.currentPage = this.pre_currentPage;
            this.$refs.pangination_n.internalCurrentPage = this.currentPage;
            this.$forceUpdate();
          });
          // console.log(this.currentPage,this.pre_currentPage);
        });
      } else {
        this.currentPage = page;
        this.pre_currentPage = page;
      }
    },
    handleSizeChange(size) {
      this.pageSize = size;
    },
    viewDetails(row) {
      console.log("查看详情:", row);
    },
    // 编辑行
    editRow(row) {
      this.addRowDialogVisible = true;
      //   this.newRow = JSON.parse(JSON.stringify(row));
      this.$nextTick(() => {
        this.newRow = Object.assign({}, row);
        this.rules_data = this.$formatFormRules([], this.newRow, {});
        // this.rules_data = {
        //   报废日期: [
        //     {
        //       required: true,
        //       message: "不能为空",
        //       trigger: "change",
        //     },
        //   ],
        // };
      });
      this.operatetitle = "编辑";
      //   console.log(this.newRow);
    },
    saveRow(row) {
      row.editing = false;
      console.log("保存行:", row);
    },
    confirmDeleteRow(row) {
      if (this.tableData.length == 1) {
        this.$message({
          type: "warning",
          message: "只剩一条数据无法删除！",
          //   duration: 0,
          showClose: true,
        });
      } else {
        this.confirmDeleteDialogVisible = true;
        this.confirmedRow = row; // 保存要删除的行
      }
    },
    cancelDelete() {
      this.confirmDeleteDialogVisible = false;
      this.confirmedRow = null; // 清空已确认的行
    },
    deleteRow(row) {
      console.log(row);
      this.$emit("deleterow", { rowinfo: row, operate: "删除" });
    },
    addRow(formname) {
      console.log(this.newRow);
      // console.log(this.$refs[formname])
      this.$refs[formname].validate((valid) => {
        // console.log(valid)
        if (valid) {
          this.$emit("addinfo", {
            rowinfo: this.newRow,
            operate: this.operatetitle,
          });
          this.change_base = false;
        } else {
          this.$message({
            message: "请完成所有必填项！",
            type: "error",
          });
          return false;
        }
      });
    },
    getCellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.age === "橙色预警" && columnIndex === 2) {
        return "orange-warning"; // 特定单元格样式
      } else {
        return "";
      }
    },
    // 初始化新行对象
    formatRow() {
      this.newRow = this.columns.reduce((obj, column) => {
        obj[column.prop] = "";
        return obj;
      }, {});
    },
    validateNumber(rule, value, callback) {
      const number = parseInt(value, 10);
      if (number) {
        callback();
      }
    },
  },
  computed: {
    paginatedData() {
      this.columns = this.column;
      this.tableData = this.tabledata.map((item) => ({
        ...item,
      }));
      this.total = this.tableData.length;
      this.setPageSizes();

      const start = (this.currentPage - 1) * this.pageSize;
      return this.tableData.slice(start, start + this.pageSize);
    },
  },
  mounted() {},
};
</script>

<style lang="less"></style>
