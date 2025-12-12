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
        @add-multiple="handleAddMultiple"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PlateVisualization from './PlateVisualization.vue'
import FoodSelection from './FoodSelection.vue'
import foodsData from '../../data/foods.json'
import { calculatePlateNutrition, calculatePlateBalance } from '../../utils/calculations'

const emit = defineEmits(['update-nutrition', 'update-totals'])

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

// Питательность
const nutrition = computed(() =>
    calculatePlateNutrition(plateItems.value, foodsData)
)

// Баланс
const balance = computed(() =>
    calculatePlateBalance(plateItems.value, foodsData)
)

const vegetablePercentage = computed(() => balance.value.vegetable || 0)
const proteinPercentage = computed(() => balance.value.protein || 0)
const carbPercentage = computed(() => balance.value.carb || 0)

// Общие данные
const totalWeight = computed(() => {
  const allItems = [...vegetableItems.value, ...proteinItems.value, ...carbItems.value]
  return allItems.reduce((sum, item) => sum + item.amount, 0)
})

const totalItems = computed(() => plateItems.value.length)

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

// Обработчик добавления нескольких продуктов
const handleAddMultiple = (foods) => {
  foods.forEach(({ food, amount }) => {
    plateItems.value.push({
      id: Date.now() + Math.random(),
      foodId: food.id,
      amount: amount
    })
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

// Метод для применения готовой тарелки
const applyMealPlan = (plan) => {
  // Очищаем текущую тарелку
  plateItems.value = []

  // Добавляем продукты из плана
  plan.items.forEach(item => {
    plateItems.value.push({
      id: Date.now() + Math.random(),
      foodId: item.foodId,
      amount: item.amount
    })
  })

  console.log(`✅ Применена тарелка "${plan.name}"`)
}

defineExpose({
  applyMealPlan
})
// Отслеживаем изменения и отправляем данные в родительский компонент
watch([nutrition, totalWeight, totalItems, vegetablePercentage, proteinPercentage, carbPercentage], () => {
  // Отправляем данные о питательности
  emit('update-nutrition', {
    calories: nutrition.value.calories || 0,
    protein: nutrition.value.protein || 0,
    carbs: nutrition.value.carbs || 0,
    fats: nutrition.value.fats || 0,
    fiber: nutrition.value.fiber || 0,
    sugar: nutrition.value.sugar || 0
  })

  // Отправляем общие данные
  emit('update-totals', {
    weight: totalWeight.value,
    items: totalItems.value,
    percentages: {
      vegetable: vegetablePercentage.value,
      protein: proteinPercentage.value,
      carb: carbPercentage.value
    }
  })
}, { immediate: true, deep: true })
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