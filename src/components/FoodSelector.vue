<template>
  <div class="food-selector-page">
    <div class="page-header">
      <h2><i class="fas fa-search"></i> База продуктов</h2>
      <p class="subtitle">Поиск и фильтрация продуктов для вашей тарелки</p>
    </div>

    <!-- Поиск и фильтры -->
    <div class="search-filters card">
      <div class="search-bar">
        <div class="search-input-wrapper">
          <i class="fas fa-search search-icon"></i>
          <input
              v-model="searchQuery"
              type="text"
              placeholder="Поиск продуктов..."
              class="search-input"
              @input="handleSearch"
          />
          <button v-if="searchQuery" class="clear-search" @click="clearSearch">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="search-actions">
          <button class="btn btn-secondary" @click="showAdvancedFilters = !showAdvancedFilters">
            <i class="fas fa-filter"></i>
            {{ showAdvancedFilters ? 'Скрыть фильтры' : 'Показать фильтры' }}
          </button>
          <button class="btn btn-primary" @click="addNewProduct">
            <i class="fas fa-plus"></i>
            Добавить продукт
          </button>
        </div>
      </div>

      <!-- Расширенные фильтры -->
      <div v-if="showAdvancedFilters" class="advanced-filters">
        <div class="filter-group">
          <h4>Категории</h4>
          <div class="filter-categories">
            <label v-for="category in availableCategories" :key="category.id" class="filter-checkbox">
              <input
                  type="checkbox"
                  :value="category.id"
                  v-model="selectedCategories"
                  @change="applyFilters"
              />
              <span class="filter-label">
                <span class="category-icon">{{ category.icon }}</span>
                {{ category.name }}
              </span>
            </label>
          </div>
        </div>

        <div class="filter-group">
          <h4>Питательные свойства</h4>
          <div class="nutrition-filters">
            <div class="nutrition-filter">
              <label>Белок (г):</label>
              <div class="range-inputs">
                <input
                    type="number"
                    v-model.number="proteinRange.min"
                    placeholder="Мин"
                    class="range-input"
                    @change="applyFilters"
                />
                <span class="range-separator">-</span>
                <input
                    type="number"
                    v-model.number="proteinRange.max"
                    placeholder="Макс"
                    class="range-input"
                    @change="applyFilters"
                />
              </div>
            </div>

            <div class="nutrition-filter">
              <label>Углеводы (г):</label>
              <div class="range-inputs">
                <input
                    type="number"
                    v-model.number="carbsRange.min"
                    placeholder="Мин"
                    class="range-input"
                    @change="applyFilters"
                />
                <span class="range-separator">-</span>
                <input
                    type="number"
                    v-model.number="carbsRange.max"
                    placeholder="Макс"
                    class="range-input"
                    @change="applyFilters"
                />
              </div>
            </div>

            <div class="nutrition-filter">
              <label>Калории (ккал):</label>
              <div class="range-inputs">
                <input
                    type="number"
                    v-model.number="caloriesRange.min"
                    placeholder="Мин"
                    class="range-input"
                    @change="applyFilters"
                />
                <span class="range-separator">-</span>
                <input
                    type="number"
                    v-model.number="caloriesRange.max"
                    placeholder="Макс"
                    class="range-input"
                    @change="applyFilters"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="filter-group">
          <h4>Сортировка</h4>
          <div class="sort-options">
            <select v-model="sortBy" class="sort-select" @change="applyFilters">
              <option value="name">По названию</option>
              <option value="calories">По калориям</option>
              <option value="protein">По белку</option>
              <option value="carbs">По углеводам</option>
              <option value="popularity">По популярности</option>
            </select>

            <div class="sort-order">
              <button
                  class="sort-order-btn"
                  :class="{ active: sortOrder === 'asc' }"
                  @click="setSortOrder('asc')"
              >
                <i class="fas fa-sort-amount-up"></i> Возрастание
              </button>
              <button
                  class="sort-order-btn"
                  :class="{ active: sortOrder === 'desc' }"
                  @click="setSortOrder('desc')"
              >
                <i class="fas fa-sort-amount-down"></i> Убывание
              </button>
            </div>
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn btn-secondary" @click="resetFilters">
            <i class="fas fa-redo"></i>
            Сбросить фильтры
          </button>
          <button class="btn btn-primary" @click="applyFilters">
            <i class="fas fa-check"></i>
            Применить фильтры
          </button>
        </div>
      </div>
    </div>

    <!-- Результаты поиска -->
    <div class="search-results">
      <div class="results-header">
        <h3>Найдено продуктов: {{ filteredFoods.length }}</h3>
        <div class="view-controls">
          <button
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
          >
            <i class="fas fa-th"></i>
          </button>
          <button
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
          >
            <i class="fas fa-list"></i>
          </button>
        </div>
      </div>

      <!-- Сообщение если ничего не найдено -->
      <div v-if="filteredFoods.length === 0" class="no-results">
        <i class="fas fa-search fa-3x"></i>
        <h4>Продукты не найдены</h4>
        <p>Попробуйте изменить условия поиска или сбросить фильтры</p>
        <button class="btn btn-primary" @click="resetFilters">
          <i class="fas fa-redo"></i>
          Сбросить фильтры
        </button>
      </div>

      <!-- Список продуктов в виде сетки -->
      <div v-if="viewMode === 'grid'" class="food-grid">
        <div
            v-for="food in paginatedFoods"
            :key="food.id"
            class="food-card-grid"
            @click="selectFood(food)"
            :class="{ selected: isSelected(food.id) }"
        >
          <div class="food-card-header" :style="{ backgroundColor: food.color + '20' }">
            <span class="food-icon">{{ food.icon }}</span>
            <div class="food-card-info">
              <h4>{{ food.name }}</h4>
              <span class="food-category">{{ getCategoryName(food.category) }}</span>
            </div>
            <button class="favorite-btn" @click.stop="toggleFavorite(food.id)">
              <i :class="isFavorite(food.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
            </button>
          </div>

          <div class="food-card-content">
            <p class="food-description">{{ food.description }}</p>

            <div class="nutrition-badges">
              <div class="nutrition-badge" :title="'Калории: ' + food.nutrition.calories">
                <i class="fas fa-fire"></i>
                <span>{{ food.nutrition.calories }}</span>
              </div>
              <div class="nutrition-badge" :title="'Белок: ' + food.nutrition.protein + 'г'">
                <i class="fas fa-dumbbell"></i>
                <span>{{ food.nutrition.protein }}г</span>
              </div>
              <div class="nutrition-badge" :title="'Углеводы: ' + food.nutrition.carbs + 'г'">
                <i class="fas fa-bread-slice"></i>
                <span>{{ food.nutrition.carbs }}г</span>
              </div>
              <div class="nutrition-badge" :title="'Жиры: ' + food.nutrition.fat + 'г'">
                <i class="fas fa-oil-can"></i>
                <span>{{ food.nutrition.fat }}г</span>
              </div>
            </div>

            <div class="food-tags">
              <span v-for="tag in food.tags.slice(0, 3)" :key="tag" class="tag">
                {{ tag }}
              </span>
              <span v-if="food.tags.length > 3" class="tag-more">
                +{{ food.tags.length - 3 }}
              </span>
            </div>
          </div>

          <div class="food-card-actions">
            <button class="btn btn-sm btn-secondary" @click.stop="showFoodDetails(food)">
              <i class="fas fa-info-circle"></i>
            </button>
            <button class="btn btn-sm btn-primary" @click.stop="addToPlate(food)">
              <i class="fas fa-plus"></i>
              Добавить
            </button>
          </div>
        </div>
      </div>

      <!-- Список продуктов в виде таблицы -->
      <div v-if="viewMode === 'list'" class="food-table">
        <table>
          <thead>
          <tr>
            <th>Продукт</th>
            <th>Категория</th>
            <th>Калории</th>
            <th>Белок</th>
            <th>Углеводы</th>
            <th>Жиры</th>
            <th>Действия</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="food in paginatedFoods"
              :key="food.id"
              @click="selectFood(food)"
              :class="{ selected: isSelected(food.id) }"
          >
            <td class="food-cell">
              <span class="food-icon">{{ food.icon }}</span>
              <div class="food-info">
                <strong>{{ food.name }}</strong>
                <small>{{ food.description }}</small>
              </div>
            </td>
            <td>{{ getCategoryName(food.category) }}</td>
            <td>{{ food.nutrition.calories }}</td>
            <td>{{ food.nutrition.protein }}г</td>
            <td>{{ food.nutrition.carbs }}г</td>
            <td>{{ food.nutrition.fat }}г</td>
            <td class="actions-cell">
              <button class="btn-icon" @click.stop="toggleFavorite(food.id)">
                <i :class="isFavorite(food.id) ? 'fas fa-heart text-danger' : 'far fa-heart'"></i>
              </button>
              <button class="btn-icon" @click.stop="showFoodDetails(food)">
                <i class="fas fa-info-circle"></i>
              </button>
              <button class="btn btn-sm btn-primary" @click.stop="addToPlate(food)">
                <i class="fas fa-plus"></i>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Пагинация -->
      <div v-if="filteredFoods.length > itemsPerPage" class="pagination">
        <button
            class="pagination-btn"
            :disabled="currentPage === 1"
            @click="prevPage"
        >
          <i class="fas fa-chevron-left"></i>
        </button>

        <div class="page-numbers">
          <button
              v-for="page in pageNumbers"
              :key="page"
              class="page-number"
              :class="{ active: page === currentPage }"
              @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
            class="pagination-btn"
            :disabled="currentPage === totalPages"
            @click="nextPage"
        >
          <i class="fas fa-chevron-right"></i>
        </button>

        <div class="page-info">
          Страница {{ currentPage }} из {{ totalPages }}
        </div>
      </div>
    </div>

    <!-- Панель выбранных продуктов -->
    <div v-if="selectedFoods.length > 0" class="selected-panel card">
      <h3>Выбранные продукты ({{ selectedFoods.length }})</h3>
      <div class="selected-list">
        <div v-for="food in selectedFoods" :key="food.id" class="selected-item">
          <span class="selected-icon">{{ food.icon }}</span>
          <span class="selected-name">{{ food.name }}</span>
          <div class="selected-amount">
            <input
                type="number"
                v-model.number="food.amount"
                min="10"
                max="1000"
                step="10"
                class="amount-input"
            />
            <span class="amount-unit">г</span>
          </div>
          <button class="btn-icon remove-btn" @click="removeSelected(food.id)">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="selected-actions">
        <div class="total-nutrition">
          <span class="nutrition-item">
            <i class="fas fa-fire"></i>
            {{ totalNutrition.calories }} ккал
          </span>
          <span class="nutrition-item">
            <i class="fas fa-dumbbell"></i>
            {{ totalNutrition.protein }}г белка
          </span>
        </div>

        <div class="action-buttons">
          <button class="btn btn-secondary" @click="clearSelected">
            <i class="fas fa-trash"></i>
            Очистить
          </button>
          <button class="btn btn-primary" @click="addAllToPlate">
            <i class="fas fa-plus-circle"></i>
            Добавить все в тарелку
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно с деталями продукта -->
    <div v-if="selectedFoodDetail" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            <span class="food-icon-modal">{{ selectedFoodDetail.icon }}</span>
            {{ selectedFoodDetail.name }}
          </h3>
          <button class="modal-close" @click="closeModal">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="food-detail-grid">
            <div class="detail-section">
              <h4>Основная информация</h4>
              <div class="detail-item">
                <span class="detail-label">Категория:</span>
                <span class="detail-value">{{ getCategoryName(selectedFoodDetail.category) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Описание:</span>
                <span class="detail-value">{{ selectedFoodDetail.description }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Пищевая ценность (на 100г)</h4>
              <div class="nutrition-details">
                <div class="nutrition-detail">
                  <div class="nutrition-label">Калории</div>
                  <div class="nutrition-value">{{ selectedFoodDetail.nutrition.calories }} ккал</div>
                </div>
                <div class="nutrition-detail">
                  <div class="nutrition-label">Белок</div>
                  <div class="nutrition-value">{{ selectedFoodDetail.nutrition.protein }} г</div>
                </div>
                <div class="nutrition-detail">
                  <div class="nutrition-label">Углеводы</div>
                  <div class="nutrition-value">{{ selectedFoodDetail.nutrition.carbs }} г</div>
                </div>
                <div class="nutrition-detail">
                  <div class="nutrition-label">Жиры</div>
                  <div class="nutrition-value">{{ selectedFoodDetail.nutrition.fat }} г</div>
                </div>
                <div class="nutrition-detail">
                  <div class="nutrition-label">Клетчатка</div>
                  <div class="nutrition-value">{{ selectedFoodDetail.nutrition.fiber }} г</div>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedFoodDetail.tags && selectedFoodDetail.tags.length > 0">
              <h4>Теги</h4>
              <div class="tags-container">
                <span v-for="tag in selectedFoodDetail.tags" :key="tag" class="tag-detail">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">
            <i class="fas fa-times"></i>
            Закрыть
          </button>
          <button class="btn btn-primary" @click="addToPlateFromModal">
            <i class="fas fa-plus"></i>
            Добавить в тарелку
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import foodsData from '../data/foods.json'
import { calculatePlateNutrition } from '../utils/calculations'

export default {
  name: 'FoodSelector',

  setup() {
    const router = useRouter()

    // Состояние
    const searchQuery = ref('')
    const showAdvancedFilters = ref(false)
    const selectedCategories = ref([])
    const proteinRange = ref({ min: null, max: null })
    const carbsRange = ref({ min: null, max: null })
    const caloriesRange = ref({ min: null, max: null })
    const sortBy = ref('name')
    const sortOrder = ref('asc')
    const viewMode = ref('grid')
    const selectedFoods = ref([])
    const selectedFoodDetail = ref(null)
    const favoriteFoods = ref(new Set())

    // Пагинация
    const currentPage = ref(1)
    const itemsPerPage = ref(12)

    // Категории для фильтрации
    const availableCategories = computed(() => {
      const categories = [
        { id: 'vegetable', name: 'Овощи и фрукты', icon: '🥗' },
        { id: 'protein', name: 'Белки', icon: '🥩' },
        { id: 'carb', name: 'Углеводы', icon: '🍞' }
      ]

      // Добавляем категорию "Все" если не все выбраны
      if (selectedCategories.value.length !== categories.length) {
        categories.unshift({ id: 'all', name: 'Все категории', icon: '🍽️' })
      }

      return categories
    })

    // Фильтрация продуктов
    const filteredFoods = computed(() => {
      let filtered = [...foodsData.foods]

      // Поиск по названию и описанию
      if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        filtered = filtered.filter(food =>
            food.name.toLowerCase().includes(query) ||
            food.description.toLowerCase().includes(query) ||
            food.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      // Фильтрация по категориям
      if (selectedCategories.value.length > 0 && !selectedCategories.value.includes('all')) {
        filtered = filtered.filter(food =>
            selectedCategories.value.includes(food.category)
        )
      }

      // Фильтрация по питательным свойствам
      filtered = filtered.filter(food => {
        const nutrition = food.nutrition

        if (proteinRange.value.min !== null && nutrition.protein < proteinRange.value.min) return false
        if (proteinRange.value.max !== null && nutrition.protein > proteinRange.value.max) return false

        if (carbsRange.value.min !== null && nutrition.carbs < carbsRange.value.min) return false
        if (carbsRange.value.max !== null && nutrition.carbs > carbsRange.value.max) return false

        if (caloriesRange.value.min !== null && nutrition.calories < caloriesRange.value.min) return false
        if (caloriesRange.value.max !== null && nutrition.calories > caloriesRange.value.max) return false

        return true
      })

      // Сортировка
      filtered.sort((a, b) => {
        let aValue, bValue

        switch (sortBy.value) {
          case 'name':
            aValue = a.name
            bValue = b.name
            break
          case 'calories':
            aValue = a.nutrition.calories
            bValue = b.nutrition.calories
            break
          case 'protein':
            aValue = a.nutrition.protein
            bValue = b.nutrition.protein
            break
          case 'carbs':
            aValue = a.nutrition.carbs
            bValue = b.nutrition.carbs
            break
          case 'popularity':
            // Здесь можно добавить логику популярности
            aValue = favoriteFoods.value.has(a.id) ? 1 : 0
            bValue = favoriteFoods.value.has(b.id) ? 1 : 0
            break
          default:
            aValue = a.name
            bValue = b.name
        }

        if (typeof aValue === 'string') {
          return sortOrder.value === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue)
        } else {
          return sortOrder.value === 'asc'
              ? aValue - bValue
              : bValue - aValue
        }
      })

      return filtered
    })

    // Пагинация
    const totalPages = computed(() =>
        Math.ceil(filteredFoods.length / itemsPerPage.value)
    )

    const paginatedFoods = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value
      const end = start + itemsPerPage.value
      return filteredFoods.value.slice(start, end)
    })

    const pageNumbers = computed(() => {
      const pages = []
      const maxPagesToShow = 5

      let start = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2))
      let end = Math.min(totalPages.value, start + maxPagesToShow - 1)

      if (end - start + 1 < maxPagesToShow) {
        start = Math.max(1, end - maxPagesToShow + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    })

    // Общая питательность выбранных продуктов
    const totalNutrition = computed(() => {
      const items = selectedFoods.value.map(food => ({
        foodId: food.id,
        amount: food.amount || 100
      }))

      return calculatePlateNutrition(items, foodsData)
    })

    // Методы
    function getCategoryName(categoryId) {
      return foodsData.categories[categoryId] || categoryId
    }

    function handleSearch() {
      currentPage.value = 1
    }

    function clearSearch() {
      searchQuery.value = ''
      currentPage.value = 1
    }

    function applyFilters() {
      currentPage.value = 1
    }

    function resetFilters() {
      searchQuery.value = ''
      selectedCategories.value = []
      proteinRange.value = { min: null, max: null }
      carbsRange.value = { min: null, max: null }
      caloriesRange.value = { min: null, max: null }
      sortBy.value = 'name'
      sortOrder.value = 'asc'
      currentPage.value = 1
    }

    function setSortOrder(order) {
      sortOrder.value = order
      applyFilters()
    }

    function selectFood(food) {
      const index = selectedFoods.value.findIndex(f => f.id === food.id)
      if (index === -1) {
        selectedFoods.value.push({
          ...food,
          amount: 100
        })
      }
    }

    function isSelected(foodId) {
      return selectedFoods.value.some(f => f.id === foodId)
    }

    function removeSelected(foodId) {
      selectedFoods.value = selectedFoods.value.filter(f => f.id !== foodId)
    }

    function clearSelected() {
      selectedFoods.value = []
    }

    function addToPlate(food) {
      selectFood(food)
      // Позже можно добавить переход на страницу тарелки
    }

    function addAllToPlate() {
      if (selectedFoods.value.length > 0) {
        router.push('/')
        // Здесь можно передать выбранные продукты в состояние тарелки
      }
    }

    function showFoodDetails(food) {
      selectedFoodDetail.value = food
    }

    function closeModal() {
      selectedFoodDetail.value = null
    }

    function addToPlateFromModal() {
      if (selectedFoodDetail.value) {
        addToPlate(selectedFoodDetail.value)
        closeModal()
      }
    }

    function toggleFavorite(foodId) {
      if (favoriteFoods.value.has(foodId)) {
        favoriteFoods.value.delete(foodId)
      } else {
        favoriteFoods.value.add(foodId)
      }
      // Сохраняем в localStorage
      localStorage.setItem('favorite_foods', JSON.stringify([...favoriteFoods.value]))
    }

    function isFavorite(foodId) {
      return favoriteFoods.value.has(foodId)
    }

    function addNewProduct() {
      // TODO: Реализовать добавление нового продукта
      alert('Функция добавления нового продукта будет реализована позже')
    }

    // Пагинация
    function prevPage() {
      if (currentPage.value > 1) {
        currentPage.value--
      }
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        currentPage.value++
      }
    }

    function goToPage(page) {
      currentPage.value = page
    }

    // Инициализация
    onMounted(() => {
      // Загружаем избранные продукты из localStorage
      const savedFavorites = localStorage.getItem('favorite_foods')
      if (savedFavorites) {
        favoriteFoods.value = new Set(JSON.parse(savedFavorites))
      }
    })

    return {
      // Состояние
      searchQuery,
      showAdvancedFilters,
      selectedCategories,
      proteinRange,
      carbsRange,
      caloriesRange,
      sortBy,
      sortOrder,
      viewMode,
      selectedFoods,
      selectedFoodDetail,
      currentPage,
      itemsPerPage,

      // Вычисляемые свойства
      availableCategories,
      filteredFoods,
      paginatedFoods,
      totalPages,
      pageNumbers,
      totalNutrition,

      // Методы
      getCategoryName,
      handleSearch,
      clearSearch,
      applyFilters,
      resetFilters,
      setSortOrder,
      selectFood,
      isSelected,
      removeSelected,
      clearSelected,
      addToPlate,
      addAllToPlate,
      showFoodDetails,
      closeModal,
      addToPlateFromModal,
      toggleFavorite,
      isFavorite,
      addNewProduct,
      prevPage,
      nextPage,
      goToPage
    }
  }
}
</script>

