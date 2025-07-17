import Vuex from 'vuex'
import Vue from 'vue'
import user from './modules/user'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        user,
    },
    state: {
        device_change: "",
        videoData: [],
        viedo_route: [],
        loginflag: false,
        curr_videoinfo: "",
        loginInfo: JSON.parse(sessionStorage.getItem('userInfo')) || {},
        authInfo: {},
        timestemp: ""
    },
    getters: {
        device_change(state) {
            return state.gameGenaral
        }
    },
    mutations: {
        changeDevice(state, data) {
            state.device_change = new Date().getTime()
            console.log(state.device_change)
        },
        // videoData
        changevideoData(state, data) {
            state.videoData = data
            // console.log(state.device_change)
        },
        viedomenu(state, data) {
            state.viedo_route = data
            // console.log(state.device_change)
        },
        haslogin(state, data) {
            state.loginflag = data
            // console.log(state.device_change)
        },
        // curr_video
        curr_video(state, data) {
            state.curr_videoinfo = data
            // console.log(state.device_change)
        },
        // 登录信息
        systemloginInfo(state, data) {
            state.loginInfo.username = data
            sessionStorage.setItem('userInfo', JSON.stringify(state.loginInfo))
        },
        //所有权限信息
        systemauthInfo(state, data) {
            state.authInfo = data
        },
        alertHandle(state, data) {
            console.log(data);
            state.timestemp = data
        },
    }
})
export default store
