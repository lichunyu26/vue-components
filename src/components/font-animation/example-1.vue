<template>
    <div class="example-1">
        <p class="landIn" id="example1DomP"></p>
    </div>
</template>

<script lang="ts">
    import fontAnimationPublic from "./font-animation-public-extends";

    export default class fontAnimationExample1 extends fontAnimationPublic {

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
</script>

<style scoped lang="less">
    .example-1 {
        p {
            margin: 0 9em;
            font-size: 2em;
            font-weight: 600;
        }

        .landIn {
            display: flex;
            flex-wrap: wrap;
            line-height: 1.8;
            color: white;
            font-family: Lora, serif;
            white-space: pre;

            ::v-deep(span) {
                animation: landIn 0.8s ease-out both;
            }

        }

        @keyframes landIn {
            from {
                opacity: 0;
                transform: translateY(-20%);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
</style>
