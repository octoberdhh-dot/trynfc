document.addEventListener('DOMContentLoaded', () => {
    // تهيئة البيانات
    initializeStory();
    createHearts();
    
    // تحديث المدة كل يوم
    updateDuration();
    setInterval(updateDuration, 86400000); // تحديث كل 24 ساعة
});

function initializeStory() {
    // Hero Section
    document.getElementById('coupleNames').textContent = storyData.couple_names;
    document.getElementById('storyTitle').textContent = storyData.story_title;
    
    // Story Section
    const storyText = document.getElementById('storyText');
    storyData.love_story.split('\n').forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        storyText.appendChild(p);
    });
    
    // Timeline
    renderTimeline();
    
    // Gallery
    renderGallery();
    
    // Favorites
    document.getElementById('favoriteSong').textContent = storyData.favorite_song;
    document.getElementById('meetingPlace').textContent = storyData.meeting_place;
    document.getElementById('favoriteFood').textContent = storyData.favorite_food;
    document.getElementById('favoriteMovie').textContent = storyData.favorite_movie;
    
    // Future Message
    document.getElementById('futureMessage').textContent = storyData.future_message;
}

function createHearts() {
    const container = document.getElementById('heartsContainer');
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(heart);
    }
}

function updateDuration() {
    const start = new Date(storyData.relationship_start);
    const now = new Date();
    const months = (now.getFullYear() - start.getFullYear()) * 12 + 
                  (now.getMonth() - start.getMonth());
    document.getElementById('duration').textContent = months;
}

function renderTimeline() {
    const container = document.getElementById('timelineContainer');
    storyData.special_moments.forEach((moment, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="moment-header">
                <span class="emoji">${moment.emoji}</span>
                <div>
                    <h3>${moment.title}</h3>
                    <small>${moment.date}</small>
                </div>
            </div>
            <p>${moment.description}</p>
        `;
        container.appendChild(item);
    });
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    storyData.photos.forEach((photo, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.textContent = photo.emoji;
        grid.appendChild(item);
    });
}

// تعريف المتغيرات العامة
let slides = [];
let currentSlide = 0;
let currentPage = 'slider';

// تحميل البيانات المحفوظة
function loadSlides() {
    const savedSlides = localStorage.getItem('sliderData');
    if (savedSlides) {
        slides = JSON.parse(savedSlides);
    } else {
        // البيانات الافتراضية إذا لم يكن هناك بيانات محفوظة
        slides = [{
            title: "السلايد الأول",
            text: "أضف وصفاً هنا",
            image: "",
            bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
        }];
        // حفظ البيانات الافتراضية
        localStorage.setItem('sliderData', JSON.stringify(slides));
    }
    renderSlides();
}

// حفظ التغييرات
function saveChanges() {
    // تحديث البيانات من النموذج
    slides = slides.map((slide, index) => ({
        title: document.getElementById(`title${index}`).value,
        text: document.getElementById(`text${index}`).value,
        image: document.getElementById(`preview${index}`).src || '',
        bg: slide.bg
    }));

    // حفظ في localStorage
    localStorage.setItem('sliderData', JSON.stringify(slides));
    
    // عرض رسالة النجاح
    const msg = document.getElementById('successMessage');
    msg.classList.add('show');
    setTimeout(() => msg.classList.remove('show'), 3000);
    
    renderSlides();
}

// معالجة رفع الصور
function handleImageUpload(index, event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById(`preview${index}`);
            preview.src = e.target.result;
            preview.classList.add('show');
            slides[index].image = e.target.result;
            // حفظ مباشر بعد رفع الصورة
            localStorage.setItem('sliderData', JSON.stringify(slides));
        };
        reader.readAsDataURL(file);
    }
}

// عرض السلايدر
function renderSlides() {
    const slider = document.getElementById('slider');
    const dots = document.getElementById('dots');
    
    slider.innerHTML = '';
    dots.innerHTML = '';

    slides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `slide ${index === currentSlide ? 'active' : ''}`;
        
        if (slide.image) {
            slideDiv.style.backgroundImage = `url(${slide.image})`;
        } else {
            slideDiv.style.background = slide.bg;
        }
        
        slideDiv.innerHTML = `
            <div class="slide-content">
                <h2>${slide.title}</h2>
                <p>${slide.text}</p>
            </div>
        `;
        slider.appendChild(slideDiv);

        const dot = document.createElement('span');
        dot.className = `dot ${index === currentSlide ? 'active' : ''}`;
        dot.onclick = () => goToSlide(index);
        dots.appendChild(dot);
    });
}

// عرض لوحة التحرير
function renderEditPanel() {
    const editorsDiv = document.getElementById('slideEditors');
    editorsDiv.innerHTML = '';

    slides.forEach((slide, index) => {
        const editor = document.createElement('div');
        editor.className = 'slide-editor';
        editor.innerHTML = `
            <h4>السلايد ${index + 1}</h4>
            <div class="form-group">
                <label>العنوان:</label>
                <input type="text" id="title${index}" value="${slide.title}">
            </div>
            <div class="form-group">
                <label>الوصف:</label>
                <textarea id="text${index}">${slide.text}</textarea>
            </div>
            <div class="form-group">
                <label>الصورة:</label>
                <div class="image-upload-area" onclick="document.getElementById('imageInput${index}').click()">
                    <p>اضغط هنا لرفع صورة</p>
                    <input type="file" id="imageInput${index}" accept="image/*" style="display: none" onchange="handleImageUpload(${index}, event)">
                </div>
                <img id="preview${index}" class="image-preview ${slide.image ? 'show' : ''}" src="${slide.image}">
            </div>
            ${slides.length > 1 ? `<button onclick="deleteSlide(${index})">🗑️ حذف السلايد</button>` : ''}
        `;
        editorsDiv.appendChild(editor);
    });
}

// التنقل بين الصفحات
function showPage(pageName) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(pageName + 'Page').classList.add('active');
    document.querySelector(`[onclick="showPage('${pageName}')"]`).classList.add('active');

    currentPage = pageName;

    if (pageName === 'slider') {
        renderSlides();
    } else if (pageName === 'edit') {
        renderEditPanel();
    }
}

// إضافة سلايد جديد
function addNewSlide() {
    slides.push({
        title: "سلايد جديد",
        text: "أضف وصفاً هنا",
        image: "",
        bg: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)"
    });
    localStorage.setItem('sliderData', JSON.stringify(slides));
    renderEditPanel();
}

// حذف سلايد
function deleteSlide(index) {
    if (slides.length > 1 && confirm('هل أنت متأكد من حذف هذا السلايد؟')) {
        slides.splice(index, 1);
        if (currentSlide >= slides.length) {
            currentSlide = slides.length - 1;
        }
        localStorage.setItem('sliderData', JSON.stringify(slides));
        renderEditPanel();
        renderSlides();
    }
}

// التنقل بين السلايدات
function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    renderSlides();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    renderSlides();
}

function goToSlide(index) {
    currentSlide = index;
    renderSlides();
}

// التبديل التلقائي
setInterval(() => {
    if (currentPage === 'slider') {
        nextSlide();
    }
}, 5000);

// تهيئة الموقع عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    loadSlides();
});