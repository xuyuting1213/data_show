<template>
    <div class="login-container">
        <el-card class="login-card" shadow="always">
            <h2 class="login-title">欢迎登录秦邮企业安全风险预警系统</h2>

            <el-form :model="form" ref="formRef" :rules="rules" label-width="0.85rem">
                <el-form-item label="账号" prop="username">
                    <el-input v-model="form.username" placeholder="请输入账号" clearable></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码" clearable></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="handleLogin" :loading="loading" block>
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { setToken, removeToken } from "@/utils/auth"; // 假设你有一个 auth.js 文件来处理 token
import { login, getInfo } from "@/api/login";
import { queryVideoSite } from "@/api/watch/video/videosite";
import { Message } from "element-ui";
import { addDynamicRoutes } from "@/router"; // 导入动态添加路由的函数
import Basicmonitor from "@/views/videomonitor/videomonitor.vue";
import Bottle from "@/views/videomonitor/bottle.vue";
import axios from "axios";
import api from "@/api/api";
export default {
    name: "Login",
    data() {
        return {
            form: {
                username: "",
                password: "",
                rememberMe: false,
                code: "qinyouwatch2024", // 大屏的特殊验证码，直接登录
                uuid: "",
            },
            loading: false,
            rules: {
                username: [{ required: true, message: "请输入账号", trigger: "blur" }],
                password: [{ required: true, message: "请输入密码", trigger: "blur" }],
            },
        };
    },
    mounted() {
        removeToken("Admin-Token");
        removeToken("Report-Token");
        sessionStorage.clear();
    },
    methods: {
        buildTree(data) {
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
        },
        async generateRoutes() {
            const res = await queryVideoSite();
            if (res.code === 200) {
                let subMenuitems = [];
                let result = this.buildTree(res.rows)
                result.map((item, index) => {
                    subMenuitems[index] = {
                        name: item.plant,
                        // index: `/videoall`,
                        index: item.plant,
                        children: [],
                    }
                    subMenuitems[index].children = item.children.map(items => {
                        return {
                            name: items.name,
                            path: `/videomonit/bottle/${items.id}`,
                        }
                    })
                });
                // console.log(subMenuitems);
                const routes = [];
                // 动态生成路由
                subMenuitems.forEach((parent) => {
                    let parentRoute = {
                        path: parent.index,
                        name: parent.name,
                        component: () => import("@/views/videomonitor/bottle.vue"),
                        children: [],
                    };
                    if (parent.children) {
                        parent.children.forEach((child) => {
                            parentRoute.children.push({
                                path: child.path,
                                name: child.name,
                                component: () =>
                                    import("@/views/videomonitor/videomonitor.vue"), // 使用同一个组件
                                props: (route) => ({ name: route.params.name }), // 传递参数
                            });
                        });
                    } else {
                        parentRoute = {
                            path: parent.path,
                            name: parent.name,
                            component: () => import("@/views/videomonitor/bottle.vue"),
                        };
                    }
                    routes.push(parentRoute);
                });
                // localStorage.setItem("dynamicRoutes", JSON.stringify(routes));
                // console.log(routes);
                this.$store.commit('viedomenu', routes)

                // 使用 addDynamicRoutes 函数添加动态路由
                addDynamicRoutes(routes);

                return subMenuitems;
            } else {
                Message.error("获取视频站点信息失败，请刷新重试");
                return [];
            }
        },
        async handleLogin() {
            this.$refs.formRef.validate(async (valid) => {
                if (valid) {
                    this.loading = true;
                    // this.$store.commit("alertHandle", new Date().getTime())

                    try {
                        const res = await login(
                            this.form.username,
                            this.form.password,
                            this.form.code,
                            this.form.uuid
                        );

                        if (res.code === 200) {
                            setToken("Admin-Token", res.token);
                            this.$store.commit('systemloginInfo', this.form.username)
                            // 登录成功后调用 generateRoutes
                            await this.generateRoutes();
                            // await this.getAuthInfo();
                            this.$store.commit('haslogin',)
                            this.$message.success("登录成功");
                            this.$router.push("/index");

                        } else {
                            this.$message.error("账号或密码错误");
                        }
                    } catch (error) {
                        this.$message.error("登录失败，请稍后再试");
                        console.error("Login request failed:", error);
                    } finally {
                        this.loading = false;
                    }
                } else {
                    this.$message.error("表单验证失败");
                    return false;
                }
            });
        },
   
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
}
</style>
