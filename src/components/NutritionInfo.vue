<template>
  <div class="nutrition-page">
    <div class="page-header">
      <h2><i class="fas fa-chart-pie"></i> Анализ питательности</h2>
      <p class="subtitle">Детальный анализ состава и баланса ваших тарелок</p>
    </div>

    <!-- Быстрые метрики -->
    <div class="quick-stats">
      <div class="stat-card">
        <div class="stat-icon" style="background: #667eea20; color: #667eea;">
          <i class="fas fa-fire"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalCalories }}</div>
          <div class="stat-label">Всего калорий</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #48bb7820; color: #48bb78;">
          <i class="fas fa-dumbbell"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalProtein }}г</div>
          <div class="stat-label">Белок</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #4299e120; color: #4299e1;">
          <i class="fas fa-bread-slice"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalCarbs }}г</div>
          <div class="stat-label">Углеводы</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: #ed893620; color: #ed8936;">
          <i class="fas fa-oil-can"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ totalFat }}г</div>
          <div class="stat-label">Жиры</div>
        </div>
      </div>
    </div>

    <div class="nutrition-content">
      <!-- Левая колонка: Графики -->
      <div class="charts-section card">
        <h3><i class="fas fa-chart-bar"></i> Визуализация</h3>

        <div class="chart-tabs">
          <button
              v-for="tab in chartTabs"
              :key="tab.id"
              class="chart-tab"
              :class="{ active: activeChart === tab.id }"
              @click="activeChart = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.label }}
          </button>
        </div>

        <!-- График распределения калорий -->
        <div v-if="activeChart === 'calories'" class="chart-container">
          <div class="chart-header">
            <h4>Распределение калорий по БЖУ</h4>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #48bb78;"></span>
                <span>Белок: {{ macrosPercent.protein }}%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #4299e1;"></span>
                <span>Углеводы: {{ macrosPercent.carbs }}%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ed8936;"></span>
                <span>Жиры: {{ macrosPercent.fat }}%</span>
              </div>
            </div>
          </div>
          <div class="pie-chart">
            <div class="pie-chart-svg">
              <svg viewBox="0 0 100 100">
                <!-- Белки -->
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    :stroke="getColor('protein')"
                    stroke-width="20"
                    :stroke-dasharray="getDashArray(macrosPercent.protein)"
                    stroke-dashoffset="25"
                />
                <!-- Углеводы -->
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    :stroke="getColor('carbs')"
                    stroke-width="20"
                    :stroke-dasharray="getDashArray(macrosPercent.carbs)"
                    :stroke-dashoffset="getDashOffset(macrosPercent.protein)"
                />
                <!-- Жиры -->
                <circle
                    cx="50" cy="50" r="40"
                    fill="transparent"
                    :stroke="getColor('fat')"
                    stroke-width="20"
                    :stroke-dasharray="getDashArray(macrosPercent.fat)"
                    :stroke-dashoffset="getDashOffset(macrosPercent.protein + macrosPercent.carbs)"
                />
              </svg>
            </div>
            <div class="pie-chart-center">
              <div class="total-calories">{{ totalCalories }}</div>
              <div class="calories-label">ккал</div>
            </div>
          </div>
        </div>

        <!-- График баланса тарелки -->
        <div v-if="activeChart === 'balance'" class="chart-container">
          <div class="chart-header">
            <h4>Баланс Гарвардской тарелки</h4>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #48bb78;"></span>
                <span>Овощи: {{ currentBalance.vegetable }}%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #ed8936;"></span>
                <span>Белки: {{ currentBalance.protein }}%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #4299e1;"></span>
                <span>Углеводы: {{ currentBalance.carb }}%</span>
              </div>
            </div>
          </div>
          <div class="balance-chart">
            <div class="balance-section" :style="{ flex: currentBalance.vegetable }">
              <div class="balance-label">Овощи</div>
              <div class="balance-percentage">{{ currentBalance.vegetable }}%</div>
            </div>
            <div class="balance-section" :style="{ flex: currentBalance.protein }">
              <div class="balance-label">Белки</div>
              <div class="balance-percentage">{{ currentBalance.protein }}%</div>
            </div>
            <div class="balance-section" :style="{ flex: currentBalance.carb }">
              <div class="balance-label">Углеводы</div>
              <div class="balance-percentage">{{ currentBalance.carb }}%</div>
            </div>
          </div>
        </div>

        <!-- График сравнения -->
        <div v-if="activeChart === 'comparison'" class="chart-container">
          <div class="chart-header">
            <h4>Сравнение с нормами</h4>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color" style="background: #667eea;"></span>
                <span>Ваша тарелка</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" style="background: #a0aec0;"></span>
                <span>Рекомендации</span>
              </div>
            </div>
          </div>
          <div class="comparison-chart">
            <div class="comparison-item">
              <div class="comparison-label">Белок</div>
              <div class="comparison-bars">
                <div
                    class="comparison-bar user"
                    :style="{ width: proteinPercent + '%' }"
                >
                  {{ totalProtein }}г
                </div>
                <div
                    class="comparison-bar recommended"
                    :style="{ width: recommendedProteinPercent + '%' }"
                >
                  56г
                </div>
              </div>
            </div>
            <div class="comparison-item">
              <div class="comparison-label">Углеводы</div>
              <div class="comparison-bars">
                <div
                    class="comparison-bar user"
                    :style="{ width: carbsPercent + '%' }"
                >
                  {{ totalCarbs }}г
                </div>
                <div
                    class="comparison-bar recommended"
                    :style="{ width: recommendedCarbsPercent + '%' }"
                >
                  130г
                </div>
              </div>
            </div>
            <div class="comparison-item">
              <div class="comparison-label">Жиры</div>
              <div class="comparison-bars">
                <div
                    class="comparison-bar user"
                    :style="{ width: fatPercent + '%' }"
                >
                  {{ totalFat }}г
                </div>
                <div
                    class="comparison-bar recommended"
                    :style="{ width: recommendedFatPercent + '%' }"
                >
                  44г
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка: Детальный анализ -->
      <div class="analysis-section card">
        <h3><i class="fas fa-search"></i> Детальный анализ</h3>

        <!-- Селектор тарелки -->
        <div class="plate-selector">
          <label for="plate-select">Выберите тарелку для анализа:</label>
          <select
              id="plate-select"
              v-model="selectedPlateId"
              class="plate-select"
              @change="loadPlateData"
          >
            <option value="current">Текущая тарелка</option>
            <option
                v-for="plate in savedPlates"
                :key="plate.id"
                :value="plate.id"
            >
              {{ plate.name }} ({{ plate.nutrition.calories }} ккал)
            </option>
          </select>
        </div>

        <!-- Оценка по Гарвардской тарелке -->
        <div class="evaluation-section">
          <h4>Оценка по Гарвардской тарелке</h4>
          <div class="evaluation-cards">
            <div
                v-for="item in harvardEvaluation"
                :key="item.category"
                class="evaluation-card"
                :class="item.status"
            >
              <div class="evaluation-header">
                <i :class="getEvaluationIcon(item.status)"></i>
                <span class="evaluation-category">{{ getCategoryName(item.category) }}</span>
              </div>
              <div class="evaluation-content">
                <div class="evaluation-percentage">
                  {{ currentBalance[item.category] || 0 }}%
                </div>
                <div class="evaluation-target">
                  <span class="target-label">Цель:</span>
                  <span class="target-value">{{ getHarvardTarget(item.category) }}%</span>
                </div>
                <div class="evaluation-difference">
                  <span class="difference-label">Разница:</span>
                  <span class="difference-value">{{ item.diff }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Рекомендации по нутриентам -->
        <div class="recommendations-section">
          <h4>Рекомендации по нутриентам</h4>
          <div class="recommendations-list">
            <div
                v-for="rec in nutrientRecommendations"
                :key="rec.nutrient"
                class="recommendation-item"
                :class="rec.type"
            >
              <div class="recommendation-icon">
                <i :class="rec.icon"></i>
              </div>
              <div class="recommendation-content">
                <h5>{{ rec.title }}</h5>
                <p>{{ rec.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Пищевая ценность по продуктам -->
        <div class="food-breakdown">
          <h4>Пищевая ценность по продуктам</h4>
          <div class="food-nutrition-table">
            <table>
              <thead>
              <tr>
                <th>Продукт</th>
                <th>Кол-во</th>
                <th>Калории</th>
                <th>Белок</th>
                <th>Жиры</th>
                <th>Углеводы</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in currentPlateItems" :key="item.id">
                <td class="food-cell">
                  <span class="food-icon">{{ getFoodIcon(item.foodId) }}</span>
                  <span class="food-name">{{ getFoodName(item.foodId) }}</span>
                </td>
                <td>{{ item.amount }}г</td>
                <td>{{ getFoodCalories(item) }}</td>
                <td>{{ getFoodProtein(item) }}г</td>
                <td>{{ getFoodFat(item) }}г</td>
                <td>{{ getFoodCarbs(item) }}г</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"><strong>Итого:</strong></td>
                <td><strong>{{ totalCalories }}</strong></td>
                <td><strong>{{ totalProtein }}г</strong></td>
                <td><strong>{{ totalFat }}г</strong></td>
                <td><strong>{{ totalCarbs }}г</strong></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Экспорт данных -->
    <div class="export-section card">
      <h3><i class="fas fa-file-export"></i> Экспорт данных</h3>
      <div class="export-options">
        <button class="btn btn-secondary" @click="exportAsText">
          <i class="fas fa-file-alt"></i>
          Экспорт в текст
        </button>
        <button class="btn btn-secondary" @click="exportAsJSON">
          <i class="fas fa-code"></i>
          Экспорт в JSON
        </button>
        <button class="btn btn-primary" @click="saveReport">
          <i class="fas fa-save"></i>
          Сохранить отчет
        </button>
        <button class="btn btn-secondary" @click="printReport">
          <i class="fas fa-print"></i>
          Печать отчета
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import foodsData from '../data/foods.json'
import { calculatePlateNutrition, calculatePlateBalance, evaluateHarvardPlate, calculateMacroPercentages } from '../utils/calculations'
import { loadPlates } from '../utils/storage'

export default {
  name: 'NutritionInfo',

  setup() {
    // Состояние
    const activeChart = ref('calories')
    const selectedPlateId = ref('current')
    const currentPlateItems = ref([])

    // Данные для графика
    const chartTabs = ref([
      { id: 'calories', label: 'Калории', icon: 'fas fa-chart-pie' },
      { id: 'balance', label: 'Баланс', icon: 'fas fa-balance-scale' },
      { id: 'comparison', label: 'Сравнение', icon: 'fas fa-chart-bar' }
    ])

    // Загруженные тарелки
    const savedPlates = ref([])

    // Вычисляемые свойства
    const currentNutrition = computed(() => {
      return calculatePlateNutrition(currentPlateItems.value, foodsData)
    })

    const totalCalories = computed(() => currentNutrition.value.calories)
    const totalProtein = computed(() => currentNutrition.value.protein)
    const totalCarbs = computed(() => currentNutrition.value.carbs)
    const totalFat = computed(() => currentNutrition.value.fat)

    const macrosPercent = computed(() => {
      return calculateMacroPercentages(currentNutrition.value)
    })

    const currentBalance = computed(() => {
      return calculatePlateBalance(currentPlateItems.value, foodsData)
    })

    const harvardEvaluation = computed(() => {
      return evaluateHarvardPlate(currentBalance.value)
    })

    // Проценты для графика сравнения
    const proteinPercent = computed(() => (totalProtein.value / 100) * 100)
    const carbsPercent = computed(() => (totalCarbs.value / 200) * 100)
    const fatPercent = computed(() => (totalFat.value / 70) * 100)

    const recommendedProteinPercent = computed(() => (56 / 100) * 100)
    const recommendedCarbsPercent = computed(() => (130 / 200) * 100)
    const recommendedFatPercent = computed(() => (44 / 70) * 100)

    // Рекомендации по нутриентам
    const nutrientRecommendations = computed(() => {
      const recs = []
      const nutrition = currentNutrition.value

      // Белки
      if (nutrition.protein < 30) {
        recs.push({
          nutrient: 'protein',
          type: 'warning',
          icon: 'fas fa-dumbbell',
          title: 'Мало белка',
          message: 'Рекомендуется добавить источники белка: курицу, рыбу, тофу или бобовые'
        })
      } else if (nutrition.protein > 100) {
        recs.push({
          nutrient: 'protein',
          type: 'warning',
          icon: 'fas fa-dumbbell',
          title: 'Много белка',
          message: 'Количество белка превышает рекомендуемую норму'
        })
      } else {
        recs.push({
          nutrient: 'protein',
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Белок в норме',
          message: 'Количество белка соответствует рекомендациям'
        })
      }

      // Углеводы
      if (nutrition.carbs < 50) {
        recs.push({
          nutrient: 'carbs',
          type: 'warning',
          icon: 'fas fa-bread-slice',
          title: 'Мало углеводов',
          message: 'Рекомендуется добавить сложные углеводы: крупы, цельнозерновые продукты'
        })
      } else if (nutrition.carbs > 200) {
        recs.push({
          nutrient: 'carbs',
          type: 'warning',
          icon: 'fas fa-bread-slice',
          title: 'Много углеводов',
          message: 'Рассмотрите снижение количества углеводов'
        })
      } else {
        recs.push({
          nutrient: 'carbs',
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Углеводы в норме',
          message: 'Количество углеводов соответствует рекомендациям'
        })
      }

      // Жиры
      if (nutrition.fat < 20) {
        recs.push({
          nutrient: 'fat',
          type: 'warning',
          icon: 'fas fa-oil-can',
          title: 'Мало жиров',
          message: 'Добавьте полезные жиры: авокадо, орехи, оливковое масло'
        })
      } else if (nutrition.fat > 60) {
        recs.push({
          nutrient: 'fat',
          type: 'warning',
          icon: 'fas fa-oil-can',
          title: 'Много жиров',
          message: 'Рассмотрите снижение количества жиров'
        })
      } else {
        recs.push({
          nutrient: 'fat',
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Жиры в норме',
          message: 'Количество жиров соответствует рекомендациям'
        })
      }

      // Клетчатка
      if (nutrition.fiber < 25) {
        recs.push({
          nutrient: 'fiber',
          type: 'info',
          icon: 'fas fa-seedling',
          title: 'Мало клетчатки',
          message: 'Добавьте больше овощей, фруктов и цельнозерновых продуктов'
        })
      } else {
        recs.push({
          nutrient: 'fiber',
          type: 'success',
          icon: 'fas fa-check-circle',
          title: 'Клетчатка в норме',
          message: 'Количество клетчатки соответствует рекомендациям'
        })
      }

      return recs
    })

    // Методы
    function getFoodName(foodId) {
      const food = foodsData.foods.find(f => f.id === foodId)
      return food ? food.name : 'Неизвестный продукт'
    }

    function getFoodIcon(foodId) {
      const food = foodsData.foods.find(f => f.id === foodId)
      return food ? food.icon : '❓'
    }

    function getFoodCalories(item) {
      const food = foodsData.foods.find(f => f.id === item.foodId)
      if (!food) return 0
      return Math.round((food.nutrition.calories * item.amount) / 100)
    }

    function getFoodProtein(item) {
      const food = foodsData.foods.find(f => f.id === item.foodId)
      if (!food) return 0
      return Math.round((food.nutrition.protein * item.amount) / 100 * 10) / 10
    }

    function getFoodCarbs(item) {
      const food = foodsData.foods.find(f => f.id === item.foodId)
      if (!food) return 0
      return Math.round((food.nutrition.carbs * item.amount) / 100 * 10) / 10
    }

    function getFoodFat(item) {
      const food = foodsData.foods.find(f => f.id === item.foodId)
      if (!food) return 0
      return Math.round((food.nutrition.fat * item.amount) / 100 * 10) / 10
    }

    function getCategoryName(category) {
      const names = {
        vegetable: 'Овощи и фрукты',
        protein: 'Белки',
        carb: 'Углеводы'
      }
      return names[category] || category
    }

    function getHarvardTarget(category) {
      const targets = {
        vegetable: 50,
        protein: 25,
        carb: 25
      }
      return targets[category] || 0
    }

    function getEvaluationIcon(status) {
      const icons = {
        good: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        bad: 'fas fa-times-circle'
      }
      return icons[status] || 'fas fa-info-circle'
    }

    function getColor(type) {
      const colors = {
        protein: '#48bb78',
        carbs: '#4299e1',
        fat: '#ed8936',
        vegetable: '#48bb78',
        carb: '#4299e1'
      }
      return colors[type] || '#667eea'
    }

    function getDashArray(percent) {
      const circumference = 2 * Math.PI * 40
      const dashLength = (percent / 100) * circumference
      return `${dashLength} ${circumference}`
    }

    function getDashOffset(percent) {
      const circumference = 2 * Math.PI * 40
      const offset = (percent / 100) * circumference
      return 25 - offset
    }

    function loadPlateData() {
      if (selectedPlateId.value === 'current') {
        // Загружаем текущую тарелку из localStorage
        const current = JSON.parse(localStorage.getItem('current_plate') || '[]')
        currentPlateItems.value = current
      } else {
        const plate = savedPlates.value.find(p => p.id === selectedPlateId.value)
        if (plate) {
          currentPlateItems.value = plate.items || []
        }
      }
    }

    function exportAsText() {
      const text = `Отчет по питательности:

Тарелка: ${selectedPlateId.value === 'current' ? 'Текущая тарелка' : 'Сохраненная тарелка'}
Дата анализа: ${new Date().toLocaleDateString()}

Общие показатели:
- Калории: ${totalCalories.value} ккал
- Белки: ${totalProtein.value}г
- Углеводы: ${totalCarbs.value}г
- Жиры: ${totalFat.value}г
- Клетчатка: ${currentNutrition.value.fiber}г

Распределение БЖУ:
- Белки: ${macrosPercent.value.protein}%
- Углеводы: ${macrosPercent.value.carbs}%
- Жиры: ${macrosPercent.value.fat}%

Состав по продуктам:${currentPlateItems.value.map(item => `
- ${getFoodName(item.foodId)}: ${item.amount}г (${getFoodCalories(item)} ккал)`).join('')}
      `

      navigator.clipboard.writeText(text)
      alert('Отчет скопирован в буфер обмена!')
    }

    function exportAsJSON() {
      const data = {
        plate: selectedPlateId.value === 'current' ? 'current' : selectedPlateId.value,
        analysisDate: new Date().toISOString(),
        nutrition: currentNutrition.value,
        balance: currentBalance.value,
        macros: macrosPercent.value,
        evaluation: harvardEvaluation.value,
        items: currentPlateItems.value.map(item => ({
          food: getFoodName(item.foodId),
          amount: item.amount,
          nutrition: {
            calories: getFoodCalories(item),
            protein: getFoodProtein(item),
            carbs: getFoodCarbs(item),
            fat: getFoodFat(item)
          }
        }))
      }

      const json = JSON.stringify(data, null, 2)
      navigator.clipboard.writeText(json)
      alert('JSON скопирован в буфер обмена!')
    }

    function saveReport() {
      const report = {
        id: `report_${Date.now()}`,
        date: new Date().toISOString(),
        plateId: selectedPlateId.value,
        nutrition: currentNutrition.value,
        balance: currentBalance.value,
        items: [...currentPlateItems.value]
      }

      const reports = JSON.parse(localStorage.getItem('nutrition_reports') || '[]')
      reports.push(report)
      localStorage.setItem('nutrition_reports', JSON.stringify(reports))

      alert('Отчет сохранен!')
    }

    function printReport() {
      window.print()
    }

    // Инициализация
    onMounted(() => {
      // Загружаем сохраненные тарелки
      savedPlates.value = loadPlates()

      // Загружаем текущую тарелку
      loadPlateData()
    })

    return {
      // Состояние
      activeChart,
      selectedPlateId,
      currentPlateItems,

      // Данные
      chartTabs,
      savedPlates,

      // Вычисляемые свойства
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      macrosPercent,
      currentBalance,
      harvardEvaluation,
      proteinPercent,
      carbsPercent,
      fatPercent,
      recommendedProteinPercent,
      recommendedCarbsPercent,
      recommendedFatPercent,
      nutrientRecommendations,

      // Методы
      getFoodName,
      getFoodIcon,
      getFoodCalories,
      getFoodProtein,
      getFoodCarbs,
      getFoodFat,
      getCategoryName,
      getHarvardTarget,
      getEvaluationIcon,
      getColor,
      getDashArray,
      getDashOffset,
      loadPlateData,
      exportAsText,
      exportAsJSON,
      saveReport,
      printReport
    }
  }
}
</script>

<style scoped>
.nutrition-page {
  padding: var(--spacing-lg) 0;
}

/* Быстрые метрики */
.quick-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  font-size: 1.5rem;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* Основной контент */
.nutrition-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .nutrition-content {
    grid-template-columns: 1fr;
  }
}

/* Вкладки графиков */
.chart-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-sm);
}

