import {Vue} from "vue-class-component";
import {Prop, Watch} from "vue-property-decorator";

export default class fontAnimationPublic extends Vue {
    @Prop([String,Number]) readonly showText: string | number | '' | undefined;

    @Watch("showText")
    handleTextChange(n: string | undefined) {
        this.refreshText(n)
    }

    mounted() {
        this.refreshText(this.showText)
    }

    refreshText(txt: string|number = 'Hello World'): void {
        throw new Error("Method not implemented.");
    }

}
