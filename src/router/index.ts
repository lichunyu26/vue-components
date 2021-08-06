import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

/*子路由*/
export const routesList: Array<RouteRecordRaw> = [
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
    }
]

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        children: routesList,
        // redirect:"digital-scroll"
    },

]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
