


import { MessageBox } from 'element-ui';
import * as XLSX from 'xlsx';
import reportapi from '@/api/reportapi'
import api from './api';
let baseparams = {
    所属分厂: "",
    所属车间: "",
    设备类型: "",
    设备名称: "",
    企业内部编号: "",
    安装地点: "",
    运行状态: "",
}
let spcial_data = {
    '吊运熔融': {
        起重机代码: "",
        起重机品种: "",
        起重机型号: "",
        起重机类型: "",
        备注: "",
    },
    '金属熔融': {
        罐体设备类别: "",
        '额定容量（t）': "",
        '耳轴数量（个）': "",
        备注: "",
    },
    '一氧化碳报警器': {
        位置类型: "",
        量程PPM: "",
        设备厂家: "",
        规格型号: "",
        出厂编号: "",
        通讯协议: "",
        备注: "",
    }
    // '正压煤气管道': {
    //     水封高度mmH2O: "",
    //     水封高度kPa: "",
    //     结构类型: "",
    //     腔室数量: "",
    //     备注: ""
    // }
}
// 方法用于将 allparams 的值赋给 baseparams
// 基础信息的参数，分为基础参数，和页面特殊参数两类
const assignValues = (con_params, allparams) => {
    // let unparams, allparams
    // if (typeof con_params == 'string' || typeof con_params == 'undefined') {//有检验信息列的情况
    //     unparams = spcial_data[con_params]
    //     allparams = all_params
    // } else {
    //     unparams = baseparams
    //     allparams = con_params
    // }
    let unparams = typeof con_params == 'string' && spcial_data[con_params] ? spcial_data[con_params] : baseparams
    // console.log(con_params);
    // console.log(con_params, all_params);
    // console.log(unparams, allparams);
    let contained = Object.keys(unparams).reduce((acc, key) => {
        acc[key] = allparams[key] ? allparams[key] : "";
        // 编辑场景，防止后端返回Null但需要传值为''的情况，且所有日期为null时候，需要传值0000-00-00
        acc[key] = allparams[key] === null ? "" : acc[key];
        if (key.indexOf("日期") >= 0) {
            acc[key] = !acc[key] ? "0000-00-00" : acc[key];
        }
        return acc;
    }, {});
    let uncontained = Object.keys(allparams).reduce((acc, key) => {
        if (!unparams.hasOwnProperty(key)) {
            acc[key] = allparams[key];
            // 编辑场景，防止后端返回Null但需要传值为''的情况，且所有日期为null时候，需要传值0000-00-00
            acc[key] = acc[key] === null ? "" : acc[key];
            if (key.indexOf("日期") >= 0) {
                acc[key] = !acc[key] ? "0000-00-00" : acc[key];
            }
        }
        return acc;
    }, {});
    return [contained, uncontained];
}

// 设施信息最后两个参数，炼钢和高炉，

const assignValues_special = (con_params, allparams) => {
    // let unparams, allparams
    // if (typeof con_params == 'string' || typeof con_params == 'undefined') {//有检验信息列的情况
    //     unparams = spcial_data[con_params]
    //     allparams = all_params
    // } else {
    //     unparams = baseparams
    //     allparams = con_params
    // }
    let unparams = baseparams
    // console.log(con_params);
    // console.log(con_params, all_params);
    console.log(allparams);
    let contained = Object.keys(unparams).reduce((acc, key) => {
        acc[key] = allparams[key] === null ? null : allparams[key];
        // 编辑信息时需判断传参数是否为null.不要处理null转为‘’
        // 编辑场景，防止后端返回Null但需要传值为''的情况，且所有日期为null时候，需要传值0000-00-00

        return acc;
    }, {});
    let uncontained = Object.keys(allparams).reduce((acc, key) => {
        if (!unparams.hasOwnProperty(key)) {
            // 编辑信息时需判断传参数是否为null.不要处理null转为‘’
            // 编辑场景，防止后端返回Null但需要传值为''的情况，且所有日期为null时候，需要传值0000-00-00
            acc[key] = allparams[key] === null ? null : allparams[key];
            // if (key.indexOf("日期") >= 0) {
            //     acc[key] = !acc[key] ? "0000-00-00" : acc[key];
            // }
        }
        return acc;
    }, {});
    return [contained, uncontained];
}

const isObjectEmpty = (obj) => {
    // console.log('qwqw', obj);
    return Object.keys(obj).every(
        (key) => obj[key] == null
    );
}




