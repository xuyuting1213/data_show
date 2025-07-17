<template>
  <div :key="componentKey" style="color: #6cc9d3">
    <el-row
      class="introcontent"
      v-for="item in watchDataList"
      style="margin: 10px 0px"
    >
      <el-col class="name" :span="widthval[0]">{{ item.paramRemark }}</el-col>
      <el-col class="value" :span="widthval[1]">{{ formatValue(item) }}</el-col>
    </el-row>
  </div>
</template>

<script>
//加载数据字典信息
import { getDictList } from "@/api/dict/data";
//设备信息列表
import { listDevice } from "@/api/watch/device";
//设备参数信息
import { queryDeviceParameter } from "@/api/watch/deviceparameter";

//设备监控信息
import {
  generateDemoWatchData,
  readWatchData,
  reconfigWatchData,
} from "@/api/watch/watchdata";

export default {
  name: "DeviceWatchList",
  props: ["deviceId", "deviceType", "widthval"],
  data() {
    return {
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
    };
  },
  created() {
    this.getList(); //查询监控数据列表
  },
  mounted() {
    this.setTimer();
   
  },
  beforeDistory() {
    this.disableTimer();
  },
  methods: {
    setTimer() {
      this.timer = setInterval(this.refreshWatchData, 2000);
      this.$once("hook:beforeDestory", () => {
        this.disableTimer();
      });
    },
    disableTimer() {
      if (this.timer != null) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
    formatValue(
      item //对数据进行格式化
    ) {
      if (item.sysDictType) {
        if (this.dictConfigMap && this.dictConfigMap[item.sysDictType]) {
          return this.dictConfigMap[item.sysDictType][item.value + ""];
        }
        return item.value;
      } else {
        if (item.value == 0) return "0";
        else if (!item.value) return "";
        return item.value.toFixed(2);
      }
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
          console.log("resp", resp);
          var returnData = resp.rows;
          if (returnData) {
            this.updateWatchData(returnData); //更新对象的监控数据
          }
        })
        .catch((resp) => {});
    },
    updateWatchData(returnData) {
      //根据返回的数据刷新监控数据
      //console.log('returndata', returnData);
      //console.log('watchDataMap', this.watchDataMap);

      for (var i = 0; i < returnData.length; i++) {
        var paramId = returnData[i].paramId;
        var value = returnData[i].value;
        var ts = returnData[i].timeStamp;
        var lastUpdateTime = returnData[i].lastUpdateTime;
        //console.log('aa', this.watchDataMap[paramId])
        if (this.watchDataMap[paramId]) {
          console.log("refresh ok");
          var checkDataItem = this.watchDataMap[paramId]; //得到检验项信息
          checkDataItem.value = value;
          checkDataItem.lastUpdateTime = lastUpdateTime; //设置更新时间
          checkDataItem.timeStamp = ts;
        }
      }
      this.componentKey++;
    },
    updateWatchDictTypeMap(
      dictTypes //更新监控信息的字典项
    ) {
      getDictList(dictTypes).then((resp) => {
        //解析字典项列表
        console.log("dictdatalist", resp);
        var myDicDataList = resp.data;
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
        console.log("dictConfigMap", this.dictConfigMap);
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
        };
        result.push(item);
      }
      return result;
    },
    /** 查询监控数据列表 */
    getList() {
      this.loading = true;
      console.log("queryParams", this.queryParams);
      queryDeviceParameter(this.queryParams).then((response) => {
        var deviceParameterList = response.rows; //返回感知数据的结果
        console.log("deviceParameterList", deviceParameterList);
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
        }
        //console.log('获得字典项信息列表:', dictTypes)
        this.updateWatchDictTypeMap(dictTypes);
        this.refreshWatchData();
        console.log("watchDataMap", this.watchDataMap);
        console.log("total", this.total);
        this.loading = false;
      });
    },
  },
};
</script>

<style></style>
