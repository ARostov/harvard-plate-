<!-- components/Plate/MealPlans.vue -->
<template>
  <div class="meal-plans">
    <div class="meal-plans-header">
      <h3><i class="fas fa-star"></i> Готовые тарелки</h3>
      <p class="subtitle">Проверенные комбинации по принципам Гарвардского питания</p>
    </div>

    <!-- Фильтры по типу -->
    <div class="plan-filters">
      <button
          v-for="filter in filters"
          :key="filter.id"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
          @click="activeFilter = filter.id"
      >
        <i :class="filter.icon"></i>
        <span>{{ filter.name }}</span>
      </button>
    </div>

    <!-- Список готовых тарелок -->
    <div class="plans-grid">
      <MealPlanCard
          v-for="plan in filteredPlans"
          :key="plan.id"
          :plan="plan"
          @apply-plan="applyPlan"
          @view-details="viewDetails"
      />
    </div>

    <!-- Сообщение если нет тарелок -->
    <div v-if="filteredPlans.length === 0" class="no-plans">
      <i class="fas fa-utensils fa-2x"></i>
      <p>Нет готовых тарелок по выбранному фильтру</p>
      <button class="btn btn-outline" @click="activeFilter = 'all'">
        Показать все
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import MealPlanCard from './MealPlanCard.vue'
import mealPlansData from '../../data/meal_plans.json'

const emit = defineEmits(['apply-plan', 'view-details'])

const activeFilter = ref('all')

const filters = [
  { id: 'all', name: 'Все', icon: 'fas fa-layer-group' },
  { id: 'healthy', name: 'Здоровые', icon: 'fas fa-heart' },
  { id: 'vegetarian', name: 'Вегетарианские', icon: 'fas fa-leaf' },
  { id: 'high_protein', name: 'Высокобелковые', icon: 'fas fa-dumbbell' },
  { id: 'quick', name: 'Быстрые', icon: 'fas fa-bolt' }
]

// Фильтрация тарелок
const filteredPlans = computed(() => {
  const plans = mealPlansData.meal_plans || []

  if (activeFilter.value === 'all') return plans

  return plans.filter(plan => {
    const tags = plan.tags || []

    switch (activeFilter.value) {
      case 'healthy':
        return tags.includes('здоровое сердце') || tags.includes('омега-3')
      case 'vegetarian':
        return plan.name.toLowerCase().includes('вегетариан') || tags.includes('растительный')
      case 'high_protein':
        return tags.includes('высокобелковый') || plan.name.toLowerCase().includes('спорт')
      case 'quick':
        return tags.includes('быстрый') || plan.calories < 400
      default:
        return true
    }
  })
})

const applyPlan = (plan) => {
  emit('apply-plan', plan)
}

const viewDetails = (plan) => {
  emit('view-details', plan)
}
</script>

<style scoped>
.meal-plans {
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.meal-plans-header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.meal-plans-header h3 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
  max-width: 500px;
  margin: 0 auto;
}

.plan-filters {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  overflow-x: auto;
  padding-bottom: var(--spacing-sm);
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  white-space: nowrap;
  transition: all var(--transition-fast);
  color: var(--text-secondary);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.filter-btn:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.no-plans {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

.no-plans i {
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.no-plans p {
  margin-bottom: var(--spacing-md);
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-filters {
    flex-wrap: wrap;
  }
}
</style>