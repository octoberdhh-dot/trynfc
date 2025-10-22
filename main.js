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