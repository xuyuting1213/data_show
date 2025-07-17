<template>
    <div class="intor_list highlight" style="padding: 0.3rem 0; overflow-y: hidden">
        <img src="../../assets/images/loading.gif" class="loadgif" v-if="loading" />
        <span class="gas_info_title"> 选择分厂： </span>
        <el-select v-model="plant" filterable placeholder="请选择" class="areaselect" @change="changePlant">
            <el-option v-for="item in plantList" :key="item" :label="item" :value="item">
            </el-option>
        </el-select>
        <span class="gas_info_title"> 选择分厂对应主机 </span>
        ：
        <el-select v-model="hostId" filterable placeholder="请选择" style="margin-bottom: 0.25rem"
            @change="queryAlarmChannels" class="areaselect">
            <el-option v-for="item in plant_child_options" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
        </el-select>

        <el-row style="height: calc(100% - 0.9rem); overflow-y: auto" v-if="paginatedArray.length">
            <el-col :span="3" class="warninginfo" v-for="(item, index) in paginatedArray" :key="item.id"
                style="min-width: 156px">
                <el-popconfirm class="confrimwarning"
                    v-if="String(item.statuscode) != '0' && warning_handle_operate == 'add'" placement="top-start"
                    title="处理报警" @confirm="confirm(item)" @cancel="cancel">
                    <div slot="reference" style="cursor: pointer;">
                        <el-tooltip class="item" effect="dark" popper-class="warning_tips"
                             :content="item.internalNo + '_' + item.channelName">
                            <div class="title-container">
                                <div class="title">{{ item.internalNo }}</div>
                                <div class="title" :title="item.internalNo">{{ item.channelName }}</div>
                            </div>
                        </el-tooltip>
                        <div style="display: flex; justify-content: space-between;height:38px">
                            <div>
                                <div>CO： {{ formatValue(item) }}</div>
                                <div>
                                    状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：
                                    <span v-html="riskLevelHtml(item.statuscode, item.num)"></span>

                                </div>
                            </div>
                            <div>
                                <img :src="getImageUrl(item)" width="30px"
                                    :class="{ 'warning-animation': String(item.statuscode) != '0' }" />
                            </div>
                        </div>
                    </div>
                </el-popconfirm>
                <div v-if="String(item.statuscode) != '0' && warning_handle_operate == 'add'">
                    <!-- <div v-if="String(item.statuscode) != '0'"> -->
                    <el-button type="text" size="small" @click="showmoreInfo(item)">查看更多</el-button>
                </div>
                <div
                    v-if="String(item.statuscode) == '0' || (String(item.statuscode) == '1' && warning_handle_operate == 'edit')">
                    <el-tooltip class="item" effect="dark" popper-class="warning_tips"
                        :content="item.internalNo + '_' + item.channelName">
                        <!-- <template slot="content">
                            <span v-html="showInfoFunc(item)"></span>
                        </template> -->
                        <div class="title-container">
                            <div class="title">{{ item.internalNo }}</div>
                            <div class="title" :title="item.internalNo">
                                {{ item.channelName }}
                            </div>
                        </div>
                    </el-tooltip>
                    <div style="display: flex; justify-content: space-between;height: 38px">
                        <div>
                            <div>CO： {{ formatValue(item) }}</div>
                            <div class="title">
                                状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态：
                                <span v-html="riskLevelHtml(String(item.statuscode), item.num)"></span>
                            </div>
                        </div>
                        <div>
                            <!-- {{ item }} -->
                            <img :src="getImageUrl(item)" width="30px"
                                :class="{ 'warning-animation': String(item.statuscode) != '0' }" />
                        </div>
                    </div>
                    <div>
                        <el-button type="text" size="small" @click="showmoreInfo(item)">查看更多</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div v-else-if="!loading">
            <span style="color: white; font-size: 0.3rem; margin-left: 0.3rem">暂无数据</span>
        </div>
        <el-col>
            <el-pagination class="e-pagin-gas" @current-change="handleCurrentChange" :current-page="currentPage"
                :page-size="pageSize" :total="totalItems" layout="total, prev, pager, next, jumper"></el-pagination>
        </el-col>
        <el-dialog :modal="false" title="查看" :visible.sync="dialogshow" @close="closeChart"
            custom-class="warndialogshow" :bodyStyle="{ 'padding-top': 0 }" top="0.6rem">
            <span v-html="showInfoFunc(curr_clickdata)" style="display: block; margin-bottom: 0.3rem"></span>

            <div style="width: 100%">
                <chart :chart-id="'main'" :chart-data="chartData" :curr_clickdata="curr_clickdata" v-if="dialogshow"
                    ref="chartCom">
                </chart>
            </div>
        </el-dialog>
        <el-dialog :title="'处理报警'" :visible.sync="addRowDialogVisible" :modal="false" top="0.8rem" class="feedback"
            :close-on-click-modal="false" v-if="addRowDialogVisible">
            <!-- <div style="margin-bottom: 0.1rem;" v-for="(item, index) in alertWarningdata">
                <el-row v-if="index != 'paramId' && index != 'id'"> -->
            <div v-html="riskLevelHtml(alertWarningdata.statuscode, alertWarningdata.num)"></div>
            <div style="margin: 0.2rem 0">
                {{ alertWarningdata.internalNo }}_{{ alertWarningdata.channelName }}
            </div>
            <div>CO：{{ formatValue(alertWarningdata) }}</div>

            <el-form :model="newRow" label-position="top" ref="newRow">
                <!-- <el-form-item :key="'picture'" :label="'报警图片'" :prop="'picture'" style="margin-bottom: 0px !important;">
                    <Uploadocom ref="uploadocom" @uploadFileName="uploadFileName">
                    </Uploadocom>
                </el-form-item> -->

                <el-form-item v-for="column in feedbackInfo" :key="column.prop" :label="column.label"
                    :prop="column.prop">
                    <el-input v-model="newRow[column.prop]" v-if="column.prop == 'warnFeedback'" placeholder="请填写报警信息"
                        style="width:600px;"></el-input>
                    <el-select v-model="newRow[column.prop]" v-if="column.prop == 'responPerson'" style="width: 200px;">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRowDialogVisible = false; newRow = {}">取消</el-button>
                <el-button @click="addWarningdata()" type="primary" :loading="loadingbtn">确定</el-button>

            </span>
        </el-dialog>
    </div>
