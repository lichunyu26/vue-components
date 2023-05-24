'use strict'
import {Vue, Options} from "vue-class-component";
import DigitalScroll from "@/components/digital-scroll/digital-scroll";
import {Form, Input} from "ant-design-vue";
// @ts-ignore
import DigitalScrollStyle from './index.less'

@Options({
    components: {DigitalScroll, Form, AFormItem: Form.Item, AInput: Input}
})
export default class digitalScrollIndex extends Vue {
    defaultNum: number = 0
    preNum: number = 0
    onceTime: number = 10
    scrollTime: number = 1000
    renderTag: string = 'span'
    className: string = ''

    render() {

        return <div class={DigitalScrollStyle.digitalScroll}>
            <Form
                label-col={{span: 2}}
                labelAlign='right'>
                <a-form-item has-feedback label="要渲染的标签">
                    <a-input
                        v-model={[this.renderTag, 'value']}/>
                </a-form-item>
                <a-form-item has-feedback label="渲染DOM的class">
                    <a-input
                        v-model={[this.className, 'value']}/>
                </a-form-item>

                <a-form-item has-feedback label="初始数值">
                    <input
                        v-model={[this.defaultNum]}
                        type="number" class="ant-input"/>
                </a-form-item>
                <a-form-item has-feedback label="最终数值">
                    <input
                        v-model={[this.preNum]}
                        type="number" class="ant-input"/>
                </a-form-item>
                <a-form-item has-feedback label="滚动间隔">
                    <input
                        v-model={[this.onceTime]}
                        type="number" class="ant-input"/>
                </a-form-item>
                <a-form-item has-feedback label="动画时长">
                    <input
                        v-model={[this.scrollTime]}

                        type="number" class="ant-input"/>
                </a-form-item>
            </Form>
            <div class='digital-scroll'>
                <digital-scroll
                    tag={this.renderTag}
                    className={this.className}
                    defaultNum={Number(this.defaultNum)}
                    onceTime={Number(this.onceTime)}
                    scrollTime={Number(this.scrollTime)}
                    preNum={Number(this.preNum)}/>
            </div>
        </div>
    }
}
