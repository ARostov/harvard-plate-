<!-- components/UI/MealPlanModal.vue -->
<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-container">
      <!-- Заголовок -->
      <div class="modal-header">
        <h3>{{ plan.name }}</h3>
        <button class="modal-close" @click="close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Контент -->
      <div class="modal-content">
        <!-- Описание -->
        <div class="modal-section">
          <p class="plan-description">{{ plan.description }}</p>
          <div class="plan-stats">
            <div class="stat-item">
              <i class="fas fa-fire"></i>
              <span class="stat-value">{{ plan.calories }}</span>
              <span class="stat-label">ккал</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-weight"></i>
              <span class="stat-value">{{ totalWeight }}</span>
              <span class="stat-label">грамм</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-layer-group"></i>
              <span class="stat-value">{{ plan.items.length }}</span>
              <span class="stat-label">продуктов</span>
            </div>
          </div>
        </div>

        <!-- Полный состав -->
        <div class="modal-section">
          <h4><i class="fas fa-list"></i> Полный состав</h4>
          <div class="composition-list">
            <div
                v-for="(item, index) in plan.items"
                :key="index"
                class="composition-item"
            >
              <div class="item-icon">
                {{ getFoodIcon(item.foodId) }}
              </div>
              <div class="item-info">
                <div class="item-name">{{ getFoodName(item.foodId) }}</div>
                <div class="item-category">{{ getFoodCategory(item.foodId) }}</div>
              </div>
              <div class="item-amount">{{ item.amount }}г</div>
            </div>
          </div>
        </div>

        <!-- Пищевая ценность -->
        <div class="modal-section">
          <h4><i class="fas fa-chart-bar"></i> Пищевая ценность</h4>
          <div class="nutrition-grid">
            <div class="nutrition-item">
              <div class="nutrition-label">Белки</div>
              <div class="nutrition-value">{{ calculatedNutrition.protein }}г</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-label">Жиры</div>
              <div class="nutrition-value">{{ calculatedNutrition.fats }}г</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-label">Углеводы</div>
              <div class="nutrition-value">{{ calculatedNutrition.carbs }}г</div>
            </div>
            <div class="nutrition-item">
              <div class="nutrition-label">Клетчатка</div>
              <div class="nutrition-value">{{ calculatedNutrition.fiber }}г</div>
            </div>
          </div>
        </div>

        <!-- Рекомендации -->
        <div class="modal-section" v-if="plan.tips">
          <h4><i class="fas fa-lightbulb"></i> Советы по приготовлению</h4>
          <ul class="tips-list">
            <li v-for="(tip, index) in plan.tips" :key="index">
              <i class="fas fa-check"></i> {{ tip }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Футер -->
      <div class="modal-footer">
        <button class="btn btn-outline" @click="close">
          Отмена
        </button>
        <button class="btn btn-primary" @click="apply">
          <i class="fas fa-plus"></i> Применить эту тарелку
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import foodsData from '../../data/foods.json'
import { calculatePlateNutrition } from '../../utils/calculations'

const props = defineProps({
  plan: {
    type: Object,
    default: () => ({})
  },
  isOpen: Boolean
})

const emit = defineEmits(['close', 'apply'])

// Общий вес
const totalWeight = computed(() => {
  return props.plan.items?.reduce((sum, item) => sum + item.amount, 0) || 0
})

// Рассчитанная питательность
const calculatedNutrition = computed(() => {
  if (!props.plan.items) return {}
  return calculatePlateNutrition(props.plan.items, foodsData)
})

// Методы для получения информации о продуктах
const getFoodName = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.name : foodId
}

const getFoodIcon = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.icon : '❓'
}

const getFoodCategory = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  const categories = {
    vegetable: 'Овощи/фрукты',
    protein: 'Белки',
    carb: 'Углеводы',
    other: 'Другое'
  }
  return food ? categories[food.category] || food.category : 'Неизвестно'
}

const close = () => {
  emit('close')
}

const apply = () => {
  emit('apply', props.plan)
  close()
}
</script>

<style scoped>
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
  padding: var(--spacing-lg);
}

.modal-container {
  background: white;
  border-radius: var(--radius-lg);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  margin: 0;
  color: var(--primary-color);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}

.modal-close:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.modal-content {
  padding: var(--spacing-lg);
}

.modal-section {
  margin-bottom: var(--spacing-xl);
}

.modal-section:last-child {
  margin-bottom: 0;
}

.modal-section h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.plan-description {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.plan-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-item i {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.composition-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.composition-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--border-color);
}

.composition-item:nth-child(3n+1) {
  border-left-color: #48bb78;
}

.composition-item:nth-child(3n+2) {
  border-left-color: #ed8936;
}

.composition-item:nth-child(3n+3) {
  border-left-color: #4299e1;
}

.item-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-name {
  font-weight: 500;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-category {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.item-amount {
  font-weight: 600;
  color: var(--primary-color);
  flex-shrink: 0;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--primary-color);
}

.nutrition-label {
  font-weight: 500;
  color: var(--text-primary);
}

.nutrition-value {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 1.2rem;
}

.tips-list {
  margin: 0;
  padding-left: var(--spacing-lg);
  color: var(--text-secondary);
}

.tips-list li {
  margin-bottom: var(--spacing-xs);
}

.tips-list li:last-child {
  margin-bottom: 0;
}

.tips-list i {
  color: var(--success-color);
  margin-right: var(--spacing-sm);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
}

.modal-footer .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }

  .plan-stats {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .nutrition-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>