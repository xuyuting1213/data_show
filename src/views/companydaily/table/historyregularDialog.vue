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
    <el-row :type="!showsearch ? 'flex' : ''" justify="end">
      <!-- <el-col>
          <el-button
            type="primary"
            @click="openAddRowDialog"
            icon="el-icon-plus"
            class="plusicon"
            >添加信息</el-button
          >
        </el-col> -->
      <!-- <el-button
        v-if="!showsearch"
        type="primary"
        @click="showsearch = true"
        icon="el-icon-search"
        class="plusicon"
        title="筛选"
      ></el-button> -->
      <!-- <el-col :span="24" v-else>
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
      </el-col> -->
    </el-row>
    <div class="table-container">
      <el-table
        bordered
        row-class-name="rowstyle"
        :data="tabledata.data"
        style="width: 100%; background: transparent"
        :cell-class-name="getCellClassName"
        :height="!showsearch ? 'calc(100vh - 3.3rem)' : 'calc(100vh - 3.3rem)'"
        v-loading="loading"
      >
        <el-table-column label="操作" minWidth="100rem">
          <template #default="scope">
            <el-button
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
            <!-- <el-button
              @click="openAddRowDialog(scope.row)"
              type="text"
              size="small"
              style="font-size: 0.175rem; margin-left: 0; color: #00c93b"
            >
              点检
            </el-button>
            <el-button
              @click="viewhistory(scope.row)"
              type="text"
              size="small"
              style="font-size: 0.175rem; color: #bfd44e"
            >
              历史
            </el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          fit
          v-for="(column, index) in tabledata.columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
          v-if="column.label != '系统ID' && column.label != 'ID'"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <div v-if="!scope.row.editing">
              <div
                v-if="
                  column.prop == '检验报告上传' ||
                  column.prop == '停用证明' ||
                  column.prop == '报废证明'
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
              <div
                v-if="column.prop == '检验报告'"
                @click="showbigimg(scope.row[column.prop])"
              >
                <img
                  :src="scope.row[column.prop]"
                  style="width: 0.5rem"
                  v-if="
                    scope.row[column.prop] &&
                    ['jpg', 'png', 'jpeg'].indexOf(
                      scope.row[column.prop].split('.')[
                        scope.row[column.prop].split('.').length - 1
                      ]
                    ) >= 0
                  "
                />
                <video
                  v-if="
                    scope.row[column.prop] &&
                    ['mov', 'avi', 'mkv'].indexOf(
                      scope.row[column.prop].split('.')[
                        scope.row[column.prop].split('.').length - 1
                      ]
                    ) >= 0
                  "
                  controls
                  class="video-player"
                  :muted="true"
                  style="height: 0.5rem; width: 0.5rem%"
                >
                  <source :src="scope.row[column.prop]" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <span v-else-if="!scope.row[column.prop]">未上传</span>
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
                  column.prop != '停用证明' &&
                  column.prop != '报废证明' &&
                  column.prop != '检验报告'
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
    </div>

    <el-dialog
      :title="operatetitle"
      :visible.sync="addRowDialogVisible"
      :modal="false"
      top="0.8rem"
    >
      <div class="dialog-content">
        <el-form
          :model="newRow"
          label-position="top"
          ref="newRow"
          :rules="rules_data"
        >
          <el-form-item
            v-for="(column, coindex) in tabledata.columns"
            :key="column.prop"
            :label="column.label"
            :prop="column.prop"
            v-if="
              column.label != 'ID' &&
              column.label != '系统ID' &&
              column.prop != '检验日期预报警状态' &&
              column.label != '停用证明' &&
              column.label != '报废证明'
            "
          >
            <div v-if="column.prop == '运行状态'">
              <el-radio-group
                v-model="newRow[column.prop]"
                :disabled="check_datas.indexOf(column.prop) >= 0"
              >
                <el-radio
                  v-for="city in checkdata1"
                  :label="city"
                  :key="city"
                  >{{ city }}</el-radio
                >
              </el-radio-group>
            </div>
            <el-select
              v-if="column.prop == '检验类型'"
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
            <div v-if="column.prop == '检验报告'">
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
                column.prop != '运行状态' &&
                column.prop != '检验报告' &&
                column.prop != '检验类型'
              "
              v-model="newRow[column.prop]"
              :placeholder="'请输入' + column.label"
              style="width: 8rem"
              :disabled="check_datas.indexOf(column.prop) >= 0"
            ></el-input>
            <div
              v-if="column.prop == '备注' && operatetitle == '编辑'"
              style="
                font-size: 0.25rem;
                font-weight: bold;
                margin-top: 0.4rem;
                color: #007bff;
              "
            >
              以下信息请至 企业日常管理数据页面 进行编辑
            </div>
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
    <!-- <el-dialog
      :modal="false"
      :visible.sync="his_visible"
      title="本设备历史数据"
      fullscreen
    >
      <historyDialog
        ref="history"
        :current_info="newRow"
        v-if="his_visible"
        pagetitle="点检记录"
      ></historyDialog>
    </el-dialog> -->
  </div>
