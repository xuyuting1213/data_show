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
    <el-row type="flex" justify="space-between">
      <el-col style="width: fit-content" v-if="!showSelect">
        <el-button
          type="primary"
          @click="openAddRowDialog"
          icon="el-icon-plus"
          class="plusicon"
          style="margin-right: 0.1rem"
          >添加信息</el-button
        >
      </el-col>
      <el-col>
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
        <div v-if="showSelect" style="width: fit-content">
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
        @click="showsearch = true"
        icon="el-icon-search"
        class="plusicon"
        title="筛选"
      ></el-button>
      <el-col
        :span="20"
        style="display: flex; justify-content: end"
        v-else-if="!showSelect"
      >
        <filtercom
          :filterinfo="[
            '所属分厂',
            '所属车间',
            '设备名称',
            '安装地点',
            '运行状态',
          ]"
          ref="filtercom"
          @searchFunc="searchFunc"
        >
        </filtercom>
        <!-- <el-button
          type="primary"
          @click="searchFunc"
          icon="el-icon-search"
          class="plusicon"
          >查询</el-button
        > -->
      </el-col>
    </el-row>
    <div class="table-container" :style="{ height: heightValue }">
      <el-table
        bordered
        row-class-name="rowstyle"
        :data="paginatedData"
        style="width: 100%; background: transparent"
        :cell-class-name="getCellClassName"
        height="100%"
        v-loading="loading"
        :key="showSelect"
        @selection-change="handleSelectionChange"
        ref="multipleTable"
      >
        <el-table-column label="操作" v-if="!showSelect" minWidth="90rem">
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
                v-if="column.prop == '报废材料'"
                @click="showbigimg(scope.row[column.prop])"
              >
                <img
                  :src="scope.row[column.prop]"
                  style="width: 0.5rem"
                  v-if="scope.row[column.prop]"
                />
                <span v-else>未上传</span>
              </div>
              <span
                v-else-if="
                  column.prop != '检验报告上传' && column.prop != '报废证明'
                "
              >
                <span v-if="column.prop.indexOf('日期') >= 0">{{
                  scope.row[column.prop].replace("T00:00:00", "")
                }}</span>
                <span v-else>
                  <span v-if="column.prop == '切断阀类型'">
                    {{
                      formatShowData(scope.row[column.prop], "gpdShutoffType")
                    }}
                  </span>
                  <span v-if="column.prop == '眼镜阀类型'">
                    {{
                      formatShowData(scope.row[column.prop], "gpdGoggleType")
                    }}
                  </span>
                  <span v-if="column.prop == '眼镜阀驱动方式'">
                    {{
                      formatShowData(
                        scope.row[column.prop],
                        "gpdGoggleDrivemode"
                      )
                    }}
                  </span>
                  <span
                    v-else-if="
                      column.prop != '切断阀类型' &&
                      column.prop != '眼镜阀类型' &&
                      column.prop != '眼镜阀驱动方式'
                    "
                  >
                    {{ scope.row[column.prop] }}
                  </span>
                </span>
              </span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        type="primary"
        @click="
          $downloadExcel({
            tableData: tabledata,
            title: '煤气设施（管道）眼镜阀组合式隔断装置',
          })
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
      :close-on-click-modal="false"
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
            v-if="
              column.label != '系统ID' &&
              column.label != 'ID' &&
              column.prop != '检验日期预报警状态' &&
              column.prop != '报废证明'
            "
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
              v-if="column.prop == '切断阀类型'"
              v-model="newRow[column.prop]"
              style="width: 8rem"
            >
              <el-option
                v-for="item in gpdShutoffType"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
            <el-select
              v-if="column.prop == '眼镜阀类型'"
              v-model="newRow[column.prop]"
              style="width: 8rem"
            >
              <el-option
                v-for="item in gpdGoggleType"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
            <el-select
              v-if="column.prop == '眼镜阀驱动方式'"
              v-model="newRow[column.prop]"
              style="width: 8rem"
            >
              <el-option
                v-for="item in gpdGoggleDrivemode"
                :label="item.label"
                :value="item.value"
                :key="item.label"
              ></el-option>
            </el-select>
            <!-- <div v-if="column.prop == '报废证明'">
              <Uploadocom
                v-if="newRow[column.prop] == ''"
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
            </div> -->
            <el-date-picker
              v-if="column.prop.indexOf('日期') >= 0"
              v-model="newRow[column.prop]"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            >
            </el-date-picker>
            <el-input
              v-else-if="
                column.prop != '切断阀类型' &&
                column.prop != '报废证明' &&
                column.prop != '运行状态' &&
                column.prop != '眼镜阀类型' &&
                column.prop != '眼镜阀驱动方式'
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
import Filtercom from "@/views/components/filtercom.vue";
import Uploadocom from "../../components/upload.vue";
export default {
  props: [
    "column",
    "tabledata",
    "operate",
    "gpdShutoffType",
    "gpdGoggleType",
    "gpdGoggleDrivemode",
  ],

  components: { Uploadocom, Filtercom },
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
      deviceKind: ["蝶阀", "闸阀", "球阀", "无"],
      deviceKind2: ["扇形", "敞开式", "封闭式"],
      deviceKind3: ["电动", "液压", "气动"],
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
      showSelect: false,
      showSelectvalue: [],
      pre_currentPage: 1,
      heightValue: "calc(100vh - 3.2rem)",
      messageinfo: "",
    };
  },
  methods: {
    formatShowData(row, name) {
      //   console.log(row, name);
      //   console.log(this.gtType);
      if (this[name].find((info) => info.value == row)) {
        return this[name].find((info) => info.value == row).label;
      }
    },
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
    searchFunc() {
      let params = Object.assign({}, this.$refs.filtercom.filterparams);
      console.log(params);

      this.$emit("searchparams", params);
    },
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
      //   this.newRow = JSON.parse(JSON.stringify(row));
      this.$nextTick(() => {
        this.newRow = JSON.parse(JSON.stringify(row));
        this.rules_data = this.$formatFormRules([], this.newRow, {});
      });
      this.operatetitle = "编辑";
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
      this.operatetitle = "添加";
      this.$nextTick(() => {
        this.formatRow();
        this.newRow["运行状态"] = "在用";

        this.rules_data = this.$formatFormRules([], this.newRow, {});
      });
    },
    addRow(formname) {
      // console.log(this.newRow)
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
      //   this.rules_data = this.$formatFormRules(["规格（t）"], this.newRow);

      const start = (this.currentPage - 1) * this.pageSize;
      return this.tableData.slice(start, start + this.pageSize);
    },
  },
  mounted() {},
};
</script>

<style lang="less"></style>
