<!-- components/Plate/PlateItemsList.vue -->
<template>
  <div class="plate-items-list">
    <h4>Состав тарелки:</h4>

    <!-- Овощи -->
    <div v-if="vegetableItems.length > 0" class="category-section">
      <div class="category-header vegetable">
        <i class="fas fa-leaf"></i>
        <h5>Овощи и фрукты ({{ vegetablePercentage }}%)</h5>
        <span class="category-weight">{{ vegetableWeight }}г</span>
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
            <div class="amount-controls">
              <button class="amount-btn" @click="decreaseAmount(item)" title="Уменьшить">
                <i class="fas fa-minus"></i>
              </button>
              <input
                  type="number"
                  :value="item.amount"
                  @input="updateAmount(item, $event.target.value)"
                  min="10"
                  max="1000"
                  step="10"
                  class="amount-input"
              />
              <button class="amount-btn" @click="increaseAmount(item)" title="Увеличить">
                <i class="fas fa-plus"></i>
              </button>
              <span class="amount-unit">г</span>
            </div>
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
        <span class="category-weight">{{ proteinWeight }}г</span>
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
            <div class="amount-controls">
              <button class="amount-btn" @click="decreaseAmount(item)" title="Уменьшить">
                <i class="fas fa-minus"></i>
              </button>
              <input
                  type="number"
                  :value="item.amount"
                  @input="updateAmount(item, $event.target.value)"
                  min="10"
                  max="1000"
                  step="10"
                  class="amount-input"
              />
              <button class="amount-btn" @click="increaseAmount(item)" title="Увеличить">
                <i class="fas fa-plus"></i>
              </button>
              <span class="amount-unit">г</span>
            </div>
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
        <span class="category-weight">{{ carbWeight }}г</span>
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
            <div class="amount-controls">
              <button class="amount-btn" @click="decreaseAmount(item)" title="Уменьшить">
                <i class="fas fa-minus"></i>
              </button>
              <input
                  type="number"
                  :value="item.amount"
                  @input="updateAmount(item, $event.target.value)"
                  min="10"
                  max="1000"
                  step="10"
                  class="amount-input"
              />
              <button class="amount-btn" @click="increaseAmount(item)" title="Увеличить">
                <i class="fas fa-plus"></i>
              </button>
              <span class="amount-unit">г</span>
            </div>
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

const emit = defineEmits(['remove-item', 'update-amount'])

// Вес по категориям
const vegetableWeight = computed(() =>
    props.vegetableItems.reduce((sum, item) => sum + item.amount, 0)
)

const proteinWeight = computed(() =>
    props.proteinItems.reduce((sum, item) => sum + item.amount, 0)
)

const carbWeight = computed(() =>
    props.carbItems.reduce((sum, item) => sum + item.amount, 0)
)

const hasItems = computed(() =>
    props.vegetableItems.length > 0 ||
    props.proteinItems.length > 0 ||
    props.carbItems.length > 0
)

const removeItem = (item) => {
  emit('remove-item', item)
}

const increaseAmount = (item) => {
  const newAmount = Math.min(item.amount + 10, 1000)
  emit('update-amount', { item, amount: newAmount })
}

const decreaseAmount = (item) => {
  const newAmount = Math.max(item.amount - 10, 10)
  emit('update-amount', { item, amount: newAmount })
}

const updateAmount = (item, value) => {
  const newAmount = parseInt(value) || 10
  const clampedAmount = Math.min(Math.max(newAmount, 10), 1000)
  emit('update-amount', { item, amount: clampedAmount })
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
  flex: 1;
}

.category-weight {
  font-size: 0.9rem;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  flex-shrink: 0;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0; /* Для корректной работы с текстом */
}

.item-name {
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.amount-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--border-color);
  background: white;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.amount-btn:hover {
  background: var(--bg-tertiary);
}

.amount-input {
  width: 60px;
  text-align: center;
  padding: 2px 4px;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.amount-unit {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-left: 2px;
}

.remove-btn {
  color: var(--danger-color);
  padding: 5px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  border: none;
  background: none;
  flex-shrink: 0;
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

  .amount-input {
    width: 50px;
  }

  .item-name {
    font-size: 0.9rem;
  }
}
</style>