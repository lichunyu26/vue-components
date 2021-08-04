<template>
    <div class="home">
        <div class="l-sidebar">
            <a-input v-model:value="inputVal"/>
            <a-menu
                    :selectedKeys="selectedKeys"
                    :openKeys="openKeys"
                    mode="inline">
                <template v-for="item in calcRouterList">
                    <sub-menu path-prefix=""
                              :item-route="item"/>
                </template>
            </a-menu>
        </div>
        <div class="r-main">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component"/>
                </keep-alive>
            </router-view>
        </div>
    </div>
</template>

<script lang="ts">
    import {Vue, Options} from "vue-class-component";
    import {Model, Watch} from 'vue-property-decorator'
    import {Input, Button, Menu} from 'ant-design-vue'
    import {routesList} from "@/router";
    import SubMenu from "@/components/sub-menu.vue";

    @Options({
        components: {
            AInput: Input,
            AButton: Button,
            AMenu: Menu,
            SubMenu: SubMenu,
        }
    })

    export default class Home extends Vue {
        inputVal: string = ''

        selectedKeys: string[] = []

        openKeys: string[] = []

        private setMenuKeys(): void {
            //获取当前route
            const fullPath = this.$route.fullPath.split("/").filter(item => item !== '')
            this.selectedKeys = fullPath
            this.openKeys = fullPath
        }

        beforeMount(): void {
            this.setMenuKeys()
        }

        /*监听路由*/
        @Watch('$route')
        onRouteChanged() {
            this.setMenuKeys()
        }


        private static recursionRouterByName(filterKey: string, routes: any): any {

            if (filterKey === '') return routes

            if (routes.children && routes.children.length > 0) {
                let tempRoutes: Array<Object> = []
                routes.children.forEach((item: any) => {
                    const _item = Home.recursionRouterByName(filterKey, item)
                    if (_item) tempRoutes.push(_item)
                })
                if (tempRoutes.length === 0) return
                return {
                    ...routes,
                    children: tempRoutes
                }
            } else {
                if (routes.meta.title.indexOf(filterKey) > -1) return routes;
            }
            return null;
        }

        get calcRouterList(): Array<Object> {
            if (this.inputVal === '') return routesList

            let tempRoutes: Array<Object> = []
            routesList.forEach(item => {
                const _item = Home.recursionRouterByName(this.inputVal, item)
                if (_item) tempRoutes.push(_item)
            })

            return tempRoutes
        }

    }
</script>
<style lang="less" scoped>
    .home {
        height: 100vh;
        width: 100vw;
        display: flex;

        .l-sidebar {
            width: 300px;
            border-right: 1px solid #42b983;
        }

        .r-main {
            width: calc(100% - 300px);
        }
    }
</style>
