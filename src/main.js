import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/iconfont.css'
import './assets/css/bootstrap.min.css'
import ElementUI from 'element-ui';             //全局引入element
import 'element-ui/lib/theme-chalk/index.css';    //全局引入element的样式
import * as echarts from 'echarts';
import scroll from 'vue-seamless-scroll'
import './assets/css/app.less'; // 引入 LESS 文件
import './assets/css/normalstyle.less'; // 引入 LESS 文件
import './assets/font_light/iconfont.css'
import { assignValues, formatFormRules, functionConfirm, downloadExcel, getId, reportimginfo } from './api/globalparams.js'
import store from './store'
import axios from 'axios'
// import Antd from 'ant-design-vue';

// import 'ant-design-vue/dist/antd.css'; // 引入样式

// import "amfe-flexible/index.js"

Vue.config.productionTip = false
// console.log(echarts)

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
Vue.use(scroll)
Vue.use(ElementUI);
// Vue.use(Antd);

Vue.prototype.$assignValues = assignValues
// console.log(formatFormRules)
Vue.prototype.$formatFormRules = formatFormRules
Vue.prototype.$functionConfrim = functionConfirm
Vue.prototype.$store = store
Vue.prototype.$downloadExcel = downloadExcel
Vue.prototype.$getId = getId
Vue.prototype.$axios = axios
Vue.prototype.$reportimginfo = reportimginfo
new Vue({
    router,
    render: h => h(App),
}).$mount('#app')


// //添加拦截器
// router.beforeEach((to, from, next) => {
//     if (to.meta.title) {
//         document.title = "秦邮" + to.meta.title;
//     }
//     // console.log('aa', from)
//     let token = window.sessionStorage.getItem('userInfo');
//     // 如果没有token 并且没有任何响应 就要去action中自动登录
//     if (!token) {
//         // const loginForm = {
//         //     username: "admin",
//         //     password: "admin123",
//         //     rememberMe: false,
//         //     code: "qinyouwatch2024", //大屏的特殊验证码，直接登录
//         //     uuid: ""
//         // }
//         // store.dispatch("Login", loginForm).then(() => {
//         //     router.push({ path: "/" }).catch(() => { });
//         //     const userInfo = {
//         //         username: loginForm.username
//         //     }
//         //     sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
//         // }).catch(() => {
//         // });
//     } else { // 其他情况可以放行
//         next();
//     }
// })

