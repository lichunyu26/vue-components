'use strict';
import { createRouter, createWebHashHistory } from 'vue-router';
/*子路由*/
export const routesList = [
    {
        path: 'digital-scroll',
        name: 'DigitalScroll',
        meta: {
            title: "数字滚动"
        },
        component: () => import('@/components/digital-scroll/index.tsx'),
    }, {
        path: 'screen-shots',
        name: 'Screenshots',
        meta: {
            title: "屏幕截图"
        },
        component: () => import('@/components/screenshots/index.tsx'),
    },
    {
        path: 'font-animation',
        name: 'FontAnimation',
        meta: {
            title: "字体动画"
        },
        component: () => import('@/components/font-animation/index.vue'),
        children: [
            {
                path: 'example-1',
                name: 'Example-1',
                meta: {
                    title: "动画效果1"
                },
                component: () => import('@/components/font-animation/example-1.tsx'),
            }, {
                path: 'example-2',
                name: 'Example-2',
                meta: {
                    title: "动画效果2"
                },
                // @ts-ignore
                component: () => import('@/components/font-animation/example-2.tsx'),
            },
        ]
    },
    {
        path: 'datetime-picker',
        name: 'datetimePicker',
        meta: {
            title: "时间选择器"
        },
        component: () => import('@/components/datetime-picker/index.vue'),
    }, {
        path: 'openlayer-map',
        name: 'olMap',
        meta: {
            title: "openlayer+天地图"
        },
        component: () => import('@/components/ol-map/Map.vue'),
    }, {
        path: 'dom2img-lazy-loading',
        name: 'LazyLoading',
        meta: {
            title: "dom2img懒加载"
        },
        component: () => import('@/components/dom2img-lazy/index.vue'),
    }
];
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        redirect: 'digital-scroll',
        children: [{
                path: 'digital-scroll',
                name: 'DigitalScroll',
                meta: {
                    title: "数字滚动"
                },
                component: () => import('@/components/digital-scroll/index.tsx'),
            }, ...routesList],
    },
];
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
export default router;
//# sourceMappingURL=index.js.map