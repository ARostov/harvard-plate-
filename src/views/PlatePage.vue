<!-- views/PlatePage.vue -->
<template>
  <div class="plate-page">
    <div class="page-header">
      <h2><i class="fas fa-utensils"></i> Конструктор тарелки</h2>
      <p class="subtitle">Соберите идеальную тарелку по принципам Гарвардского питания</p>
    </div>

    <div class="layout-container">
      <!-- Левая колонка: Основной контент -->
      <div class="left-column">
        <!-- Переключатель режимов с четкой индикацией -->
        <div class="mode-switcher">
          <button
              class="mode-btn"
              :class="{ active: mode === 'constructor' }"
              @click="mode = 'constructor'"
          >
            <i class="fas fa-plus"></i> Конструктор
            <span class="mode-indicator" v-if="mode === 'constructor'">← активен</span>
          </button>
          <button
              class="mode-btn"
              :class="{ active: mode === 'templates' }"
              @click="mode = 'templates'"
          >
            <i class="fas fa-star"></i> Готовые тарелки
            <span class="mode-indicator" v-if="mode === 'templates'">← активен</span>
          </button>
        </div>

        <!-- Конструктор (показывается когда выбран конструктор) -->
        <div v-if="mode === 'constructor'" class="mode-content constructor">
          <div class="mode-header">
            <h3><i class="fas fa-plus"></i> Создайте свою тарелку</h3>
            <p class="mode-subtitle">Добавляйте продукты из списка справа</p>
          </div>
          <Plate
              ref="plateComponent"
              @update-nutrition="handleNutritionUpdate"
              @update-totals="handleTotalsUpdate"
          />
        </div>

        <!-- Готовые тарелки (показывается когда выбран этот режим) -->
        <div v-else class="mode-content templates">
          <div class="mode-header">
            <h3><i class="fas fa-star"></i> Готовые решения</h3>
            <p class="mode-subtitle">Выберите проверенную комбинацию</p>
          </div>
          <MealPlans
              @apply-plan="applyMealPlan"
              @view-details="openPlanDetails"
          />
        </div>
      </div>

      <!-- Правая колонка: Аналитика (ВСЕГДА видна) -->
      <div class="right-column">
        <!-- Статистика тарелки -->
        <div class="analytics-section">
          <h3><i class="fas fa-chart-bar"></i> Анализ тарелки</h3>

          <!-- Индикатор загрузки данных -->
          <div v-if="!hasData" class="no-data-message">
            <i class="fas fa-utensils fa-2x"></i>
            <p>Добавьте продукты в тарелку чтобы увидеть анализ</p>
            <button class="btn btn-primary btn-sm" @click="mode = 'constructor'">
              <i class="fas fa-plus"></i> Перейти в конструктор
            </button>
          </div>

          <!-- Если есть данные - показываем аналитику -->
          <div v-else class="analytics-content">
            <!-- Быстрая сводка -->
            <div class="quick-stats">
              <div class="quick-stat">
                <i class="fas fa-fire"></i>
                <div>
                  <div class="stat-value">{{ nutrition.calories }}</div>
                  <div class="stat-label">ккал</div>
                </div>
              </div>
              <div class="quick-stat">
                <i class="fas fa-weight"></i>
                <div>
                  <div class="stat-value">{{ totalWeight }}</div>
                  <div class="stat-label">грамм</div>
                </div>
              </div>
              <div class="quick-stat">
                <i class="fas fa-layer-group"></i>
                <div>
                  <div class="stat-value">{{ totalItems }}</div>
                  <div class="stat-label">продуктов</div>
                </div>
              </div>
            </div>

            <!-- Табы для детальной аналитики -->
            <Tabs :tabs="analyticsTabs" default-tab="stats">
              <template #stats>
                <PlateStats
                    :nutrition="nutrition"
                    :total-weight="totalWeight"
                    :total-items="totalItems"
                />
              </template>

              <template #analysis>
                <PlateAnalysis
                    :vegetable-percentage="vegetablePercentage"
                    :protein-percentage="proteinPercentage"
                    :carb-percentage="carbPercentage"
                />
              </template>

              <template #recommendations>
                <div class="recommendations-panel">
                  <h4><i class="fas fa-lightbulb"></i> Рекомендации</h4>
                  <!-- Упрощенная версия рекомендаций -->
                  <div class="simple-recommendations">
                    <div v-if="vegetablePercentage < 40" class="recommendation-item warning">
                      <i class="fas fa-leaf"></i>
                      <div>
                        <p>Добавьте больше овощей</p>
                        <small>Сейчас {{ vegetablePercentage }}%, нужно 50%</small>
                      </div>
                    </div>
                    <div v-if="isPlateBalanced" class="recommendation-item success">
                      <i class="fas fa-check-circle"></i>
                      <div>
                        <p>Отличный баланс!</p>
                        <small>Тарелка соответствует Гарвардской модели</small>
                      </div>
                    </div>
                    <!-- Добавь больше рекомендаций по необходимости -->
                  </div>
                </div>
              </template>
            </Tabs>

            <!-- Быстрые действия -->
            <div class="quick-actions">
              <button class="btn btn-outline btn-sm" @click="savePlate">
                <i class="fas fa-save"></i> Сохранить
              </button>
              <button class="btn btn-outline btn-sm" @click="clearPlate">
                <i class="fas fa-trash"></i> Очистить
              </button>
              <button class="btn btn-outline btn-sm" @click="sharePlate">
                <i class="fas fa-share"></i> Поделиться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка с деталями тарелки -->
    <MealPlanModal
        v-if="selectedPlan"
        :plan="selectedPlan"
        :is-open="showPlanModal"
        @close="closePlanModal"
        @apply="applyMealPlan"
    />

    <!-- Отладочная информация (временно) -->
    <div class="debug-info" v-if="false">
      <h4>Отладка:</h4>
      <p>Режим: {{ mode }}</p>
      <p>hasData: {{ hasData }}</p>
      <p>Продуктов: {{ totalItems }}</p>
      <p>Калории: {{ nutrition.calories }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import Plate from '../components/Plate/Plate.vue'
import MealPlans from '../components/Plate/MealPlans.vue'
import PlateStats from '../components/Plate/PlateStats.vue'
import PlateAnalysis from '../components/Plate/PlateAnalysis.vue'
import MealPlanModal from '../components/UI/MealPlanModal.vue'
import Tabs from '../components/UI/Tabs.vue'

const plateComponent = ref(null)

// Режим работы
const mode = ref('constructor')

// Данные о питательности
const nutrition = reactive({
  calories: 0,
  protein: 0,
  carbs: 0,
  fats: 0,
  fiber: 0,
  sugar: 0
})

// Общие данные
const totalWeight = ref(0)
const totalItems = ref(0)

// Проценты для анализа
const vegetablePercentage = ref(0)
const proteinPercentage = ref(0)
const carbPercentage = ref(0)

// Модалка с деталями тарелки
const selectedPlan = ref(null)
const showPlanModal = ref(false)

// Проверка есть ли данные
const hasData = computed(() => {
  return totalItems.value > 0 && nutrition.calories > 0
})

// Проверка баланса тарелки
const isPlateBalanced = computed(() => {
  return vegetablePercentage.value >= 40 &&
      vegetablePercentage.value <= 60 &&
      proteinPercentage.value >= 20 &&
      proteinPercentage.value <= 30 &&
      carbPercentage.value >= 20 &&
      carbPercentage.value <= 30
})

// Табы для аналитики
const analyticsTabs = computed(() => [
  {
    id: 'stats',
    title: 'Статистика',
    icon: 'fas fa-chart-bar',
    badge: hasData.value ? totalItems.value : null
  },
  {
    id: 'analysis',
    title: 'Анализ',
    icon: 'fas fa-chart-line'
  },
  {
    id: 'recommendations',
    title: 'Советы',
    icon: 'fas fa-lightbulb'
  }
])

// Обработчики обновления данных из Plate компонента
const handleNutritionUpdate = (newNutrition) => {
  console.log('📥 Получены данные о питательности:', newNutrition)
  Object.assign(nutrition, newNutrition)
}

const handleTotalsUpdate = ({ weight, items, percentages }) => {
  console.log('📥 Получены общие данные:', { weight, items, percentages })
  totalWeight.value = weight
  totalItems.value = items
  vegetablePercentage.value = percentages.vegetable
  proteinPercentage.value = percentages.protein
  carbPercentage.value = percentages.carb
}

// Применение готовой тарелки
const applyMealPlan = (plan) => {
  if (plateComponent.value?.applyMealPlan) {
    plateComponent.value.applyMealPlan(plan)
  }
  // Переключаемся в конструктор чтобы видеть изменения
  mode.value = 'constructor'
  closePlanModal()
}

// Просмотр деталей тарелки
const openPlanDetails = (plan) => {
  selectedPlan.value = plan
  showPlanModal.value = true
}

const closePlanModal = () => {
  showPlanModal.value = false
  selectedPlan.value = null
}

// Быстрые действия
const savePlate = () => {
  console.log('💾 Сохранение тарелки...')
  // Реализация сохранения
}

const clearPlate = () => {
  if (confirm('Очистить тарелку?')) {
    if (plateComponent.value?.clearPlate) {
      plateComponent.value.clearPlate()
    }
  }
}

const sharePlate = () => {
  console.log('📤 Поделиться тарелкой...')
  // Реализация шаринга
}
</script>

<style scoped>
.plate-page {
  padding: var(--spacing-lg) 0;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  padding: 0 var(--spacing-lg);
}

.page-header h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.layout-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
  padding: 0 var(--spacing-lg);
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

/* Переключатель режимов */
.mode-switcher {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.mode-btn {
  position: relative;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.mode-btn.active {
  background: var(--primary-color);
  color: white;
}

.mode-btn:hover:not(.active) {
  background: var(--bg-tertiary);
}

.mode-indicator {
  position: absolute;
  right: 10px;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* Контент режимов */
.mode-content {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mode-header {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--border-color);
}

.mode-header h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.mode-subtitle {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

/* Секция аналитики */
.analytics-section {
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.analytics-section h3 {
  margin: 0;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.no-data-message {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

.no-data-message i {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.no-data-message p {
  margin-bottom: var(--spacing-md);
}

.analytics-content {
  padding: var(--spacing-lg);
}

/* Быстрая сводка */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.quick-stat {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.quick-stat i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 2px;
}

/* Рекомендации */
.recommendations-panel {
  padding: var(--spacing-md);
}

.recommendations-panel h4 {
  margin-top: 0;
  margin-bottom: var(--spacing-md);
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.simple-recommendations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.recommendation-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.recommendation-item.warning {
  border-left-color: var(--warning-color);
  background: rgba(237, 137, 54, 0.05);
}

.recommendation-item.success {
  border-left-color: var(--success-color);
  background: rgba(72, 187, 120, 0.05);
}

.recommendation-item i {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.recommendation-item.warning i {
  color: var(--warning-color);
}

.recommendation-item.success i {
  color: var(--success-color);
}

.recommendation-item p {
  margin: 0 0 4px 0;
  font-weight: 500;
}

.recommendation-item small {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

/* Быстрые действия */
.quick-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.quick-actions .btn {
  flex: 1;
}

/* Отладочная информация */
.debug-info {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: var(--radius-md);
  font-family: monospace;
  font-size: 0.9rem;
}

.debug-info h4 {
  margin-top: 0;
  color: #6c757d;
}

/* Адаптивность */
@media (max-width: 1200px) {
  .layout-container {
    grid-template-columns: 1.5fr 1fr;
  }
}

@media (max-width: 992px) {
  .layout-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .plate-page {
    padding: var(--spacing-md) 0;
  }

  .page-header,
  .layout-container {
    padding: 0 var(--spacing-md);
  }

  .mode-switcher {
    grid-template-columns: 1fr;
  }

  .quick-stats {
    grid-template-columns: 1fr;
  }

  .quick-actions {
    flex-direction: column;
  }
}
</style>