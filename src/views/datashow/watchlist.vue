<template>
    <div :key="componentKey" style="color: #6cc9d3;" v-loading="loading">
        <el-row class="introcontent" v-for="item in watchDataList" style="margin: 0.1rem 0px" type="flex">
            <el-col class="name" :span="widthval[0]" style="margin-right: 0.5rem">
                <el-popconfirm class="confrimwarning"
                    v-if="[-2, -1, 1, 2].includes(item.alarmValue) && warning_handle_operate == 'add'"
                    placement="top-start" title="处理报警" @confirm="confirm(item)">
                    <span slot="reference" style="cursor: pointer;" class="showDialogtext"
                        v-html="getRedWarningSpan(item.alarmValue, item.paramRemark)"></span>
                </el-popconfirm>
                <span v-html="getRedWarningSpan(item.alarmValue, item.paramRemark)" v-else></span>
            </el-col>
            <el-col class="value" :span="widthval[1]" style="min-width: 2rem" v-if="item.sysDictType"
                v-html="formatValue(item)"></el-col>
            <el-tooltip popper-class="warning_tips" v-else effect="dark" placement="right">
                <template slot="content"><span v-html="showInfoFunc(item)"></span></template>
                <div class="title-container">
                    <img :src="getImageUrl(item)" width="30px" v-if="[-2, -1, 1, 2].includes(item.alarmValue)"
                        class="warning-animation" style="margin-top: -10px;" />
                    <span v-html="formatValue(item)" class="warntips" @click="showmoreInfo(item)"
                        style="cursor: pointer;"></span>
                </div>
            </el-tooltip>
        </el-row>

        <el-dialog :title="'处理报警'" :visible.sync="addRowDialogVisible" :modal="false" top="0.8rem" class="feedback"
            :close-on-click-modal="false" v-if="addRowDialogVisible">
            <!-- <div style="margin-bottom: 0.1rem;" v-for="(item, index) in alertWarningdata">
                <el-row v-if="index != 'paramId' && index != 'id'"> -->
            <div v-html="showInfoFunc(alertWarningdata)"></div>

            <div style="margin: 0.2rem 0">
                {{ alertWarningdata.deviceName }}_{{ alertWarningdata.channelName }}
            </div>
            <div>{{ alertWarningdata.paramRemark }}：<span v-html="formatValue(alertWarningdata)"></span></div>

            <el-form :model="newRow" label-position="top" ref="newRow">
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
                <el-button @click="addRowDialogVisible = false; newRow = {}; setTimer()">取消</el-button>
                <el-button @click="addWarningdata()" type="primary" :loading="loadingbtn">确定</el-button>

            </span>
        </el-dialog>

        <el-dialog :modal="false" title="查看" :visible.sync="dialogshow" custom-class="warndialogshow"
            :bodyStyle="{ 'padding-top': 0 }" top="0.6rem" @close="setTimer">
            <span v-html="showInfoFunc(curr_clickdata)" style="display: block;margin-bottom: 0.3rem;"></span>

            <div style="width: 100%">
                <chart :chart-id="'main'" :curr_clickdata="curr_clickdata" v-if="dialogshow" ref="chartCom">
                </chart>
            </div>
        </el-dialog>
    </div>
</template>

<script>
//加载数据字典信息
import { getDictList } from "@/api/dict/data";
//设备信息列表
import { listDevice } from "@/api/watch/device";
//设备参数信息
import { queryDeviceParameter } from "@/api/watch/deviceparameter";
import { getDeviceAlarmSetupByParamIds } from "@/api/watch/devicealarmsetup";
import chart from "./charts/chart.vue";
import { listUser } from "@/api/system/user";

//设备监控信息
import {
    generateDemoWatchData,
    readWatchData,
    reconfigWatchData,
} from "@/api/watch/watchdata";
import { addAlarmWorkOrder } from "@/api/system/alarmworkorder";

