import { __decorate } from "tslib";
import { Vue } from "vue-class-component";
import { Prop, Watch } from "vue-property-decorator";
export default class fontAnimationPublic extends Vue {
    handleTextChange(n) {
        this.refreshText(n);
    }
    mounted() {
        this.refreshText(this.showText);
    }
    refreshText(txt = 'Hello World') {
        throw new Error("Method not implemented.");
    }
}
__decorate([
    Prop([String, Number])
], fontAnimationPublic.prototype, "showText", void 0);
__decorate([
    Watch("showText")
], fontAnimationPublic.prototype, "handleTextChange", null);
//# sourceMappingURL=font-animation-public-extends.js.map