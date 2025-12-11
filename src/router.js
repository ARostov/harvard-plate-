import { createRouter, createWebHistory } from 'vue-router'

// Ленивая загрузка компонентов (пока пустые)
const Home = () => import('./components/Plate.vue')
const SavedPlates = () => import('./components/FoodSelector.vue') // временно
const FoodDatabase = () => import('./components/NutritionInfo.vue') // временно

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: 'Конструктор тарелки' }
    },
    {
        path: '/saved',
        name: 'saved',
        component: SavedPlates,
        meta: { title: 'Сохраненные тарелки' }
    },
    {
        path: '/foods',
        name: 'foods',
        component: FoodDatabase,
        meta: { title: 'База продуктов' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Изменяем заголовок страницы при навигации
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Harvard Plate'
    next()
})

export default router