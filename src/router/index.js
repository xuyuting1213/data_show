
import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import index from '@/views/home/index.vue'
import login from '@/views/login/login.vue'
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
import videoall from '@/views/videomonitor/videoall.vue'
import { Message } from 'element-ui'
import videowarninglist from '@/views/videomonitor/videowaring/videowarninglist.vue'
Vue.use(Router)
const buildTree=(data) =>{
    // 创建一个以 id 为键的对象映射
    const map = {};
    data.forEach(item => {
      map[item.id] = { ...item, children: [] };
    });
  
    const tree = [];
    data.forEach(item => {
      if (item.parentId === null || !map[item.parentId]) {
        // 如果 parentId 是 null 或者不存在于映射中，则认为是顶层节点
        tree.push(map[item.id]);
      } else {
        // 否则，添加到对应的父节点的 children 中
        map[item.parentId].children.push(map[item.id]);
      }
    });
  
    return tree;
  }
  
const generateRoutes = async (router) => {
    // console.log('router',router.history.current);
    let subMenuitems = [];
    const res = await queryVideoSite();
    // console.log(res);
 
    if (res.code == 200) {
        // console.log(buildTree(res.rows));
        const rows=JSON.parse(JSON.stringify(res.rows))
        let result = buildTree(rows)
        // console.log(result);
        result.map((item, index) => {
            subMenuitems[index] = {
                name: item.plant,
                // index: `/videoall`,
                index: '/'+item.id,
                children: [],
            }
            subMenuitems[index].children=item.children.map(items => {
                return {
                    name: items.name,
                    path: `/videomonit/bottle/${items.id}`,
                }
            })
        });
        // console.log(subMenuitems);
    } else {
        // Message.error({
        //     message: "登录失败，刷新重试"
        // })
    }
    // 动态生成路由
    const routes = [];
    subMenuitems.forEach(parent => {
        let parentRoute = {
            path: parent.index,
            name: parent.name,
            component: Bottle,  // 父级页面组件
            children: []
        };
        if (parent.children) {
            parent.children.forEach(child => {
                parentRoute.children.push({
                    path: child.path,
                    name: child.name,
                    component: Basicmonitor,  // 使用同一个组件
                    props: route => ({ name: route.params.name })  // 传递参数
                });
            });
        } else {
            parentRoute = {
                path: parent.path,
                name: parent.name,
                component: Bottle,  // 父级页面组件
            };
        }
        routes.push(parentRoute);
    });
    routes.unshift({
        path: '/warningvideo',
        name: '视频报警',
        component: videowarninglist
    })
    // console.log(routes);

    return routes;
};

const routes = [
    {
        path: '/',
        name: 'login',
        component: login,
    },
    {
        path: '/index',
        name: 'index',
        component: index,
    },
    // {
    //     path: '/',
    //     name: 'index',
    //     component: index,
    // },
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
            }, {
                path: 'warning',
                name: '报警信息',
                component: Warningshow
            },]
        },

        {
            path: '/videomonit',
            name: '视频监控',
            component: Basicmonitor,
            // redirect: '/videoall',
            // redirect: '/videomonit/bottle/1',
            redirect: '/warningvideo',
            children: [
                // ...await generateRoutes()  // 动态添加的路由
            ]
        },
        {
            path: '/warningvideo',
            name: '视频报警',
            component: videowarninglist,
        },
        {
            path: '/videoall',
            name: '视频监控',
            component: videoall,
        },
        ]
    }
]
const router = new Router({
    routes
});

// 导出一个函数用于动态添加路由
export function addDynamicRoutes(newRoutes) {
    console.log(newRoutes);
    newRoutes.forEach(route => {
        router.addRoute('menu', route);
    });
}

// 异步加载动态路由
(async () => {

    const dynamicRoutes = await generateRoutes(router); // 传递 router 实例
    console.log('dynamicRoutes',dynamicRoutes);
    router.addRoutes([{
      path: '/menu',
      name: 'menu',
      component: menu,
      children: [
        // 静态子路由
        // ...
        // 动态添加的路由
        ...dynamicRoutes
      ]
    }]);
})();
export default router;
  
// // 监听路由变化
// router.beforeEach((to, from, next) => {
//     // 如果当前路由是登录页，则清除本地存储中的动态路由
//     if (to.name === 'login') {
//         localStorage.removeItem('dynamicRoutes');
//     } else {
        
//     }
//     next();
// });

