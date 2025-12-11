// Функции для расчета питательности и баланса тарелки

/**
 * Рассчитывает суммарную питательность тарелки
 * @param {Array} plateItems - элементы тарелки [{foodId, amount}, ...]
 * @param {Object} foodsData - база продуктов
 * @returns {Object} - суммарные нутриенты
 */
export function calculatePlateNutrition(plateItems, foodsData) {
    const totals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0
    }

    plateItems.forEach(item => {
        const food = foodsData.foods.find(f => f.id === item.foodId)
        if (food) {
            const multiplier = item.amount / 100 // питательность на 100г
            totals.calories += food.nutrition.calories * multiplier
            totals.protein += food.nutrition.protein * multiplier
            totals.carbs += food.nutrition.carbs * multiplier
            totals.fat += food.nutrition.fat * multiplier
            totals.fiber += food.nutrition.fiber * multiplier
        }
    })

    // Округляем значения
    Object.keys(totals).forEach(key => {
        totals[key] = Math.round(totals[key] * 10) / 10
    })

    return totals
}

/**
 * Рассчитывает баланс тарелки по категориям (Гарвардская тарелка)
 * @param {Array} plateItems - элементы тарелки
 * @param {Object} foodsData - база продуктов
 * @returns {Object} - проценты по категориям
 */
export function calculatePlateBalance(plateItems, foodsData) {
    const categories = {
        vegetable: 0,
        protein: 0,
        carb: 0,
        other: 0
    }

    let totalAmount = 0

    plateItems.forEach(item => {
        const food = foodsData.foods.find(f => f.id === item.foodId)
        if (food) {
            const category = food.category
            if (categories[category] !== undefined) {
                categories[category] += item.amount
            } else {
                categories.other += item.amount
            }
            totalAmount += item.amount
        }
    })

    // Преобразуем в проценты
    const percentages = {}
    Object.keys(categories).forEach(category => {
        percentages[category] = totalAmount > 0
            ? Math.round((categories[category] / totalAmount) * 100)
            : 0
    })

    return percentages
}

/**
 * Проверяет соответствует ли тарелка идеалу Гарвардской тарелки
 * @param {Object} balance - баланс тарелки в процентах
 * @returns {Object} - оценка по каждой категории
 */
export function evaluateHarvardPlate(balance) {
    const ideal = {
        vegetable: 50,
        protein: 25,
        carb: 25
    }

    const evaluation = {}

    Object.keys(ideal).forEach(category => {
        const diff = Math.abs(balance[category] - ideal[category])
        if (diff <= 10) {
            evaluation[category] = { status: 'good', diff }
        } else if (diff <= 20) {
            evaluation[category] = { status: 'warning', diff }
        } else {
            evaluation[category] = { status: 'bad', diff }
        }
    })

    return evaluation
}

/**
 * Рассчитывает калорийность и макронутриенты для рецепта
 * @param {Array} ingredients - ингредиенты рецепта
 * @param {Object} foodsData - база продуктов
 * @returns {Object} - питательность рецепта
 */
export function calculateRecipeNutrition(ingredients, foodsData) {
    return calculatePlateNutrition(
        ingredients.map(ing => ({ foodId: ing.id, amount: ing.amount })),
        foodsData
    )
}

/**
 * Конвертирует единицы измерения
 * @param {number} amount - количество
 * @param {string} fromUnit - исходная единица
 * @param {string} toUnit - целевая единица
 * @returns {number} - конвертированное количество
 */
export function convertUnits(amount, fromUnit, toUnit) {
    const conversions = {
        'g': { 'kg': 0.001, 'ml': 1 },
        'kg': { 'g': 1000 },
        'ml': { 'l': 0.001, 'g': 1 },
        'l': { 'ml': 1000 },
        'piece': { 'g': 50 } // примерная конвертация
    }

    if (fromUnit === toUnit) return amount
    if (conversions[fromUnit] && conversions[fromUnit][toUnit]) {
        return amount * conversions[fromUnit][toUnit]
    }

    return amount // если конвертация неизвестна, возвращаем как есть
}

/**
 * Рассчитывает соотношение БЖУ в процентах от калорий
 * @param {Object} nutrition - объект с protein, carbs, fat (в граммах)
 * @returns {Object} - проценты БЖУ от калорий
 */
export function calculateMacroPercentages(nutrition) {
    // Калории на грамм: белки - 4 ккал, углеводы - 4 ккал, жиры - 9 ккал
    const proteinCals = nutrition.protein * 4
    const carbCals = nutrition.carbs * 4
    const fatCals = nutrition.fat * 9
    const totalCals = proteinCals + carbCals + fatCals

    return {
        protein: totalCals > 0 ? Math.round((proteinCals / totalCals) * 100) : 0,
        carbs: totalCals > 0 ? Math.round((carbCals / totalCals) * 100) : 0,
        fat: totalCals > 0 ? Math.round((fatCals / totalCals) * 100) : 0
    }
}

// Экспортируем все функции
export default {
    calculatePlateNutrition,
    calculatePlateBalance,
    evaluateHarvardPlate,
    calculateRecipeNutrition,
    convertUnits,
    calculateMacroPercentages
}