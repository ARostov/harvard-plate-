<template>
  <div class="plate-page">
    <div class="page-header">
      <h2><i class="fas fa-utensils"></i> Конструктор тарелки</h2>
      <p class="subtitle">Соберите идеальную тарелку по принципам Гарвардского питания</p>
    </div>

    <div class="plate-layout">
      <!-- Левая колонка: Визуализация тарелки -->
      <div class="plate-visualization card">
        <h3>Ваша тарелка</h3>

        <!-- Визуализация Гарвардской тарелки -->
        <div class="plate-container">
          <div class="plate-circle">
            <!-- Секция овощей (50%) -->
            <div class="plate-section vegetables" :style="{ '--percentage': vegetablePercentage + '%' }">
              <h4>Овощи и фрукты ({{ vegetablePercentage }}%)</h4>
              <div class="plate-items">
                <div v-for="item in vegetableItems" :key="item.id" class="plate-item">
                  <span class="food-icon">{{ getFoodIcon(item.foodId) }}</span>
                  <span class="food-name">{{ getFoodName(item.foodId) }}</span>
                  <span class="food-amount">{{ item.amount }}г</span>
                  <button class="remove-btn" @click="removeFromPlate(item)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div v-if="vegetableItems.length === 0" class="empty-section">
                  <i class="fas fa-leaf"></i>
                  <p>Добавьте овощи или фрукты</p>
                </div>
              </div>
            </div>

            <!-- Секция белков (25%) -->
            <div class="plate-section proteins" :style="{ '--percentage': proteinPercentage + '%' }">
              <h4>Белки ({{ proteinPercentage }}%)</h4>
              <div class="plate-items">
                <div v-for="item in proteinItems" :key="item.id" class="plate-item">
                  <span class="food-icon">{{ getFoodIcon(item.foodId) }}</span>
                  <span class="food-name">{{ getFoodName(item.foodId) }}</span>
                  <span class="food-amount">{{ item.amount }}г</span>
                  <button class="remove-btn" @click="removeFromPlate(item)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div v-if="proteinItems.length === 0" class="empty-section">
                  <i class="fas fa-drumstick-bite"></i>
                  <p>Добавьте белки</p>
                </div>
              </div>
            </div>

            <!-- Секция углеводов (25%) -->
            <div class="plate-section carbs" :style="{ '--percentage': carbPercentage + '%' }">
              <h4>Углеводы ({{ carbPercentage }}%)</h4>
              <div class="plate-items">
                <div v-for="item in carbItems" :key="item.id" class="plate-item">
                  <span class="food-icon">{{ getFoodIcon(item.foodId) }}</span>
                  <span class="food-name">{{ getFoodName(item.foodId) }}</span>
                  <span class="food-amount">{{ item.amount }}г</span>
                  <button class="remove-btn" @click="removeFromPlate(item)">
                    <i class="fas fa-times"></i>
                  </button>
                </div>
                <div v-if="carbItems.length === 0" class="empty-section">
                  <i class="fas fa-bread-slice"></i>
                  <p>Добавьте углеводы</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация о питательности -->
        <div class="nutrition-summary">
          <h4>Пищевая ценность</h4>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutrition.calories }}</div>
              <div class="nutrition-label">Калории</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutrition.protein }}г</div>
              <div class="nutrition-label">Белки</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutrition.carbs }}г</div>
              <div class="nutrition-label">Углеводы</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutrition.fat }}г</div>
              <div class="nutrition-label">Жиры</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-value">{{ nutrition.fiber }}г</div>
              <div class="nutrition-label">Клетчатка</div>
            </div>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="plate-actions">
          <button class="btn btn-secondary" @click="clearPlate" :disabled="plateItems.length === 0">
            <i class="fas fa-trash"></i> Очистить
          </button>
          <button class="btn btn-primary" @click="savePlate" :disabled="plateItems.length === 0">
            <i class="fas fa-save"></i> Сохранить тарелку
          </button>
          <button class="btn btn-secondary" @click="sharePlate" :disabled="plateItems.length === 0">
            <i class="fas fa-share"></i> Поделиться
          </button>
        </div>
      </div>

      <!-- Правая колонка: Выбор продуктов -->
      <div class="food-selection card">
        <h3>Выберите продукты</h3>

        <!-- Фильтр по категориям -->
        <div class="category-filter">
          <button
              v-for="category in categories"
              :key="category.id"
              class="category-btn"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
          >
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ category.name }}</span>
          </button>
        </div>

        <!-- Список продуктов -->
        <div class="food-list">
          <div
              v-for="food in filteredFoods"
              :key="food.id"
              class="food-card"
              @click="addToPlate(food)"
              :style="{ borderLeftColor: food.color }"
          >
            <div class="food-card-header">
              <span class="food-icon">{{ food.icon }}</span>
              <h4>{{ food.name }}</h4>
              <span class="food-category">{{ getCategoryName(food.category) }}</span>
            </div>

            <p class="food-description">{{ food.description }}</p>

            <div class="food-nutrition">
              <span class="nutrition-badge">
                <i class="fas fa-fire"></i> {{ food.nutrition.calories }} ккал
              </span>
              <span class="nutrition-badge">
                <i class="fas fa-dumbbell"></i> {{ food.nutrition.protein }}г белка
              </span>
              <span class="nutrition-badge">
                <i class="fas fa-seedling"></i> {{ food.nutrition.fiber }}г клетчатки
              </span>
            </div>

            <div class="food-card-actions">
              <button class="btn btn-sm" @click.stop="showFoodDetails(food)">
                <i class="fas fa-info-circle"></i> Подробнее
              </button>
              <button class="btn btn-primary btn-sm" @click.stop="addToPlate(food)">
                <i class="fas fa-plus"></i> Добавить
              </button>
            </div>
          </div>
        </div>

        <!-- Быстрый выбор количества -->
        <div class="quick-add" v-if="selectedFood">
          <h4>Добавить {{ selectedFood?.name }}</h4>
          <div class="amount-selector">
            <button class="amount-btn" @click="decreaseAmount">-</button>
            <input
                type="number"
                v-model.number="foodAmount"
                min="10"
                max="1000"
                step="10"
                class="amount-input"
            />
            <span class="amount-unit">грамм</span>
            <button class="amount-btn" @click="increaseAmount">+</button>
          </div>
          <button class="btn btn-primary" @click="confirmAdd">
            <i class="fas fa-check"></i> Добавить {{ foodAmount }}г
          </button>
        </div>
      </div>
    </div>

    <!-- Анализ тарелки -->
    <div class="plate-analysis card">
      <h3><i class="fas fa-chart-line"></i> Анализ вашей тарелки</h3>

      <!-- Баланс Гарвардской тарелки -->
      <div class="analysis-section">
        <h4>Баланс по Гарвардской тарелке</h4>
        <div class="balance-indicators">
          <div class="balance-item" :class="getBalanceClass('vegetable')">
            <div class="balance-label">Овощи и фрукты</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: vegetablePercentage + '%' }"></div>
            </div>
            <div class="balance-value">{{ vegetablePercentage }}% (цель: 50%)</div>
          </div>

          <div class="balance-item" :class="getBalanceClass('protein')">
            <div class="balance-label">Белки</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: proteinPercentage + '%' }"></div>
            </div>
            <div class="balance-value">{{ proteinPercentage }}% (цель: 25%)</div>
          </div>

          <div class="balance-item" :class="getBalanceClass('carb')">
            <div class="balance-label">Углеводы</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: carbPercentage + '%' }"></div>
            </div>
            <div class="balance-value">{{ carbPercentage }}% (цель: 25%)</div>
          </div>
        </div>
      </div>

      <!-- Рекомендации -->
      <div class="analysis-section" v-if="recommendations.length > 0">
        <h4>Рекомендации</h4>
        <div class="recommendations">
          <div
              v-for="(rec, index) in recommendations"
              :key="index"
              class="recommendation"
              :class="rec.type"
          >
            <i :class="getRecommendationIcon(rec.type)"></i>
            <div class="recommendation-content">
              <p class="recommendation-text">{{ rec.message }}</p>
              <p class="recommendation-details" v-if="rec.details">{{ rec.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import foodsData from '../data/foods.json'
import combinationsData from '../data/combinations.json'
import { calculatePlateNutrition, calculatePlateBalance, evaluateHarvardPlate } from '../utils/calculations'
import { checkPlateCompatibility, generateCompatibilityRecommendations } from '../utils/compatibility'
import { savePlate } from '../utils/storage'

export default {
  name: 'PlateComponent',

  setup() {
    // Состояние
    const plateItems = ref([])
    const selectedCategory = ref('all')
    const selectedFood = ref(null)
    const foodAmount = ref(100)

    // Категории для фильтрации
    const categories = ref([
      { id: 'all', name: 'Все', icon: '🍽️' },
      { id: 'vegetable', name: 'Овощи и фрукты', icon: '🥗' },
      { id: 'protein', name: 'Белки', icon: '🥩' },
      { id: 'carb', name: 'Углеводы', icon: '🍞' }
    ])

    // Вычисляемые свойства
    const filteredFoods = computed(() => {
      if (selectedCategory.value === 'all') {
        return foodsData.foods
      }
      return foodsData.foods.filter(food => food.category === selectedCategory.value)
    })

    const nutrition = computed(() => {
      return calculatePlateNutrition(plateItems.value, foodsData)
    })

    const balance = computed(() => {
      return calculatePlateBalance(plateItems.value, foodsData)
    })

    const vegetablePercentage = computed(() => balance.value.vegetable || 0)
    const proteinPercentage = computed(() => balance.value.protein || 0)
    const carbPercentage = computed(() => balance.value.carb || 0)

    const vegetableItems = computed(() =>
        plateItems.value.filter(item => getFoodCategory(item.foodId) === 'vegetable')
    )

    const proteinItems = computed(() =>
        plateItems.value.filter(item => getFoodCategory(item.foodId) === 'protein')
    )

    const carbItems = computed(() =>
        plateItems.value.filter(item => getFoodCategory(item.foodId) === 'carb')
    )

    const recommendations = computed(() => {
      const recs = []

      // Проверка баланса Гарвардской тарелки
      const harvardEvaluation = evaluateHarvardPlate(balance.value)

      Object.keys(harvardEvaluation).forEach(category => {
        const evalItem = harvardEvaluation[category]
        if (evalItem.status === 'warning') {
          recs.push({
            type: 'warning',
            message: `${getCategoryName(category)}: немного не хватает (${evalItem.diff}% от идеала)`,
            details: 'Добавьте немного продуктов этой категории'
          })
        } else if (evalItem.status === 'bad') {
          recs.push({
            type: 'error',
            message: `${getCategoryName(category)}: значительно отличается от идеала (${evalItem.diff}% от идеала)`,
            details: 'Рекомендуется добавить больше продуктов этой категории'
          })
        }
      })

      // Проверка сочетаемости
      if (plateItems.value.length >= 2) {
        const compatibilityRecs = generateCompatibilityRecommendations(
            plateItems.value,
            combinationsData,
            foodsData
        )

        compatibilityRecs.forEach(rec => {
          recs.push({
            type: rec.type,
            message: rec.message,
            details: rec.suggestion
          })
        })
      }

      // Общие рекомендации
      if (plateItems.value.length === 0) {
        recs.push({
          type: 'info',
          message: 'Начните добавлять продукты в тарелку',
          details: 'Выберите продукты из списка справа'
        })
      } else if (plateItems.value.length < 3) {
        recs.push({
          type: 'info',
          message: 'Добавьте больше продуктов для сбалансированного питания',
          details: 'Рекомендуется 4-5 различных продуктов'
        })
      }

      return recs
    })

    // Методы
    function getFoodCategory(foodId) {
      const food = foodsData.foods.find(f => f.id === foodId)
      return food ? food.category : 'other'
    }

    function getFoodName(foodId) {
      const food = foodsData.foods.find(f => f.id === foodId)
      return food ? food.name : 'Неизвестный продукт'
    }

    function getFoodIcon(foodId) {
      const food = foodsData.foods.find(f => f.id === foodId)
      return food ? food.icon : '❓'
    }

    function getCategoryName(categoryId) {
      return foodsData.categories[categoryId] || categoryId
    }

    function selectCategory(categoryId) {
      selectedCategory.value = categoryId
    }

    function showFoodDetails(food) {
      selectedFood.value = food
      foodAmount.value = 100
    }

    function addToPlate(food) {
      showFoodDetails(food)
    }

    function confirmAdd() {
      if (selectedFood.value && foodAmount.value > 0) {
        plateItems.value.push({
          id: Date.now(),
          foodId: selectedFood.value.id,
          amount: foodAmount.value
        })
        selectedFood.value = null
      }
    }

    function removeFromPlate(item) {
      const index = plateItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        plateItems.value.splice(index, 1)
      }
    }

    function clearPlate() {
      plateItems.value = []
    }

    function savePlateToStorage() {
      if (plateItems.value.length === 0) return

      const plate = {
        name: `Тарелка от ${new Date().toLocaleDateString()}`,
        items: [...plateItems.value],
        nutrition: { ...nutrition.value },
        balance: { ...balance.value },
        createdAt: new Date().toISOString()
      }

      savePlate(plate)
      alert('Тарелка сохранена!')
    }

    function sharePlate() {
      if (plateItems.value.length === 0) return

      const shareText = `Моя гарвардская тарелка: ${nutrition.value.calories} ккал\n` +
          plateItems.value.map(item =>
              `- ${getFoodName(item.foodId)}: ${item.amount}г`
          ).join('\n')

      if (navigator.share) {
        navigator.share({
          title: 'Моя гарвардская тарелка',
          text: shareText
        })
      } else {
        navigator.clipboard.writeText(shareText)
        alert('Тарелка скопирована в буфер обмена!')
      }
    }

    function increaseAmount() {
      if (foodAmount.value < 1000) {
        foodAmount.value += 10
      }
    }

    function decreaseAmount() {
      if (foodAmount.value > 10) {
        foodAmount.value -= 10
      }
    }

    function getBalanceClass(category) {
      const evalItem = evaluateHarvardPlate(balance.value)[category]
      return evalItem ? evalItem.status : 'unknown'
    }

    function getRecommendationIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || 'fas fa-info-circle'
    }

    // Инициализация
    onMounted(() => {
      // Загружаем пример тарелки при первом запуске
      if (plateItems.value.length === 0) {
        const examplePlate = [
          { id: 1, foodId: 'tomato', amount: 100 },
          { id: 2, foodId: 'cucumber', amount: 80 },
          { id: 3, foodId: 'chicken', amount: 120 },
          { id: 4, foodId: 'rice', amount: 100 }
        ]
        plateItems.value = examplePlate
      }
    })

    return {
      // Состояние
      plateItems,
      selectedCategory,
      selectedFood,
      foodAmount,
      categories,

      // Вычисляемые свойства
      filteredFoods,
      nutrition,
      balance,
      vegetablePercentage,
      proteinPercentage,
      carbPercentage,
      vegetableItems,
      proteinItems,
      carbItems,
      recommendations,

      // Методы
      getFoodCategory,
      getFoodName,
      getFoodIcon,
      getCategoryName,
      selectCategory,
      showFoodDetails,
      addToPlate,
      confirmAdd,
      removeFromPlate,
      clearPlate,
      savePlate: savePlateToStorage,
      sharePlate,
      increaseAmount,
      decreaseAmount,
      getBalanceClass,
      getRecommendationIcon
    }
  }
}
</script>

