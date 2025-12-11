// Утилиты для работы с хранилищем данных

const STORAGE_KEYS = {
    PLATES: 'harvard_plate_saved_plates',
    USER_PREFERENCES: 'harvard_plate_user_prefs',
    FOODS_CACHE: 'harvard_plate_foods_cache',
    LAST_SYNC: 'harvard_plate_last_sync'
}

/**
 * Сохраняет данные в localStorage
 * @param {string} key - ключ
 * @param {any} data - данные
 */
export function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data))
        return true
    } catch (error) {
        console.error('Ошибка сохранения в localStorage:', error)
        return false
    }
}

/**
 * Загружает данные из localStorage
 * @param {string} key - ключ
 * @param {any} defaultValue - значение по умолчанию
 */
export function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : defaultValue
    } catch (error) {
        console.error('Ошибка загрузки из localStorage:', error)
        return defaultValue
    }
}

/**
 * Сохраняет тарелку в localStorage
 * @param {Object} plate - объект тарелки
 */
export function savePlate(plate) {
    const plates = loadFromLocalStorage(STORAGE_KEYS.PLATES, [])

    // Добавляем ID и дату создания, если их нет
    if (!plate.id) {
        plate.id = `plate_${Date.now()}`
        plate.createdAt = new Date().toISOString()
    }

    plate.updatedAt = new Date().toISOString()

    // Проверяем, существует ли уже тарелка с таким ID
    const existingIndex = plates.findIndex(p => p.id === plate.id)

    if (existingIndex >= 0) {
        // Обновляем существующую
        plates[existingIndex] = plate
    } else {
        // Добавляем новую
        plates.push(plate)
    }

    saveToLocalStorage(STORAGE_KEYS.PLATES, plates)
    return plate
}

/**
 * Загружает сохраненные тарелки
 */
export function loadPlates() {
    return loadFromLocalStorage(STORAGE_KEYS.PLATES, [])
}

/**
 * Удаляет тарелку
 * @param {string} plateId - ID тарелки
 */
export function deletePlate(plateId) {
    const plates = loadPlates()
    const filteredPlates = plates.filter(plate => plate.id !== plateId)
    saveToLocalStorage(STORAGE_KEYS.PLATES, filteredPlates)
    return filteredPlates
}

/**
 * Сохраняет пользовательские настройки
 * @param {Object} preferences - настройки
 */
export function saveUserPreferences(preferences) {
    const current = loadUserPreferences()
    const updated = { ...current, ...preferences, updatedAt: new Date().toISOString() }
    saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, updated)
    return updated
}

/**
 * Загружает пользовательские настройки
 */
export function loadUserPreferences() {
    return loadFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES, {
        theme: 'light',
        language: 'ru',
        showNutrition: true,
        showCompatibility: true,
        notifications: true,
        createdAt: new Date().toISOString()
    })
}

/**
 * Кэширует данные продуктов
 * @param {Object} foodsData - данные продуктов
 */
export function cacheFoodsData(foodsData) {
    saveToLocalStorage(STORAGE_KEYS.FOODS_CACHE, {
        data: foodsData,
        timestamp: Date.now()
    })
}

/**
 * Загружает кэшированные данные продуктов
 * @param {number} maxAge - максимальный возраст кэша в миллисекундах
 */
export function loadCachedFoodsData(maxAge = 24 * 60 * 60 * 1000) { // 24 часа по умолчанию
    const cached = loadFromLocalStorage(STORAGE_KEYS.FOODS_CACHE)

    if (!cached || !cached.data || !cached.timestamp) {
        return null
    }

    const age = Date.now() - cached.timestamp
    if (age > maxAge) {
        // Кэш устарел
        return null
    }

    return cached.data
}

/**
 * Экспортирует все данные пользователя в JSON
 */
export function exportUserData() {
    const data = {
        plates: loadPlates(),
        preferences: loadUserPreferences(),
        exportedAt: new Date().toISOString(),
        version: '1.0'
    }

    return {
        data,
        json: JSON.stringify(data, null, 2),
        filename: `harvard-plate-backup-${new Date().toISOString().split('T')[0]}.json`
    }
}

/**
 * Импортирует данные пользователя из JSON
 * @param {string} jsonString - JSON строка с данными
 */
export function importUserData(jsonString) {
    try {
        const data = JSON.parse(jsonString)

        // Проверяем структуру данных
        if (!data.plates || !Array.isArray(data.plates)) {
            throw new Error('Неверный формат данных')
        }

        // Сохраняем данные
        saveToLocalStorage(STORAGE_KEYS.PLATES, data.plates)

        if (data.preferences) {
            saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, data.preferences)
        }

        return { success: true, count: data.plates.length }
    } catch (error) {
        console.error('Ошибка импорта данных:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Очищает все данные пользователя
 */
export function clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key)
    })

    return { success: true }
}

// GitHub Gist интеграция (для будущего использования)
export class GistStorage {
    constructor(token) {
        this.token = token
        this.gistId = null
    }

    async initialize() {
        // TODO: Реализовать инициализацию Gist
        console.log('Gist storage initialized (not implemented yet)')
        return this
    }

    async save(data) {
        // TODO: Реализовать сохранение в Gist
        console.log('Saving to Gist (not implemented yet)', data)
        return { success: true }
    }

    async load() {
        // TODO: Реализовать загрузку из Gist
        console.log('Loading from Gist (not implemented yet)')
        return null
    }
}

// Экспортируем все функции и классы
export default {
    STORAGE_KEYS,
    saveToLocalStorage,
    loadFromLocalStorage,
    savePlate,
    loadPlates,
    deletePlate,
    saveUserPreferences,
    loadUserPreferences,
    cacheFoodsData,
    loadCachedFoodsData,
    exportUserData,
    importUserData,
    clearAllData,
    GistStorage
}