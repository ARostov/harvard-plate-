<!-- components/Plate/FoodSelection.vue -->
<template>
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
      <FoodCard
          v-for="food in filteredFoods"
          :key="food.id"
          :food="food"
          @add-to-plate="handleAddToPlate"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FoodCard from '../UI/FoodCard.vue'

const props = defineProps({
  foods: Array,
  selectedCategory: String
})

const emit = defineEmits(['add-to-plate', 'category-change'])

const categories = [
  { id: 'all', name: 'Все', icon: '🍽️' },
  { id: 'vegetable', name: 'Овощи и фрукты', icon: '🥗' },
  { id: 'protein', name: 'Белки', icon: '🥩' },
  { id: 'carb', name: 'Углеводы', icon: '🍞' }
]

const filteredFoods = computed(() => {
  if (!props.foods) return []
  if (props.selectedCategory === 'all') return props.foods
  return props.foods.filter(food => food.category === props.selectedCategory)
})

const selectCategory = (categoryId) => {
  emit('category-change', categoryId)
}

// Обработчик добавления в тарелку
const handleAddToPlate = ({ food, amount }) => {
  emit('add-to-plate', { food, amount })
}
</script>

<style scoped>
/* Стили остаются без изменений */
.food-selection {
  padding: var(--spacing-md);
}

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
  flex-shrink: 0;
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

.food-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  max-height: 600px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

/* Стили прокрутки */
.food-list::-webkit-scrollbar {
  width: 8px;
}

.food-list::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 4px;
}

.food-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

.food-list::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}
</style>