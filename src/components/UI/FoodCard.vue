<!-- components/UI/FoodCard.vue -->
<template>
  <div class="food-card" :style="{ borderLeftColor: foodColor }">
    <div class="food-card-header">
      <span class="food-icon">{{ food.icon }}</span>
      <h4>{{ food.name }}</h4>
      <span class="food-category">{{ categoryName }}</span>
    </div>

    <p class="food-description">{{ food.description }}</p>

    <div class="food-nutrition">
      <span class="nutrition-badge">
        <i class="fas fa-fire"></i> {{ food.nutrition.calories }} ккал/100г
      </span>
      <span class="nutrition-badge">
        <i class="fas fa-dumbbell"></i> {{ food.nutrition.protein }}г белка
      </span>
      <span v-if="food.nutrition.fiber" class="nutrition-badge">
        <i class="fas fa-seedling"></i> {{ food.nutrition.fiber }}г клетчатки
      </span>
    </div>

    <div class="food-card-actions">
      <div class="amount-selector">
        <button class="amount-btn" @click="decreaseAmount">-</button>
        <input
            type="number"
            v-model.number="amount"
            min="10"
            max="1000"
            step="10"
            class="amount-input"
        />
        <span class="amount-unit">г</span>
        <button class="amount-btn" @click="increaseAmount">+</button>
      </div>
      <button class="btn btn-primary btn-sm" @click="addToPlate">
        <i class="fas fa-plus"></i> Добавить {{ amount }}г
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  food: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['add-to-plate'])

const amount = ref(100)

const foodColor = computed(() => {
  const colors = {
    vegetable: '#48bb78',
    protein: '#ed8936',
    carb: '#4299e1'
  }
  return colors[props.food.category] || '#718096'
})

const categoryName = computed(() => {
  const names = {
    vegetable: 'Овощи и фрукты',
    protein: 'Белки',
    carb: 'Углеводы'
  }
  return names[props.food.category] || props.food.category
})

const increaseAmount = () => {
  if (amount.value < 1000) amount.value += 10
}

const decreaseAmount = () => {
  if (amount.value > 10) amount.value -= 10
}

const addToPlate = () => {
  // Проверяем, что food существует
  if (!props.food || !props.food.id) {
    console.error('Food object is undefined or missing id')
    return
  }

  emit('add-to-plate', {
    food: props.food,
    amount: amount.value
  })
  amount.value = 100 // Сбрасываем к дефолтному значению
}
</script>

<style scoped>
/* Стили без изменений */
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
  font-size: 1.1rem;
}

.food-icon {
  font-size: 1.5rem;
}

.food-category {
  font-size: 0.8rem;
  padding: 2px 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  white-space: nowrap;
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
  white-space: nowrap;
}

.food-card-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.amount-selector {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  justify-content: center;
}

.amount-btn {
  width: 30px;
  height: 30px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.amount-btn:hover {
  background: var(--bg-tertiary);
}

.amount-input {
  width: 70px;
  text-align: center;
  padding: var(--spacing-xs);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
}

.amount-unit {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>