'use strict';
import { __decorate } from "tslib";
import { Prop, Watch } from "vue-property-decorator";
import { h } from 'vue';
import { Vue } from "vue-class-component";
export default class DigitalScroll extends Vue {
    constructor() {
        super(...arguments);
        /*渲染的domID*/
        this.DigitalScrollDomID = `DigitalScrollDom-${Math.random()}-${new Date().getTime()}`;
        /*数字滚动用到的定时器*/
        this.scrollTimer = null;
    }
    render() {
        return this.renderSpecifyTag();
    }
    /*渲染指定的html标签*/
    renderSpecifyTag() {
        return h(this.tag, {
            class: this.className,
            id: this.DigitalScrollDomID,
        }, this.defaultNum);
    }
    handleKeyDataChange() {
        if (this.scrollTimer)
            clearInterval(this.scrollTimer);
        this.run2preNum(this.defaultNum, this.preNum, this.scrollTime, this.onceTime, this.DigitalScrollDomID);
    }
    /*当发生变化的时候*/
    async run2preNum(defaultNum = 0, preNum = 0, scrollTime = 1000, onceTime = 10, domID) {
        const dom = document.getElementById(domID);
        if (!dom) {
            await this.$nextTick();
            await this.run2preNum(defaultNum, preNum, scrollTime, onceTime, domID);
            return;
        }
        if (defaultNum === preNum)
            return dom.innerText = String(preNum);
        //计算差值
        const difference = preNum - defaultNum, 
        //计算步数
        stepCount = parseInt(String(scrollTime / onceTime)) + 1;
        //根据步数计算步长
        let stepSize = difference / stepCount;
        if (stepSize < 0)
            stepSize > -1 ? stepSize = -1 : parseInt(String(stepSize));
        else
            stepSize < 1 ? stepSize = 1 : parseInt(String(stepSize));
        let nextVal = defaultNum;
        this.scrollTimer = setInterval(() => {
            // nextVal
            nextVal = nextVal + stepSize;
            if ((stepSize < 0 && nextVal < preNum) || (stepSize > 0 && nextVal > preNum)) {
                clearInterval(this.scrollTimer);
                dom.innerText = String(preNum);
                return;
            }
            dom.innerText = String(parseInt(String(nextVal)));
        }, onceTime);
    }
}
__decorate([
    Prop({ default: 'span', type: String })
], DigitalScroll.prototype, "tag", void 0);
__decorate([
    Prop({ default: '', type: String })
], DigitalScroll.prototype, "className", void 0);
__decorate([
    Prop({ default: 0, type: Number })
], DigitalScroll.prototype, "defaultNum", void 0);
__decorate([
    Prop({ default: 0, type: Number })
], DigitalScroll.prototype, "preNum", void 0);
__decorate([
    Prop({ default: 1000, type: Number })
], DigitalScroll.prototype, "scrollTime", void 0);
__decorate([
    Prop({ default: 10, type: Number })
], DigitalScroll.prototype, "onceTime", void 0);
__decorate([
    Watch('defaultNum'),
    Watch('preNum'),
    Watch('scrollTime'),
    Watch('onceTime')
], DigitalScroll.prototype, "handleKeyDataChange", null);
//# sourceMappingURL=digital-scroll.jsx.map