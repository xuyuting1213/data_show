import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import index from '@/views/home/index.vue'
import store from '@/store'
// import { createRouter, createWebHistory } from 'vue-router'

// import monitor from '@/views/monitor/monitor'
// import logistics from '@/views/logistics/logistics'
// import classroom from '@/views/classroom/classroom'
// import officeData from '@/views/officeData/officeData'
// import assetAnalysis from '@/views/assetAnalysis/assetAnalysis'
// import oneCardSolution from '@/views/oneCardSolution/oneCardSolution'
import menu from '@/views/menu/menu.vue'
import basicinfo from '@/views/basic/basicinfo.vue'
import introduction from '@/views/basic/introduction.vue'
import personalrecord from '@/views/basic/personalrecord.vue'
import Basicmonitor from '@/views/videomonitor/videomonitor.vue'
import Bottle from '@/views/videomonitor/bottle.vue'
import Basicdatashow from '@/views/datashow/basicdatashow.vue'
import highbottleshow from '@/views/datashow/highbottleshow.vue'
import rotatebottleshow from '@/views/datashow/rotatebottleshow.vue'
import rotatebottleshowtwo from '@/views/datashow/rotatebottleshow2.vue'
import Warningshow from '@/views/datashow/warningshow.vue'
import Basicdevice from '@/views/devicedata/basicdevice.vue'
import Devicetallbottle from '@/views/devicedata/devicetallbottle.vue'
import Devicerotatebottle from '@/views/devicedata/devicerotatebottle.vue'
import Gasshow from '@/views/datashow/gasshow.vue'
import Gasbox from '@/views/devicedata/devicegasbox.vue'
import Devicecontinuous from '@/views/devicedata/devicecontinuous.vue'
import DeviceHangmachine from '@/views/devicedata/deviceHangmachine.vue'
import Devicemoltentanl from '@/views/devicedata/devicemoltentanl.vue'
import Glassgasdevice from '@/views/devicedata/glassgasdevice.vue'
import Gasdrainerdevice from '@/views/devicedata/gasdrainerdevice.vue'
import DeviceCowarnning from '@/views/devicedata/deviceCowarnning.vue'
import DeviceEmergencyfac from '@/views/devicedata/deviceEmergencyfac.vue'
import DeviceReliefset from '@/views/devicedata/deviceReliefset.vue'
import Checkout from '@/views/companydaily/checkout.vue'
import Regularcheck from '@/views/companydaily/regularcheck.vue'
import Stopwork from '@/views/companydaily/stopwork.vue'
import Scrabwork from '@/views/companydaily/scrabwork.vue'
import Autocompany from '@/views/basic/autocompany.vue'
import Gasboxshow from '@/views/datashow/gasboxshow.vue'
import Oxgenshow from '@/views/datashow/oxgenshow.vue'
import { queryVideoSite } from "@/api/watch/video/videosite";
Vue.use(Router)

// const subMenuitems = []
// queryVideoSite().then((res) => {
//     // console.log(res.rows);
//     const subMenuitems = []
//     // 遍历所有数据并根据parentName分组
//     res.rows.forEach((item) => {
//         let parent = subMenuitems.find((p) => p.name === item.parentName);

//         if (!parent) {
//             // 如果没有找到相同的parentName，创建一个新的parent
//             parent = {
//                 name: item.parentName,
//                 index: `/${item.parentName}`,
//                 children: [],
//             };
//             subMenuitems.push(parent);
//         }

//         // 将当前项加入到对应的parent的children中
//         parent.children.push({
//             name: item.name,
//             path: `/${item.parentName}/${item.id}`,
//         });
//     });
//     // console.log(subMenuitems);
// });

// // 动态生成路由的函数
// const generateRoutes = async () => {
//     const subMenuitems = [];
//     const res = await queryVideoSite();
//     res.rows.forEach((item) => {
//         let parent = subMenuitems.find((p) => p.name === item.parentName);
//         if (!parent) {
//             parent = {
//                 name: item.parentName,
//                 index: `/${item.parentName}`,
//                 children: [],
//             };
//             subMenuitems.push(parent);
//         }
//         parent.children.push({
//             name: item.name,
//             // path: `/${item.parentName}/${item.id}`,
//             path: `/videomonit/bottle/${item.id}`,
//         });
//     });

//     // 动态生成路由
//     const routes = [];
//     subMenuitems.forEach(parent => {
//         const parentRoute = {
//             path: parent.index,
//             name: parent.name,
//             component: Bottle,  // 父级页面组件
//             children: []
//         };
//         parent.children.forEach(child => {
//             parentRoute.children.push({
//                 path: child.path,
//                 name: child.name,
//                 component: Bottle,  // 使用同一个组件
//                 props: route => ({ name: route.params.name })  // 传递参数
//             });
//         });
//         routes.push(parentRoute);
//     });
//     return routes;
// };