//系统中整个form表单验证的全局函数
/** 
@param{numberdata} 必须为数字类型的字段，数组形式 如["点检周期（天）", "规格（t/台/年）"]
@param{newRow} 整个表单对象
@param{specialform} 有特殊校验的表单对象，比如非必填等单独的校验规则 如{
        停用证明资料: {
                required: false,
            },
*/
const formatFormRules = (numberdata, newRow, specialform) => {
    console.log(numberdata, newRow, specialform);
    let rulesdata = {};

    for (let i in newRow) {
        // console.log(numberdata, i);
        switch (true) {
            case numberdata.indexOf(i) >= 0:
                rulesdata[i] = [
                    {
                        required: true,
                        message: "必填项",
                        trigger: "change",
                    },
                    {
                        pattern: /^(\d+(\.\d*)?|\.\d+)$/,
                        message: "请输入一个数字",
                        trigger: "change",
                    },
                ];
                break;
            case (specialform && typeof specialform[i] == 'object') || (specialform && i == '备注') || (specialform && i == '设备编码' || (specialform && i == '问题描述') || (specialform && i == '图片描述') || (specialform && i == '存在问题')):
                rulesdata[i] = specialform[i]
                break
            default:
                rulesdata[i] = [
                    {
                        required: true,
                        message: "不能为空",
                        trigger: "change",
                    },
                ];
                break;
        }
    }
    return rulesdata
}

const functionConfirm = (value) => {
    return new Promise((resolve, reject) => {
        MessageBox.confirm('确认上报已选信息?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(() => {
            console.log(value);
            resolve({ status: 'yes', value }); // 返回一个对象，包含状态和传递的值
        }).catch(() => {
            resolve({ status: 'no' }); // 返回一个对象，仅包含状态
        });
    });
};


const downloadExcel = (value) => {
    let table_data = value.tableData.map(row => {
        const { 系统ID, ID, ...rest } = row; // 使用解构来去除“系统ID”
        return rest;
    });
    // console.log(table_data);
    // Step 1: 创建工作表并添加数据
    const worksheet = XLSX.utils.json_to_sheet(table_data);

    // Step 2: 创建工作簿
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, value.title + '表格数据');

    // Step 3: 导出 Excel 文件
    XLSX.writeFile(workbook, value.title + '表格数据.xlsx');
}
async function getId() {
    let res = await reportapi.getReportId();
    console.log(res);
    if (res.data.msg == "成功") {
        return res.data.data;
    } else {
        this.$message.error("获取ID失败！");
        return false;
    }
}
// imageUrl:"http://200.150.100.70:8000/statics/1864166781192966144_1733287092.jpg"
// referType:对应类型
async function reportimginfo(imageUrl, referType) {
    console.log('imageUrl', imageUrl);
    console.log('referType', referType);
    let url = imageUrl.split('/')
    console.log(url[url.length - 1])
    const response = await this.$axios.get('/api/statics/' + url[url.length - 1], {
        responseType: "blob", // 设置响应类型为 blob
    });
    // const response = api.getimage(url[1])
    const blob = new Blob([response.data]);
    //   let file = new File([blob], "image.jpg", { type: "image/jpeg" });

    //根据文件名拆出来信息
    const fileExtension = imageUrl.split(".").pop();
    const fileId = imageUrl.split('/')[4].split('_')[0]; //根据文件名拆出来relativeid
    const renamedFile = new File([blob], `${fileId}.${fileExtension}`, { type: "image/" + fileExtension });

    console.log('上报图片参数');
    console.log(fileExtension);
    console.log(fileId);
    console.log(renamedFile);

    const formData = new FormData();
    // 添加文件和其他参数
    formData.append("file", renamedFile);
    formData.append("relativeId", fileId);
    formData.append("referType", referType);
    console.log('formData', formData);
    let token = await reportapi.getReportToken()
    if (token.status == 200) {
        let res = await reportapi.uploadFile(formData,fileId);
        return res
    } else {
        MessageBox.error("局端token获取失败")
        // token过期
        return {
            data: {
                code: 401
            }
        }
    }

    // 将 Blob 转换为 Data URL 以便在 img 标签中显示
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   this.imageSrc = reader.result;
    // };
    // reader.readAsDataURL(blob);
}
// console.log(formatFormRules)
export { assignValues, formatFormRules, assignValues_special, isObjectEmpty, functionConfirm, downloadExcel, getId, reportimginfo }