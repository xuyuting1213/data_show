import axios from "axios";
import qs from 'qs'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getVideoDevice } from "./watch/video/videodevice";

// /api/basic/tb_iron_blastfurnace_info
let request_base = '/api'
// let request = 'http://129.146.79.255:9999'
let request = '/api'
// let request = 'http://172.21.167.7:9999'
let videoapi = "/viedo_api"

// 创建一个 Axios 实例
const instance = axios.create({
    request,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
    const token = getToken('Admin-Token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(response => {
    return response;
}, error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
});

// 辅助函数
//   const postRequest = (url, params) => instance.post(url, qs.stringify(params));

// upload
export default {
    // /videolog
    // getVideoLog() {
    //     return axios.post('http://127.0.0.1:21001/videolog',)
    // },
    // getvideowarning(params) {
    //     return axios.post('http://127.0.0.1:21001/videowarning', params)
    // },
    getVideoKey(params) {
        return axios.post(videoapi + '/openapi/authenticate', params)
    },
    getvideologlist(params) {
        // console.log(params)
        return axios.get(videoapi + '/openapi/alert/list?keyword=&alertType=&startDate=' + params.startDate + '&endDate=' + params.endDate + '&page=' + params.page + '&size=' + params.size + '&id=',{
            
                headers: {
                    // isToken: true,
                    crKey: params.crKey,
                    // "Content-Type": "multipart/form-data"
                }
            
        })
    },
    getvideologDetail(params) {
        return axios.get(videoapi + '/openapi/task/detail?taskId=' + params.taskId )
    },
    // 获取图片地址
    getimage(names) {
        console.log(request + names)
        return axios.get(request + names, {
            responseType: "blob", // 设置响应类型为 blob
        })
    },
    // 企业基础信息
    companyinfo() {
        return axios.get(request + '/basic/tb_iron_companyinfo/read')
    },
    writecompanyinfo(params) {
        return axios.post(request + '/basic/tb_iron_companyinfo/write', qs.stringify(params))
    },
    // 企业专项信息
    companyspecialinfo() {
        return axios.get(request + '/basic/tb_iron_ironinfo/read')
    },
    writecompanyspecialinfo(params) {
        return axios.post(request + '/basic/tb_iron_ironinfo/write', qs.stringify(params))
    },
    // 企业自动化信息
    autocompanyInfo() {
        return axios.get(request + '/basic/tb_auto_construction_situation/read')
    },
    //企业自动化信息写
    writeAutocompanyInfo(params) {
        return axios.post(request + '/basic/tb_auto_construction_situation/write', qs.stringify(params))
    },
    // 企业自动化信息删除
    deleteAutocompanyInfo(params) {
        return axios.post(request + '/basic/tb_auto_construction_situation/delete', qs.stringify(params))
    },


    // 基础页面--所有删除接口
    deleteDeviceinfo(params) {
        return axios.post(request + '/function/switch_device_to_unactive', qs.stringify(params))
    },
    // device_info_filter
    // 基础页面--所有筛选接口
    filterDeviceinfo(params) {
        console.log(params);
        return axios.post(request + '/function/device_info_filter', qs.stringify(params))
    },



    //设施信息--高炉查
    readTallbottle(params) {
        return axios.post(request + '/basic/tb_iron_blastfurnace_info/read', qs.stringify(params))
    },
    // 基础页面高炉增加
    writeTallbottle(params) {
        return axios.post(request + '/basic/tb_iron_blastfurnace_info/write', qs.stringify(params))
    },
    // 基础页面高炉修改
    updateTallbottle(params) {
        return axios.post(request + '/basic/tb_iron_blastfurnace_info/update', qs.stringify(params))
    },

    //设施信息--转炉查询
    readRotatebottle(params) {
        return axios.post(request + '/basic/tb_iron_basicoxygenfurnace_info/read', qs.stringify(params))
    },
    // 基础页面转炉增加
    writeRotatebottle(params) {
        return axios.post(request + '/basic/tb_iron_basicoxygenfurnace_info/write', qs.stringify(params))
    },
    // 基础页面转炉编辑
    updateRotatebottle(params) {
        return axios.post(request + '/basic/tb_iron_basicoxygenfurnace_info/update', qs.stringify(params))
    },

    //设施信息--煤气柜查询
    readGasbox(params) {
        return axios.post(request + '/basic/tb_iron_gastank_info/read', qs.stringify(params))
    },
    // 基础页面煤气柜增加
    writeGasbox(params) {
        return axios.post(request + '/basic/tb_iron_gastank_info/write', qs.stringify(params))
    },
    // 基础页面煤气柜删除
    updateGasbox(params) {
        return axios.post(request + '/basic/tb_iron_gastank_info/update', qs.stringify(params))
    },

    //设施信息--连铸机查询
    readContinuous(params) {
        return axios.post(request + '/basic/tb_iron_continuouscastingmachine_info/read', qs.stringify(params))
    },
    // 基础页面连铸机增加
    writeContinuous(params) {
        return axios.post(request + '/basic/tb_iron_continuouscastingmachine_info/write', qs.stringify(params))
    },
    // 基础页面连铸机修改
    updateContinuous(params) {
        return axios.post(request + '/basic/tb_iron_continuouscastingmachine_info/update', qs.stringify(params))
    },

    // tb_iron_crane_info/read
    //设施信息--吊运熔融
    readHangmachine(params) {
        return axios.post(request + '/basic/tb_iron_crane_info/read', qs.stringify(params))
    },
    // 基础页面吊运熔融增加
    writeHangmachine(params) {
        return axios.post(request + '/basic/tb_iron_crane_info/write', qs.stringify(params))
    },
    // 基础页面吊运熔融删除
    updateHangmachine(params) {
        return axios.post(request + '/basic/tb_iron_crane_info/update', qs.stringify(params))
    },

    // tb_iron_moltenmetaltank_info/read
    //设施信息--熔融金属罐体
    readmoltentaltank(params) {
        return axios.post(request + '/basic/tb_iron_moltenmetaltank_info/read', qs.stringify(params))
    },
    // 设施信息--熔融金属罐体增加
    writemoltentaltank(params) {
        return axios.post(request + '/basic/tb_iron_moltenmetaltank_info/write', qs.stringify(params))
    },
    // 设施信息--熔融金属罐体更新
    updatemoltentaltank(params) {
        return axios.post(request + '/basic/tb_iron_moltenmetaltank_info/update', qs.stringify(params))
    },
    // tb_iron_gaspartitiondevice_info/read
    //设施信息--煤气管道
    readGaspartitiondevice(params) {
        return axios.post(request + '/basic/tb_iron_gaspartitiondevice_info/read', qs.stringify(params))
    },
    // 设施信息--煤气管道
    writeGaspartitiondevice(params) {
        return axios.post(request + '/basic/tb_iron_gaspartitiondevice_info/write', qs.stringify(params))
    },
    // 设施信息--煤气管道
    updateGaspartitiondevice(params) {
        return axios.post(request + '/basic/tb_iron_gaspartitiondevice_info/update', qs.stringify(params))
    },
    // tb_iron_coalarm_info/read
    //设施信息--正压煤气管道
    readGasdrainer(params) {
        return axios.post(request + '/basic/tb_iron_gasdrainer_info/read', qs.stringify(params))
    },
    // 设施信息--正压煤气管道
    writeGasdrainer(params) {
        return axios.post(request + '/basic/tb_iron_gasdrainer_info/write', qs.stringify(params))
    },
    // 设施信息--正压煤气管道
    updateGasdrainer(params) {
        return axios.post(request + '/basic/tb_iron_gasdrainer_info/update', qs.stringify(params))
    },

    // tb_iron_coalarm_info/read
    //设施信息--固定式一氧化碳
    readCoalarm(params) {
        return axios.post(request + '/basic/tb_iron_coalarm_info/read', qs.stringify(params))
    },
    // 设施信息--固定式一氧化碳
    writeCoalarm(params) {
        return axios.post(request + '/basic/tb_iron_coalarm_info/write', qs.stringify(params))
    },
    // 设施信息--固定式一氧化碳
    updateCoalarm(params) {
        return axios.post(request + '/basic/tb_iron_coalarm_info/update', qs.stringify(params))
    },


    // tb_iron_coalarm_info/read
    //设施信息--、炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施信息表
    readEmergencyfac(params) {
        return axios.post(request + '/basic/tb_emergency_facilities_info/read', qs.stringify(params))
    },
    // 设施信息--、炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施信息表
    writeEmergencyfac(params) {
        return axios.post(request + '/basic/tb_emergency_facilities_info/write', qs.stringify(params))
    },
    // 设施信息--、炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施信息表
    deleteEmergencyfac(params) {
        return axios.post(request + '/basic/tb_emergency_facilities_info/delete', qs.stringify(params))
    },
    // 设施信息--、炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施信息表
    updateEmergencyfac(params) {
        return axios.post(request + '/basic/tb_emergency_facilities_info/update', qs.stringify(params))
    },

    // tb_iron_coalarm_info/read
    //设施信息--高炉生产过程炉顶放散阀联锁放散压力设定值信息表
    readReliefset(parmas) {
        return axios.post(request + '/basic/tb_relief_pressure_setting_info/read', qs.stringify(parmas))
    },
    // 设施信息--高炉生产过程炉顶放散阀联锁放散压力设定值信息表
    writeReliefset(params) {
        return axios.post(request + '/basic/tb_relief_pressure_setting_info/write', qs.stringify(params))
    },
    // 设施信息--高炉生产过程炉顶放散阀联锁放散压力设定值信息表
    updateReliefset(params) {
        return axios.post(request + '/basic/tb_relief_pressure_setting_info/update', qs.stringify(params))
    },

    // tb_iron_coalarm_info/read
    //日常检验--点检记录
    readCheckout(params) {
        return axios.post(request + '/dm/tb_iron_check_record/read', qs.stringify(params))
    },
    // 点检记录读出一条，且可以查看该条历史数据
    OnedeviceCheckout(params) {
        return axios.post(request + '/dm/tb_iron_check_record/read_one_device', qs.stringify(params))
    },
    //日常检验--点检记录，
    updateCheckout(params) {
        return axios.post(request + '/dm/tb_iron_check_record/update', qs.stringify(params))
    },
    //日常检验--新增点检记录，
    writeCheckout(params) {
        return axios.post(request + '/dm/tb_iron_check_record/write', qs.stringify(params))
    },
    //日常检验--点检记录
    deleteCheckout(params) {
        return axios.post(request + '/dm/tb_iron_check_record/delete', qs.stringify(params))
    },


    // tb_iron_coalarm_info/read
    //日常检验--定期检验/校准记录
    readRegularcheck(params) {
        return axios.post(request + '/dm/tb_iron_regularcheck_record/read', qs.stringify(params))
    },
    //定期检验读出一条，且可以查看该条历史数据
    OnedeviceRegularcheck(params) {
        return axios.post(request + '/dm/tb_iron_regularcheck_record/read_one_device', qs.stringify(params))
    },
    //日常检验--定期检验/校准记录
    updateRegularcheck(params) {
        return axios.post(request + '/dm/tb_iron_regularcheck_record/update', qs.stringify(params))
    },
    //日常检验--定期检验/校准记录
    writeRegularcheck(params) {
        return axios.post(request + '/dm/tb_iron_regularcheck_record/write', qs.stringify(params))
    },
    //日常检验--定期检验/校准记录
    deleteRegularcheck(params) {
        return axios.post(request + '/dm/tb_iron_regularcheck_record/delete', qs.stringify(params))
    },


    // tb_iron_coalarm_info/read
    //日常检验--停用设备记录
    readStopwork(params) {
        return axios.post(request + '/dm/tb_iron_device_stopwork_record/read', qs.stringify(params))
    },
    //日常检验--停用设备记录
    writeStopwork(params) {
        return axios.post(request + '/dm/tb_iron_device_stopwork_record/write', qs.stringify(params))
    },
    //停用设备且可以查看该条历史数据
    OnedeviceStopcheck(params) {
        return axios.post(request + '/dm/tb_iron_device_stopwork_record/read_one_device', qs.stringify(params))
    },
    //日常检验--停用设备记录
    deleteStopwork(params) {
        return axios.post(request + '/dm/tb_iron_device_stopwork_record/delete', qs.stringify(params))
    },
    //日常检验--停用设备记录
    updateStopwork(params) {
        return axios.post(request + '/dm/tb_iron_device_stopwork_record/update', qs.stringify(params))
    },



    // tb_iron_coalarm_info/read
    //日常检验--报废设备记录
    readScrapwork(params) {
        return axios.post(request + '/dm/tb_iron_device_scrap_record/read', qs.stringify(params))
    },
    //日常检验--报废设备记录
    writeScrapwork(params) {
        return axios.post(request + '/dm/tb_iron_device_scrap_record/write', qs.stringify(params))
    },
    //日常检验--报废设备记录
    updateScrapwork(params) {
        return axios.post(request + '/dm/tb_iron_device_scrap_record/update', qs.stringify(params))
    },
    //日常检验--报废设备记录
    deleteScrapwork(params) {
        return axios.post(request + '/dm/tb_iron_device_scrap_record/delete', qs.stringify(params))
    },
    //报废设备且可以查看该条历史数据
    OnedeviceScrapwork(params) {
        return axios.post(request + '/dm/tb_iron_device_scrap_record/read_one_device', qs.stringify(params))
    },

}


