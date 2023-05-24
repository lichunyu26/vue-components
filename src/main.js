import { createApp } from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import { createPinia } from "pinia";
const pinia = createPinia();
function findAbsoluteEl(el) {
    const position = window.getComputedStyle(el).position;
    if (position === "absolute")
        return el;
    // @ts-ignore
    return findAbsoluteEl(el.parentElement);
}
const v3App = createApp(App);
function findElParentWithClass(el, className) {
    const position = window.getComputedStyle(el).position;
    if (position === "absolute")
        return el;
    // @ts-ignore
    return findElParentWithAntModalClass(el.parentElement, className);
}
const draggable = {
    mounted: function (bindEl) {
        //获取要绑定的el
        // const titleEl = findElParentWithClass(bindEl,)
        bindEl = document.querySelector(".ant-modal-header");
        // console.log(e)
        // const antBindEl = bindEl
        let disx = 0;
        let disy = 0;
        bindEl.onmousedown = function (e) {
            // const el = findAbsoluteEl(bindEl);
            const el = document.querySelector(".ant-modal");
            //向上找到 position 是 absolute 的元素，拖动该元素
            disx = e.pageX - el.offsetLeft;
            disy = e.pageY - el.offsetTop;
            el.style.cursor = 'move';
            window.onmousemove = function (event) {
                // el.style.cursor = 'move'
                let x = event.pageX - disx;
                let y = event.pageY - disy;
                let maxX = document.body.clientWidth - parseInt(window.getComputedStyle(el).width);
                let maxY = document.body.clientHeight - parseInt(window.getComputedStyle(el).height);
                if (x < 0) {
                    x = 0;
                }
                else if (x > maxX) {
                    x = maxX;
                }
                if (y < 0) {
                    y = 0;
                }
                else if (y > maxY) {
                    y = maxY;
                }
                el.classList.add("move");
                el.style.left = x + 'px';
                el.style.top = y + 'px';
                el.style.right = 'unset';
                el.style.bottom = 'unset';
            };
            window.onmouseup = function () {
                el.style.cursor = 'auto';
                el.classList.remove("move");
                window.onmousemove = window.onmouseup = null;
            };
        };
    },
    unmount: function (el) {
        el.style.cursor = 'auto';
        el.onmousedown = null;
    }
};
v3App.directive("draggable-modal", draggable);
v3App.use(pinia);
v3App.use(router).mount('#app');
//# sourceMappingURL=main.js.map