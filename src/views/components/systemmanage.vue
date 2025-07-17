<template>
    <div>
        <el-dropdown class="systemset" @command="clickmenu">
            <i class="el-icon-more">
            </i>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item icon="el-icon-caret-left" command="logout">退出系统</el-dropdown-item>
                <el-dropdown-item icon="el-icon-message" command="handle"
                    v-show="alarm_auth.length">工单处理</el-dropdown-item>
                <el-dropdown-item command="user">{{ systemloginInfo.username }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-dialog :title="'我提交的工单'" :visible.sync="addRowDialogVisible" :modal="false" center class="messageHandle" -->
        <el-dialog :title="'报警工单列表'" :visible.sync="addRowDialogVisible" :modal="false" center class="messageHandle"
            width="12rem" :close-on-click-modal="false" top="0.5rem">
            <template slot="title">
                <span style="font-size: 14px;">报警工单列表</span>
            </template>
            <!-- <el-radio-group v-model="radio1" size="medium">
                <el-radio-button label="未处置"></el-radio-button>
                <el-radio-button label="已处置"></el-radio-button>
            </el-radio-group> -->
            <!-- <span @click="getWarningList" style="cursor: pointer;color: #409EFF">刷新 </span> -->
            <small style="float:left">
                共{{ tableData.length }}条工单；其中未处置 {{ unhandle_process_status.length }} 条；未关闭 {{ unhandle_status.length }}
                条；
            </small>
            <small style="float:right">
                最后刷新时间：{{ refreshTime }}
            </small>
            <el-table :data="tableData" style="width: 100%; background: transparent;" height="6rem"
                :default-sort="warning_handle_type.indexOf('TbAlarmWorkOrder指派') >= 0 ? { prop: 'updateTime', order: 'descending' } : { prop: 'createTime', order: 'descending' }">
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <div v-if="warning_handle_type.indexOf('TbAlarmWorkOrder指派') >= 0">
                            <el-button type="text" size="medium" @click="closeStatus(scope.row, 'add')"
                                style="color:#31db31"
                                :disabled="!(String(scope.row.status) == '0' && String(scope.row.processStatus) == '1')">关闭</el-button>

                            <el-button type="text" size="medium" @click="editRow(scope.row)"
                                :disabled="String(scope.row.processStatus) == '1' || String(scope.row.status) == '1'">编辑</el-button>
                            <el-button type="text" size="medium" @click="deleteRow(scope.row)" style="color:red"
                                :disabled="String(scope.row.processStatus) == '1' || String(scope.row.status) == '1'">删除</el-button>
                        </div>
                        <div v-if="warning_handle_type.indexOf('TbAlarmWorkOrder处理') >= 0">
                            <el-button type="text" size="medium" @click="closeStatus(scope.row, 'edit')"
                                :disabled="String(scope.row.status) == '1'" style="color:#31db31">处置</el-button>
                        </div>
                    </template>

                </el-table-column>
                <!-- <el-table-column prop="info" label="报警信息">
                </el-table-column> -->
                <el-table-column prop="createTime" label="生成时间" width="180" sortable>
                </el-table-column>
                <el-table-column prop="updateTime" label="处置时间" width="180" sortable>
                </el-table-column>
                <el-table-column prop="processStatus" label="处置状态" sortable>
                    <template #default="scope">
                        <span v-if="String(scope.row.processStatus) == '1'">已处置</span>
                        <span v-if="String(scope.row.processStatus) == '0'" style="color:#ff8a5e">未处置</span>
                    </template>

                </el-table-column>
                <el-table-column prop="status" label="关闭状态" sortable>
                    <template #default="scope">
                        <span v-if="String(scope.row.status) == '1'">已关闭</span>
                        <span v-if="String(scope.row.status) == '0'" style="color:#ff8a5e">未关闭</span>
                    </template>
                </el-table-column>
                <el-table-column prop="plant" label="所属分厂">
                </el-table-column>
                <el-table-column prop="plant" label="设备信息" width="200px">
                    <template #default="scope">
                        <!-- {{ scope.row.bitNo }}_{{ scope.row.paramName }} -->
                        {{ scope.row.bitNo }}
                    </template>
                </el-table-column>
                <el-table-column prop="warnRank" label="报警等级">
                    <template #default="scope">
                        <span v-html="riskLevelHtml(scope.row)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="paramValue" label="报警值">
                </el-table-column>
                <el-table-column prop="alarmMeasures" label="处置意见" :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span style="font-weight: bold;">{{ scope.row.alarmMeasures }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="picUrl" label="图片说明">
                    <template #default="scope">
                        <img :src="scope.row.picUrl" style="width: 0.5rem" class="hover-zoom"
                            @click="showbigimg(scope.row.picUrl)" />
                    </template>

                </el-table-column>
                <el-table-column prop="up" label="上限">
                </el-table-column>
                <el-table-column prop="upup" label="上上限">
                </el-table-column>
                <el-table-column prop="low" label="下限">
                </el-table-column>
                <el-table-column prop="lowlow" label="下下限">
                </el-table-column>

                <el-table-column prop="source" label="报警信息" :show-overflow-tooltip="true">
                    <template #default="scope">
                        <span style="font-weight: bold;">{{ scope.row.source }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="confirmBy" label="提交人">
                </el-table-column>
                <el-table-column prop="responPerson" label="处置人">
                </el-table-column>

            </el-table>
            <!-- <el-dialog :title="'填写'" :visible.sync="DialogVisible" :modal="false" center class="messageHandle2"
                width="8rem" top="3rem" :close-on-click-modal="false">
                处置意见：<el-input v-model="newRow.value"></el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handle()" type="primary" :loading="loadingbtn">确定</el-button>
                    <el-button @click="DialogVisible = false">取消</el-button>
                </span>
            </el-dialog> -->
            <span slot="footer" class="dialog-footer">
                <!-- warning_handle_type.indexOf('TbAlarmWorkOrder指派') >= 0 -->
                <!-- <el-button @click="confrimWarningbtn()" type="primary" :loading="loadingbtn">提交</el-button> -->
                <el-button @click="addRowDialogVisible = false; disableTimer()">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :modal="false" title="文件查看" :visible.sync="imgdialog" @close="imgdialog = false"
            custom-class="imgdialog" top="1rem" width="15rem">
            <div style="width: 100%">
                <img :src="currimgsrc" style="width: 100%" />
            </div>
        </el-dialog>

        <el-dialog :modal="false" title="工单信息" :visible.sync="statusdialog" @close="statusdialog = false"
            custom-class="imgdialog" top="0.3rem">
            <div style="margin: 0 0  0.2rem 0" v-for="item in columns_data" :key="item.label">
                {{ item.label }}：
                <span v-if="item.prop == 'alarmMeasures'">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" autofocus
                        class="handlewarningInput" v-model="alertWarningdata['alarmMeasures']" placeholder="请填写报警处置意见"
                        v-if="warning_handle_operate == 'edit'"></el-input>
                    <span v-html="showStatus(item.prop)" v-else></span>

                </span>
                <div v-if="item.prop == 'picUrl'">
                    <Uploadocom ref="uploadocom" @uploadFileName="uploadFileName"
                        v-if="warning_handle_operate == 'edit'">
                    </Uploadocom>
                    <img :src="alertWarningdata.picUrl" style=" width:2rem" v-else
                        @click="showbigimg(alertWarningdata.picUrl)" />
                </div>

                <span v-html="showStatus(item.prop)" v-else-if="item.prop != 'alarmMeasures'"></span>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="statusdialog = false">取消</el-button>
                <el-button @click="changeStatus" type="primary" :loading="loadingbtn">
                    <span v-if="warning_handle_operate == 'add'">
                        确认关闭
                    </span>
                    <span v-if="warning_handle_operate == 'edit'">
                        确认处置
                    </span>
                </el-button>
            </span>
        </el-dialog>

        <el-dialog :title="'编辑报警信息'" :visible.sync="editRowDialogVisible" :modal="false" top="0.8rem" class="feedback"
            v-if="editRowDialogVisible" :close-on-click-modal="false">
            <div v-html="riskLevelHtml(alertWarningdata)"></div>
            <div style="margin: 0.2rem 0">
                {{ alertWarningdata.bitNo }}_{{ alertWarningdata.paramName }}
            </div>
            <div>CO：{{ formatValue(alertWarningdata) }}</div>
            <el-form :model="alertWarningdata" label-position="top" ref="newRow2">
                <!-- <el-form-item :key="'picture'" :label="'报警图片'" :prop="'picture'"
                    style="margin: 10px 0px 0px !important;">
                    <Uploadocom ref="uploadocom" :fileurl="alertWarningdata.picUrl" @uploadFileName="uploadFileName">
                    </Uploadocom>
                </el-form-item> -->

                <el-form-item v-for="column in feedbackInfo" :key="column.prop" :label="column.label"
                    :prop="column.prop">
                    <el-input v-model="alertWarningdata[column.prop]" v-if="column.prop == 'source'"
                        style="width:600px;"></el-input>
                    <el-select v-model="alertWarningdata[column.prop]" v-if="column.prop == 'responPerson'"
                        style="width: 200px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRowDialogVisible = false">取消</el-button>
                <el-button @click="confrimWarningbtn()" type="primary" :loading="loadingbtn">确定</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
import { listAlarmWorkOrder, updateAlarmWorkOrder, delAlarmWorkOrder } from "@/api/system/alarmworkorder";
import { listUser } from "@/api/system/user";
import Uploadocom from "../components/uploadwarning.vue";
import { changeRoleStatus } from "@/api/system/role";
import moment from 'moment'
import { login, getInfo } from "@/api/login";

export default {
    data() {
        return {
            addRowDialogVisible: false,
            editRowDialogVisible: false,
            // DialogVisible: false,
            radio1: "未处置",
            tableData: [
            ],
            newRow: {
                value: ""
            },
            loadingbtn: false,
            imgdialog: false,
            statusdialog: false,
            currimgsrc: "",
            loading: false,
            alertWarningdata: {},
            feedbackInfo: [
                {
                    label: "报警信息",
                    prop: "source",
                },
                {
                    label: "工单处置人",
                    prop: "responPerson",
                },
            ],
            operateType: "addPic",
            options: [],
            columns_data: [
                {
                    prop: 'createTime',
                    label: '生成时间'
                },
                {
                    prop: 'updateTime',
                    label: '处置时间'
                },
                {
                    prop: 'processStatus',
                    label: '处置状态'
                },
                {
                    prop: 'status',
                    label: '关闭状态'
                },
                {
                    prop: 'plant',
                    label: '所属分厂'
                },
                {
                    prop: 'bitNo', // 注意：这里使用了模板插槽，因此我们取用了在模板内实际显示的字段
                    label: '设备信息'
                },
                {
                    prop: 'warnRank',
                    label: '报警等级'
                },
                {
                    prop: 'paramValue',
                    label: '报警值'
                }, {
                    prop: 'alarmMeasures',
                    label: '处置意见'
                },
                {
                    prop: 'picUrl',
                    label: '图片说明'
                },
                {
                    prop: 'up',
                    label: '上限'
                },
                {
                    prop: 'upup',
                    label: '上上限'
                },
                {
                    prop: 'low',
                    label: '下限'
                },
                {
                    prop: 'lowlow',
                    label: '下下限'
                },

                {
                    prop: 'source',
                    label: '报警信息'
                },
                {
                    prop: 'confirmBy',
                    label: '提交人'
                },
                {
                    prop: 'responPerson',
                    label: '处置人'
                },

            ],
            refreshTime: "",
            alarm_auth: [],
            warning_handle_type: "",
            warning_handle_operate: "",
            timer: undefined,
            flag_alert: '',
            unhandle_status: 0,
            unhandle_process_status: 0,
        }
    },
    components: { Uploadocom },
    methods: {
        uploadFileName(data) {
            this.alertWarningdata.picFileName = data
            this.alertWarningdata.picUrl = "http://222.189.207.202:801/upload/" + this.alertWarningdata.picFileName//图片链接

        },
        showStatus(str) {
            if (str == 'status') {
                return String(this.alertWarningdata[str]) == '1' ? '已关闭' : '<span style="color:#ff8a5e">未关闭</span>'
            } else if (str == 'processStatus') {
                return String(this.alertWarningdata[str]) == '1' ? '已处置' : '<span style="color:#ff8a5e">未处置</span>'
            } else if (str == 'warnRank') {
                return this.riskLevelHtml(this.alertWarningdata)
            } else if (str == 'alarmMeasures') {
                return `<div style="font-weight:bold;border:1px dashed #569cf0;padding:5px;display:inline-block">${this.alertWarningdata[str]}</div>`
            } else if (str == 'source') {
                return `<div style="font-weight:bold;border:1px dashed #569cf0;padding:5px;display:inline-block">${this.alertWarningdata[str]}</div>`
            } else {
                return this.alertWarningdata[str]
            }
        },
        async handleStatus(row) {
            // this.alertWarningdata.status = '0'
            // console.log(this.alertWarningdata);
            // let res = await updateAlarmWorkOrder(this.alertWarningdata)
            // console.log(res);
            // if (res.code == 200) {
            //     this.$message.success("编辑工单成功!")
            // } else {
            //     this.$message.error("创建工单失败！")
            // }
            // this.statusdialog = false
            // this.getWarningList()
        },
        async changeStatus() {
            if (this.warning_handle_operate === 'add') {
                this.alertWarningdata.status = '1'
            } else if (this.warning_handle_operate === 'edit') {
                this.alertWarningdata.processStatus = '1'

            }
            console.log(this.alertWarningdata);
            let res = await updateAlarmWorkOrder(this.alertWarningdata)
            console.log(res);
            if (res.code == 200) {
                this.$message.success(this.warning_handle_operate === 'add' ? "关闭工单成功!" : "处置工单成功")
            } else {
                this.$message.error(this.warning_handle_operate === 'add' ? "关闭工单失败!" : "处置工单失败")
            }
            this.statusdialog = false
            this.getWarningList()
        },
        async closeStatus(row, flag) {
            this.alertWarningdata = JSON.parse(JSON.stringify(row))
            this.statusdialog = true
            this.warning_handle_operate = flag
        },
        uploadFileName(data) {
            this.alertWarningdata.picFileName = data
            this.alertWarningdata.picUrl = "http://222.189.207.202:801/upload/" + data//图片链接
        },
        // 编辑
        async confrimWarningbtn() {
            this.alertWarningdata.remark = this.alertWarningdata.source
            this.alertWarningdata.source = ''
            console.log(this.alertWarningdata);
            let res = await updateAlarmWorkOrder(this.alertWarningdata)
            console.log(res);
            if (res.code == 200) {
                this.$message.success("编辑工单成功!")
            } else {
                this.$message.error("创建工单失败！")
            }
            this.editRowDialogVisible = false
            this.getWarningList()

        },
        formatValue(item) {
            item.paramValue = item.paramValue ? Number(item.paramValue) : ''
            if (item.paramValue == 0) return "0.00";
            else if (!item.paramValue) return "";
            return item.paramValue.toFixed(2);
        },
        editRow(row) {
            console.log(row);
            this.alertWarningdata = JSON.parse(JSON.stringify(row))
            this.editRowDialogVisible = true;
            listUser({ postld: 2 }).then((res) => {
                // console.log(res.rows);
                if (res.code == 200 && res.rows.length) {
                    this.options = res.rows.map(item => {
                        return {
                            label: item.userName,
                            value: item.userName,
                        }
                    })
                }
            }
            )
        },
        deleteRow(row) {
            this.$alert('确认删除', '提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(() => {
                console.log(row);
                delAlarmWorkOrder(row.id).then(res => {
                    if (res.code == 200) {
                        this.$message.success("删除成功！")
                    } else {
                        this.$message.error("删除失败！")
                    }
                    this.getWarningList()

                }).catch(() => {
                    this.$message.error("删除失败！")
                    this.getWarningList()

                })

            })
        },
        sortByProcessStatusAndStatus(data) {
            return data.sort((a, b) => {
                // 定义优先级：processStatus=1 且 status=0 的排在前面
                const aPriority = a.processStatus === '1' && a.status === '0' ? 1 : 0;
                const bPriority = b.processStatus === '1' && b.status === '0' ? 1 : 0;

                // 根据优先级排序
                return bPriority - aPriority;
            });
        },
        async getWarningList(flag) {
            this.loading = true
            // this.tableData = []
            // console.log(listAlarmWorkOrder());
            let res = await listAlarmWorkOrder()
            // console.log(res);
            if (res.code == 200) {
                this.tableData = JSON.parse(JSON.stringify(res.data))
                if (this.warning_handle_type.indexOf('TbAlarmWorkOrder指派') >= 0) {
                    this.tableData = this.sortByProcessStatusAndStatus(res.data)
                    this.$forceUpdate()
                } else {
                    // this.tableData = this.tableData.sort((a, b) => (b.updateTime === '0') - (a.processStatus === '0'));
                }
            }
            this.refreshTime = moment().format('YYYY-MM-DD HH:mm:ss')
            // console.log(this.warning_handle_operate, flag);
            this.unhandle_process_status = this.tableData.filter(item => item.processStatus == 0)
            this.unhandle_status = this.tableData.filter(item => item.status == 0)
            if (flag && this.warning_handle_operate == 'edit') {

                // console.log(unhandle_status);
                if (this.unhandle_process_status.length!=0) {
                    this.$alert(`您有未处理的工单${this.unhandle_process_status.length}条，请前往处理`, '是否前往', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.addRowDialogVisible = true
                        }
                    });
                }
                this.flag_alert = 'initial'
            }
            this.loading = false
        },
        checkBitNoForKeywordsWithRegex(bitNo) {
            // 定义一个正则表达式，用于匹配任意一个关键词
            const regex = /高炉|转炉|煤气|液氧储槽/;
            return regex.test(bitNo);
        },
        riskLevelHtml(data) {
            // console.log(data);
            let objflag = this.checkBitNoForKeywordsWithRegex(data.bitNo)

            data = String(data.warnRank);

            // if (this.alertWarningdata.bitNo.test(/高炉|转炉|煤气|液氧储槽/) >= 0) {
            //     console.log('adsdd', this.alertWarningdata);
            // } else {
            //     console.log('222222', this.alertWarningdata);

            // }
            if (!objflag) {
                switch (data) {
                    case "0":
                        return '';
                    case "2":
                        return '<span class="yellow-warning">黄色预警</span>';
                    case "1":
                        return '<span class="orange-warning">橙色预警</span>';
                    case "3":
                        return '<span class="red-warning">红色预警</span>';
                    default:
                        // console.log(data);

                        return "正常";
                }
            } else {
                switch (true) {
                    case (data == -2): {
                        return `<span class="yellow-warning">低低报</span></br>`
                    }
                    case (data == -1): {
                        return `<span class="yellow-warning">低报</span></br>`
                    }
                    case (data == 1): {
                        return `<span class="red-warning">高报</span></br>`
                    }
                    case (data == 2): {
                        return `<span class="red-warning">高高报</span></br>`
                    }
                    default: {
                        return ''
                    }
                }
            }

        },
        showbigimg(src) {
            this.imgdialog = true;
            this.currimgsrc = src;
        },
        // handleRow(item) {
        //     this.DialogVisible = true
        // },
        handle() {

        },

        clickmenu(value) {
            // console.log(value);
            if (value == 'logout') {
                removeToken("Admin-Token");
                removeToken("Report-Token");
                setTimeout(() => {
                    this.$router.replace("/");
                    location.reload();

                }, 500);
            } else if (value == 'handle') {
                this.addRowDialogVisible = true
                this.setTimer()
                this.getWarningList()

            }
        },
        setTimer() {
            this.timer = setInterval(this.getWarningList, 2000);
            console.log(this.timer);
            this.$once("hook:beforeDestory", () => {
                this.disableTimer();
            });
        },
        disableTimer() {
            // console.log("hhh", this.timer);
            if (this.timer != null) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        async getAuthInfo() {
            let res2 = await getInfo()
            console.log('权限22222', res2);
            if (res2.code == 200) {
                let alarm_auth = res2.pagePermissions.find(item => item.name ==
                    'TbAlarmWorkOrder处理')
                // console.log(alarm_auth);
                this.$store.commit("systemauthInfo", res2)
                if (res2.permissions[0] != "*:*:*") {
                    this.alarm_auth = res2.pagePermissions
                } else {
                    // this.alarm_auth = newVal.pagePermissions.filter(item => item.perms != 'TbAlarmWorkOrder处理')
                    console.log(this.alarm_auth);
                    // alarmworkorder
                    this.alarm_auth = res2.pagePermissions.filter(item => item.name.indexOf('TbAlarmWorkOrder') >= 0)
                }

                // if (newVal.permissions[0] == "*:*:*") {
                //     this.alarm_auth = this.alarm_auth.filter(item => item.perms != 'TbAlarmWorkOrder处理')
                // }

                // 工单权限主要分为两种：
                // 1、修改权限，工单处置权限   
                // 2、新增权限，工单指派权限
                this.warning_handle_type = this.alarm_auth.filter(item => item.name ==
                    'TbAlarmWorkOrder处理' || item.name == 'TbAlarmWorkOrder指派').map(
                        item => item.name
                    )

                this.warning_handle_operate = this.alarm_auth.find(item => item.name ==
                    'TbAlarmWorkOrder处理') ? 'edit' : 'add'
                // this.getWarningList()

                console.log('this.warning_handle_type :', this.warning_handle_type);
                this.getWarningList('initial')
                // if (alarm_auth) {
                //     this.$store.commit("alertHandle", new Date().getTime())
                // }
            }
        },
    },
    mounted() {
        this.getAuthInfo()
        // this.setTimer()
        // this.initial = false
        // this.getWarningList('initial')
    },
    destroyed() {
        this.disableTimer();
    },
    computed: {
        'systemloginInfo'() {
            return this.$store.state.loginInfo
        },
        // 'systemauthInfo'() {
        //     return this.$store.state.authInfo
        // },
        'timestemp'() {
            return this.$store.state.timestemp
        },

    },
    watch: {
        timestemp: {
            handler(newVal, oldVal) {
                console.log('新值:', newVal);

                // this.getWarningList('initial')
            }
        },
        // systemauthInfo: {
        //     handler(newVal, oldVal) {
        //         // console.log('系统权限信息已更新');
        //         // console.log('新值:', newVal.permissions);
        //         // console.log('旧值:', oldVal);
        //         if (newVal.permissions[0] != "*:*:*") {
        //             this.alarm_auth = newVal.pagePermissions
        //         } else {
        //             // this.alarm_auth = newVal.pagePermissions.filter(item => item.perms != 'TbAlarmWorkOrder处理')
        //             console.log(this.alarm_auth);
        //             // alarmworkorder
        //             this.alarm_auth = newVal.pagePermissions.filter(item => item.name.indexOf('TbAlarmWorkOrder') >= 0)
        //         }

        //         // if (newVal.permissions[0] == "*:*:*") {
        //         //     this.alarm_auth = this.alarm_auth.filter(item => item.perms != 'TbAlarmWorkOrder处理')
        //         // }

        //         // 工单权限主要分为两种：
        //         // 1、修改权限，工单处置权限   
        //         // 2、新增权限，工单指派权限
        //         this.warning_handle_type = this.alarm_auth.filter(item => item.name ==
        //             'TbAlarmWorkOrder处理' || item.name == 'TbAlarmWorkOrder指派').map(
        //                 item => item.name
        //             )

        //         this.warning_handle_operate = this.alarm_auth.find(item => item.name ==
        //             'TbAlarmWorkOrder处理') ? 'edit' : 'add'
        //         // this.getWarningList()

        //         console.log('this.warning_handle_type :', this.warning_handle_type);

        //     },
        //     deep: true        // 深度监听对象内部变化
        // }
    },
}
</script>

<style></style>