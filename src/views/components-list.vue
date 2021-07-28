<template>
    <div class="components-list">
        <h1>components-list</h1>
        <h2>{{msg}}</h2>
        <h2>{{mgs2}}</h2>
        <input type="text"
               v-model="mgs2">
        <button @click="setMsgWithOtherVal"></button>

        <a-button type="primary">Primary Button</a-button>
    </div>
</template>

<script lang="ts">
    import {Options, Vue} from "vue-class-component";
    import {Button} from "ant-design-vue";

    @Options({
        components: {AButton: Button}
    })
    export default class ComponentsList extends Vue {
        msg = 'AAA'
        mgs2 = "BBB"

        public setMsgWithOtherVal():void {
            console.log(this.$route)
            console.log(this.$router)
            this.msg = this.mgs2
        }

    }
</script>

<style scoped>
    .components-list {

    }
</style>
