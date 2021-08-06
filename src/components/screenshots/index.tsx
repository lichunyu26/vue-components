import {Options, Vue} from "vue-class-component";
import {Input, Row, Col, Typography, Button} from "ant-design-vue";
// @ts-ignore
import ScreenShotsStyle from './index.less'
import html2canvas from 'html2canvas'

@Options({
    components: {
        AInput: Input,
        AInputSearch: Input.Search,
        ARow: Row,
        ACol: Col,
        ATypography: Typography,
        ATypographyTitle: Typography.Title,
        ATypographyParagraph: Typography.Paragraph,
        AButton: Button
    }
})
export default class ScreenShots extends Vue {
    userInputVal: string = ''

    render() {
        return <div style={ScreenShotsStyle.screenshots} class='screenshots'>
            <a-row type="flex" justify="space-around" align="middle">
                <a-col span={10} id='staticTextArea'>

                    <a-typography>
                        <a-typography-title>左侧区域将会生成一张截图</a-typography-title>
                        <a-typography-paragraph>
                            {this.userInputVal}
                        </a-typography-paragraph>
                    </a-typography>

                    <a-input-search
                        v-model={[this.userInputVal, 'value']}
                        placeholder="在此处输入任意内容，然后点击旁边的截图按钮"
                        enterButton='截图'
                        onSearch={this.toCreateScreenshots}/>
                </a-col>
                <a-col span={10}>
                    <video id='videoDom'
                           controls
                           src={require('@/../static/video/CruisingInThecean.mp4')}/>

                    <div>
                        <a-button onClick={this.toCreateScreenshotsVideo}>点击截图视频内容</a-button>
                    </div>
                </a-col>
            </a-row>
        </div>
    }

    async toCreateScreenshots(): Promise<void> {
        const dom = document.getElementById("staticTextArea");
        if (!dom) return;
        await ScreenShots.createCanvas2Img(dom.clientWidth, dom.clientHeight, dom)
    }

    async toCreateScreenshotsVideo(): Promise<void> {
        const dom = document.getElementById("videoDom");
        if (!dom) return;
        await ScreenShots.createCanvas2Img(dom.clientWidth, dom.clientHeight, dom, true)
    }

    private static downFile(urlData: any, filename: string = (new Date().getTime() + '.png')): void {
        var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        // @ts-ignore
        save_link.href = urlData;
        // @ts-ignore
        save_link.download = filename;

        var event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
    }

    private static async createCanvas2Img(w: number, h: number, dom: any, isVideo: boolean = false) {
        let canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        if (isVideo) canvas.getContext('2d')?.drawImage(dom, 0, 0, canvas.width, canvas.height);
        else canvas = await html2canvas(dom as HTMLElement, {useCORS: true})
        ScreenShots.downFile(canvas.toDataURL("image/png"))
    }

}

