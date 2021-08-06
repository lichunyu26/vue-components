'use strict'
import {Prop, Watch} from "vue-property-decorator";
import {h} from 'vue'
import {Vue} from "vue-class-component";

export default class DigitalScroll extends Vue {
    /*要渲染的html 标签*/
    @Prop({default: 'span', type: String}) readonly tag: string | undefined
    /*要渲染的标签对应的class*/
    @Prop({default: '', type: String}) readonly className: string | undefined
    /*默认显示的值--初始值*/
    @Prop({default: 0, type: Number}) readonly defaultNum: number | undefined
    /*要显示的值---终值*/
    @Prop({default: 0, type: Number}) readonly preNum: number | undefined
    /*滚动所需要的时间，单位毫秒*/
    @Prop({default: 1000, type: Number}) readonly scrollTime: number | undefined
    /*多少毫秒滚动一次*/
    @Prop({default: 10, type: Number}) readonly onceTime: number | undefined

    /*渲染的domID*/
    DigitalScrollDomID: string = `DigitalScrollDom-${Math.random()}-${new Date().getTime()}`

    /*数字滚动用到的定时器*/
    scrollTimer: any = null;

    render() {
        return this.renderSpecifyTag()
    }

    /*渲染指定的html标签*/
    private renderSpecifyTag() {
        return h(this.tag as string, {
            class: this.className,
            id: this.DigitalScrollDomID,
        }, this.defaultNum as number)
    }


    @Watch('defaultNum')
    @Watch('preNum')
    @Watch('scrollTime')
    @Watch('onceTime')
    handleKeyDataChange() {
        if (this.scrollTimer) clearInterval(this.scrollTimer)
        this.run2preNum(this.defaultNum, this.preNum, this.scrollTime, this.onceTime, this.DigitalScrollDomID)
    }


    /*当发生变化的时候*/
    async run2preNum(defaultNum: number = 0, preNum: number = 0, scrollTime: number = 1000, onceTime: number = 10, domID: string): Promise<any> {
        const dom = document.getElementById(domID)
        if (!dom) {
            await this.$nextTick()
            await this.run2preNum(defaultNum, preNum, scrollTime, onceTime, domID)
            return
        }
        if (defaultNum === preNum) return dom.innerText = String(preNum)
        //计算差值
        const difference = preNum - defaultNum,
            //计算步数
            stepCount = parseInt(String(scrollTime / onceTime)) + 1
        //根据步数计算步长
        let stepSize = difference / stepCount
        if (stepSize < 0) stepSize > -1 ? stepSize = -1 : parseInt(String(stepSize));
        else stepSize < 1 ? stepSize = 1 : parseInt(String(stepSize));


        let nextVal = defaultNum

        this.scrollTimer = setInterval(() => {
            // nextVal
            nextVal = nextVal + stepSize
            if ((stepSize < 0 && nextVal < preNum) || (stepSize > 0 && nextVal > preNum)) {
                clearInterval(this.scrollTimer)
                dom.innerText = String(preNum)
                return
            }
            dom.innerText = String(parseInt(String(nextVal)))
        }, onceTime)
    }
}
