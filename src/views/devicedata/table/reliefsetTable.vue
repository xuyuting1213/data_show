<template>
    <div>
        <el-row type="flex" justify="end">
            <!-- <el-col :span="4">
        <el-button
          type="primary"
          @click="openAddRowDialog"
          icon="el-icon-plus"
          class="plusicon"
          >添加信息</el-button
        >
      </el-col> -->
            <!-- <el-button v-if="!showsearch" type="primary" @click="showsearch = true" icon="el-icon-search"
                class="plusicon" title="筛选"></el-button>
            <el-col :span="20" style="display: flex; justify-content: end" v-else>
                <filtercom :filterinfo="[
            '所属分厂',
            '所属车间',
            '设备名称',
            '安装地点',
            '运行状态',
          ]" ref="filtercom" @searchFunc="searchFunc"></filtercom>
            </el-col> -->
        </el-row>
        <div class="machineTable">
            <img src="../../../assets/images/loading.gif" class="loadgif" id="show_loading2" />

            <p>正在上传报告。。。</p>
        </div>
        <div class="table-container">
            <el-table bordered row-class-name="rowstyle" :data="paginatedData"
                style="width: 100%; background: transparent" :cell-class-name="getCellClassName"
                height="calc(100vh - 3.2rem)" v-loading="loading">
                <el-table-column label="操作" v-if="operate[0] || operate[1]" minWidth="100rem">
                    <template #default="scope">
                        <!-- <el-button
              v-if="operate[1] == 'delete'"
              @click="confirmDeleteRow(scope.row)"
              type="text"
              size="small"
              style="color: red; font-size: 0.175rem"
            >
              删除
            </el-button> -->
                        <el-button @click="editRow(scope.row)" type="text" size="small" style="font-size: 0.175rem">
                            编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column fit v-for="(column, index) in columns.slice(0, 8)" :key="index" :prop="column.prop"
                    :label="column.label" :sortable="column.sortable"
                    v-if="column.label != '系统ID' && column.label != 'ID'">
                    <template #default="scope">
                        <span>
                            {{ scope.row[column.prop] }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column fit :key="'高炉炉顶放散阀'" :prop="'高炉炉顶放散阀'" :label="'高炉炉顶放散阀'">
                    <el-table-column fit v-for="(column, index) in columns.slice(8)" :key="index" :prop="column.prop"
                        :label="column.label" :sortable="column.sortable">
                        <template #default="scope">
                            <span>
                                {{ scope.row[column.prop] }}
                            </span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-button type="primary" @click="
          $downloadExcel({
            tableData: tabledata,
            title: '高炉生产过程炉顶放散阀联锁放散压力设定',
          })
        " class="plusicon" size="small">导出数据</el-button>
        </div>

        <el-dialog :title="operatetitle" :visible.sync="addRowDialogVisible" :modal="false" top="0.8rem"
            v-if="operate[2] == 'add'" :showClose="false">
            <div class="dialog-content">
                <el-form :model="newRow" label-position="top" ref="newRow" :rules="rules_data">
                    <el-form-item v-for="column in columns" :key="column.prop" :label="column.label"
                        :prop="column.label" v-if="
              column.label != '系统ID' &&
              column.label != 'ID' &&
              column.prop != '检验/校准日期预报警状态'
            ">
                        <div v-if="column.prop == '运行状态'">
                            <el-radio-group v-model="newRow[column.prop]" disabled>
                                <el-radio v-for="city in checkdata1" :label="city" :key="city">{{ city }}</el-radio>
                            </el-radio-group>
                        </div>
                        <el-select v-if="column.prop == '检验/校准类型'" v-model="newRow[column.prop]" style="width: 8rem">
                            <el-option v-for="item in deviceKind" :label="item" :value="item" :key="item"></el-option>
                        </el-select>
                        <div v-if="
                column.prop == '检验/校准报告（标签）' ||
                column.prop == '停用证明资料'
              ">
                            <Uploadocom v-if="newRow[column.prop] == ''" :uploadAction="'/api/function/upload'"
                                :showloading2="showloading2" @upload="listenUpload"
                                @imageshow="(data) => imageshowFunc(data, column.prop)" ref="uploadocom"></Uploadocom>
                            <div style="width: 1rem" v-else>
                                <img :src="newRow[column.prop]" style="width: 1rem; height: 1rem" />
                                <div style="width: 1rem">
                                    <span style="color: #247cc3; cursor: pointer"
                                        @click="cancelImg(column.prop)">取消</span>
                                </div>
                            </div>
                        </div>
                        <el-date-picker v-if="column.prop.indexOf('日期') >= 0" v-model="newRow[column.prop]" type="date"
                            placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                        <el-input v-else-if="
                column.prop != '检验/校准类型' &&
                column.prop != '检验/校准报告（标签）' &&
                column.prop != '运行状态' &&
                column.prop != '停用证明资料'
              " v-model="newRow[column.prop]" :placeholder="'请输入' + column.label" style="width: 8rem"
                            :disabled="check_datas.indexOf(column.prop) >= 0"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRow('newRow')" type="primary" :loading="loadingbtn">保存</el-button>
                <el-button @click="resetform">取消</el-button>
            </span>
        </el-dialog>

        <el-dialog :modal="false" title="确认删除" :visible.sync="confirmDeleteDialogVisible" @close="cancelDelete"
            width="5rem">
            <span>您确定要删除本行？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDelete">取消</el-button>
                <el-button type="danger" @click="deleteRow(confirmedRow)">确认删除</el-button>
            </span>
        </el-dialog>

        <el-dialog :modal="false" title="文件查看" :visible.sync="imgdialog" @close="imgdialog = false"
            custom-class="imgdialog" top="1rem">
            <div style="width: 100%">
                <img :src="currimgsrc" style="width: 100%" />
            </div>
        </el-dialog>

        <el-pagination v-if="tableData.length > pageSize" class="el-pagin" @size-change="handleSizeChange"
            @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="total"
            layout="total, prev, pager, next, sizes" :page-sizes="pageSizes" ref="pangination_n" />
    </div>
</template>

<script>
import Filtercom from "@/views/components/filtercom.vue";
import Uploadocom from "../../components/upload.vue";
import { assignValues_special, isObjectEmpty } from "@/api/globalparams";

export default {
    props: ["column", "tabledata", "operate"],

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
            deviceKind: ["定期检验", "定期校准"],
            showloading2: "show_loading2",
            imgdialog: false,
            currimgsrc: false,
            checkdata1: ["在用", "停用", "报废"],
            checkedData1: "",
            operatetitle: "添加",
            rulesNumber: {
                number: [
                    { required: true, message: "请输入一个数字", trigger: "blur" },
                    { validator: this.validateNumber, trigger: "blur" },
                ],
            },
            rules_data: {},
            showsearch: false,
            change_base: false,
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
            write_flag: false,
        };
    },
    methods: {
        searchFunc() {
            let params = Object.assign({}, this.$refs.filtercom.filterparams);
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
        validateNumber(rule, value, callback) {
            const number = parseInt(value, 10);
            if (!number || number < 1 || number > 12) {
                callback(new Error("请输入 1 到 12 之间的数字"));
            } else {
                callback();
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
            //   if (this.showSelectvalue.length) {
            //     this.$alert("当前页尚有未完成的上报信息，请先完成上报功能", "提示", {
            //       confirmButtonText: "确定",
            //       type: "warning",
            //     }).then(() => {
            //       // this.pageSize=0
            //       // console.log(this.$refs.pangination_n.internalCurrentPage);
            //       this.$nextTick(() => {
            //         // this.pageSize=10
            //         this.currentPage = this.pre_currentPage;
            //         this.$refs.pangination_n.internalCurrentPage = this.currentPage;
            //         this.$forceUpdate();
            //       });
            //       // console.log(this.currentPage,this.pre_currentPage);
            //     });
            //   } else {
            this.currentPage = page;
            this.pre_currentPage = page;
            //   }
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
            this.write_flag = false;
            console.log(row);
            //   this.newRow = JSON.parse(JSON.stringify(row));
            // assignValues_special函数主要是用来判断当前行在点击之前是否都为空
            let flag_p1 = assignValues_special(undefined, row);
            let infoparam = JSON.parse(JSON.stringify(flag_p1[1]));
            delete infoparam.系统ID;
            this.write_flag = isObjectEmpty(infoparam);
            this.$nextTick(() => {
                this.newRow = JSON.parse(JSON.stringify(row));
                for (let i in row) {
                    if (i.indexOf("图片") >= 0) {
                        this.newRow[i] = row[i] ? row[i].split("|") : [];
                    }
                }
                this.operatetitle = "编辑";
            });
            //   console.log(this.newRow);
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
            //   this.operatetitle = "添加";
            this.$nextTick(() => {
                this.formatRow();
                this.newRow["运行状态"] = "在用";
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
                        write_flag: this.write_flag,
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
        formatRow() {
            // 初始化新行对象
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

            const start = (this.currentPage - 1) * this.pageSize;
            setTimeout(() => {
                this.heightvalue = "calc(100vh - 3.2rem)";
            }, 2000);
            return this.tableData.slice(start, start + this.pageSize);
        },
    },
    mounted() {
        // this.columns = this.column;
        // this.tableData = this.tabledata.map((item) => ({
        //   ...item,
        // }));
        // this.total = this.tableData.length;
        // this.setPageSizes();
        // this.formatRow();
        // this.rules_data = this.$formatFormRules(
        //   [
        //     "放散阀1联锁压力设定值（kPa）",
        //     "放散阀2联锁压力设定值（kPa）",
        //     "放散阀3联锁压力设定值（kPa）",
        //     "放散阀4联锁压力设定值（kPa）",
        //     "数量（个）",
        //     "设计文件或设备厂家提供明确的设备设计压力值（kPa）",
        //   ],
        //   this.newRow
        // );
        // console.log(this.rules_data);
    },
};
</script>

<style lang="less"></style>