<style scoped>
.plate-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.plate-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .plate-layout {
    grid-template-columns: 1fr;
  }
}

/* Визуализация тарелки */
.plate-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto var(--spacing-lg);
}

.plate-circle {
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 50%;
  background: #f8f9fa;
  border: 3px solid var(--border-color);
  overflow: hidden;
}

.plate-section {
  position: absolute;
  overflow: hidden;
}

.plate-section.vegetables {
  top: 0;
  left: 0;
  width: 100%;
  height: var(--percentage);
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.2) 100%);
  border-radius: 50% 50% 0 0;
}

.plate-section.proteins {
  bottom: 0;
  left: 0;
  width: 50%;
  height: calc(100% - var(--percentage));
  background: linear-gradient(135deg, rgba(237, 137, 54, 0.1) 0%, rgba(237, 137, 54, 0.2) 100%);
  border-radius: 0 0 0 50%;
}

.plate-section.carbs {
  bottom: 0;
  right: 0;
  width: 50%;
  height: calc(100% - var(--percentage));
  background: linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0.2) 100%);
  border-radius: 0 0 50% 0;
}

.plate-section h4 {
  margin: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.plate-items {
  padding: var(--spacing-sm);
}

.plate-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  margin-bottom: var(--spacing-xs);
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.food-icon {
  font-size: 1.2rem;
}

.food-name {
  flex: 1;
}

.food-amount {
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.remove-btn {
  background: none;
  border: none;
  color: var(--danger-color);
  cursor: pointer;
  padding: 2px 5px;
  border-radius: var(--radius-sm);
}

.remove-btn:hover {
  background: var(--danger-color);
  color: white;
}

.empty-section {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--text-light);
}

.empty-section i {
  font-size: 2rem;
  margin-bottom: var(--spacing-sm);
}

/* Навигация по категориям */
.category-filter {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border: 2px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-width: 80px;
}

.category-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.category-btn:hover:not(.active) {
  border-color: var(--primary-color);
}

.category-icon {
  font-size: 1.5rem;
}

.category-name {
  font-size: 0.8rem;
  white-space: nowrap;
}

/* Список продуктов */
.food-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  max-height: 600px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.food-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-left: 4px solid;
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.food-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.food-card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.food-card-header h4 {
  margin: 0;
  flex: 1;
}

.food-category {
  font-size: 0.8rem;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.food-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
}

.food-nutrition {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-sm);
}

