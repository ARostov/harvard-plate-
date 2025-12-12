<!-- components/Plate/PlateVisualization.vue -->
<template>
  <div class="plate-visualization card">
    <h3>Ваша тарелка</h3>

    <!-- Круг тарелки -->
    <div class="plate-container">
      <div class="plate-circle-wrapper">
        <!-- Конусный градиент для секторов -->
        <div
            class="plate-circle"
            :style="plateCircleStyle"
        >
          <!-- Иконки продуктов -->
          <div class="plate-icons">
            <!-- Иконки овощей -->
            <span
                v-for="(item, index) in vegetableItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getIconPosition(index, vegetableItems.length, vegetablePercentage, 0)"
            >
              {{ getFoodIcon(item.foodId) }}
            </span>

            <!-- Иконки белков -->
            <span
                v-for="(item, index) in proteinItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getIconPosition(index, proteinItems.length, proteinPercentage, vegetablePercentage)"
            >
              {{ getFoodIcon(item.foodId) }}
            </span>

            <!-- Иконки углеводов -->
            <span
                v-for="(item, index) in carbItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getIconPosition(index, carbItems.length, carbPercentage, vegetablePercentage + proteinPercentage)"
            >
              {{ getFoodIcon(item.foodId) }}
            </span>
          </div>
        </div>

        <!-- Легенда -->
        <div class="plate-legend">
          <div class="legend-item">
            <span class="legend-color vegetable"></span>
            <span>Овощи/фрукты: {{ vegetablePercentage }}%</span>
          </div>
          <div class="legend-item">
            <span class="legend-color protein"></span>
            <span>Белки: {{ proteinPercentage }}%</span>
          </div>
          <div class="legend-item">
            <span class="legend-color carb"></span>
            <span>Углеводы: {{ carbPercentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Список продуктов -->
    <PlateItemsList
        :vegetable-items="vegetableItems"
        :protein-items="proteinItems"
        :carb-items="carbItems"
        :vegetable-percentage="vegetablePercentage"
        :protein-percentage="proteinPercentage"
        :carb-percentage="carbPercentage"
        :get-food-name="getFoodName"
        :get-food-icon="getFoodIcon"
        @remove-item="$emit('remove-item', $event)"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import PlateItemsList from './PlateItemsList.vue'

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

// Стиль для круговой диаграммы
const plateCircleStyle = computed(() => {
  const vegDeg = props.vegetablePercentage * 3.6
  const protDeg = props.proteinPercentage * 3.6
  const carbDeg = props.carbPercentage * 3.6

  return {
    background: `conic-gradient(
      #48bb78 0deg ${vegDeg}deg,
      #ed8936 ${vegDeg}deg ${vegDeg + protDeg}deg,
      #4299e1 ${vegDeg + protDeg}deg 360deg
    )`
  }
})

// Заголовок для иконки
const getFoodTitle = (item) => {
  return `${props.getFoodName(item.foodId)} - ${item.amount}г`
}

// Позиционирование иконки
const getIconPosition = (index, total, sectorSize, sectorStart) => {
  if (total === 0 || sectorSize === 0) return {}

  // Средний угол в секторе
  const angleDeg = sectorStart + (sectorSize / 2)
  const angleRad = (angleDeg - 90) * (Math.PI / 180) // -90 чтобы начать с 12 часов

  // Радиус от центра (70% от радиуса круга)
  const radius = 0.35
  const centerX = 0.5
  const centerY = 0.5

  // Вычисляем координаты
  const x = centerX + radius * Math.cos(angleRad)
  const y = centerY + radius * Math.sin(angleRad)

  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: `translate(-50%, -50%)`
  }
}
</script>

<style scoped>
.plate-visualization {
  padding: var(--spacing-md);
}

.plate-container {
  margin-bottom: var(--spacing-lg);
}

.plate-circle-wrapper {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto var(--spacing-lg);
}

.plate-circle {
  width: 100%;
  padding-bottom: 100%; /* Квадрат для круга */
  border-radius: 50%;
  border: 3px solid var(--border-color);
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
}

.plate-icons {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.food-icon-plate {
  position: absolute;
  font-size: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid white;
  pointer-events: auto;
  cursor: help;
  transition: all 0.3s ease;
  z-index: 10;
}

.food-icon-plate:hover {
  transform: scale(1.3) translate(-50%, -50%);
  z-index: 20;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.plate-legend {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-lg);
  flex-wrap: wrap;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  font-weight: 500;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.vegetable {
  background: #48bb78;
}
.legend-color.protein {
  background: #ed8936;
}
.legend-color.carb {
  background: #4299e1;
}

/* Адаптивность */
@media (max-width: 768px) {
  .plate-circle-wrapper {
    max-width: 300px;
  }

  .food-icon-plate {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .plate-legend {
    gap: var(--spacing-md);
    padding: var(--spacing-sm);
  }
}
</style>