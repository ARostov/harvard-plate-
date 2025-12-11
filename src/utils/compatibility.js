// Функции для проверки сочетаемости продуктов

/**
 * Проверяет сочетаемость двух продуктов
 * @param {string} foodId1 - ID первого продукта
 * @param {string} foodId2 - ID второго продукта
 * @param {Object} compatibilityData - данные о сочетаемости
 * @returns {Object} - результат проверки
 */
export function checkFoodCompatibility(foodId1, foodId2, compatibilityData) {
    // Если это один и тот же продукт
    if (foodId1 === foodId2) {
        return {
            compatible: true,
            score: 8,
            reason: "Один и тот же продукт",
            type: "same"
        }
    }

    // Ищем в хороших сочетаниях
    const goodMatch = compatibilityData.good_combinations.find(combo =>
        (combo.foods.includes(foodId1) && combo.foods.includes(foodId2))
    )

    if (goodMatch) {
        return {
            compatible: true,
            score: goodMatch.score,
            reason: goodMatch.reason,
            examples: goodMatch.examples,
            type: "good"
        }
    }

    // Ищем в плохих сочетаниях
    const badMatch = compatibilityData.bad_combinations.find(combo =>
        (combo.foods.includes(foodId1) && combo.foods.includes(foodId2))
    )

    if (badMatch) {
        return {
            compatible: false,
            score: badMatch.score,
            reason: badMatch.reason,
            warning: badMatch.warning,
            type: "bad"
        }
    }

    // Если нет явного правила
    return {
        compatible: null,
        score: 5,
        reason: "Неизвестное сочетание",
        type: "unknown"
    }
}

/**
 * Проверяет сочетаемость всех продуктов на тарелке
 * @param {Array} plateItems - элементы тарелки
 * @param {Object} compatibilityData - данные о сочетаемости
 * @returns {Object} - общая оценка сочетаемости
 */
export function checkPlateCompatibility(plateItems, compatibilityData) {
    if (plateItems.length < 2) {
        return {
            overallScore: 10,
            compatible: true,
            pairs: [],
            message: "Добавьте больше продуктов для проверки сочетаемости"
        }
    }

    const pairs = []
    let totalScore = 0
    let compatiblePairs = 0
    let incompatiblePairs = 0

    // Проверяем все пары продуктов
    for (let i = 0; i < plateItems.length; i++) {
        for (let j = i + 1; j < plateItems.length; j++) {
            const result = checkFoodCompatibility(
                plateItems[i].foodId,
                plateItems[j].foodId,
                compatibilityData
            )

            pairs.push({
                food1: plateItems[i].foodId,
                food2: plateItems[j].foodId,
                ...result
            })

            totalScore += result.score

            if (result.compatible === true) compatiblePairs++
            if (result.compatible === false) incompatiblePairs++
        }
    }

    const pairCount = pairs.length
    const overallScore = pairCount > 0 ? Math.round(totalScore / pairCount) : 0

    // Определяем общую совместимость
    let overallCompatible
    let message

    if (incompatiblePairs > 0) {
        overallCompatible = false
        message = "Найдены плохо сочетаемые продукты"
    } else if (compatiblePairs === pairCount) {
        overallCompatible = true
        message = "Все продукты хорошо сочетаются"
    } else {
        overallCompatible = null
        message = "Смешанная сочетаемость продуктов"
    }

    return {
        overallScore,
        overallCompatible,
        pairs,
        compatiblePairs,
        incompatiblePairs,
        totalPairs: pairCount,
        message
    }
}

/**
 * Предлагает продукты, которые хорошо сочетаются с выбранными
 * @param {Array} selectedFoods - выбранные продукты
 * @param {Object} compatibilityData - данные о сочетаемости
 * @param {Object} foodsData - база продуктов
 * @returns {Array} - рекомендуемые продукты
 */