export default {
    name: "DeviceWatchList",
    props: ["deviceId", "deviceType", "widthval"],
    data() {
        return {
            dialogshow: false,

            dictConfigMap: {}, //每个开关量显示的字典项
            // 遮罩层
            loading: true, //数据加载标志
            dataList: [],
            componentKey: 0, //对象的键值
            //监控设备数据
            watchDataList: [],
            //设备参数id到设备参数的映射表
            watchDataMap: {},
            timer: null, //定时器
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10000,
                searchText: "",
                plant: null, //分厂
                deviceId: this.deviceId, //设备
                deviceType: this.deviceType, //设备类型映射到当前设备
            },
            curr_clickdata: {},
            alarm_auth: [],
            warning_handle_type: "",
            warning_handle_operate: "",
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
            options: [],

        };
    },
    components: { chart },
    created() {
        this.getList(); //查询监控数据列表
    },

    mounted() {
        // this.refreshWatchData()
        this.$nextTick(() => {
            this.getAuthData()
        })
        this.setTimer();
        // listDevice().then((res) => {
        //   console.log(res.data);
        // });
    },
    destroyed() {
        this.disableTimer();
    },
    methods: {
        async addWarningdata() {
            let params = {
                "createTime": "",
                "updateTime": "",
                "params": {},
                "startTime": null,
                "endTime": null,
                "warnRank": this.alertWarningdata.alarmValue,//报警级别
                "paramId": this.alertWarningdata.paramId,//参数id
                // "paramName": this.alertWarningdata.channelName,//设备参数名名称
                "paramName": '',//设备参数名名称
                "targetCode": "",//设备参数编码
                "targetType": "",//类型
                "equipCode": "",//设备编码
                "paramValue": this.alertWarningdata.value ? this.alertWarningdata.value : 0,
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
                "bitNo": this.alertWarningdata.deviceName + '_' + this.alertWarningdata.paramRemark,//设备编号
                "low": this.alertWarningdata.low,
                "lowlow": this.alertWarningdata.lowlow,
                "up": this.alertWarningdata.up,
                "upup": this.alertWarningdata.upup,
                "plant": ''
            }
            if (params.bitNo.indexOf('高炉') >= 0) {
                params.plant = '炼铁厂'
            } else if (params.bitNo.indexOf('转炉') >= 0) {
                params.plant = '炼刚厂'
            } else if (params.bitNo.indexOf('煤气') >= 0) {
                params.plant = '石灰厂'
            } else if (params.bitNo.indexOf('液氧储槽') >= 0) {
                params.plant = '制氧厂'
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
        confirm(data) {
            this.alertWarningdata = data;
            this.addRowDialogVisible = true;
            this.disableTimer()
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
        async showmoreInfo(data) {
            this.disableTimer()
            this.curr_clickdata = data;
            this.dialogshow = true;
        },
        getImageUrl(item) {
            return [-2, -1].includes(item.alarmValue)
                ? require("../../assets/images/yellowlight.png")
                : require("../../assets/images/redlight.png");
        },
        showInfoFunc(item) {
            return `${this.warningtype(item)}标准值：${item.normal ? item.normal + item.unit : '未设置'}；</br>低限值：${item.low ? item.low + item.unit : "未设置"}；低低限值：${item.lowlow ? item.lowlow + item.unit : "未设置"}；</br>高限值：${item.up ? item.up + item.unit : "未设置"}；高高限值：${item.upup ? item.upup + item.unit : "未设置"}；`
        },
        setTimer() {

            this.timer = setInterval(this.refreshWatchData, 2000);

        },
        disableTimer() {
            // console.log("hhh", this.timer);
            if (this.timer != null) {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        warningtype(item) {
            let alarmValue = item.alarmValue
            switch (true) {
                case (alarmValue == -2): {
                    return `报警类型：<span class="yellow-warning">低低报</span></br>`
                }
                case (alarmValue == -1): {
                    return `报警类型：<span class="yellow-warning">低报</span></br>`
                }
                case (alarmValue == 1): {
                    return `报警类型：<span class="red-warning">高报</span></br>`
                }
                case (alarmValue == 2): {
                    return `报警类型：<span class="red-warning">高高报</span></br>`
                }
                default: {
                    return ''
                }
            }
        },
        // 提取公共的红色警告样式方法
        getRedWarningSpan(alarmValue, showInfo) {
            // console.log(alarmValue, showInfo);
            switch (true) {
                case (alarmValue == -2): {
                    return `<span class="yellow-warning">${showInfo}</span>`
                }
                case (alarmValue == -1): {
                    return `<span class="yellow-warning">${showInfo}</span>`
                }
                case (alarmValue == 1): {
                    return `<span class="red-warning">${showInfo}</span>`
                }
                case (alarmValue == 2): {
                    return `<span class="red-warning">${showInfo}</span>`
                }
                default: {
                    return showInfo
                }
            }
        },

        formatValue(item) {
            if (item.sysDictType) {
                let showInfo = '';
                // console.log(item.sysDictType);
                if (this.dictConfigMap && this.dictConfigMap[item.sysDictType]) {
                    showInfo = this.dictConfigMap[item.sysDictType][item.value + ""] ? this.dictConfigMap[item.sysDictType][item.value + ""] : '';
                    return showInfo == '解锁' ? `<span class="red-warning">${showInfo}</span>` : `<span>${showInfo}</span>`
                }
            } else {
                // 处理非字典类型的值显示
                // console.log(item.value);
                const showvalue = item.value ? parseFloat(item.value).toFixed(2) : 0;
                const showInfo = `${showvalue}${item.unit}`;
                // console.log(item.alarmValue);

                return [-2, -1, 1, 2].includes(item.alarmValue) ? this.getRedWarningSpan(item.alarmValue, showInfo) : showInfo;
            }

            // 如果没有满足任何条件，返回空字符串或其他默认值
            return '';
        },
        refreshWatchData() {
            //刷新监控数据
            if (this.watchDataList == null) return;
            //如果有对象的情况下只更新对象的值
            var paramsIds = [];
            //console.log('watchDataList', this.watchDataList)
            for (var i = 0; i < this.watchDataList.length; i++) {
                var watchdata = this.watchDataList[i];
                if (watchdata.paramId) {
                    paramsIds.push(watchdata.paramId);
                }
            }
            var qp = { paramIds: paramsIds, readChanged: true, fromCache: true };
            // console.log('qp', qp);
            //发送
            readWatchData(qp)
                .then((resp) => {
                    // console.log("resp", resp);
                    var returnData = resp.rows;
                    if (returnData) {
                        this.updateWatchData(returnData); //更新对象的监控数据
                    }
                    this.loading = false;

                })
                .catch((resp) => { });
        },
        async updateWatchData(returnData) {
            //根据返回的数据刷新监控数据
            // console.log('returndata', returnData);
            // console.log('watchDataMap', this.watchDataMap);

            for (var i = 0; i < returnData.length; i++) {
                var paramId = returnData[i].paramId;
                var value = returnData[i].value;
                var ts = returnData[i].timeStamp;
                var lastUpdateTime = returnData[i].lastUpdateTime;
                //console.log('aa', this.watchDataMap[paramId])
                // let res1 = await getDeviceAlarmSetupByParamIds(paramId)
                // console.log('res1', res1.data[0]);
                // res1.data[0].alarmValue = -3 + i
                if (this.watchDataMap[paramId]) {
                    console.log("refresh ok");
                    var checkDataItem = this.watchDataMap[paramId]; //得到检验项信息
                    // console.log(checkDataItem);
                    checkDataItem.value = value;
                    checkDataItem.lastUpdateTime = lastUpdateTime; //设置更新时间
                    checkDataItem.timeStamp = ts;
                }
            }


            console.log(returnData);
            this.componentKey++;
        },
        updateWatchDictTypeMap(
            dictTypes //更新监控信息的字典项
        ) {
            getDictList(dictTypes).then((resp) => {
                //解析字典项列表
                // console.log("dictdatalist", resp);
                var myDicDataList = resp.data;
                if (resp.code == 200) {
                    this.dictConfigMap = {};
                    for (var i = 0; i < myDicDataList.length; i++) {
                        var myrow = myDicDataList[i];
                        var dictType = myrow.dictType; //字典类型
                        var dictLabel = myrow.dictLabel;
                        var dictValue = myrow.dictValue;
                        if (dictType) {
                            if (!this.dictConfigMap[dictType]) {
                                this.dictConfigMap[dictType] = {};
                            }
                            this.dictConfigMap[dictType][dictValue] = dictLabel;
                        }
                    }
                } else {
                    this.$message({
                        type: "warning",
                        message: "登录已过期,自动重新登录",
                        //   duration: 0,
                        showClose: true,
                    });
                    this.disableTimer();
                    setTimeout(() => {
                        this.$router.push("/");
                    }, 2000);
                }

                // console.log("dictConfigMap", this.dictConfigMap);
            });
        },
        buildWatchList(deviceParameterList) {
            var result = [];
            if (!deviceParameterList) return result;
            for (var i = 0; i < deviceParameterList.length; i++) {
                var input = deviceParameterList[i];
                var item = {
                    paramId: input.id, //参数id
                    deviceId: input.deviceId, //设备id
                    paramRemark: input.remark,
                    tagId: input.tagId,
                    timeStamp: undefined,
                    value: undefined,
                    deviceType: input.deviceType,
                    sysDictType: input.sysDictType,
                    deviceName: input.deviceName,
                    lastUpdateTime: 0,
                    unit: ""
                };

                switch (true) {
                    case item.paramRemark.indexOf("转炉水冷氧枪氧气压力") >= 0: {
                        item.unit = " MPa";
                        break;
                    }
                    case item.paramRemark.indexOf("水流量") >= 0: {
                        item.unit = " Nm3/h";
                        break;
                    }
                    case item.paramRemark.indexOf("温度") >= 0: {
                        item.unit = " °C"; // 使用度数符号
                        break;
                    }
                    case item.paramRemark.indexOf("炉顶工作压力") >= 0: {
                        item.unit = " kPa"; // 使用度数符号
                        break;
                    }
                }
                result.push(item);
            }
            return result;
        },
        /** 查询监控数据列表 */
        async getList() {
            this.loading = true;
            console.log("queryParams", this.queryParams);
            let response = await queryDeviceParameter(this.queryParams)
            var deviceParameterList = response.rows; //返回感知数据的结果
            // console.log("deviceParameterList", deviceParameterList);
            this.total = response.total;
            this.watchDataList = this.buildWatchList(deviceParameterList); //根据设备参数
            this.watchDataMap = {};
            let dictTypes = [];
            for (var i = 0; i < this.watchDataList.length; i++) {
                var paramId = this.watchDataList[i].paramId + "";
                var sysDictType = this.watchDataList[i].sysDictType;
                if (sysDictType && !dictTypes.includes(sysDictType))
                    dictTypes.push(sysDictType);
                this.watchDataMap[paramId] = this.watchDataList[i]; //得到监控参数的映射表

                let res1 = await getDeviceAlarmSetupByParamIds(paramId)

                if (res1.data[0]) {
                    this.watchDataMap[paramId].normal = res1.data[0].normal
                    this.watchDataMap[paramId].low = res1.data[0].low
                    this.watchDataMap[paramId].lowlow = res1.data[0].lowlow
                    this.watchDataMap[paramId].up = res1.data[0].up
                    this.watchDataMap[paramId].upup = res1.data[0].upup
                    this.watchDataMap[paramId].alarmValue = res1.data[0].alarmValue
                }

            }
            // console.log('获得字典项信息列表:', dictTypes)
            this.updateWatchDictTypeMap(dictTypes);
            // this.watchDataList[1].alarmValue = 2
            // this.watchDataList[3].alarmValue = -1
            // this.refreshWatchData();
            // console.log("watchDataMap", this.watchDataMap);
            // console.log("total", this.total);

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
            console.log('this.warning_handle_operate :', this.warning_handle_operate);

        }
    },
    computed: {
        'systemauthInfo'() {
            return this.$store.state.authInfo
        },

        'systemloginInfo'() {
            return this.$store.state.loginInfo
        },
        activeIndex() {
            return this.$route.fullPath;
        },
    },
    watch: {
        activeIndex(newvalue, oldvalue) {
            console.log('aaaaaaaaa', newvalue);
            this.getAuthData()
        },
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

                this.warning_handle_operate = this.alarm_auth.find(item => item.name == 'TbAlarmWorkOrder处理') ? 'edit' : 'add'
            },
            deep: true        // 深度监听对象内部变化
        }
    },
};
</script>

<style></style>