</template>

<script>
import Filtercom from "@/views/components/filtercom.vue";
import Uploadocom from "../../components/upload.vue";
import api from "@/api/api";

export default {
  props: ["current_info"],

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
      deviceKind: [
        "定期检验",
        "定期探伤",
        "A类（定期校验）",
        "B类（定期校准）",
      ],
      showloading2: "show_loading2",
      imgdialog: false,
      currimgsrc: false,
      checkdata1: ["在用", "停用", "报废"],
      checkedData1: "",
      operatetitle: "添加设备点检记录",
      rules_data: {
        检验日期: [
          {
            required: true,
            message: "不能为空",
            trigger: "change",
          },
        ],
        再检验日期: [
          {
            required: true,
            message: "不能为空",
            trigger: "change",
          },
        ],
      },
      showsearch: false,
      loading: false,
      check_datas: [
        "所属分厂",
        "所属车间",
        "设备名称",
        "企业内部编号",
        "安装地点",
        "运行状态",
        "设备编码",
      ],
      his_visible: false,
      tabledata: {
        data: [],
        columns: [],
      },
    };
  },
  methods: {
    viewhistory(row) {
      this.his_visible = true;
      this.newRow = Object.assign({}, row);
    },
    searchFunc() {
      let params = Object.assign({}, this.$refs.filtercom.filterparams);
      this.getdata(params);
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
      this.operatetitle = "添加设备点检记录";
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
      this.$nextTick(() => {
        this.newRow = Object.assign({}, row);
        // this.rules_data = this.$formatFormRules(
        //   [],
        //   this.newRow,
        //   this.rulesCreate()
        // );
      });
      this.operatetitle = "编辑";
    },
    saveRow(row) {
      row.editing = false;
      console.log("保存行:", row);
    },
    deleteRow(row) {
      api
        .deleteRegularcheck({
          system_id: row.系统ID,
          record_id: row.ID,
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
          this.addRowDialogVisible = false;
          this.confirmDeleteDialogVisible = false;
          this.getdata();
        })
        .catch((err) => {
          this.$message({
            message: "删除失败稍后重试！",
            type: "error",
          });
        });
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
    rulesCreate() {
      let obj = {};
      this.check_datas.map(
        (item) =>
          (obj[item] = {
            required: false,
          })
      );
      return obj;
    },
    openAddRowDialog(row) {
      this.addRowDialogVisible = true;
      this.operatetitle = "添加设备点检记录";
      this.$nextTick(() => {
        this.formatRow();
        this.newRow = Object.assign({}, row);
        this.newRow["运行状态"] = "在用";
      });
    },
    addRow(formname) {
      // console.log(this.newRow)
      // console.log(this.$refs[formname])
      this.loadingbtn = true;
      this.$refs[formname].validate((valid) => {
        // console.log(valid)
        if (valid) {
          //   this.$emit("addinfo", {
          //     rowinfo: this.newRow,
          //     operate: this.operatetitle,
          //   });
          let current_newinfo = JSON.parse(JSON.stringify(this.newRow));
          let base_pa = this.$assignValues(undefined, current_newinfo);
          delete base_pa[1].系统ID;
          delete base_pa[1].ID;
          delete base_pa[1].报废证明;
          delete base_pa[1].停用证明;
          delete base_pa[1].检验日期预报警状态;
          delete base_pa[1].设备编码;
          let params = {
            record_id: this.newRow.ID,
            system_id: this.newRow.系统ID,
            regula_check_data: JSON.stringify(Object.values(base_pa[1])),
          };

          api.updateRegularcheck({ ...params }).then((res) => {
            if (res.data.code == 200) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.loadingbtn = false;
              this.addRowDialogVisible = false;
              this.getdata();
            } else {
              this.$message({
                message: "失败稍后重试！",
                type: "error",
              });
            }
            this.loadingbtn = false;
          });
        } else {
          this.$message({
            message: "请完成所有必填项！",
            type: "error",
          });
          this.loadingbtn = false;

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
    getdata() {
      //   console.log({ filter: [{ ...params }] });
      this.$set(this.tabledata, "data", []);
      this.loading = true;

      api
        .OnedeviceRegularcheck({ system_id: this.current_info.系统ID })
        .then((res) => {
          //   console.log(res.data.data);
          if (res.data.code == "200" && res.data.data[0]) {
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

          this.loading = false;
        });
    },
  },
  computed: {
    paginatedData() {
      //   this.columns = this.column;
      //   this.tableData = this.tabledata.map((item) => ({
      //     ...item,
      //   }));
      //   this.total = this.tableData.length;
      //   this.setPageSizes();

      const start = (this.currentPage - 1) * this.pageSize;
      return this.tabledata.data.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.getdata();
  },
};
</script>

<style lang="less"></style>
