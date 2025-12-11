<template>
  <div class="compatibility-page">
    <div class="page-header">
      <h2><i class="fas fa-handshake"></i> Сочетаемость продуктов</h2>
      <p class="subtitle">Анализ и рекомендации по сочетанию продуктов на вашей тарелке</p>
    </div>

    <!-- Быстрая проверка -->
    <div class="quick-check card">
      <h3><i class="fas fa-search"></i> Быстрая проверка сочетаемости</h3>
      <div class="check-form">
        <div class="food-inputs">
          <div class="food-input-group">
            <label>Первый продукт:</label>
            <select v-model="checkFood1" class="food-select">
              <option value="">Выберите продукт</option>
              <option
                  v-for="food in foodsData.foods"
                  :key="food.id"
                  :value="food.id"
              >
                {{ food.icon }} {{ food.name }}
              </option>
            </select>
          </div>

          <div class="food-input-group">
            <label>Второй продукт:</label>
            <select v-model="checkFood2" class="food-select">
              <option value="">Выберите продукт</option>
              <option
                  v-for="food in foodsData.foods"
                  :key="food.id"
                  :value="food.id"
              >
                {{ food.icon }} {{ food.name }}
              </option>
            </select>
          </div>
        </div>

        <button
            class="btn btn-primary check-btn"
            @click="checkCompatibility"
            :disabled="!checkFood1 || !checkFood2"
        >
          <i class="fas fa-check"></i>
          Проверить сочетаемость
        </button>
      </div>

      <!-- Результат проверки -->
      <div v-if="checkResult" class="check-result" :class="checkResult.type">
        <div class="result-header">
          <i :class="getResultIcon(checkResult.type)"></i>
          <h4>{{ checkResult.title }}</h4>
        </div>
        <div class="result-content">
          <p>{{ checkResult.message }}</p>
          <div v-if="checkResult.examples" class="result-examples">
            <strong>Примеры блюд:</strong>
            <ul>
              <li v-for="(example, index) in checkResult.examples" :key="index">
                {{ example }}
              </li>
            </ul>
          </div>
          <div v-if="checkResult.suggestions" class="result-suggestions">
            <strong>Рекомендации:</strong>
            <p>{{ checkResult.suggestions }}</p>
          </div>
        </div>
        <div class="result-score">
          <div class="score-label">Оценка сочетаемости:</div>
          <div class="score-value">{{ checkResult.score }}/10</div>
          <div class="score-bar">
            <div
                class="score-fill"
                :style="{ width: checkResult.score * 10 + '%' }"
                :class="getScoreClass(checkResult.score)"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="compatibility-content">
      <!-- Левая колонка: Анализ текущей тарелки -->
      <div class="plate-analysis card">
        <h3><i class="fas fa-clipboard-check"></i> Анализ текущей тарелки</h3>

        <div v-if="plateItems.length === 0" class="empty-plate">
          <i class="fas fa-utensils fa-3x"></i>
          <p>Добавьте продукты в тарелку для анализа сочетаемости</p>
          <router-link to="/" class="btn btn-primary">
            <i class="fas fa-plus"></i>
            Перейти к конструктору
          </router-link>
        </div>

        <div v-else>
          <!-- Общая оценка -->
          <div class="overall-rating" :class="getOverallClass(plateCompatibility.overallScore)">
            <div class="rating-score">
              <div class="score-number">{{ plateCompatibility.overallScore }}/10</div>
              <div class="score-label">Общая оценка</div>
            </div>
            <div class="rating-message">
              <h4>{{ plateCompatibility.message }}</h4>
              <p>Хороших сочетаний: {{ plateCompatibility.compatiblePairs }},
                Плохих: {{ plateCompatibility.incompatiblePairs }}</p>
            </div>
          </div>

          <!-- Детальный анализ пар -->
          <div class="pairs-analysis">
            <h4>Анализ пар продуктов</h4>
            <div class="pairs-list">
              <div
                  v-for="pair in plateCompatibility.pairs"
                  :key="pair.food1 + '-' + pair.food2"
                  class="pair-item"
                  :class="pair.type"
              >
                <div class="pair-header">
                  <span class="pair-icons">
                    <span class="food-icon">{{ getFoodIcon(pair.food1) }}</span>
                    <i class="fas fa-plus"></i>
                    <span class="food-icon">{{ getFoodIcon(pair.food2) }}</span>
                  </span>
                  <span class="pair-names">
                    {{ getFoodName(pair.food1) }} + {{ getFoodName(pair.food2) }}
                  </span>
                  <span class="pair-score">{{ pair.score }}/10</span>
                </div>
                <div class="pair-content">
                  <p>{{ pair.reason }}</p>
                  <div v-if="pair.examples" class="pair-examples">
                    <small>Примеры: {{ pair.examples.join(', ') }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Рекомендации по улучшению -->
          <div class="improvement-tips">
            <h4><i class="fas fa-lightbulb"></i> Рекомендации по улучшению</h4>
            <div class="tips-list">
              <div
                  v-for="(tip, index) in improvementTips"
                  :key="index"
                  class="tip-item"
                  :class="tip.type"
              >
                <i :class="tip.icon"></i>
                <div class="tip-content">
                  <h5>{{ tip.title }}</h5>
                  <p>{{ tip.description }}</p>
                  <div v-if="tip.suggestions" class="tip-suggestions">
                    <strong>Предложения:</strong>
                    <ul>
                      <li v-for="(suggestion, idx) in tip.suggestions" :key="idx">
                        {{ suggestion }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка: База знаний о сочетаемости -->
      <div class="knowledge-base card">
        <h3><i class="fas fa-book"></i> База знаний о сочетаемости</h3>

        <!-- Поиск по базе -->
        <div class="knowledge-search">
          <div class="search-input-wrapper">
            <i class="fas fa-search"></i>
            <input
                v-model="knowledgeSearch"
                type="text"
                placeholder="Поиск сочетаний..."
                class="search-input"
                @input="filterKnowledge"
            />
          </div>
        </div>

        <!-- Лучшие сочетания -->
        <div class="knowledge-section">
          <h4><i class="fas fa-star"></i> Лучшие сочетания</h4>
          <div class="combinations-grid">
            <div
                v-for="combo in filteredGoodCombinations"
                :key="combo.foods.join('-')"
                class="combo-card good"
            >
              <div class="combo-header">
                <span class="combo-icons">
                  <span
                      v-for="foodId in combo.foods"
                      :key="foodId"
                      class="combo-icon"
                  >
                    {{ getFoodIcon(foodId) }}
                  </span>
                </span>
                <span class="combo-score">{{ combo.score }}/10</span>
              </div>
              <div class="combo-content">
                <h5>{{ getComboNames(combo.foods) }}</h5>
                <p>{{ combo.reason }}</p>
                <div v-if="combo.examples" class="combo-examples">
                  <small><strong>Блюда:</strong> {{ combo.examples.join(', ') }}</small>
                </div>
              </div>
              <div class="combo-actions">
                <button class="btn btn-sm" @click="addComboToPlate(combo.foods)">
                  <i class="fas fa-plus"></i>
                  Добавить в тарелку
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Неудачные сочетания -->
        <div class="knowledge-section">
          <h4><i class="fas fa-times-circle"></i> Неудачные сочетания</h4>
          <div class="combinations-grid">
            <div
                v-for="combo in filteredBadCombinations"
                :key="combo.foods.join('-')"
                class="combo-card bad"
            >
              <div class="combo-header">
                <span class="combo-icons">
                  <span
                      v-for="foodId in combo.foods"
                      :key="foodId"
                      class="combo-icon"
                  >
                    {{ getFoodIcon(foodId) }}
                  </span>
                </span>
                <span class="combo-score">{{ combo.score }}/10</span>
              </div>
              <div class="combo-content">
                <h5>{{ getComboNames(combo.foods) }}</h5>
                <p>{{ combo.reason }}</p>
                <div v-if="combo.warning" class="combo-warning">
                  <small><i class="fas fa-exclamation-triangle"></i> {{ combo.warning }}</small>
                </div>
              </div>
              <div class="combo-actions">
                <button class="btn btn-sm btn-secondary" @click="showAlternatives(combo.foods)">
                  <i class="fas fa-exchange-alt"></i>
                  Альтернативы
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Принципы сочетаемости -->
        <div class="knowledge-section">
          <h4><i class="fas fa-graduation-cap"></i> Принципы сочетаемости</h4>
          <div class="principles-list">
            <div class="principle-item">
              <div class="principle-icon">
                <i class="fas fa-palette"></i>
              </div>
              <div class="principle-content">
                <h5>Цветовая палитра</h5>
                <p>Разноцветные продукты обычно содержат разные питательные вещества</p>
              </div>
            </div>

            <div class="principle-item">
              <div class="principle-icon">
                <i class="fas fa-balance-scale"></i>
              </div>
              <div class="principle-content">
                <h5>Текстуры</h5>
                <p>Сочетание разных текстур (хрустящее + мягкое) улучшает восприятие</p>
              </div>
            </div>

            <div class="principle-item">
              <div class="principle-icon">
                <i class="fas fa-thermometer-half"></i>
              </div>
              <div class="principle-content">
                <h5>Температуры</h5>
                <p>Теплые и холодные продукты вместе создают интересный контраст</p>
              </div>
            </div>

            <div class="principle-item">
              <div class="principle-icon">
                <i class="fas fa-utensil-spoon"></i>
              </div>
              <div class="principle-content">
                <h5>Вкусы</h5>
                <p>Баланс сладкого, кислого, соленого, горького и умами</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import foodsData from '../data/foods.json'
import combinationsData from '../data/combinations.json'
import { checkFoodCompatibility, checkPlateCompatibility, generateCompatibilityRecommendations } from '../utils/compatibility'

export default {
  name: 'CompatibilityInfo',

  setup() {
    const router = useRouter()

    // Состояние
    const checkFood1 = ref('')
    const checkFood2 = ref('')
    const checkResult = ref(null)
    const knowledgeSearch = ref('')
    const plateItems = ref([])

    // Вычисляемые свойства
    const filteredGoodCombinations = computed(() => {
      if (!knowledgeSearch.value.trim()) {
        return combinationsData.good_combinations
      }

      const query = knowledgeSearch.value.toLowerCase().trim()
      return combinationsData.good_combinations.filter(combo => {
        const foodNames = combo.foods.map(foodId =>
            foodsData.foods.find(f => f.id === foodId)?.name.toLowerCase() || ''
        )
        return (
            foodNames.some(name => name.includes(query)) ||
            combo.reason.toLowerCase().includes(query) ||
            (combo.examples && combo.examples.some(example =>
                example.toLowerCase().includes(query)
            ))
        )
      })
    })

    const filteredBadCombinations = computed(() => {
      if (!knowledgeSearch.value.trim()) {
        return combinationsData.bad_combinations
      }

      const query = knowledgeSearch.value.toLowerCase().trim()
      return combinationsData.bad_combinations.filter(combo => {
        const foodNames = combo.foods.map(foodId =>
            foodsData.foods.find(f => f.id === foodId)?.name.toLowerCase() || ''
        )
        return (
            foodNames.some(name => name.includes(query)) ||
            combo.reason.toLowerCase().includes(query) ||
            (combo.warning && combo.warning.toLowerCase().includes(query))
        )
      })
    })

    const plateCompatibility = computed(() => {
      return checkPlateCompatibility(plateItems.value, combinationsData)
    })

    const improvementTips = computed(() => {
      const tips = []
      const compatibility = plateCompatibility.value

      // Оценка общей сочетаемости
      if (compatibility.overallScore < 6) {
        tips.push({
          type: 'warning',
          icon: 'fas fa-exclamation-triangle',
          title: 'Низкая сочетаемость',
          description: 'Общая оценка сочетаемости продуктов на тарелке низкая',
          suggestions: [
            'Замените продукты с плохой сочетаемостью',
            'Добавьте продукты-посредники',
            'Используйте травы и специи для гармонизации'
          ]
        })
      }

      // Рекомендации на основе плохих сочетаний
      compatibility.pairs.forEach(pair => {
        if (pair.type === 'bad') {
          tips.push({
            type: 'error',
            icon: 'fas fa-times-circle',
            title: `Плохое сочетание: ${getFoodName(pair.food1)} + ${getFoodName(pair.food2)}`,
            description: pair.reason,
            suggestions: [
              `Замените ${getFoodName(pair.food1)} или ${getFoodName(pair.food2)}`,
              'Добавьте третий продукт для баланса',
              'Измените способ приготовления'
            ]
          })
        }
      })

      // Общие рекомендации
      if (plateItems.value.length > 0) {
        const generatedTips = generateCompatibilityRecommendations(
            plateItems.value,
            combinationsData,
            foodsData
        )

        generatedTips.forEach(tip => {
          tips.push({
            type: tip.type,
            icon: getTipIcon(tip.type),
            title: tip.message,
            description: tip.reason || '',
            suggestions: tip.suggestion ? [tip.suggestion] : []
          })
        })
      }

      return tips.slice(0, 5) // Ограничиваем количество подсказок
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

    function getComboNames(foodIds) {
      return foodIds.map(id => getFoodName(id)).join(' + ')
    }

    function getResultIcon(type) {
      const icons = {
        good: 'fas fa-check-circle',
        bad: 'fas fa-times-circle',
        unknown: 'fas fa-question-circle'
      }
      return icons[type] || 'fas fa-info-circle'
    }

    function getTipIcon(type) {
      const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
      }
      return icons[type] || 'fas fa-info-circle'
    }

    function getScoreClass(score) {
      if (score >= 8) return 'score-high'
      if (score >= 5) return 'score-medium'
      return 'score-low'
    }

    function getOverallClass(score) {
      if (score >= 8) return 'rating-high'
      if (score >= 6) return 'rating-medium'
      return 'rating-low'
    }

    function checkCompatibility() {
      if (!checkFood1.value || !checkFood2.value) return

      const result = checkFoodCompatibility(
          checkFood1.value,
          checkFood2.value,
          combinationsData
      )

      checkResult.value = {
        type: result.type,
        title: result.compatible === true ? 'Хорошее сочетание' :
            result.compatible === false ? 'Плохое сочетание' : 'Неизвестное сочетание',
        message: result.reason,
        score: result.score,
        examples: result.examples,
        suggestions: result.warning
      }
    }

    function filterKnowledge() {
      // Фильтрация происходит в computed свойствах
    }

    function addComboToPlate(foodIds) {
      const items = foodIds.map(foodId => ({
        id: Date.now() + Math.random(),
        foodId,
        amount: 100
      }))

      // Сохраняем в localStorage для передачи на страницу тарелки
      localStorage.setItem('combo_to_add', JSON.stringify(items))
      router.push('/')
    }

    function showAlternatives(foodIds) {
      // TODO: Реализовать показ альтернатив
      alert('Функция поиска альтернатив будет реализована позже')
    }

    // Инициализация
    onMounted(() => {
      // Загружаем текущую тарелку
      const currentPlate = localStorage.getItem('current_plate')
      if (currentPlate) {
        plateItems.value = JSON.parse(currentPlate)
      }
    })

    return {
      // Состояние
      checkFood1,
      checkFood2,
      checkResult,
      knowledgeSearch,
      plateItems,

      // Данные
      foodsData,
      combinationsData,

      // Вычисляемые свойства
      filteredGoodCombinations,
      filteredBadCombinations,
      plateCompatibility,
      improvementTips,

      // Методы
      getFoodName,
      getFoodIcon,
      getComboNames,
      getResultIcon,
      getScoreClass,
      getOverallClass,
      checkCompatibility,
      filterKnowledge,
      addComboToPlate,
      showAlternatives
    }
  }
}
</script>

<style scoped>
.compatibility-page {
  padding: var(--spacing-lg) 0;
}

/* Быстрая проверка */
.quick-check {
  margin-bottom: var(--spacing-xl);
}

.check-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.food-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.food-input-group label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.food-select {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
}

.check-btn {
  align-self: flex-start;
}

/* Результат проверки */
.check-result {
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  animation: slideUp 0.3s ease;
}

.check-result.good {
  background: rgba(72, 187, 120, 0.1);
  border: 1px solid rgba(72, 187, 120, 0.3);
}

.check-result.bad {
  background: rgba(245, 101, 101, 0.1);
  border: 1px solid rgba(245, 101, 101, 0.3);
}

.check-result.unknown {
  background: rgba(160, 174, 192, 0.1);
  border: 1px solid rgba(160, 174, 192, 0.3);
}

.result-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.result-header i {
  font-size: 1.5rem;
}

.check-result.good .result-header i {
  color: #48bb78;
}

.check-result.bad .result-header i {
  color: #f56565;
}

.check-result.unknown .result-header i {
  color: #a0aec0;
}

.result-header h4 {
  margin: 0;
}

.result-content {
  margin-bottom: var(--spacing-lg);
}

.result-content p {
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.result-examples ul {
  margin: var(--spacing-sm) 0;
  padding-left: var(--spacing-lg);
}

.result-examples li {
  margin-bottom: var(--spacing-xs);
}

.result-suggestions {
  padding: var(--spacing-md);
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
}

.result-score {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: var(--spacing-md);
}

.score-label {
  margin-bottom: var(--spacing-xs);
  font-weight: 500;
}

.score-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.score-bar {
  height: 10px;
  background: var(--border-color);
  border-radius: 5px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.score-high {
  background: #48bb78;
}

.score-medium {
  background: #ed8936;
}

.score-low {
  background: #f56565;
}

/* Основной контент */
.compatibility-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

@media (max-width: 1024px) {
  .compatibility-content {
    grid-template-columns: 1fr;
  }
}

/* Анализ тарелки */
.empty-plate {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

.empty-plate i {
  margin-bottom: var(--spacing-md);
  color: var(--text-light);
}

.empty-plate p {
  margin-bottom: var(--spacing-lg);
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-lg);
}

.rating-high {
  background: rgba(72, 187, 120, 0.1);
  border: 2px solid #48bb78;
}

.rating-medium {
  background: rgba(237, 137, 54, 0.1);
  border: 2px solid #ed8936;
}

.rating-low {
  background: rgba(245, 101, 101, 0.1);
  border: 2px solid #f56565;
}

.rating-score {
  text-align: center;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
}

.rating-high .score-number {
  color: #48bb78;
}

.rating-medium .score-number {
  color: #ed8936;
}

.rating-low .score-number {
  color: #f56565;
}

.score-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.rating-message h4 {
  margin: 0 0 var(--spacing-xs) 0;
}

.rating-message p {
  margin: 0;
  color: var(--text-secondary);
}

/* Анализ пар */
.pairs-analysis {
  margin-bottom: var(--spacing-lg);
}

.pairs-list {
  max-height: 300px;
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.pair-item {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.pair-item.good {
  background: rgba(72, 187, 120, 0.05);
  border-left-color: #48bb78;
}

.pair-item.bad {
  background: rgba(245, 101, 101, 0.05);
  border-left-color: #f56565;
}

.pair-item.unknown {
  background: rgba(160, 174, 192, 0.05);
  border-left-color: #a0aec0;
}

.pair-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xs);
}

.pair-icons {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.food-icon {
  font-size: 1.2rem;
}

.pair-names {
  flex: 1;
  font-weight: 500;
}

.pair-score {
  font-weight: 600;
  padding: 2px 8px;
  background: white;
  border-radius: var(--radius-sm);
}

.pair-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.pair-examples {
  margin-top: var(--spacing-xs);
  font-size: 0.8rem;
  color: var(--text-light);
}

/* Рекомендации по улучшению */
.improvement-tips {
  margin-top: var(--spacing-lg);
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.tip-item.success {
  background: rgba(72, 187, 120, 0.05);
  border-left-color: #48bb78;
}

.tip-item.warning {
  background: rgba(237, 137, 54, 0.05);
  border-left-color: #ed8936;
}

.tip-item.error {
  background: rgba(245, 101, 101, 0.05);
  border-left-color: #f56565;
}

.tip-item.info {
  background: rgba(66, 153, 225, 0.05);
  border-left-color: #4299e1;
}

.tip-item i {
  font-size: 1.2rem;
  margin-top: 2px;
}

.tip-item.success i {
  color: #48bb78;
}

.tip-item.warning i {
  color: #ed8936;
}

.tip-item.error i {
  color: #f56565;
}

.tip-item.info i {
  color: #4299e1;
}

.tip-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1rem;
}

.tip-content p {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.tip-suggestions {
  font-size: 0.9rem;
}

.tip-suggestions ul {
  margin: var(--spacing-xs) 0;
  padding-left: var(--spacing-lg);
}

.tip-suggestions li {
  margin-bottom: 2px;
}

/* База знаний */
.knowledge-search {
  margin-bottom: var(--spacing-lg);
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.search-input {
  width: 100%;
  padding: 12px 15px 12px 45px;
  font-size: 1rem;
}

.knowledge-section {
  margin-bottom: var(--spacing-xl);
}

.combinations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.combo-card {
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.combo-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.combo-card.good {
  border-top: 3px solid #48bb78;
}

.combo-card.bad {
  border-top: 3px solid #f56565;
}

.combo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: var(--bg-secondary);
}

.combo-icons {
  display: flex;
  gap: var(--spacing-xs);
}

.combo-icon {
  font-size: 1.2rem;
}

.combo-score {
  font-weight: 600;
  padding: 2px 8px;
  background: white;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
}

.combo-card.good .combo-score {
  color: #48bb78;
}

.combo-card.bad .combo-score {
  color: #f56565;
}

.combo-content {
  padding: var(--spacing-md);
}

.combo-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1rem;
}

.combo-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.combo-examples,
.combo-warning {
  margin-top: var(--spacing-sm);
  font-size: 0.8rem;
  color: var(--text-light);
}

.combo-warning {
  color: #f56565;
}

.combo-actions {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

/* Принципы сочетаемости */
.principles-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.principle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-lg);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  transition: transform var(--transition-fast);
}

.principle-item:hover {
  transform: translateY(-2px);
}

.principle-icon {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  margin-bottom: var(--spacing-md);
}

.principle-content h5 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 1rem;
}

.principle-content p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Адаптивность */
@media (max-width: 768px) {
  .food-inputs {
    grid-template-columns: 1fr;
  }

  .overall-rating {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-md);
  }

  .combinations-grid {
    grid-template-columns: 1fr;
  }

  .principles-list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .pair-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .pair-score {
    align-self: flex-end;
  }

  .principles-list {
    grid-template-columns: 1fr;
  }

  .check-form {
    gap: var(--spacing-md);
  }
}

/* Анимации */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.check-result {
  animation: slideUp 0.3s ease;
}

.combo-card {
  animation: slideUp 0.3s ease;
  animation-fill-mode: both;
}

.combo-card:nth-child(1) { animation-delay: 0.1s; }
.combo-card:nth-child(2) { animation-delay: 0.2s; }
.combo-card:nth-child(3) { animation-delay: 0.3s; }
.combo-card:nth-child(4) { animation-delay: 0.4s; }

.principle-item {
  animation: slideUp 0.3s ease;
  animation-fill-mode: both;
}

.principle-item:nth-child(1) { animation-delay: 0.1s; }
.principle-item:nth-child(2) { animation-delay: 0.2s; }
.principle-item:nth-child(3) { animation-delay: 0.3s; }
.principle-item:nth-child(4) { animation-delay: 0.4s; }

/* Улучшенная прокрутка */
.pairs-list::-webkit-scrollbar,
.combinations-grid::-webkit-scrollbar {
  width: 6px;
}

.pairs-list::-webkit-scrollbar-track,
.combinations-grid::-webkit-scrollbar-track {
  background: var(--bg-secondary);
  border-radius: 3px;
}

.pairs-list::-webkit-scrollbar-thumb,
.combinations-grid::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.pairs-list::-webkit-scrollbar-thumb:hover,
.combinations-grid::-webkit-scrollbar-thumb:hover {
  background: var(--text-light);
}

/* Микро-анимации для иконок */
.food-icon {
  transition: transform 0.2s ease;
}

.food-icon:hover {
  transform: scale(1.1);
}

.combo-icon {
  transition: transform 0.2s ease;
}

.combo-icon:hover {
  transform: scale(1.2);
}

.principle-icon {
  transition: all 0.3s ease;
}

.principle-item:hover .principle-icon {
  transform: rotate(5deg) scale(1.1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}
</style>