.nutrition-badge {
  font-size: 0.8rem;
  padding: 2px 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
}

.food-card-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
}

/* Быстрое добавление */
.quick-add {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.amount-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-md) 0;
}

.amount-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-color);
  background: white;
  border-radius: var(--radius-md);
  font-size: 1.2rem;
  cursor: pointer;
}

.amount-input {
  width: 80px;
  text-align: center;
  padding: var(--spacing-sm);
}

.amount-unit {
  color: var(--text-secondary);
}

/* Анализ тарелки */
.plate-analysis {
  margin-top: var(--spacing-xl);
}

.analysis-section {
  margin-bottom: var(--spacing-lg);
}

.balance-indicators {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.balance-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
}

.balance-item.good {
  border-left: 4px solid var(--success-color);
}

.balance-item.warning {
  border-left: 4px solid var(--warning-color);
}

.balance-item.bad {
  border-left: 4px solid var(--danger-color);
}

.balance-label {
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.balance-bar {
  height: 10px;
  background: var(--border-color);
  border-radius: 5px;
  margin: var(--spacing-sm) 0;
  overflow: hidden;
}

.balance-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.balance-value {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Рекомендации */
.recommendations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.recommendation {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.recommendation.success {
  background: rgba(72, 187, 120, 0.1);
  border-left-color: var(--success-color);
}

.recommendation.warning {
  background: rgba(237, 137, 54, 0.1);
  border-left-color: var(--warning-color);
}

.recommendation.error {
  background: rgba(245, 101, 101, 0.1);
  border-left-color: var(--danger-color);
}

.recommendation.info {
  background: rgba(66, 153, 225, 0.1);
  border-left-color: var(--info-color);
}

.recommendation i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.recommendation.success i {
  color: var(--success-color);
}

.recommendation.warning i {
  color: var(--warning-color);
}

.recommendation.error i {
  color: var(--danger-color);
}

.recommendation.info i {
  color: var(--info-color);
}

.recommendation-content {
  flex: 1;
}

.recommendation-text {
  margin: 0 0 var(--spacing-xs) 0;
  font-weight: 500;
}

.recommendation-details {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Кнопки действий */
.plate-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
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