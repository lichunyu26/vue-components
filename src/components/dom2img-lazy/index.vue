<template>
    <div class="dom2img-lazy-loading">
        <temp-lazy-loading v-for="(i,index) in renderBoxNum"
                           :box-index="index"
                           :complete-box-num="completeBoxNum"
                           @finish="completeBoxNum++"
        ></temp-lazy-loading>
    </div>
</template>

<script setup lang="ts">

import TempLazyLoading from "@/components/dom2img-lazy/temp-lazy-loading.vue";
import {ref} from "vue";

const renderBoxNum = 10;
const completeBoxNum = ref(0)
</script>

<style scoped lang="less">
.dom2img-lazy-loading {
    display: flex;
    flex-flow: wrap;
}
</style>
