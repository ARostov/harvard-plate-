<!-- components/Plate/PlateItemsList.vue -->
<template>
  <div class="plate-items-list">
    <h4>Состав тарелки:</h4>

    <!-- Овощи -->
    <div v-if="vegetableItems.length > 0" class="category-section">
      <div class="category-header vegetable">
        <i class="fas fa-leaf"></i>
        <h5>Овощи и фрукты ({{ vegetablePercentage }}%)</h5>
      </div>
      <div class="items-grid">
        <div
            v-for="item in vegetableItems"
            :key="item.id"
            class="list-item vegetable"
        >
          <span class="item-icon">{{ getFoodIcon(item.foodId) }}</span>
          <div class="item-info">
            <span class="item-name">{{ getFoodName(item.foodId) }}</span>
            <span class="item-amount">{{ item.amount }}г</span>
          </div>
          <button class="remove-btn" @click="removeItem(item)" title="Удалить">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Белки -->
    <div v-if="proteinItems.length > 0" class="category-section">
      <div class="category-header protein">
        <i class="fas fa-drumstick-bite"></i>
        <h5>Белки ({{ proteinPercentage }}%)</h5>
      </div>
      <div class="items-grid">
        <div
            v-for="item in proteinItems"
            :key="item.id"
            class="list-item protein"
        >
          <span class="item-icon">{{ getFoodIcon(item.foodId) }}</span>
          <div class="item-info">
            <span class="item-name">{{ getFoodName(item.foodId) }}</span>
            <span class="item-amount">{{ item.amount }}г</span>
          </div>
          <button class="remove-btn" @click="removeItem(item)" title="Удалить">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Углеводы -->
    <div v-if="carbItems.length > 0" class="category-section">
      <div class="category-header carb">
        <i class="fas fa-bread-slice"></i>
        <h5>Углеводы ({{ carbPercentage }}%)</h5>
      </div>
      <div class="items-grid">
        <div
            v-for="item in carbItems"
            :key="item.id"
            class="list-item carb"
        >
          <span class="item-icon">{{ getFoodIcon(item.foodId) }}</span>
          <div class="item-info">
            <span class="item-name">{{ getFoodName(item.foodId) }}</span>
            <span class="item-amount">{{ item.amount }}г</span>
          </div>
          <button class="remove-btn" @click="removeItem(item)" title="Удалить">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Пустая тарелка -->
    <div v-if="!hasItems" class="empty-plate-message">
      <i class="fas fa-utensils fa-2x"></i>
      <p>Тарелка пуста. Добавьте продукты из списка справа!</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  vegetableItems: Array,
  proteinItems: Array,
  carbItems: Array,
  vegetablePercentage: Number,
  proteinPercentage: Number,
  carbPercentage: Number,
  getFoodName: Function,
  getFoodIcon: Function
})

const emit = defineEmits(['remove-item'])

const hasItems = computed(() =>
    props.vegetableItems.length > 0 ||
    props.proteinItems.length > 0 ||
    props.carbItems.length > 0
)

const removeItem = (item) => {
  emit('remove-item', item)
}
</script>

<style scoped>
.plate-items-list {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.category-section {
  margin-bottom: var(--spacing-lg);
}

.category-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid;
}

.category-header.vegetable {
  border-color: #48bb78;
  color: #48bb78;
}

.category-header.protein {
  border-color: #ed8936;
  color: #ed8936;
}

.category-header.carb {
  border-color: #4299e1;
  color: #4299e1;
}

.category-header h5 {
  margin: 0;
  font-size: 1.1rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-sm);
}

.list-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border-left: 4px solid;
  transition: all 0.2s;
}

.list-item.vegetable {
  border-left-color: #48bb78;
  background: rgba(72, 187, 120, 0.05);
}

.list-item.protein {
  border-left-color: #ed8936;
  background: rgba(237, 137, 54, 0.05);
}

.list-item.carb {
  border-left-color: #4299e1;
  background: rgba(66, 153, 225, 0.05);
}

.list-item:hover {
  transform: translateX(5px);
  box-shadow: var(--shadow-sm);
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
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-weight: 500;
  margin-bottom: 2px;
}

.item-amount {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.remove-btn {
  color: var(--danger-color);
  padding: 5px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: none;
  background: none;
}

.remove-btn:hover {
  background: var(--danger-color);
  color: white;
}

.empty-plate-message {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.empty-plate-message i {
  margin-bottom: var(--spacing-md);
  color: var(--text-light);
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }
}
</style>