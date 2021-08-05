<template>
    <div class="font-animation">
        <div>
            <a-input-search
                    v-model:value="userEnterChildrenText"
                    placeholder="input search text"
                    enter-button="更换文字"
                    size="large"
                    :loading="isInLoading"
                    @search="toResetChildrenText"/>
        </div>

        <router-view
                v-slot="{ Component }">
            <keep-alive>
                <a-spin size="large" :spinning="isInLoading">
                    <component
                            :show-text="childrenText"
                            class="font-animation-main"
                            :is="Component"/>
                </a-spin>

            </keep-alive>
        </router-view>

    </div>

</template>
<script lang="ts">
    import {Options, Vue} from "vue-class-component";
    import {Spin, Input} from "ant-design-vue";

    @Options({
        components: {
            AInputSearch: Input.Search,
            ASpin: Spin
        }
    })
    export default class fontAnimation extends Vue {
        userEnterChildrenText: string = 'Hello World'
        childrenText: string = 'Hello World'
        isInLoading: boolean = false

        toResetChildrenText(): void {
            this.isInLoading = true
            setTimeout(() => {
                this.isInLoading = false
                this.childrenText = this.userEnterChildrenText;
            }, Math.random() * 1000)

        }
    }

</script>
<style lang="less" scoped>
    .font-animation {
        height: 100%;
        width: 100%;

        ::v-deep(.font-animation-main) {
            background: #42b983;
            height: calc(100vh - 80px);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
</style>
