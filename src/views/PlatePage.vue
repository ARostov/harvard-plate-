<!-- views/PlatePage.vue -->
<template>
  <div class="plate-page">
    <div class="page-header">
      <h2><i class="fas fa-utensils"></i> Конструктор тарелки</h2>
      <p class="subtitle">Соберите идеальную тарелку по принципам Гарвардского питания</p>
    </div>

    <Plate />

    <!-- Анализ тарелки (пока оставляем как было, потом тоже вынесем в компонент) -->
    <div class="plate-analysis card">
      <h3><i class="fas fa-chart-line"></i> Анализ вашей тарелки</h3>

      <div class="analysis-section">
        <h4>Баланс по Гарвардской тарелке</h4>
        <div class="balance-indicators">
          <div class="balance-item good">
            <div class="balance-label">Овощи и фрукты</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: '50%' }"></div>
            </div>
            <div class="balance-value">Цель: 50%</div>
          </div>
          <div class="balance-item good">
            <div class="balance-label">Белки</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: '25%' }"></div>
            </div>
            <div class="balance-value">Цель: 25%</div>
          </div>
          <div class="balance-item good">
            <div class="balance-label">Углеводы</div>
            <div class="balance-bar">
              <div class="balance-fill" :style="{ width: '25%' }"></div>
            </div>
            <div class="balance-value">Цель: 25%</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Plate from '../components/Plate/Plate.vue'
</script>

<style scoped>
.plate-page {
  padding: var(--spacing-lg) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.page-header h2 {
  color: var(--primary-color);
  margin-bottom: var(--spacing-sm);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
}

.plate-analysis {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
}

.analysis-section {
  margin-bottom: var(--spacing-lg);
}

.balance-indicators {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.balance-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border-left: 4px solid var(--success-color);
}

.balance-label {
  font-weight: 500;
  margin-bottom: var(--spacing-xs);
}

.balance-bar {
  height: 10px;
  background: var(--border-color);
  border-radius: 5px;
  margin: var(--spacing-sm) 0;
  overflow: hidden;
}

.balance-fill {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.5s ease;
}

.balance-value {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
</style>