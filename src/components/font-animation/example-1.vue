<template>
    <div class="example-1">
        <h5>example-1</h5>
        <h2>{{showText}}</h2>
    </div>
</template>

<script lang="ts">
    import {Vue} from "vue-class-component";
    import {Prop} from "vue-property-decorator";

    export default class fontAnimationExample1 extends Vue {
        @Prop(String) readonly showText: string | undefined;
    }
</script>

<style scoped lang="less">
    .example-1 {

    }
</style>