.chart-tab {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.chart-tab:hover {
  color: var(--primary-color);
}

.chart-tab.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* Контейнер графиков */
.chart-container {
  margin-top: var(--spacing-lg);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.chart-header h4 {
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: var(--spacing-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

/* Круговой график */
.pie-chart {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
}

.pie-chart-svg {
  width: 100%;
  height: 100%;
}

.pie-chart-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.total-calories {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.calories-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* График баланса */
.balance-chart {
  display: flex;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: var(--spacing-lg);
}

.balance-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: var(--spacing-sm);
  color: white;
  font-weight: 500;
}

.balance-section:nth-child(1) {
  background: #48bb78;
}

.balance-section:nth-child(2) {
  background: #ed8936;
}

.balance-section:nth-child(3) {
  background: #4299e1;
}

.balance-label {
  font-size: 0.9rem;
  margin-bottom: 4px;
}

.balance-percentage {
  font-size: 1.2rem;
}

/* График сравнения */
.comparison-chart {
  margin-top: var(--spacing-lg);
}

.comparison-item {
  margin-bottom: var(--spacing-md);
}

.comparison-label {
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.comparison-bars {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.comparison-bar {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 500;
  transition: width 0.5s ease;
}

.comparison-bar.user {
  background: #667eea;
}

.comparison-bar.recommended {
  background: #a0aec0;
}

/* Селектор тарелки */
.plate-selector {
  margin-bottom: var(--spacing-lg);
}

.plate-selector label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.plate-select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
}

/* Оценка по Гарвардской тарелке */
.evaluation-section {
  margin-bottom: var(--spacing-lg);
}

.evaluation-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.evaluation-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.evaluation-card.good {
  background: rgba(72, 187, 120, 0.1);
  border-left-color: #48bb78;
}

.evaluation-card.warning {
  background: rgba(237, 137, 54, 0.1);
  border-left-color: #ed8936;
}

.evaluation-card.bad {
  background: rgba(245, 101, 101, 0.1);
  border-left-color: #f56565;
}

.evaluation-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.evaluation-header i {
  font-size: 1.2rem;
}

.evaluation-card.good .evaluation-header i {
  color: #48bb78;
}

.evaluation-card.warning .evaluation-header i {
  color: #ed8936;
}

.evaluation-card.bad .evaluation-header i {
  color: #f56565;
}

.evaluation-category {
  font-weight: 500;
}

.evaluation-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs);
}

.evaluation-percentage {
  grid-column: span 2;
  font-size: 2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: var(--spacing-xs);
}

.evaluation-target,
.evaluation-difference {
  font-size: 0.9rem;
}

.target-label,
.difference-label {
  display: block;
  color: var(--text-secondary);
  font-size: 0.8rem;
}

.target-value,
.difference-value {
  font-weight: 500;
}

/* Рекомендации по нутриентам */
.recommendations-section {
  margin-bottom: var(--spacing-lg);
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.recommendation-item.success {
  background: rgba(72, 187, 120, 0.1);
  border-left-color: #48bb78;
}

.recommendation-item.warning {
  background: rgba(237, 137, 54, 0.1);
  border-left-color: #ed8936;
}

.recommendation-item.info {
  background: rgba(66, 153, 225, 0.1);
  border-left-color: #4299e1;
}

.recommendation-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 1.2rem;
}

.recommendation-item.success .recommendation-icon {
  background: rgba(72, 187, 120, 0.2);
  color: #48bb78;
}

.recommendation-item.warning .recommendation-icon {
  background: rgba(237, 137, 54, 0.2);
  color: #ed8936;
}

.recommendation-item.info .recommendation-icon {
  background: rgba(66, 153, 225, 0.2);
  color: #4299e1;
}

.recommendation-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1rem;
}

.recommendation-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Таблица пищевой ценности */
.food-breakdown {
  margin-bottom: var(--spacing-lg);
}

.food-nutrition-table {
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.food-nutrition-table table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
}

.food-nutrition-table th {
  background: var(--bg-tertiary);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
}

.food-nutrition-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-color);
}

