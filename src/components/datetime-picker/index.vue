<template>
    <div class="datetime-picker">
        {{timeValue}}
        <picker
                :value="timeValue"
                @change="val=>this.timeValue = val"></picker>
    </div>
</template>

<script>
    import Picker from './picker'

    export default {
        name: 'datetimePicker',
        components: {Picker},
        data() {
            return {
                timeValue: "14:25"
            }
        },
    }
</script>

<style scoped lang="less">
    .datetime-picker {

    }
</style>
