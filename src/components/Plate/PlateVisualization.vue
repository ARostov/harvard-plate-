<!-- components/Plate/PlateVisualization.vue -->
<template>
  <div class="plate-visualization card">
    <h3>Ваша тарелка <span class="total-weight">({{ totalWeight }}г)</span></h3>

    <!-- Круг тарелки -->
    <div class="plate-container">
      <div class="plate-circle-wrapper">
        <!-- Конусный градиент для секторов -->
        <div
            class="plate-circle"
            :style="plateCircleStyle"
        >
          <!-- Разделительные линии между секторами -->
          <div class="sector-lines">
            <div class="sector-line" :style="{ transform: `rotate(${vegetablePercentage * 3.6}deg)` }"></div>
            <div class="sector-line" :style="{ transform: `rotate(${(vegetablePercentage + proteinPercentage) * 3.6}deg)` }"></div>
          </div>

          <!-- Иконки овощей -->
          <div class="sector-icons vegetables">
            <span
                v-for="(item, index) in vegetableItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getVegetableIconPosition(index, vegetableItems.length)"
                :data-amount="item.amount"
            >
            {{ getFoodIcon(item.foodId) }}
            </span>
          </div>

          <!-- Иконки белков -->
          <div class="sector-icons proteins">
            <span
                v-for="(item, index) in proteinItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getProteinIconPosition(index, proteinItems.length)"
                :data-amount="item.amount"
            >
              {{ getFoodIcon(item.foodId) }}
            </span>
          </div>

          <!-- Иконки углеводов -->
          <div class="sector-icons carbs">
            <span
                v-for="(item, index) in carbItems"
                :key="item.id"
                class="food-icon-plate"
                :title="getFoodTitle(item)"
                :style="getCarbIconPosition(index, carbItems.length)"
                :data-amount="item.amount"
            >
              {{ getFoodIcon(item.foodId) }}
            </span>
          </div>
        </div>

        <!-- Легенда -->
        <div class="plate-legend">
          <div class="legend-item">
            <span class="legend-color vegetable"></span>
            <span>Овощи/фрукты: {{ vegetablePercentage }}% ({{ vegetableWeight }}г)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color protein"></span>
            <span>Белки: {{ proteinPercentage }}% ({{ proteinWeight }}г)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color carb"></span>
            <span>Углеводы: {{ carbPercentage }}% ({{ carbWeight }}г)</span>
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
        @update-amount="$emit('update-amount', $event)"
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

const emit = defineEmits(['remove-item', 'update-amount'])

// Вычисляем общий вес
const totalWeight = computed(() => {
  const allItems = [...props.vegetableItems, ...props.proteinItems, ...props.carbItems]
  return allItems.reduce((sum, item) => sum + item.amount, 0)
})

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

// Стиль для круговой диаграммы
const plateCircleStyle = computed(() => {
  const vegDeg = props.vegetablePercentage * 3.6
  const protDeg = props.proteinPercentage * 3.6
  const carbDeg = props.carbPercentage * 3.6

  return {
    background: `conic-gradient(
      rgba(72, 187, 120, 0.4) 0deg ${vegDeg}deg,
      rgba(237, 137, 54, 0.4) ${vegDeg}deg ${vegDeg + protDeg}deg,
      rgba(66, 153, 225, 0.4) ${vegDeg + protDeg}deg 360deg
    )`
  }
})

// Заголовок для иконки
const getFoodTitle = (item) => {
  return `${props.getFoodName(item.foodId)} - ${item.amount}г`
}

// Позиционирование иконок овощей (верхний сектор)
const getVegetableIconPosition = (index, total) => {
  if (total === 0) return {}

  // Распределяем по дуге овощного сектора (от 0 до vegetablePercentage)
  const vegAngle = props.vegetablePercentage * 3.6 // в градусах
  const angleStep = vegAngle / (total + 1)

  // Начинаем не с самого края, а с небольшим отступом
  const angleDeg = (index + 1) * angleStep

  // Конвертируем в радианы и корректируем угол
  // -90 чтобы начать с 12 часов
  const angleRad = (angleDeg - 90) * (Math.PI / 180)

  // Радиус - 80% от радиуса круга (ближе к краю)
  const radius = 0.4

  const x = 0.5 + radius * Math.cos(angleRad)
  const y = 0.5 + radius * Math.sin(angleRad)

  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: `translate(-50%, -50%)`
  }
}

// Позиционирование иконок белков (левый нижний сектор)
const getProteinIconPosition = (index, total) => {
  if (total === 0) return {}

  // Сектор белков начинается после овощей
  const startAngle = props.vegetablePercentage * 3.6
  const protAngle = props.proteinPercentage * 3.6
  const angleStep = protAngle / (total + 1)

  // Распределяем по дуге белкового сектора
  const angleDeg = startAngle + (index + 1) * angleStep

  // Конвертируем в радианы
  const angleRad = (angleDeg - 90) * (Math.PI / 180)

  // Радиус - 80% от радиуса круга
  const radius = 0.4

  const x = 0.5 + radius * Math.cos(angleRad)
  const y = 0.5 + radius * Math.sin(angleRad)

  return {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    transform: `translate(-50%, -50%)`
  }
}

// Позиционирование иконок углеводов (правый нижний сектор)
const getCarbIconPosition = (index, total) => {
  if (total === 0) return {}

  // Сектор углеводов начинается после овощей и белков
  const startAngle = (props.vegetablePercentage + props.proteinPercentage) * 3.6
  const carbAngle = props.carbPercentage * 3.6
  const angleStep = carbAngle / (total + 1)

  // Распределяем по дуге углеводного сектора
  const angleDeg = startAngle + (index + 1) * angleStep

  // Конвертируем в радианы
  const angleRad = (angleDeg - 90) * (Math.PI / 180)

  // Радиус - 80% от радиуса круга
  const radius = 0.4

  const x = 0.5 + radius * Math.cos(angleRad)
  const y = 0.5 + radius * Math.sin(angleRad)

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

.plate-visualization h3 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.total-weight {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: normal;
  background: var(--bg-secondary);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
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

/* Разделительные линии между секторами */
.sector-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.sector-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 50%;
  background: rgba(255, 255, 255, 0.8);
  transform-origin: bottom center;
}

/* Контейнеры для иконок в каждом секторе */
.sector-icons {
  position: absolute;
  width: 100%;
  height: 100%;
}

.food-icon-plate {
  position: absolute;
  font-size: 2rem; /* Увеличиваем размер иконок */
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  width: 56px; /* Увеличиваем размер */
  height: 56px; /* Увеличиваем размер */
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 3px solid white; /* Более толстая граница */
  cursor: help;
  transition: all 0.3s ease;
  z-index: 10;
}

.food-icon-plate:hover {
  transform: scale(1.4) translate(-50%, -50%);
  z-index: 20;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.plate-legend {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-lg);
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
  justify-content: space-between;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  flex-shrink: 0;
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

.legend-item span:last-child {
  text-align: right;
  flex: 1;
}

/* Добавим цифры с весом на иконки (опционально) */
.food-icon-plate::after {
  content: attr(data-amount);
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: var(--primary-color);
  color: white;
  font-size: 0.6rem;
  padding: 1px 4px;
  border-radius: 8px;
  min-width: 20px;
  text-align: center;
}

/* Адаптивность */
@media (max-width: 768px) {
  .plate-circle-wrapper {
    max-width: 300px;
  }

  .food-icon-plate {
    width: 48px;
    height: 48px;
    font-size: 1.7rem;
  }

  .legend-item {
    font-size: 0.8rem;
  }
}
</style>