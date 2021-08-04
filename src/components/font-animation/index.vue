<template>
    <div class="font-animation">
        <div>
            <a-input-search
                    v-model:value="userEnterChildrenText"
                    placeholder="input search text"
                    enter-button="更换文字"
                    size="large"
                    @search="toResetChildrenText"/>
        </div>
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component
                        :show-text="childrenText"
                        class="font-animation-main"
                        :is="Component"/>
            </keep-alive>
        </router-view>
    </div>

</template>
<script lang="ts">
    import {Options, Vue} from "vue-class-component";
    import {Button, Input} from "ant-design-vue";

    @Options({
        components: {
            AInputSearch: Input.Search,
        }
    })
    export default class fontAnimation extends Vue {
        userEnterChildrenText: string = 'Hello World'
        childrenText: string = 'Hello World'

        toResetChildrenText(): void {
            this.childrenText = this.userEnterChildrenText;
        }
    }

</script>
<style lang="less" scoped>
    .font-animation {
        height: 100%;
        width: 100%;

        .font-animation-main {
            background: #42b983;
            height: calc(100% - 80px);
        }
    }
</style>
