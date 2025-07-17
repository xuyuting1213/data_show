import axios from "axios";
import { getToken, setToken, removeToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { Notification, MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { login } from "@/api/login";
import { tansParams, blobValidate } from "@/utils/ruoyi";
import cache from '@/plugins/cache'
export let isRelogin = { show: false };
export const baseUrl = "http://222.189.207.202:801";
// export const baseUrl = "/requestapi";

import reportapi from "@/api/reportapi";
import router from '@/router/index'; // 引入 Vue Router

// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 第一步，创建实例
const instance = axios.create({
    baseURL: baseUrl,
    timeout: 120000 //毫秒
})

async function doLogin() {
    // 如果没有token 并且没有任何响应 就要去action中自动登录
    const loginForm = {
        username: "admin",
        password: "admin123",
        rememberMe: false,
        code: "qinyouwatch2024", //大屏的特殊验证码，直接登录
        uuid: ""
    }
    let res = await login(loginForm.username, loginForm.password, loginForm.code, loginForm.uuid);
    if (res) {
        setToken('Admin-Token', res.token)
        // store.commit('SET_TOKEN;', res.token)
        // console.log(getToken());
    }
    return res;
}
// async function getReportTokenFunc() {
//     let res = await reportapi.getReportToken();
//     if (res) {
//         // setToken('Authorization', res.token)
//         // store.commit('SET_TOKEN;', res.token)
//         // setToken('')
//         // report_token = res.data.data
//         // console.log('res', res.data.data);
//         setToken('Report-Token', res.data.data)

//     }
//     return res;
// }
// getReportTokenFunc()

// 第二步 请求拦截
instance.interceptors.request.use(function (config) {

    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false
    // if (getToken('Admin-Token') && !isToken) {
    config.headers['Authorization'] = 'Bearer ' + getToken('Admin-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
    // }

    // if (config.baseURL.indexOf("/api/prod-api/web") >= 0 && getToken('Report-Token')) {
    //     config.headers['Authorization'] = getToken('Report-Token') // 让每个请求携带自定义token 请根据实际情况自行修改
    //     console.log(' config.headers', config.headers);
    // }
    // get请求映射params参数
    if (config.method === 'get' && config.params) {
        let url = config.url + '?' + tansParams(config.params);
        url = url.slice(0, -1);
        config.params = {};
        config.url = url;
    }
    if (!isRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
        const requestObj = {
            url: config.url,
            data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
            time: new Date().getTime()
        }
        const sessionObj = cache.session.getJSON('sessionObj')
        if (sessionObj === undefined || sessionObj === null || sessionObj === '') {
            cache.session.setJSON('sessionObj', requestObj)
        } else {
            const s_url = sessionObj.url;                  // 请求地址
            const s_data = sessionObj.data;                // 请求数据
            const s_time = sessionObj.time;                // 请求时间
            cache.session.setJSON('sessionObj', requestObj)
        }
    }
    return config
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
})
// 第三步 响应拦截
instance.interceptors.response.use(function (res) {
    // 未设置状态码则默认成功状态
    // console.log('intercept:', res)
    const code = res.data.code || 200;
    // 获取错误信息
    const msg = errorCode[code] || res.data.msg || errorCode['default']
    // 二进制数据则直接返回
    if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
        return res.data
    }
    if (code === 401) {
        // doLogin();
        // console.log('logResult:', loginResult)
        // 清除 Token
        removeToken('Admin-Token');
        removeToken('Report-Token');
        // setToken('Report-Token', res.data.data)
        // console.log(router);
        // 重定向到登录页面
        // setTimeout(() => {

        //     router.push('/')
        // }, 1000)
        // store.dispatch('/').then(() => {
        // location.reload(); // 为了重新实例化 vue-router 对象 避免 bug
        // });s
        return res.data
    } else if (code === 500) {
        Message({
            message: msg,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(new Error(msg))
    } else if (code !== 200) {
        Notification.error({
            title: msg
        })
        return Promise.reject('error')
    } else {

        return res.data
    }
},
    error => {
        console.log('err' + error)
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        }
        else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        }
        else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        Message({
            message: message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    });

export default instance;



// get请求
// @param {*}url请求地址
// @param {*}params url参数

export function get(url, params) {
    return instance.get(url, {
        params
    })
}

// post请求
// @param {*}url请求地址
// @param {*}params data数据
export function post(url, data) {
    return instance.post(url, data)
}


export function put(url, data) {
    return instance.put(url, data)
}

export function del(url) {
    return instance.delete(url)
}