// http://beziercg.lingfei.ife/qinyou-prod-api

import axios from "axios";
import qs from 'qs'
let request = '/reportapi/qinyou'
// let request = 'http://beziercg.lingfei.life/qinyou-prod-api/qinyou'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from "element-ui";
// upload
export default {
    // 获取token
    async getReportToken() {
        return axios.get(request + '/ReportedData/getToken')
    },
    // 文件上传
    // 文件上传
    async uploadFile(params, fileId) {
        // console.log(res);
        // if (res.status == 200) {

        try {
            // 获取访问令牌
            let res = await this.getReportToken();
            if (res.status !== 200) {
                throw new Error('Failed to get report token');
            }
            let res1 = await this.getFile({ relativeId: fileId }, res.data.data);
            // console.log('Access Token:', res.data.data);
            console.log('局端是否有该rellativeid', res1.data.data);

            // // 检查状态码是否为200

            if (res1.data.data.length == 0) {
                // 发起GET请求获取警告信息
                const response = axios.post('/zfapi/prod-api/web/ironWarn/store/upload', params, {
                    headers: {
                        // isToken: true,
                        Authorization: res.data.data,
                        "Content-Type": "multipart/form-data"
                    }
                })

                // 检查响应状态
                if (response.status === 200) {
                    console.log('Warning Info:', response.data);
                    return response.data;
                } else {
                    throw new Error(`Request failed with status ${response.status}`);
                }
            } else {
                return []
            }

        } catch (error) {
            console.error('Error in zfwarningInfo:', error.message);
            throw error; // 或者你可以选择在这里处理错误而不是抛出
        }

    },
    // /api/function/upload
    // 文件上传
    uploadFileLocal(params) {
        return axios.post('/api/function/upload', params, {
            // headers: {
            //     Authorization: getToken("Report-Token"),
            //     "Content-Type": "multipart/form-data"
            // }
        })
    },
    // web/ironWarn/store/deleteFileById
    //文件取消上传
    deleteuploadFile(params) {

        return axios.get('/api/web/ironWarn/store/deleteFileById?id=' + params.id, {
            headers: {
                Authorization: getToken("Report-Token"),
            }
        })
    },
    // ÷web/ironWarn/store/getByRelativeId
    // 文件获取id
    async getFile(params, token) {
        try {
            // 获取访问令牌
            // let res = await this.getReportToken();
            // // 检查状态码是否为200
            // if (res.status !== 200) {
            //     throw new Error('Failed to get report token');
            // }
            //    console.log(params)
            // 发起GET请求获取警告信息
            const response = await axios.get('/zfapi/prod-api/web/ironWarn/store/getByRelativeId?relativeId=' + params.relativeId, {
                headers: {
                    // isToken: true,
                    Authorization: token
                }
            })
            //  console.log(response)
            // 检查响应状态
            if (response.status === 200) {
                console.log('Warning Info:', response.data);
                return response.data;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Error in zfwarningInfo:', error.message);
            throw error; // 或者你可以选择在这里处理错误而不是抛出
        }
    },
    // 获取Id
    getReportId() {
        return axios.get(request + '/ReportedData/getId')
    },
    // 上报企业基础信息
    reportCompany(params) {
        return axios.post(request + '/ReportedData/ironWarn/basicCompany/updateByState', params)
    },
    // 企业基础信息获取
    readCompany() {
        // /qinyou/TbIronCompanyinfo/list
        return axios.get(request + '/TbIronCompanyinfo/1')
    },
    // 企业基础信息更新
    updateCompany(params) {
        // /qinyou/TbIronCompanyinfo/list
        return axios.put(request + '/TbIronCompanyinfo', params)
    },

    // 上报企业专项信息
    reportPersonal(params) {
        return axios.post(request + '/ReportedData/ironWarn/basicIron/saveByState', params)
    },
    // 企业专项信息获取
    readPersonal() {
        // /qinyou/TbIronCompanyinfo/list
        return axios.get(request + '/TbIronIroninfo/1', {
            headers: {
                // isToken: true,
                Authorization: 'Bearer ' + getToken('Admin-Token'),
                // "Content-Type": "multipart/form-data"
            }
        })
    },
    // 企业专项信息更新
    updatePersonal(params) {
        // /qinyou/TbIronCompanyinfo/list
        return axios.put(request + '/TbIronIroninfo', params)
    },

    // 上报设备
    reportDevice(params) {
        return axios.post(request + '/ReportedData/ironWarn/device/enterpriseSave', params)
    },
    //根据systemID获取新增修改状态
    listReportStatus(params) {
        return axios.post(request + '/ReportedData/device/state', params)
    },
    //点检根据id获取新增修改状态
    idscheckReportStatus(params) {
        return axios.post(request + '/ReportedData/supervision/checkRecord/flag', params)
    },
    //定期检验据id获取新增修改状态
    idsregularcheckReportStatus(params) {
        return axios.post(request + '/ReportedData/supervision/regularcheck/flag', params)
    },
    //停用根据id获取新增修改状态
    idsstopReportStatus(params) {
        return axios.post(request + '/ReportedData/supervision/stopworkRecord/flag', params)
    },
    //报废根据id获取新增修改状态
    idsscrabReportStatus(params) {
        return axios.post(request + '/ReportedData/supervision/scarpRecord/flag', params)
    },
    // 点检上报
    checkreportDevice(params) {
        return axios.post(request + '/ReportedData/supervision/checkRecord/save', params)
    },
    // 定期检验上报
    reugularcheckreportDevice(params) {
        return axios.post(request + '/ReportedData/supervision/regularcheck/save', params)
    },
    //停用上报
    stopreportDevice(params) {
        return axios.post(request + '/ReportedData/supervision/stopworkRecord/save', params)
    },
    //报废上报
    scrabreportDevice(params) {
        return axios.post(request + '/ReportedData/ironWarn/scarpRecord/save', params)
    },

    // 预警信息
    async zfwarningInfo(params) {
        try {
            // 获取访问令牌
            let res = await this.getReportToken();
            // console.log('Access Token:', res.data.data);

            // 检查状态码是否为200
            if (res.status !== 200) {
                throw new Error('Failed to get report token');
            }

            // 发起GET请求获取警告信息
            const response = await axios.get('/zfapi/prod-api/judgment/tbIronWarninfo/findJudgmentWarnInfo', {
                headers: {
                    Authorization: res.data.data,
                },
                params: params
            });

            // 检查响应状态
            if (response.status === 200) {
                // console.log('Warning Info:', response.data);
                return response.data;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('Error in zfwarningInfo:', error.message);
            throw error; // 或者你可以选择在这里处理错误而不是抛出
        }
    },
    // 预警信息反馈
    warninginfoFeedback(params) {
        return axios.post(request + '/ReportedData/judgment/tbIronWarninfo/updateFeedback', params)
    },
    // /qinyou/ReportedData/ironWarn/video/saveByState
    videoReport(params) {
        return axios.post(request + '/ReportedData/ironWarn/video/saveByState', params)
    },
}