export function suggestCompatibleFoods(selectedFoods, compatibilityData, foodsData) {
    if (selectedFoods.length === 0) {
        // Если ничего не выбрано, предлагаем популярные сочетания
        return foodsData.foods.slice(0, 5)
    }

    const suggestions = []
    const usedFoods = new Set(selectedFoods)

    // Ищем продукты, которые хорошо сочетаются со всеми выбранными
    foodsData.foods.forEach(food => {
        if (!usedFoods.has(food.id)) {
            let totalScore = 0
            let count = 0

            selectedFoods.forEach(selectedFood => {
                const compatibility = checkFoodCompatibility(
                    selectedFood,
                    food.id,
                    compatibilityData
                )

                if (compatibility.score >= 7) {
                    totalScore += compatibility.score
                    count++
                }
            })

            if (count > 0) {
                const avgScore = totalScore / count
                suggestions.push({
                    ...food,
                    compatibilityScore: avgScore,
                    matches: count
                })
            }
        }
    })

    // Сортируем по совместимости
    return suggestions
        .sort((a, b) => {
            if (b.compatibilityScore !== a.compatibilityScore) {
                return b.compatibilityScore - a.compatibilityScore
            }
            return b.matches - a.matches
        })
        .slice(0, 10)
}

/**
 * Проверяет сочетаемость по категориям
 * @param {Array} plateItems - элементы тарелки
 * @param {Object} foodsData - база продуктов
 * @param {Object} compatibilityData - данные о сочетаемости
 * @returns {Object} - оценка по категориям
 */
export function checkCategoryCompatibility(plateItems, foodsData, compatibilityData) {
    const categories = plateItems.map(item => {
        const food = foodsData.foods.find(f => f.id === item.foodId)
        return food ? food.category : 'other'
    })

    const categoryRules = compatibilityData.categories_compatibility
    const issues = []

    // Проверяем каждую пару категорий
    for (let i = 0; i < categories.length; i++) {
        for (let j = i + 1; j < categories.length; j++) {
            const cat1 = categories[i]
            const cat2 = categories[j]

            if (categoryRules[cat1] && !categoryRules[cat1].includes(cat2)) {
                issues.push({
                    categories: [cat1, cat2],
                    message: `${cat1} плохо сочетается с ${cat2}`
                })
            }
        }
    }

    return {
        hasIssues: issues.length > 0,
        issues,
        categoryCount: categories.reduce((acc, cat) => {
            acc[cat] = (acc[cat] || 0) + 1
            return acc
        }, {})
    }
}

/**
 * Генерирует рекомендации по улучшению сочетаемости
 * @param {Array} plateItems - элементы тарелки
 * @param {Object} compatibilityData - данные о сочетаемости
 * @param {Object} foodsData - база продуктов
 * @returns {Array} - рекомендации
 */
export function generateCompatibilityRecommendations(plateItems, compatibilityData, foodsData) {
    const recommendations = []
    const compatibility = checkPlateCompatibility(plateItems, compatibilityData)

    // Рекомендации на основе плохих сочетаний
    compatibility.pairs.forEach(pair => {
        if (pair.compatible === false) {
            recommendations.push({
                type: 'warning',
                message: `⚠️ ${pair.food1} и ${pair.food2} плохо сочетаются`,
                reason: pair.reason,
                suggestion: `Попробуйте заменить один из продуктов`
            })
        }
    })

    // Рекомендации на основе категорий
    const categoryCheck = checkCategoryCompatibility(plateItems, foodsData, compatibilityData)
    if (categoryCheck.hasIssues) {
        categoryCheck.issues.forEach(issue => {
            recommendations.push({
                type: 'info',
                message: `ℹ️  Обратите внимание на сочетание категорий`,
                reason: issue.message,
                suggestion: `Добавьте продукты-посредники`
            })
        })
    }

    // Общие рекомендации
    if (compatibility.overallScore >= 8) {
        recommendations.push({
            type: 'success',
            message: '✅ Отличное сочетание продуктов!',
            suggestion: 'Тарелка хорошо сбалансирована'
        })
    } else if (compatibility.overallScore >= 6) {
        recommendations.push({
            type: 'info',
            message: '📝 Хорошее сочетание, но есть что улучшить',
            suggestion: 'Добавьте травы или специи для гармонии вкусов'
        })
    }

    return recommendations
}

// Экспортируем все функции
export default {
    checkFoodCompatibility,
    checkPlateCompatibility,
    suggestCompatibleFoods,
    checkCategoryCompatibility,
    generateCompatibilityRecommendations
}