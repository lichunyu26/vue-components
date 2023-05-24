<template>
    <div class="temp-lazy-loading">
        <div v-if="!lazyLoadingMap.showImg"
             :id="lazyLoadingMap.domId">
            {{ lazyLoadingMap.fullText }}
        </div>
        <a-image
            v-else
            :width="200"
            :src="lazyLoadingMap.imgSrc"
        />
    </div>
</template>

<script setup lang="ts">
import {reactive, watch, nextTick} from "vue";
import {Image as AImage} from "ant-design-vue";

const emit = defineEmits(['finish'])
const props = defineProps(['boxIndex', 'completeBoxNum'])
const lazyLoadingMap = reactive({
    domId: `lazy-loading-dom-${Math.random()}`,
    imgSrc: "",
    showImg: false,
    fullText: ""
})

function ready2Load() {
    let uidList: string[] = []
    for (let i = 0; i < 999; i++) {
        uidList.push(crypto.randomUUID())
    }
    lazyLoadingMap.fullText = uidList.join('')
    nextTick(() => {
        const dom2Img = require("dom-to-image")
        const target = document.getElementById(lazyLoadingMap.domId)
        dom2Img.toPng(target, {}).then((dataUrl: any) => {
            lazyLoadingMap.showImg = true;
            lazyLoadingMap.imgSrc = dataUrl;
            emit("finish")
        }).catch(function (error: any) {
            console.error('oops, something went wrong!', error);
        });
    })
    /*  setTimeout(() => {
          const dom2Img = require("dom-to-image")
          const target = document.getElementById(lazyLoadingMap.domId)
          dom2Img.toPng(target, {}).then((dataUrl: any) => {
              lazyLoadingMap.showImg = true;
              lazyLoadingMap.imgSrc = dataUrl;
              emit("finish")
          }).catch(function (error: any) {
              console.error('oops, something went wrong!', error);
          });
      }, 1500)*/
}

watch(() => props.completeBoxNum, (num) => {
    // console.log(num)
    // console.log(props.boxIndex)
    if (num === props.boxIndex) ready2Load()
}, {immediate: true})
</script>

<style scoped lang="less">
.temp-lazy-loading {
    width: 25%;
    height: 500px;
    overflow: auto;

    > div {
        background: #6ee1f5;
        min-width: 1000px;
    }
}
</style>
