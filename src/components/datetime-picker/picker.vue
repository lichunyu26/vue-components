<template>
    <div class="picker">
        {{value}}
        <input
                type="text"
                ref="input"
                :value="value"
                @click="isFocus = true"
                @input="inputChange"/>
        <form ref="timePicker">
            <h3 v-show="isFocus">隐藏</h3>
        </form>


    </div>
</template>

<script>
    export default {
        name: 'picker',
        data() {
            return {
                isFocus: false
            }
        },

        props: {
            value: {
                default: '',
                type: String
            }
        },
        mounted() {
            console.log(this.$refs.timePicker)
// addEventListener
            this.$refs.timePicker.addEventListener('blur', e => {
                console.log(e)
                console.log("失去焦点")
            })
        },
        methods: {
            inputChange(e) {
                console.log(e.target.value)
                this.$emit('input', e.target.value);
                this.$emit('input', e.target.value)  // 这个input对应model选项的event值
            }
        }
    }
</script>

<style scoped lang="less">
    .picker {

    }
</style>
