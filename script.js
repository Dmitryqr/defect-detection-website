// Конфигурация для GitHub Pages
const IS_GITHUB_PAGES = window.location.hostname.includes('github.io');

// Глобальные переменные
let currentImage = null;

// Демо-режим для GitHub (без бэкенда)
const DEMO_MODE = true;

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Defect Detector loaded on:', window.location.hostname);
    
    // Настройка ссылок для GitHub Pages
    if (IS_GITHUB_PAGES) {
        console.log('🌐 Running on GitHub Pages');
        setupGitHubLinks();
    }
    
    // Инициализация страницы
    initPage();
});

// Настройка ссылок для GitHub
function setupGitHubLinks() {
    // Убедимся, что все внутренние ссылки работают правильно
    const links = document.querySelectorAll('a[href^="./"], a[href^="/"]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href.startsWith('./')) {
            // Для GitHub Pages убираем точки, если нужно
            link.setAttribute('href', href.replace('./', ''));
        }
    });
}

// Инициализация страницы
function initPage() {
    const path = window.location.pathname;
    
    if (path.includes('upload.html') || path.endsWith('upload.html')) {
        initUploadPage();
    } else if (path.includes('results.html') || path.endsWith('results.html')) {
        initResultsPage();
    } else {
        initHomePage();
    }
}

// Инициализация главной страницы
function initHomePage() {
    // Анимация статистики
    animateStats();
}

// Инициализация страницы загрузки
function initUploadPage() {
    setupFileUpload();
    
    // Демо-данные для примера
    if (DEMO_MODE) {
        document.getElementById('demoModeBadge')?.removeAttribute('hidden');
    }
}

// Инициализация страницы результатов
function initResultsPage() {
    // Загружаем демо-данные для GitHub Pages
    if (DEMO_MODE) {
        loadDemoResults();
    }
    
    // Инициализация графиков
    initCharts();
}

// Настройка загрузки файлов
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadArea || !fileInput) return;
    
    // Drag & Drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    });
    
    // Клик
    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file);
    });
}

// Обработка выбора файла
function handleFileSelect(file) {
    if (!validateFile(file)) return;
    
    currentImage = file;
    showPreview(file);
    
    // Прокрутка к превью
    document.getElementById('previewContainer')?.scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Валидация файла
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (!validTypes.includes(file.type)) {
        alert('❌ Поддерживаются только JPG, PNG, BMP, WebP форматы');
        return false;
    }
    
    if (file.size > maxSize) {
        alert('❌ Файл слишком большой (макс. 10MB)');
        return false;
    }
    
    return true;
}

// Показ превью
function showPreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const previewContainer = document.getElementById('previewContainer');
        const previewImg = document.getElementById('previewImage');
        
        if (previewContainer) previewContainer.style.display = 'block';
        if (previewImg) previewImg.src = e.target.result;
        
        // Обновляем информацию о файле
        updateFileInfo(file);
    };
    reader.readAsDataURL(file);
}

// Обновление информации о файле
function updateFileInfo(file) {
    const elements = {
        'fileName': file.name,
        'fileSize': formatFileSize(file.size),
        'fileType': getFileType(file.type)
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    });
}

// Имитация анализа для GitHub Pages
function simulateAnalysis() {
    if (!currentImage && DEMO_MODE) {
        // Используем демо-изображение
        currentImage = {
            name: 'demo-image.jpg',
            size: 1024 * 1024,
            type: 'image/jpeg'
        };
    }
    
    if (!currentImage) {
        alert('⚠️ Пожалуйста, сначала выберите изображение');
        return;
    }
    
    // Показываем прогресс
    const progressContainer = document.getElementById('progressContainer');
    if (progressContainer) progressContainer.style.display = 'block';
    
    // Запускаем симуляцию анализа
    startProgressSimulation(() => {
        // Сохраняем данные для results.html
        const reader = new FileReader();
        reader.onload = function(e) {
            // Сохраняем в sessionStorage для передачи на другую страницу
            sessionStorage.setItem('analyzedImage', e.target.result);
            sessionStorage.setItem('fileName', currentImage.name);
            
            // Переход на страницу результатов
            window.location.href = 'results.html';
        };
        
        if (currentImage instanceof File) {
            reader.readAsDataURL(currentImage);
        } else {
            // Демо-изображение
            sessionStorage.setItem('analyzedImage', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5');
            sessionStorage.setItem('fileName', 'demo-image.jpg');
            setTimeout(() => {
                window.location.href = 'results.html';
            }, 500);
        }
    });
}

// Симуляция прогресса анализа
function startProgressSimulation(callback) {
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const steps = [
        'Загрузка изображения...',
        'Предварительная обработка...',
        'Анализ нейронной сетью...',
        'Постобработка результатов...',
        'Генерация отчета...'
    ];
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        const stepIndex = Math.floor(progress / 20) - 1;
        if (stepIndex >= 0 && stepIndex < steps.length && progressText) {
            progressText.textContent = steps[stepIndex];
        }
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(callback, 500);
        }
    }, 300);
}

// Загрузка демо-результатов
function loadDemoResults() {
    // Получаем данные из sessionStorage
    const imageData = sessionStorage.getItem('analyzedImage');
    const fileName = sessionStorage.getItem('fileName') || 'demo-image.jpg';
    
    // Устанавливаем изображение
    const originalImg = document.getElementById('originalImage');
    if (originalImg) {
        originalImg.src = imageData || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5';
    }
    
    // Устанавливаем имя файла
    const fileNameEl = document.getElementById('resultFileName');
    if (fileNameEl) fileNameEl.textContent = fileName;
    
    // Генерируем демо-результаты
    generateDemoResults();
}

// Генерация демо-результатов
function generateDemoResults() {
    // Демо-данные
    const demoData = {
        defects: [
            { type: 'crack', count: 3, severity: 'high' },
            { type: 'corrosion', count: 2, severity: 'medium' }
        ],
        stats: {
            totalArea: '15.2 см²',
            confidence: '96.7%',
            processingTime: '2.3 сек'
        }
    };
    
    // Обновляем UI
    updateResultsUI(demoData);
}

// Инициализация графиков
function initCharts() {
    if (typeof Chart === 'undefined') return;
    
    // График распределения дефектов
    const defectsCtx = document.getElementById('defectsChart');
    if (defectsCtx) {
        new Chart(defectsCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Трещины', 'Коррозия', 'Норма'],
                datasets: [{
                    data: [45, 30, 25],
                    backgroundColor: ['#ff6b6b', '#4dabf7', '#51cf66'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Утилиты
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFileType(mimeType) {
    const types = {
        'image/jpeg': 'JPEG Image',
        'image/png': 'PNG Image',
        'image/bmp': 'BMP Image',
        'image/webp': 'WebP Image'
    };
    return types[mimeType] || 'Unknown';
}

// Экспорт функций для использования в HTML
window.simulateAnalysis = simulateAnalysis;
window.handleFileSelect = handleFileSelect;
window.setupGitHubLinks = setupGitHubLinks;