<style scoped>
.food-selector-page {
  padding: var(--spacing-lg) 0;
}

/* Поиск и фильтры */
.search-filters {
  margin-bottom: var(--spacing-lg);
}

.search-bar {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 45px;
  font-size: 1rem;
}

.clear-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  padding: 5px;
}

.clear-search:hover {
  color: var(--danger-color);
}

.search-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Расширенные фильтры */
.advanced-filters {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-lg);
}

.filter-group {
  margin-bottom: var(--spacing-lg);
}

.filter-group h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
}

.filter-categories {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  transition: background var(--transition-fast);
}

.filter-checkbox:hover {
  background: var(--bg-tertiary);
}

.filter-checkbox input {
  margin: 0;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.category-icon {
  font-size: 1.2rem;
}

.nutrition-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.nutrition-filter label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.range-input {
  width: 80px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: center;
}

.range-separator {
  color: var(--text-light);
}

.sort-options {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.sort-select {
  flex: 1;
  max-width: 200px;
}

.sort-order {
  display: flex;
  gap: var(--spacing-xs);
}

.sort-order-btn {
  padding: 8px 12px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.sort-order-btn:hover {
  background: var(--bg-tertiary);
}

.sort-order-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

/* Результаты поиска */
.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.view-controls {
  display: flex;
  gap: var(--spacing-xs);
}

.view-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-btn:hover {
  background: var(--bg-tertiary);
}

.view-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.no-results {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

.no-results i {
  margin-bottom: var(--spacing-md);
  color: var(--text-light);
}

.no-results h4 {
  margin-bottom: var(--spacing-sm);
}

/* Сетка продуктов */
.food-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.food-card-grid {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.food-card-grid:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.food-card-grid.selected {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.food-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
}

.food-icon {
  font-size: 2rem;
}

.food-card-info {
  flex: 1;
}

.food-card-info h4 {
  margin: 0;
}

.food-category {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.favorite-btn {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.food-card-content {
  padding: 0 var(--spacing-md) var(--spacing-md);
}

.food-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.4;
}

.nutrition-badges {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.nutrition-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
}

.nutrition-badge i {
  color: var(--primary-color);
}

.food-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.tag {
  padding: 2px 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.tag-more {
  font-size: 0.8rem;
  color: var(--text-light);
  padding: 2px 8px;
}

.food-card-actions {
  display: flex;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

/* Таблица продуктов */
.food-table {
  margin-bottom: var(--spacing-lg);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.food-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
}

.food-table th {
  background: var(--bg-tertiary);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
}

.food-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.food-table tr:hover {
  background: var(--bg-secondary);
}

.food-table tr.selected {
  background: rgba(102, 126, 234, 0.05);
}

.food-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.food-info {
  display: flex;
  flex-direction: column;
}

.food-info strong {
  margin-bottom: 4px;
}

.food-info small {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.actions-cell {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.btn-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background: var(--bg-tertiary);
}

.text-danger {
  color: var(--danger-color);
}

/* Пагинация */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  margin: var(--spacing-xl) 0;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.pagination-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

.page-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.page-number:hover {
  background: var(--bg-tertiary);
}

.page-number.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-info {
  margin-left: auto;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

/* Панель выбранных продуктов */
.selected-panel {
  position: sticky;
  bottom: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  z-index: 100;
}

.selected-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: var(--spacing-md);
  padding-right: var(--spacing-sm);
}

.selected-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-xs);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.selected-icon {
  font-size: 1.5rem;
}

.selected-name {
  flex: 1;
  font-weight: 500;
}

.selected-amount {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.amount-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  text-align: center;
}

.amount-unit {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.remove-btn {
  color: var(--danger-color);
}

.remove-btn:hover {
  background: var(--danger-color);
  color: white;
}

.selected-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.total-nutrition {
  display: flex;
  gap: var(--spacing-lg);
}

.nutrition-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-weight: 500;
}

.nutrition-item i {
  color: var(--primary-color);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
}

/* Модальное окно */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.food-icon-modal {
  font-size: 2rem;
}

.modal-close {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.modal-close:hover {
  background: var(--bg-secondary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.food-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.detail-section {
  margin-bottom: var(--spacing-lg);
}

.detail-section h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  padding-bottom: var(--spacing-xs);
}

.detail-item {
  display: flex;
  margin-bottom: var(--spacing-sm);
}

.detail-label {
  width: 120px;
  font-weight: 500;
  color: var(--text-secondary);
}

.detail-value {
  flex: 1;
}

.nutrition-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.nutrition-detail {
  text-align: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.nutrition-detail .nutrition-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
}

.nutrition-detail .nutrition-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag-detail {
  padding: 4px 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

/* Адаптивность */
@media (max-width: 768px) {
  .food-detail-grid {
    grid-template-columns: 1fr;
  }

  .selected-actions {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: stretch;
  }

  .total-nutrition {
    justify-content: space-around;
  }

  .action-buttons {
    justify-content: center;
  }

  .food-table {
    font-size: 0.9rem;
  }

  .food-table th,
  .food-table td {
    padding: var(--spacing-sm);
  }
}

@media (max-width: 480px) {
  .food-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    max-height: 95vh;
  }

  .pagination {
    flex-wrap: wrap;
  }

  .page-info {
    margin-left: 0;
    width: 100%;
    text-align: center;
    order: 1;
  }
}

/* Прокрутка */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}
</style>