<template>
    <div class="table-container">
        <el-table v-loading="loading" row-class-name="rowstyle" :data="paginatedData" tooltip-effect="light"
            style="width: 100%; background: transparent;" height="calc(100vh - 2.2rem)"
            :cell-class-name="getCellClassName">
            <el-table-column label="操作" width="50rem">
                <template #default="scope">
                    <!-- <el-button @click="viewDetails(scope.row)" type="text">详情</el-button> -->
                    <!-- <el-button @click="editRow(scope.row)" type="text">编辑</el-button> -->
                    <el-button @click="editRow(scope.row)" type="text" style=""
                        v-if="scope.row['warnStatus'] == 0">处理</el-button>
                </template>
            </el-table-column>
            <el-table-column fit v-for="(column, index) in columns" :key="index" :prop="column.prop"
                :width="column.width ? column.width : ''"
                :show-overflow-tooltip="column.prop == 'message' ? true : false" :label="column.label"
                :sortable="column.sortable">
                <template #default="scope">
                    <span v-if="column.label == '预警等级'">
                        <span>{{ scope.row[column.prop] == 1 ? '红色预警' : (scope.row[column.prop] == 2 ? '橙色预警' :
                            (scope.row[column.prop] == 3 ? '黄色预警' : '正常'))
                            }}</span>
                    </span>
                    <span v-if="column.label == '预警状态'">
                        <span>{{ ['1', '2', '3'].indexOf(scope.row['warnRank']) >= 0 ? (scope.row[column.prop] == 0 ?
                            '未消警'
                            : '已消警') : '' }}</span>
                    </span>
                    <span v-else-if="column.label != '预警状态' && column.label != '预警等级'">{{ scope.row[column.prop]
                        }}</span>
                </template>
            </el-table-column>

        </el-table>
        <el-pagination class="el-pagin" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-size="pageSize" :total="total" layout="total, prev, pager, next, sizes"
            :page-sizes="pageSizes" ref="pangination_n" />
        <el-dialog :title="'处理警报'" :visible.sync="addRowDialogVisible" :modal="false" top="0.8rem" class="feedback"
            :close-on-click-modal="false">
            <div style="margin-bottom: 0.1rem;" v-for="item in columns">
                <el-row>
                    <el-col style="font-weight: bold;" :span="4">
                        {{ item.label }}
                    </el-col>
                    <el-col :span="16">
                        <span v-if="item.label != '预警等级' && item.label != '预警状态'"> {{ newRow[item.prop] }}</span>
                        <span v-else-if="item.label != '预警状态'" v-html="riskLevelHtml"> </span>
                        <span v-if="item.label == '预警状态'">
                            {{ newRow[item.prop] == 0 ? '未消警' : '已消警'
                            }}
                        </span>
                    </el-col>
                </el-row>
                <!-- <div style="font-weight: bold;">
                    预警等级：
                    <span v-html="riskLevelHtml"></span>
                </div>
                <div style="font-weight: bold;">
                    预警描述：{{ newRow.message }}
                </div> -->
            </div>
            <el-form :model="newRow" label-position="top" ref="newRow">
                <el-form-item v-for="column in feedbackInfo" :key="column.prop" :label="column.label"
                    :prop="column.label">
                    <el-input v-model="newRow[column.prop]"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRow()" type="primary" :loading="loadingbtn">确定</el-button>
                <el-button @click="addRowDialogVisible = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import reportapi from '@/api/reportapi';

