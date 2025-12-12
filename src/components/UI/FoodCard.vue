<template>
  <div class="food-card" :style="{ borderLeftColor: food.color }" @click="emit('addToPlate')">
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
    </div>

    <div class="food-card-actions">
      <button class="btn btn-primary btn-sm" @click.stop="emit('addToPlate')">
        <i class="fas fa-plus"></i> Добавить
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  food: Object
})

const emit = defineEmits(['addToPlate'])

const getCategoryName = (category) => {
  const names = {
    vegetable: 'Овощи и фрукты',
    protein: 'Белки',
    carb: 'Углеводы'
  }
  return names[category] || category
}
</script>