.food-cell {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.food-icon {
  font-size: 1.2rem;
}

.food-name {
  font-weight: 500;
}

.total-row {
  background: var(--bg-tertiary);
  font-weight: 600;
}

.total-row td {
  border-top: 2px solid var(--border-color);
}

/* Секция экспорта */
.export-section {
  margin-top: var(--spacing-xl);
}

.export-options {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .export-options {
    flex-direction: column;
  }

  .export-options .btn {
    width: 100%;
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .quick-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .evaluation-cards {
    grid-template-columns: 1fr;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .chart-legend {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .quick-stats {
    grid-template-columns: 1fr;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .food-nutrition-table {
    font-size: 0.9rem;
  }

  .food-nutrition-table th,
  .food-nutrition-table td {
    padding: var(--spacing-sm);
  }
}

/* Анимации */
@keyframes grow {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.pie-chart {
  animation: grow 0.5s ease-out;
}

.balance-chart .balance-section,
.comparison-chart .comparison-bar {
  animation: grow 0.5s ease-out;
  animation-fill-mode: both;
}

.balance-chart .balance-section:nth-child(1) { animation-delay: 0.1s; }
.balance-chart .balance-section:nth-child(2) { animation-delay: 0.2s; }
.balance-chart .balance-section:nth-child(3) { animation-delay: 0.3s; }

.comparison-chart .comparison-bar.user { animation-delay: 0.1s; }
.comparison-chart .comparison-bar.recommended { animation-delay: 0.2s; }

/* Улучшенная прокрутка для таблиц */
.food-nutrition-table {
  overflow-x: auto;
}

.food-nutrition-table table {
  min-width: 600px;
}

/* Стили для печати */
@media print {
  .nutrition-page {
    padding: 0;
  }

  .page-header,
  .quick-stats,
  .export-section,
  .btn,
  .chart-tabs,
  .plate-selector {
    display: none;
  }

  .nutrition-content {
    display: block;
  }

  .card {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }

  .charts-section {
    display: none;
  }

  .analysis-section {
    border: none;
    padding: 0;
  }

  .evaluation-cards,
  .recommendations-list {
    page-break-inside: avoid;
  }

  .food-nutrition-table {
    page-break-inside: avoid;
  }

  .food-nutrition-table table {
    min-width: auto;
    width: 100%;
  }
}
</style>