export default {
    props: ["column", "tabledata", "loading"],
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 20,
            total: 0,
            columns: [],
            currentPage: 1,
            pageSize: 10,
            pageSizes: [],
            addRowDialogVisible: false,
            operatetitle: "",
            feedbackInfo: [{
                label: "反馈信息",
                prop: "warnFeedback",
            }, {
                label: "反馈处置人",
                prop: "responPerson",
            }, {
                label: "处置措施",
                prop: "alarmMeasures",
            }, {
                label: "填报人",
                prop: "fillBy",
            }],
            newRow: {
            },
            warning_message: "",
            loadingbtn: false
        };
    },
    created() {
        // this.fetchData();
    },
    methods: {
        addRow() {
            console.log(this.newRow);
            let params = {
                "warnFeedback": this.newRow.warnFeedback,
                "responPerson": this.newRow.responPerson,
                "alarmMeasures": this.newRow.responPerson,
                "fillBy": this.newRow.fillBy,
                warnId: this.newRow.id
            }
            console.log(params);
            reportapi.warninginfoFeedback(params).then(res => {
                console.log(res.data);
                if (res.data.code == '2000') {
                    this.$message.success(res.data.message)
                    this.addRowDialogVisible = false
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        handleCurrentChange(page) {
            this.currentPage = page;
            this.fetchData();
        },
        handleSizeChange(size) {
            this.pageSize = size;
            this.fetchData();
        },
        viewDetails(row) {
            console.log("查看详情:", row);
        },
        editRow(row) {
            this.newRow = Object.assign({}, row)
            this.addRowDialogVisible = true

        },
        getCellClassName({ row, column, rowIndex, columnIndex }) {
            // console.log(row, columnIndex);
            if (columnIndex == 2) {
                console.log(row.warnRank);
                // 根据条件返回不同的类名
                if (row.warnRank === '1') {
                    return 'red-warning'; // 特定单元格样式
                } else if (row.warnRank === '2') {
                    return 'orange-warning'; // 特定单元格样式
                } else if (row.warnRank === '3') {
                    return 'yellow - warning '; // 特定单元格样式
                } else if (row.warnRank === '4') {
                    return ''; // 特定单元格样式
                }
            }
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
        riskLevelHtml() {
            console.log(this.newRow.warnRank);
            switch (this.newRow.warnRank) {
                case '1':
                    return '<span class="red-warning">红色预警</span>';
                case '2':
                    return '<span class="orange-warning">橙色预警</span>';
                case '3':
                    return '<span class="yellow-warning">黄色预警</span>';
                default:
                    return '未知预警';
            }
        }
    },
};
</script>

<style lang="less">
/* 添加样式（如需要） */
.table-container {
    //   max-height: 500px; /* 设置最大高度以支持滚动 */
    //   overflow-y: auto; /* 使其可滚动 */
    //   .el-table .cell {
    //     background: rgba(7, 36, 63, 0.7);
    //   }
}

.rowstyle {
    background-color: #06253aad !important;
    color: white;

    &:hover {
        background-color: #06253aad !important;
        color: white;
    }
}

// .el-table tr,.el-table th.el-table__cell{
//     background-color:#06253aad !important;
//     color: white;
// }
// .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell {
//     background-color:#294e78 !important;
//     color: white;

// }

// .el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf,.el-table--border::after, .el-table--group::after, .el-table::before {
//     border-bottom: 1px solid #425a92 !important;
// }

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
    color: #409EFF !important;
    cursor: default;
    background: #0d59a0 !important;
}


/* 设置表格背景色 */
// .el-table,.el-table th.el-table__cell{
//   background-color: transparent; /* 表格背景色 */
// }

// /* 设置表格头部背景色 */
// .el-table .el-table__header {
//   background-color: #009688; /* 表头背景色 */
//   color: white; /* 表头文字颜色 */
// }

// /* 设置表格行背景色 */
// .el-table .el-table__body tr {
//     background:rgba(7, 36, 63, 0.7) ;
// }

// /* 设置鼠标悬停时的行背景色 */
// .el-table .el-table__body tr:hover {
//   background-color: transparent; /* 悬停时背景色 */
// }

// /* 设置单元格文字颜色 */
// .el-table .cell {
//   color: white; /* 单元格文字颜色 */
//   background-color: transparent; /* 表格背景色 */

// }</style>