<template>
  <div>
    <div class="table-container">
      <el-table
        bordered
        row-class-name="rowstyle"
        :data="paginatedData"
        style="width: 100%; background: transparent"
        :cell-class-name="getCellClassName"
      >
        <el-table-column
          fit
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
          v-if="column.label != '系统ID'"
        >
          <template #default="scope">
            <div v-if="!scope.row.editing">
              {{ scope.row[column.prop] }}
            </div>
            <div v-else>
              <el-input v-model="scope.row[column.prop]"></el-input>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="150px"
          v-if="operate[0] && operate[1]"
        >
          <template #default="scope">
            <el-button
              v-if="operate[0] == 'edit'"
              @click="
                scope.row.editing ? saveRow(scope.row) : editRow(scope.row)
              "
              type="text"
            >
              {{ scope.row.editing ? "保存" : "编辑" }}
            </el-button>
            <el-button
              v-if="operate[1] == 'delete'"
              @click="confirmDeleteRow(scope.row)"
              type="text"
              style="color: red"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="添加"
      :visible.sync="addRowDialogVisible"
      :modal="false"
      top="0.8rem"
      v-if="operate[2] == 'add'"
    >
      <div class="dialog-content">
        <el-form :model="newRow" label-position="top">
          <el-form-item
            v-for="column in columns"
            :key="column.prop"
            :label="column.label"
            v-if="column.label != '系统ID'"
          >
            <el-select
              v-if="
                column.prop == '炉顶工作压力' ||
                column.prop == '炉顶放散阀联锁投入状态'
              "
              v-model="newRow[column.prop]"
              style="width: 8rem"
            >
              <el-option :value="1" :label="'记录'"></el-option>
              <el-option :value="0" :label="'不记录'"></el-option>
            </el-select>
            <el-input
              v-else
              v-model="newRow[column.prop]"
              :placeholder="'请输入' + column.label"
              style="width: 8rem"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRow" type="primary" :loading="loadingbtn"
          >保存</el-button
        >
        <el-button @click="addRowDialogVisible = false">取消</el-button>
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
    <el-pagination
      v-if="tableData.length > pageSize"
      class="el-pagin"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, prev, pager, next, sizes"
      :page-sizes="[20, 40, 60, 80, 100]"
    />
  </div>
</template>

<script>
export default {
  props: ["column", "tabledata", "operate"],
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      total: 0,
      columns: [],
      addRowDialogVisible: false,
      newRow: {},
      confirmDeleteDialogVisible: false,
      confirmedRow: null,
      value: "",
      loadingbtn: false,
    };
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
      editing: false,
    }));
    this.total = this.tableData.length;
    // 初始化新行对象
    this.newRow = this.columns.reduce((obj, column) => {
      obj[column.prop] = "";
      return obj;
    }, {});
  },
  methods: {
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
    editRow(row) {
      row.editing = true;
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
      const index = this.tableData.indexOf(row);
      if (index > -1) {
        this.tableData.splice(index, 1);
        this.total = this.tableData.length; // 更新总数
      }
      this.cancelDelete(); // 关闭确认对话框
    },
    openAddRowDialog() {
      this.addRowDialogVisible = true;
    },
    addRow() {
      // console.log(this.newRow)
      // console.log(Object.values(this.newRow).join(','))
      this.$emit("addinfo", this.newRow);
      // this.tableData.push({ ...this.newRow, editing: false });
      // this.total = this.tableData.length; // 更新总数
      // this.newRow = this.columns.reduce((obj, column) => {
      //   obj[column.prop] = '';
      //   return obj;
      // }, {}); // 重置新行对象
      // this.addRowDialogVisible = false; // 关闭弹窗
    },
    getCellClassName({ row, column, rowIndex, columnIndex }) {
      if (row.age === "橙色预警" && columnIndex === 2) {
        return "orange-warning"; // 特定单元格样式
      } else {
        return "";
      }
    },
  },
};
</script>

<style lang="less">
.orange-warning {
  color: orange !important; /* 设置橙色预警的字体颜色 */
}
/* 添加样式（如需要） */
.table-container {
  //   max-height: 500px; /* 设置最大高度以支持滚动 */
  //   overflow-y: auto; /* 使其可滚动 */
}

.dialog-content {
  max-height: 60vh; /* 最大高度为视口的60% */
  overflow-y: auto; /* 超出部分可滚动 */
}

.rowstyle {
  background-color: #06253aad !important;
  color: white;
  &:hover {
    background-color: #06253aad !important;
    color: white;
  }
}
.el-table tr {
  background-color: #06253aad !important;
  color: white;
}
.el-table th.el-table__cell {
  background-color: #2d527e !important;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #294e78 !important;
  color: white;
}
.el-table td.el-table__cell,
.el-table th.el-table__cell.is-leaf,
.el-table--border::after,
.el-table--group::after,
.el-table::before {
  border-bottom: 1px solid #425a92 !important;
}
.el-pagination__total {
  color: white !important;
}
.el-pagination button:disabled,
.el-pager li,
.el-pagination .btn-next,
.el-pagination .btn-prev,
.el-input__inner,
.el-pagination__jump {
  background: transparent !important;
  color: white !important;
}
.el-pager li.active {
  color: #409eff !important;
  cursor: default;
  background: #0d59a0 !important;
}
</style>
