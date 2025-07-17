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
    <el-row type="flex">
      <el-button
        type="primary"
        @click="openAddRowDialog"
        icon="el-icon-plus"
        class="plusicon"
        v-if="!showSelect"
        >添加信息</el-button
      >
      <!-- <el-button
        type="text"
        @click="showSelectFunc"
        class="plusicon" 
        v-if="!showSelect"
      >
        <span>上报</span>
      </el-button> -->
      <!-- <div v-if="showSelect" style="width: fit-content">
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
          @click="showSelectFunc"
          class="plusicon"
          v-if="showSelect"
          style="margin-right: 0.1rem; color: grey"
        >
          <span>取消</span>
        </el-button>
      </div> -->
    </el-row>
    <div class="table-container">
      <el-table
        bordered
        row-class-name="rowstyle"
        :data="paginatedData"
        style="width: 100%; background: transparent"
        :cell-class-name="getCellClassName"
        height="calc(100vh - 3.2rem)"
        @selection-change="handleSelectionChange"
        :key="showSelect"
      >
        <el-table-column label="操作" v-if="!showSelect" minWidth="110rem">
          <template #default="scope">
            <el-button
              v-if="operate[1] == 'delete'"
              @click="confirmDeleteRow(scope.row)"
              type="text"
              size="small"
              style="color: red; font-size: 0.175rem"
            >
              删除
            </el-button>
            <el-button
              @click="editRow(scope.row)"
              type="text"
              size="small"
              style="font-size: 0.175rem"
            >
              编辑
            </el-button>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" v-if="showSelect">
        </el-table-column>
        <!-- <el-table-column label="上报状态">
          <template #default="scope">
            {{ scope.row["addFlag"] == 1 ? "已上报" : "未上报" }}
          </template>
        </el-table-column> -->
        <el-table-column
          fit
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
          v-if="column.label != 'ID'"
        >
          <template #default="scope">
            <div v-if="!scope.row.editing">
              <div
                v-if="
                  column.prop == '检验报告上传' ||
                  column.prop == '停用/报废证明'
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
                  column.prop != '停用/报废证明'
                "
              >
                <span v-if="column.prop.indexOf('日期') >= 0">{{
                  scope.row[column.prop].replace("T00:00:00", "")
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
          $downloadExcel({ tableData: tabledata, title: '企业自动化建设' })
        "
        class="plusicon"
        size="small"
        >导出数据</el-button
      >
    </div>

    <el-dialog
      :title="operatetitle"
      :visible.sync="addRowDialogVisible"
      :modal="false"
      top="0.8rem"
      v-if="operate[2] == 'add'"
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
            <div v-if="column.prop == '状态'">
              <el-radio-group v-model="newRow[column.prop]">
                <el-radio
                  v-for="city in checkdata1"
                  :label="city"
                  :key="city"
                  >{{ city }}</el-radio
                >
              </el-radio-group>
            </div>
            <el-select
              v-if="column.prop == '类型'"
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
              v-if="column.prop.indexOf('时间') >= 0"
              v-model="newRow[column.prop]"
              type="year"
              placeholder="选择时间"
              value-format="yyyy"
            >
            </el-date-picker>
            <div v-if="column.prop == '传输方式'">
              <el-radio-group v-model="newRow[column.prop]">
                <el-radio
                  v-for="city in checkdata1"
                  :label="city"
                  :key="city"
                  >{{ city }}</el-radio
                >
              </el-radio-group>
            </div>
            <el-switch
              v-if="column.prop == '是否有配套系统'"
              v-model="newRow[column.prop]"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
            <el-input
              v-else-if="
                column.prop.indexOf('时间') < 0 &&
                column.prop != '传输方式' &&
                column.prop != '类型'
              "
              v-model="newRow[column.prop]"
              :placeholder="'请输入' + column.label"
              style="width: 8rem"
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
        <el-button @click="resetform">取消</el-button>
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
  </div>
</template>

<script>
import Uploadocom from "../../components/upload.vue";
export default {
  props: ["column", "tabledata", "operate"],

  components: { Uploadocom },
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
      showloading2: "show_loading2",
      imgdialog: false,
      currimgsrc: false,
      checkedData1: "",
      operatetitle: "添加",
      rules_data: {},
      checkdata1: [
        "可通过TCP/IP输出数据",
        "可通过OPC通讯方式被读取",
        "可通过Modbus输出数据",
      ],
      showSelect: false,
      showSelectvalue: [],
      pre_currentPage: 1,
    };
  },
  methods: {
    confirmSelectFunc() {
      this.$functionConfrim(this.showSelectvalue).then((result) => {
        console.log(result);
        if (result == "yes") {
          this.$refs.multipleTable.clearSelection();
        }
      });
    },
    showSelectFunc() {
      this.showSelect = !this.showSelect;
      this.$nextTick(() => {
        this.$forceUpdate(); // 确保 Vue 检测到变化
      });
    },
    handleSelectionChange(val) {
      console.log(val);
      this.showSelectvalue = val;
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
    resetform() {
      this.addRowDialogVisible = false;
      this.operatetitle = "添加";
      this.initialform();
    },
    initialform() {
      this.$refs.newRow.resetFields();
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
      this.newRow = JSON.parse(JSON.stringify(row));
      console.log(row);
      console.log(row["是否有配套系统"] == "是" ? 1 : 0);
      this.newRow["是否有配套系统"] = row["是否有配套系统"] == "是" ? 1 : 0;
      console.log(this.newRow);

      this.operatetitle = "编辑";
      // row.editing = true;
    },
    saveRow(row) {
      row.editing = false;
      console.log("保存行:", row);
    },
    confirmDeleteRow(row) {
      if (this.paginatedData.length == 1) {
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
      // const index = this.tableData.indexOf(row);
      console.log(row);
      this.$emit("deleterow", { rowinfo: row, operate: "删除" });
      // if (index > -1) {
      //   this.tableData.splice(index, 1);
      //   this.total = this.tableData.length; // 更新总数
      // }
      // this.cancelDelete(); // 关闭确认对话框
    },
    openAddRowDialog() {
      this.addRowDialogVisible = true;
      this.$nextTick(() => {
        this.formatRow();
        this.initialform();
      });
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
      this.newRow["是否有配套系统"] = "0";
    },
  },
  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.tableData.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.columns = this.column;
    this.tableData = this.tabledata.map((item) => ({
      ...item,
    }));
    this.total = this.tableData.length;
    this.setPageSizes();
    this.formatRow();

    this.rules_data = this.$formatFormRules([], this.newRow, {
      其他情况说明: {
        required: false,
      },
    });
    // console.log(this.rules_data);
  },
};
</script>

<style lang="less"></style>
