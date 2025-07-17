<template>
    <div style="padding: 20px" class="base_list highlight">
        <edit-table :column="columns" :tabledata="tableData" :loading="loading"></edit-table>
        <div class="echarts-foot"></div>
    </div>
</template>

<script>
import EditTable from "../home/components/editTable.vue";
import aes from '../../api/aes'
import reportapi from "@/api/reportapi";
import moment from 'moment'
export default {
    components: { EditTable },
    data() {
        return {
            tableData: [],
            columns: [
                // { prop: "id", label: "预警编号", sortable: true },
                { prop: "warnOrg", label: "预警发布单位", },
                { prop: "warnRank", label: "预警等级", width: "80rem" },
                { prop: "warnStatus", label: "预警状态", width: "70rem" },
                { prop: "riskIndex", label: "风险预警指数", width: "90rem" },
                { prop: "startTime", label: "预警起始时间", width: "180rem" },
                { prop: "endTime", label: "预警结束时间" },
                { prop: "message", label: "预警描述", width: "290rem" },
            ],
            loading: true,
            timer: null
        };
    },
    destroyed() {
        this.disableTimer();
    },
    mounted() {
        this.exampleUsage();
        this.timer = setInterval(this.exampleUsage, 60000);

    },
    methods: {
        disableTimer() {
            // console.log("hhh", this.timer);
            if (this.timer != null) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        // 示例用法
        async exampleUsage() {
            this.loading = true
            let datevalue = moment(new Date().getTime()).format('yyyy-MM-DD HH:mm:ss')
            let res = await reportapi.zfwarningInfo({
                dataId: 'GT3210840001',
                // startTime:datevalue
                startTime: '2024-10-01 00:00:00'
            })
            if (res.code == 2000) {
                const encryptedData = res.data; // 需要解密的数据
                const decryptedData = aes.decryptWithAES(encryptedData);
                console.log('解密后的数据:', decryptedData);
                this.tableData = decryptedData.records
            } else {
                this.$message.error("获取预警信息失败！")
            }
            this.loading = false

        },
    },
};
</script>

<style lang="less">
.waring {

    /* 添加样式（如需要） */
    .table-container {
        max-height: 500px;
        /* 设置最大高度以支持滚动 */
        overflow-y: auto;

        /* 使其可滚动 */
        .el-table .cell {
            // background:rgba(7, 36, 63, 0.7) ;
        }
    }

    /* 如果需要设置特定行的背景色，可以根据条件添加类 */
    .el-table tr {
        background: rgba(7, 36, 63, 0.7);
    }

    .el-table {
        height: 4rem !important;
    }
}
</style>