</template>

<script>
//设备参数信息
import { queryAlarmHostSetup } from "@/api/watch/alarmhostsetup"; //报警主机列表
import { queryCOAlarmChannelSetup } from "@/api/watch/coalarmchannelsetup"; //报警点位信息列表
import { readAlarmData } from "@/api/watch/alarmwatch"; //报警监控服务
import chart from "./charts/chart.vue";
import { getDeviceAlarmSetupByParamIds } from "@/api/watch/devicealarmsetup";
import { querySingleCurve, queryCurve } from "@/api/watch/devicecurve";
import { listUser } from "@/api/system/user";
import { addAlarmWorkOrder } from "@/api/system/alarmworkorder";
import reportapi from "@/api/reportapi";
import Uploadocom from "../components/uploadwarning.vue";
export default {
    data() {
        return {
            options: [],
            chartData: {
                xData: [],
                yData: [],
                seriesName: "",
            },
            dialogshow: false,
            currentPage: 1,
            pageSize: 32,
            array: [], //报警信息列表
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10000,
                plant: this.plant, //分厂
            },
            componentKey: 0,
            plantList: [], //分厂列表(配置了煤气报警器的分厂列表)
            alarmHostList: [], //主机信息列表
            plant_child_options: [], //筛选的主机信息列表
            alarmChannelList: [], //报警通道列表
            deviceParameterList: [], //需要查询的参数信息列表
            alarmDataMap: {}, //从报警参数到通道数据的映射表
            plant: "石灰厂", //分厂
            hostId: "", //报警主机id
            loading: false,
            timerEnabled: false, //是否启用timer
            timer: undefined,
            curr_clickdata: {},
            addRowDialogVisible: false,
            alertWarningdata: {},
            feedbackInfo: [
                {
                    label: "报警信息",
                    prop: "warnFeedback",
                },
                // {
                //     label: "报警图片",
                //     prop: "warnPicture",
                // },
                {
                    label: "工单处理人",
                    prop: "responPerson",
                },
                // {
                // label: "处置措施",
                // prop: "alarmMeasures",
                // }
            ],
            newRow: {
                warnFeedback: "",
                responPerson: "",
                warnPicture: "",
            },
            loadingbtn: false,
            timer_chart: null,
            operateType: "addPic",
            alarm_auth: [],
            warning_handle_type: "",
            warning_handle_operate: "",
        };
    },
    components: { chart, Uploadocom },
    computed: {
        totalItems() {
            return this.array.length;
        },
        paginatedArray() {
            const start = (this.currentPage - 1) * this.pageSize;
            return this.array.slice(start, start + this.pageSize);
        },
        'systemloginInfo'() {
            return this.$store.state.loginInfo
        },
        'systemauthInfo'() {
            return this.$store.state.authInfo
        },
    },
    mounted() {
        this.getplantdata();
        // this.setTimer(); //设置定时器
        this.$nextTick(() => {
            this.getAuthData()

        })
    },
    destroyed() {
        this.disableTimer();
    },
    methods: {
        uploadFileName(data) {
            this.alertWarningdata.picFileName = data
        },
        async showmoreInfo(data) {
            this.curr_clickdata = data;
            this.dialogshow = true;
            this.disableTimer();
            // 启动定时器获取新数据
            // this.startTimer();
        },
        showInfoFunc(item) {
            // console.log(item.internalNo);
            return `${item.internalNo}_${item.channelName}</br>${this.warningtype(
                item
            )}标准值：${item.normal ? item.normal : "未设置"}；</br>低限值：${item.low ? item.low : "未设置"
                }；低低限值：${item.lowlow ? item.lowlow : "未设置"}；</br>高限值：${item.up ? item.up : "未设置"
                }；高高限值：${item.upup ? item.upup : "未设置"}；`;
        },
        warningtype(item) {
            let alarmValue = item.alarmValue;
            switch (true) {
                case alarmValue == -2: {
                    return `报警类型：<span class="yellow-warning">低低报</span></br>`;
                }
                case alarmValue == -1: {
                    return `报警类型：<span class="yellow-warning">低报</span></br>`;
                }
                case alarmValue == 1: {
                    return `报警类型：<span class="red-warning">高报</span></br>`;
                }
                case alarmValue == 2: {
                    return `报警类型：<span class="red-warning">高高报</span></br>`;
                }
                default: {
                    return "";
                }
            }
        },
        async addWarningdata() {
            let params = {
                "createTime": "",
                "updateTime": "",
                "params": {},
                "startTime": null,
                "endTime": null,
                "warnRank": this.alertWarningdata.statuscode,//报警级别
                "paramId": this.alertWarningdata.paramId,//参数id
                // "paramName": this.alertWarningdata.channelName,//设备参数名名称
                "paramName": '',//设备参数名名称
                "targetCode": "",//设备参数编码
                "targetType": "",//类型
                "equipCode": "",//设备编码
                "paramValue": this.alertWarningdata.num,
                "responPerson": this.newRow.responPerson,//报告人
                "alarmMeasures": "",//报警信息描述
                "status": "0",//关闭状态
                "processStatus": "0",//处理状态
                "confirmBy": this.systemloginInfo.username,//工单处置人
                // "picUrl": "images/alarmpic-1-1.20241214123115",//图片链接
                // "picUrl": "http://222.189.207.202:801/upload/" + this.alertWarningdata.picFileName,//图片链接
                "picUrl": "",//图片链接
                "attachmentUrl": "",//附件链接
                // "picFileName": "Database.accdb.20241214123115",//图片文件名
                // "picFileName": this.alertWarningdata.picFileName,//图片文件名
                "picFileName": "",//图片文件名
                "attachmentFileName": "",//附件文件名
                "remark": this.newRow.warnFeedback,//报警信息
                "source": "",//数据来源
                "bitNo": this.alertWarningdata.internalNo + '_CO',//设备编号
                "low": this.alertWarningdata.low,
                "lowlow": this.alertWarningdata.lowlow,
                "up": this.alertWarningdata.up,
                "upup": this.alertWarningdata.upup,
                "plant": this.plant
            }
            console.log(params);
            let res = await addAlarmWorkOrder(params)
            if (res.code == 200) {
                this.$message.success("创建工单成功！请至工单管理页面查看~")
            } else {
                this.$message.error("创建工单失败！")
            }

            this.addRowDialogVisible = false
            this.newRow = {}
        },
        riskLevelHtml(data, num) {
            // console.log(data == '1');
            data = String(data);
            if (!num) {
                switch (data) {
                    case "2":
                        return '<span class="yellow-warning">黄色预警</span>';
                    case "1":
                        return '<span class="orange-warning">橙色预警</span>';
                    case "3":
                        return '<span class="red-warning">红色预警</span>';
                    default:
                        return "正常";
                }
            }
            else if (num == 7777) {
                return '<span class="yellow-warning">通道备用</span>';
            }
            else if (num == 9988) {
                return '<span class="yellow-warning">故障</span>';
            }
            else {
                switch (data) {
                    case "2":
                        return '<span class="yellow-warning">黄色预警</span>';
                    case "1":
                        return '<span class="orange-warning">橙色预警</span>';
                    case "3":
                        return '<span class="red-warning">红色预警</span>';
                    default:
                        return "正常";
                }
            }
        },
        closeChart() {
            this.$refs.chartCom.disableTimerchart();
            this.dialogshow = false;
            this.setTimer();
        },

        confirm(data) {
            this.alertWarningdata = data;
            this.addRowDialogVisible = true;
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
        cancel() { },
        setTimer() {
            this.timer = setInterval(this.refreshWatchData, 1000);
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

        async queryAlarmChannels() {
            //查询报警通道列表
            //console.log('hostid', this.hostId);
            if (this.hostId) {
                var qp = {
                    pageNum: 1,
                    pageSize: this.pageSize,
                    hostId: this.hostId,
                };
                this.array = []; //报警信息列表
                //查询报警通道列表
                let resp = await queryCOAlarmChannelSetup(qp);
                console.log("resp", resp);
                this.componentKey++;
                //报警通道列表
                this.alarmChannelList = resp.rows;
                this.paramIds = [];
                this.alarmDataMap = {};
                for (var j = 0; j < this.alarmChannelList.length; j++) {
                    var paramId = this.alarmChannelList[j].paramId; //得到参数id
                    var row = {
                        internalNo: this.alarmChannelList[j].internalNo, //内部编号
                        channelName: this.alarmChannelList[j].channelName, //通道名称
                        id: this.alarmChannelList[j].id, //通道id
                        paramId: paramId,
                        num: null, //实际值
                        // alarmVal: 0, //报警值, -2, 低低报, -1 低报, 1: 高报, 2: 高高报
                        statuscode: 0, //报警状态 0:正常, 1: 黄色报警, 2:橙色报警, 3:红色报警
                    };
                    let res1 = await getDeviceAlarmSetupByParamIds(paramId);
                    if (res1.data[0]) {
                        row.alarmValue = res1.data[0].alarmValue; //报警值
                        row.up = res1.data[0].up; //报警值
                        row.upup = res1.data[0].upup; //报警值
                        row.low = res1.data[0].low; //报警值
                        row.lowlow = res1.data[0].lowlow; //报警值
                        row.normal = res1.data[0].normal; //报警值
                    }
                    this.array.push(row);
                    if (paramId && !this.paramIds.includes(paramId)) {
                        this.alarmDataMap[paramId] = row;
                        if (this.paramIds.length < 255) this.paramIds.push(paramId);
                    }
                    // console.log('array', this.array);
                }
                // this.array[0] = { "internalNo": "石固221", "channelName": "4#加压机旁", "id": 367, "paramId": "367", "num": null, "alarmVal": 0, "statuscode": 1 }
                console.log("array", this.array);

                this.timerEnabled = true; //启用timer
                this.refreshWatchData();
            }
        },
        // 获得所有的报警主机,按照分厂
        async getplantdata() {
            this.loading = true;
            this.timerEnabled = false;
            var qp = {
                pageNum: 1,
                pageSize: 10000,
            };
            let response = await queryAlarmHostSetup(qp);
            if (response.code == 200) {
                //得到报警主机列表
                this.alarmHostList = response.rows; //返回感知数据的结果
                this.plantList = [];
                if (this.alarmHostList) {
                    for (var i = 0; i < this.alarmHostList.length; i++) {
                        //遍历所有的
                        var item = this.alarmHostList[i];
                        var plant = item.plant; //分厂名字
                        if (plant) {
                            if (!this.plant) this.plant = plant;
                            if (!this.plantList.includes(plant)) {
                                this.plantList.push(plant);
                            }
                        }
                        if (item.id && !this.hostId) {
                            //得到
                            this.hostId = item.id;
                        }
                    }
                    // this.plantList=['石灰厂','渣厂']
                }
                //有了报警主机，则获取报警通道列表
                // 根据当前选择的分厂拿到当前的分厂对应的主机
                this.plant_child_options = [];
                for (var jj = 0; jj < this.alarmHostList.length; jj++) {
                    var item = this.alarmHostList[jj];
                    if (item.plant == this.plant) {
                        this.plant_child_options.push(item);
                    }
                }
                console.log("plant_child_options", this.plant_child_options);
                if (!this.plant_child_options || this.plant_child_options.length < 1)
                    return;
                // 赋值
                this.hostId = this.plant_child_options[0].id;
                this.queryAlarmChannels();
            } else {
                this.$message({
                    type: "warning",
                    message: "登录已过期,自动重新登录",
                    //   duration: 0,
                    showClose: true,
                });
                setTimeout(() => {
                    this.$router.push("/");
                }, 2000);
            }

            this.loading = false;
        },
        changePlant(value) {
            //重新选择分厂
            console.log("value", value);
            this.disableTimer();
            // 根据当前选择的分厂拿到当前的分厂对应的主机
            this.plant_child_options = this.alarmHostList.filter(
                (item) => item.plant == value
            ); //筛选到所有的主机
            console.log(this.plant_child_options);
            if (!this.plant_child_options || this.plant_child_options.length < 1)
                return;
            if (this.plant_child_options.length) {
                this.plant_child_options = this.plant_child_options.filter(item => {
                    return item.name != '炼钢厂5#主机' && item.name != '喷煤主机' && item.name != '供料主控室新主机'
                        && item.name != '供料主控室旧主机'
                        && item.name != '高炉主控室新增'
                })
                console.log('111', this.plant_child_options);
                // 赋值
                this.hostId = this.plant_child_options[0].id;
                this.queryAlarmChannels();
                /*
                        let loadingInstance = this.$loading({
                          text: "加载中...",
                          spinner: "el-icon-loading",
                          background: "rgba(255, 255, 255, 0)",
                          color: "white",
                          customClass: "loadingclass",
                        });
                        // 模拟异步操作
                        setTimeout(() => {
                          loadingInstance.close();
                        }, 2000);*/
            }
        },
        async refreshWatchData() {
            //刷新报警监控数据的函数
            if (!this.timerEnabled)
                //在刷新配置的时候停止数据的刷新
                return;
            var paramIds = this.paramIds;
            var qp = { paramIds: paramIds, readChanged: true, fromCache: false };
            // var qp1 = { "paramId": 1, startTime: '2024-12-13 00:00:00', endTime: '2024-12-13 01:00:00', interval: 0 }
            // console.log('qp', qp);
            //发送
            let resp = await readAlarmData(qp); //读取报警数据
            // let resp1 = await querySingleCurve(qp1) //读取报警数据
            console.log("111", this.array);

            // .then((resp) => {
            // console.log("接收到报警值", resp);
            // resp.rows[0].alarmState = 1
            // resp.rows[1].alarmState = 2
            // resp.rows[2].alarmState = 3
            var returnData = resp.rows;
            //   console.log(resp);
            returnData = Array.from(
                new Set(resp.rows.map((item) => item.paramId))
            ).map((paramId) => resp.rows.find((item) => item.paramId === paramId));
            console.log(returnData);

            if (returnData) {
                for (var i = 0; i < returnData.length; i++) {
                    var paramId = returnData[i].paramId;
                    var value = returnData[i].value;
                    var ts = returnData[i].timeStamp;
                    var lastUpdateTime = returnData[i].lastUpdateTime;

                    // let res1 = await getDeviceAlarmSetupByParamIds(paramId)
                    // res1.data = [{
                    //     "id": "10",
                    //     "paramId": "16",
                    //     "normal": null,
                    //     "low": 10,
                    //     "up": null,
                    //     "lowlow": 10,
                    //     "upup": null,
                    //     "alarmPolicy": 0,
                    //     "ignorePeriod": 0,
                    //     "alarmValue": 1,
                    //     "alarmTagId": null,
                    //     "actived": null
                    // }]
                    if (this.alarmDataMap[paramId]) {
                        var alarmDataItem = this.alarmDataMap[paramId];
                        alarmDataItem = Object.assign(alarmDataItem, returnData[i]); //对象赋值
                        // console.log(alarmDataItem);
                        this.array[i].num = value; //实际值
                        this.array[i].statuscode = returnData[i].alarmState + ""; //报警状态
                        // this.array[i].alarmVal = returnData[i].alarmVal; //报警值
                    }
                }
                // this.array[0].statuscode = 1
                // this.array[1].statuscode = 2
            }
            this.componentKey++;
            // }
            // )
            // .catch((resp) => { });
        },
        formatValue(item) {
            if (item.num == 0) return "0.00";
            else if (!item.num) return "";
            return item.num.toFixed(2);
        },
        getImageUrl(item) {
            return String(item.statuscode) == "0"
                ? require("../../assets/images/greenlight.png")
                : item.statuscode == "1"
                    ? require("../../assets/images/yellowlight.png")
                    : require("../../assets/images/redlight.png");
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
        },
        getAuthData() {
            // console.log('系统权限信息已更新');
            // console.log('新值:', this.systemauthInfo.permissions);
            // console.log('旧值:', oldVal);
            if (this.systemauthInfo.permissions[0] != "*:*:*") {
                this.alarm_auth = this.systemauthInfo.pagePermissions
            } else {
                // alarmworkorder
                this.alarm_auth = this.systemauthInfo.pagePermissions.filter(item => item.name.indexOf('TbAlarmWorkOrder') >= 0)
            }
            // 工单权限主要分为两种：
            // 1、修改权限，工单处置权限
            // 2、新增权限，工单指派权限
            this.warning_handle_type = this.alarm_auth.filter(item => item.name ==
                'TbAlarmWorkOrder处理' || item.name == 'TbAlarmWorkOrder指派').map(
                    item => item.name
                )
            this.warning_handle_operate = this.alarm_auth.find(item => item.name ==
                'TbAlarmWorkOrder处理') ? 'edit' : 'add'
            console.log('this.warning_handle_type :', this.warning_handle_type);

        }
    },
    watch: {
        systemauthInfo: {
            handler(newVal, oldVal) {
                // console.log('系统权限信息已更新');
                // console.log('新值:', newVal.permissions);
                // console.log('旧值:', oldVal);
                if (newVal.permissions[0] != "*:*:*") {
                    this.alarm_auth = newVal.pagePermissions
                } else {
                    // alarmworkorder
                    this.alarm_auth = newVal.pagePermissions.filter(item => item.name.indexOf('TbAlarmWorkOrder') >= 0)
                }
                // 工单权限主要分为两种：
                // 1、修改权限，工单处置权限
                // 2、新增权限，工单指派权限
                this.warning_handle_type = this.alarm_auth.filter(item => item.name ==
                    'TbAlarmWorkOrder处理' || item.name == 'TbAlarmWorkOrder指派').map(
                        item => item.name
                    )

                this.warning_handle_operate = this.alarm_auth.find(item => item.name ==
                    'TbAlarmWorkOrder处理') ? 'edit' : 'add'
                console.log('this.warning_handle_type :', this.warning_handle_type);


            },
            deep: true        // 深度监听对象内部变化
        }
    },

};
</script>

<style lang="less"></style>