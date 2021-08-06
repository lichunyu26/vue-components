import fontAnimationPublic from "@/components/font-animation/font-animation-public-extends";
// @ts-ignore
import fontStyle from './font-animation-tsx.less'

export default class fontAnimationExample2 extends fontAnimationPublic {
    refreshAnimation: boolean = true

    render() {
        return <template class={fontStyle.example2}>
            {this.refreshAnimation ? <div class='example-2'>
                <div class='example2Dom' id='example2Dom'>{this.refreshAnimation}</div>
            </div> : ''}
        </template>
    }

    refreshText(txt: string = 'Hello World'): void {

        this.refreshAnimation = false
        setTimeout(async () => {
            this.refreshAnimation = true
            await this.$nextTick()
            const delay = 0.3,
                example2Dom = document.querySelector("#example2Dom"),
                letters = txt.split("");
            if (example2Dom) example2Dom.textContent = ''

            const middle = letters.filter(e => e !== " ").length / 2;

            letters.forEach((letter, i) => {
                let span = document.createElement("span");
                span.textContent = letter;
                span.style.animationDelay = `${delay + Math.abs(i - middle) * 0.1}s`;
                example2Dom?.append(span);
            });
        }, 150)
    }
}
