<template>
    <a-sub-menu
            v-if="itemRoute.children"
            :key="itemRoute.path">
        <template #title>{{itemRoute.meta.title}}</template>
        <sub-menu
                v-for="item in itemRoute.children"
                :path-prefix="pathPrefix + '/'+itemRoute.path"
                :item-route="item"/>
    </a-sub-menu>
    <a-menu-item
            v-else
            :key="itemRoute.path">
        <router-link
                :to="spliceFullPath"> {{itemRoute.meta.title}}
        </router-link>
    </a-menu-item>
</template>

<script lang="ts">
    import {Options, Vue} from "vue-class-component";
    import {Menu} from 'ant-design-vue'
    import {Prop} from "vue-property-decorator";

    @Options({
        components: {
            AMenuItem: Menu.Item,
            ASubMenu: Menu.SubMenu,
        }
    })
    export default class SubMenu extends Vue {
        @Prop(Object) private itemRoute: any | undefined
        @Prop(String) private pathPrefix: string | undefined

        get spliceFullPath(): string {
            return this.pathPrefix + '/' + this.itemRoute.path
        }
    }
</script>

<style scoped>
    .sub-menu {

    }
</style>
