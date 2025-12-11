<template>
  <div id="app">
    <!-- Навигация -->
    <nav class="navbar">
      <div class="container">
        <div class="nav-brand">
          <i class="fas fa-utensils"></i>
          <h1>Harvard Plate</h1>
        </div>

        <div class="nav-menu">
          <router-link to="/" class="nav-link">
            <i class="fas fa-plus-circle"></i>
            <span>Конструктор</span>
          </router-link>

          <router-link to="/saved" class="nav-link">
            <i class="fas fa-save"></i>
            <span>Сохраненные</span>
          </router-link>

          <router-link to="/foods" class="nav-link">
            <i class="fas fa-database"></i>
            <span>Продукты</span>
          </router-link>

          <button class="auth-btn" @click="toggleAuth">
            <i class="fas fa-user"></i>
            <span>{{ authStatus }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <main class="main-content">
      <div class="container">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- Футер -->
    <footer class="footer">
      <div class="container">
        <p>Harvard Plate &copy; 2024 | Здоровое питание для всех</p>
        <p class="footer-note">
          <i class="fas fa-info-circle"></i>
          Основано на принципах Гарвардской тарелки питания
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isAuthenticated: false
    }
  },
  computed: {
    authStatus() {
      return this.isAuthenticated ? 'Выйти' : 'Войти'
    }
  },
  methods: {
    toggleAuth() {
      this.isAuthenticated = !this.isAuthenticated
      // Позже добавим GitHub OAuth
    }
  }
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Навигация */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 15px 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.5rem;
  color: #667eea;
}

.nav-brand i {
  font-size: 1.8rem;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: #667eea;
  color: white;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #764ba2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s;
}

.auth-btn:hover {
  background: #5a3780;
}

/* Основной контент */
.main-content {
  flex: 1;
  padding: 30px 0;
  background: #f8f9fa;
}

/* Футер */
.footer {
  background: #333;
  color: white;
  padding: 20px 0;
  text-align: center;
}

.footer-note {
  margin-top: 10px;
  font-size: 0.9rem;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

/* Анимации */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .nav-menu {
    gap: 10px;
  }

  .nav-link span,
  .auth-btn span {
    display: none;
  }

  .nav-link,
  .auth-btn {
    padding: 10px;
  }
}
</style>