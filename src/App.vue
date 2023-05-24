<template>
                <router-view/>
<!--        <div id="aMap"></div>-->
<!--    <div id="app">

        <a-modal
            v-model:visible="state.visible"
            title="Basic Modal"
            :wrap-class-name="state.fullModal?'full-modal':''">
           <div  v-draggable-modal>
               <a-button @click="state.visible = !state.visible">state.visible{{state.visible}}</a-button>
               <a-button @click="state.fullModal = !state.fullModal">state.fullModal{{state.fullModal}}</a-button>
               <p>Some contents...</p>
               <p>Some contents...</p>
               <p>Some contents...</p>
           </div>
        </a-modal>
        <a-button @click="state.visible = !state.visible">state.visible{{state.visible}}</a-button>

    </div>-->
</template>
<script setup>
import {Modal as AModal,Button as AButton} from "ant-design-vue"
import {onMounted, reactive} from "vue";
import AMapLoader from '@amap/amap-jsapi-loader';
const state = reactive({
    visible: false,
    fullModal:false
})

</script>
<style>
html, body {
    margin: 0;
    padding: 0;

}

#aMap {
    height: 100vh;
    width: 100vw;
}

* {
    box-sizing: border-box;
}
</style>
<style lang="less">
.ant-modal{
    position:absolute;

}
.ant-modal .ant-modal-content{
    transition: all .38s;
    height: 400px;
}
.full-modal {
    .ant-modal {
        max-width: 100%;
        top: 0;
        padding-bottom: 0;
        margin: 0;
    }
    .ant-modal-content {
        display: flex;
        flex-direction: column;
        height: calc(100vh);
    }
    .ant-modal-body {
        flex: 1;
    }
}
</style>
