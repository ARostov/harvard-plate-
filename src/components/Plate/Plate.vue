<!-- components/Plate/Plate.vue -->
<template>
  <div class="plate">
    <!-- Визуализация тарелки -->
    <PlateVisualization
        :vegetable-items="vegetableItems"
        :protein-items="proteinItems"
        :carb-items="carbItems"
        :vegetable-percentage="vegetablePercentage"
        :protein-percentage="proteinPercentage"
        :carb-percentage="carbPercentage"
        :get-food-name="getFoodName"
        :get-food-icon="getFoodIcon"
        @remove-item="removeFromPlate"
        @update-amount="updateAmount"
    />

    <!-- Выбор продуктов -->
    <FoodSelection
        :foods="foodsData.foods"
        :selected-category="selectedCategory"
        @add-to-plate="handleAddToPlate"
        @category-change="selectCategory"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PlateVisualization from './PlateVisualization.vue'
import FoodSelection from './FoodSelection.vue'
import foodsData from '../../data/foods.json'
import { calculatePlateBalance } from '@/utils/calculations.js'

console.log('Foods data loaded:', foodsData)
console.log('Foods array:', foodsData?.foods)

// Состояние
const plateItems = ref([
  { id: 1, foodId: 'tomato', amount: 100 },
  { id: 2, foodId: 'cucumber', amount: 80 },
  { id: 3, foodId: 'chicken', amount: 120 },
  { id: 4, foodId: 'rice', amount: 100 }
])
const selectedCategory = ref('all')

// Вычисляемые свойства
const vegetableItems = computed(() =>
    plateItems.value.filter(item => getFoodCategory(item.foodId) === 'vegetable')
)

const proteinItems = computed(() =>
    plateItems.value.filter(item => getFoodCategory(item.foodId) === 'protein')
)

const carbItems = computed(() =>
    plateItems.value.filter(item => getFoodCategory(item.foodId) === 'carb')
)

const balance = computed(() => calculatePlateBalance(plateItems.value, foodsData))

const vegetablePercentage = computed(() => balance.value.vegetable || 0)
const proteinPercentage = computed(() => balance.value.protein || 0)
const carbPercentage = computed(() => balance.value.carb || 0)

// Методы
const getFoodCategory = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.category : 'other'
}

const getFoodName = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.name : 'Неизвестный продукт'
}

const getFoodIcon = (foodId) => {
  const food = foodsData.foods.find(f => f.id === foodId)
  return food ? food.icon : '❓'
}

// Обработчик добавления в тарелку
const handleAddToPlate = ({ food, amount }) => {
  // Добавляем проверку
  if (!food || !food.id) {
    console.error('Invalid food object received:', food)
    return
  }

  plateItems.value.push({
    id: Date.now(),
    foodId: food.id,
    amount: amount
  })
}

const removeFromPlate = (item) => {
  const index = plateItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    plateItems.value.splice(index, 1)
  }
}

const updateAmount = ({ item, amount }) => {
  const index = plateItems.value.findIndex(i => i.id === item.id)
  if (index !== -1) {
    plateItems.value[index].amount = amount
  }
}

const selectCategory = (category) => {
  selectedCategory.value = category
}
</script>

<style scoped>
.plate {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .plate {
    grid-template-columns: 1fr;
  }
}
</style>