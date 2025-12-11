import { createRouter, createWebHistory } from 'vue-router'

// Импортируем компоненты
const Plate = () => import('./components/Plate.vue')
const FoodSelector = () => import('./components/FoodSelector.vue')
const NutritionInfo = () => import('./components/NutritionInfo.vue')
const CompatibilityInfo = () => import('./components/CompatibilityInfo.vue')

const routes = [
    {
        path: '/',
        name: 'home',
        component: Plate,
        meta: { title: 'Конструктор тарелки' }
    },
    {
        path: '/foods',
        name: 'foods',
        component: FoodSelector,
        meta: { title: 'База продуктов' }
    },
    {
        path: '/nutrition',
        name: 'nutrition',
        component: NutritionInfo,
        meta: { title: 'Анализ питательности' }
    },
    {
        path: '/compatibility',
        name: 'compatibility',
        component: CompatibilityInfo,
        meta: { title: 'Сочетаемость продуктов' }
    },
    // Редирект для старых URL
    {
        path: '/saved',
        redirect: '/'
    },
    // 404 страница
    {
        path: '/:pathMatch(.*)*',
        redirect: '/'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// Изменяем заголовок страницы при навигации
router.beforeEach((to, from, next) => {
    document.title = to.meta.title ? `${to.meta.title} | Harvard Plate` : 'Harvard Plate'
    next()
})

export default router