#!/bin/bash

# Скрипт для настройки проекта Harvard Plate

echo "🚀 Настройка проекта Harvard Plate"

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js 18+"
    exit 1
fi

echo "✅ Node.js установлен: $(node --version)"

# Проверка npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm не установлен"
    exit 1
fi

echo "✅ npm установлен: $(npm --version)"

# Установка зависимостей
echo "📦 Установка зависимостей..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Зависимости установлены"
else
    echo "❌ Ошибка установки зависимостей"
    exit 1
fi

# Создание необходимых папок
echo "📁 Создание структуры проекта..."
mkdir -p dist
mkdir -p .github/workflows
mkdir -p .github/ISSUE_TEMPLATE

echo "✅ Структура создана"

# Проверка конфигурации
echo "🔧 Проверка конфигурации..."
if [ ! -f "vite.config.js" ]; then
    echo "❌ Отсутствует vite.config.js"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ Отсутствует package.json"
    exit 1
fi

echo "✅ Конфигурация проверена"

# Создание .env файла
echo "🔐 Создание .env файла..."
if [ ! -f ".env" ]; then
    cat > .env << EOL
# Конфигурация Harvard Plate
VITE_APP_NAME="Harvard Plate"
VITE_APP_VERSION="1.0.0"
VITE_API_URL=""
VITE_GA_ID=""
EOL
    echo "✅ .env файл создан"
else
    echo "✅ .env файл уже существует"
fi

# Создание .env.example
echo "📝 Создание .env.example..."
cat > .env.example << EOL
# Конфигурация Harvard Plate
VITE_APP_NAME="Harvard Plate"
VITE_APP_VERSION="1.0.0"
VITE_API_URL=""
VITE_GA_ID=""
EOL

echo "🎉 Настройка завершена!"
echo ""
echo "Для запуска проекта выполните:"
echo "  npm run dev     # Запуск сервера разработки"
echo "  npm run build   # Сборка для production"
echo "  npm run preview # Предпросмотр сборки"
echo ""
echo "Приложение будет доступно по адресу: http://localhost:3000"