import fontAnimationPublic from "./font-animation-public-extends";
// @ts-ignore
import fontStyle from './font-animation-tsx.less'
export default class fontAnimationExample1 extends fontAnimationPublic {
    render() {
        return <template class={fontStyle.example1}>
            <div class="example-1">
                <p class="landIn" id="example1DomP"/>
            </div>
        </template>

    }

    refreshText(txt: string = 'Hello World'): void {
        let letters = txt.split("");
        const example1DomP = document.getElementById("example1DomP")
        if (example1DomP) example1DomP.innerText = "";
        letters.forEach((letter: string | null, i: number) => {
            let span = document.createElement("span");
            span.textContent = letter;
            span.style.animationDelay = `${i * 0.05}s`;
            example1DomP?.append(span);
        });
    }

}