const routes = [
    {
        path: '/',
        name: 'index',
        component: index,
    },
    {
        path: '/menu',
        name: 'menu',
        component: menu,
        children: [{
            path: '/basicinfo',
            name: '基础信息',
            component: basicinfo,
            redirect: '/basicinfo/introduction',
            children: [{
                path: 'introduction',
                name: '企业基础信息',
                component: introduction,
            },
            {
                path: 'autocompany',
                name: '企业自动化系统建设',
                component: Autocompany,
            },
            {
                path: 'personalrecord',
                name: '企业专项信息',
                component: personalrecord,
            },
            {
                path: 'deviceinfo',
                name: '设施设备信息',
                component: basicinfo,
                children: [{
                    path: 'devicetallbottle',
                    name: '高炉',
                    component: Devicetallbottle,
                }, {
                    path: 'devicerotatebottle',
                    name: '转炉',
                    component: Devicerotatebottle,
                },
                {
                    path: 'gasbox',
                    name: '煤气柜',
                    component: Gasbox,
                },
                {
                    path: 'gasbox',
                    name: '煤气柜',
                    component: Gasbox,
                },
                {
                    path: 'devicecontinuous',
                    name: '连铸机',
                    component: Devicecontinuous,
                },
                {
                    path: 'deviceHangmachine',
                    name: '吊运熔融金属起重机',
                    component: DeviceHangmachine,
                },
                {
                    path: 'devicemoltentanl',
                    name: '熔融金属罐体',
                    component: Devicemoltentanl,
                },
                {
                    path: 'glassgasdevice',
                    name: '煤气设施（管道）眼镜阀组合式隔断装置',
                    component: Glassgasdevice,
                },
                {
                    path: 'gasdrainerdevice',
                    name: '正压煤气管道水封式煤气排水器',
                    component: Gasdrainerdevice,
                },
                {
                    path: 'deviceCowarnning',
                    name: '固定式一氧化碳报警器',
                    component: DeviceCowarnning,
                },
                {
                    path: 'deviceEmergencyfac',
                    name: '炼钢（连铸）生产过程熔融金属紧急排放和应急储存设施',
                    component: DeviceEmergencyfac,
                },
                {
                    path: 'deviceReliefset',
                    name: '高炉生产过程炉顶放散阀联锁放散压力设定',
                    component: DeviceReliefset,
                },
                ]
            },
            {
                path: 'companydaily',
                name: '企业日常数据',
                component: basicinfo,
                children: [{
                    path: 'checkout',
                    name: '点检记录',
                    component: Checkout,
                }, {
                    path: 'regularcheck',
                    name: '定期检验/校准记录',
                    component: Regularcheck,
                }, {
                    path: 'stopwork',
                    name: '设备停用记录',
                    component: Stopwork,
                }, {
                    path: 'scrabwork',
                    name: '设备报废记录',
                    component: Scrabwork,
                }]
            }
            ]
        },
        {
            path: '/datashow',
            name: '感知数据',
            component: Basicdatashow,
            redirect: '/datashow/highbottleshow',
            children: [{
                path: 'basicdatashow',
                name: '感知数据',
                component: Basicdatashow,
                children: [{
                    path: 'highbottleshow',
                    name: '高炉',
                    component: highbottleshow,
                }, {
                    path: 'rotatebottleshow',
                    name: '1#转炉',
                    component: rotatebottleshow,
                },
                    , {
                    path: 'rotatebottleshowtwo',
                    name: '2#转炉',
                    component: rotatebottleshowtwo,
                },
                {
                    path: 'gasboxshow',
                    name: '煤气柜',
                    component: Gasboxshow,
                }, {
                    path: 'oxgenshow',
                    name: '液氧储槽',
                    component: Oxgenshow,
                },
                // {
                //   path: 'gasshow',
                //   name: '煤气柜',
                //   component:Gasshow,
                // },
                {
                    path: 'cowarning',
                    name: '固定式一氧化碳报警器',
                    component: Gasshow,
                }]
            },
            {
                path: 'warning',
                name: '报警信息',
                component: Warningshow
            }

            ]
        },
        {
            path: '/videomonit',
            name: '视频监控',
            component: Basicmonitor,
            redirect: "/videomonit/bottle/110",
            children: [
                // ...await generateRoutes()  // 动态添加的路由
                //     {
                //     path: 'bottle',
                //     name: '炼铁厂',
                //     component: Bottle,
                //     children: [{
                //         path: 'bottletall',
                //         name: '高炉',
                //         component: Bottle,
                //     },]
                // },
                // {
                //     path: '/introduction22',
                //     name: '企业基础信息22',
                //     // component: introduction,
                // }
            ]
        }]
    }
    // {
    //   path: '/baicinfo,
    //   name: 'basic',
    //   component: Basicinfo',
    // },
    // {
    //   path: '/logistics',
    //   name: 'logistics',
    //   component: logistics,
    // },
    // {
    //   path: '/monitor',
    //   name: 'monitor',
    //   component: monitor,
    // },
    // {
    //   path: '/classroom',
    //   name: 'classroom',
    //   component: classroom,
    // },
    // {
    //   path: '/assetAnalysis',
    //   name: 'assetAnalysis',
    //   component: assetAnalysis,
    // },
    // {
    //   path: '/officeData',
    //   name: 'officeData',
    //   component: officeData,
    // },
    // {
    //   path: '/oneCardSolution',
    //   name: 'oneCardSolution',
    //   component: oneCardSolution,
    // }
]


console.log(routes);
// 创建 Vue Router 实例
const router = new Router({
    mode: 'history',  // 使用 HTML5 history 模式
    routes
});

export default router;

