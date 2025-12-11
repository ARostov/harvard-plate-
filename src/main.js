import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

// Импортируем стили
import './styles/reset.css'
import './styles/main.css'

// Создаем и монтируем приложение
const app = createApp(App)
app.use(router)
app.mount('#app')

// Убираем индикатор загрузки после монтирования
app.config.globalProperties.$appReady = true
const loading = document.querySelector('.loading')
if (loading) {
    loading.style.display = 'none'
}