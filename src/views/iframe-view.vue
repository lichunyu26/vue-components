<template>
    <div class="iframe-view">

        <iframe :src="path"></iframe>

    </div>
</template>

<script setup>
import {computed, onMounted} from "vue";
import {useRoute} from "vue-router";

onMounted(()=>{
    console.log("AAAAAAAAAAAAAAAA")
})
const route = useRoute()
const path =  computed(()=>route.meta.path)

</script>

<style scoped>
.iframe-view {

}
</style>
