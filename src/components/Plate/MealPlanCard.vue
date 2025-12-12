<!-- components/Plate/MealPlanCard.vue -->
<template>
  <div class="meal-plan-card">
    <div class="plan-header">
      <div class="plan-icon">
        <i class="fas fa-utensils"></i>
      </div>
      <div class="plan-info">
        <h4 class="plan-name">{{ plan.name }}</h4>
        <div class="plan-calories">
          <i class="fas fa-fire"></i>
          {{ plan.calories }} ккал
        </div>
      </div>
    </div>

    <p class="plan-description">{{ plan.description }}</p>

    <!-- Теги -->
    <div class="plan-tags">
      <span
          v-for="tag in plan.tags || []"
          :key="tag"
          class="plan-tag"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Состав (превью) -->
    <div class="plan-composition">
      <div class="composition-title">Состав:</div>
      <div class="composition-items">
        <span
            v-for="(item, index) in previewItems"
            :key="index"
            class="composition-item"
        >
          {{ getFoodName(item.foodId) }} {{ item.amount }}г
        </span>
        <span v-if="hasMoreItems" class="composition-more">
          +{{ plan.items.length - 3 }} ещё
        </span>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="plan-actions">
      <button class="btn btn-outline btn-sm" @click="$emit('view-details', plan)">
        <i class="fas fa-info-circle"></i> Подробнее
      </button>
      <button class="btn btn-primary btn-sm" @click="$emit('apply-plan', plan)">
        <i class="fas fa-plus"></i> Применить
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import foodsData from '../../data/foods.json'

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }
})

defineEmits(['apply-plan', 'view-details'])

// Превью первых 3 продуктов
const previewItems = computed(() => {
  return props.plan.items.slice(0, 3)
})

// Есть ли еще продукты
const hasMoreItems = computed(() => {
  return props.plan.items.length > 3
})

// Получение названия продукта
const getFoodName = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.name : foodId
}
</script>

<style scoped>
.meal-plan-card {
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.meal-plan-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.plan-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.plan-icon {
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.plan-info {
  flex: 1;
  min-width: 0;
}

.plan-name {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.plan-calories {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.plan-description {
  margin: 0 0 var(--spacing-md) 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
  flex: 1;
}

.plan-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-md);
}

.plan-tag {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: rgba(66, 153, 225, 0.1);
  color: var(--primary-color);
  border-radius: 12px;
  white-space: nowrap;
}

.plan-composition {
  margin-bottom: var(--spacing-md);
  padding: var(--spacing-sm);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
}

.composition-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.composition-items {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.composition-item {
  font-size: 0.8rem;
  color: var(--text-primary);
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  white-space: nowrap;
}

.composition-more {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

.plan-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: auto;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  flex: 1;
}

@media (max-width: 480px) {
  .plan-actions {
    flex-direction: column;
  }
}
</style>