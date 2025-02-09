// Örnek veri
const stories = [
    {
        id: 1,
        username: 'gezgin',
        image: 'https://source.unsplash.com/100x100?travel',
        hasStory: true,
        viewed: false
    },
    {
        id: 2,
        username: 'fotografci',
        image: 'https://source.unsplash.com/100x100?camera',
        hasStory: true,
        viewed: false
    },
    {
        id: 3,
        username: 'tasarimci',
        image: 'https://source.unsplash.com/100x100?design',
        hasStory: true,
        viewed: true
    }
    // Daha fazla hikaye eklenebilir
];

const posts = [
    {
        id: 1,
        username: 'gezgin',
        userImage: 'https://source.unsplash.com/100x100?travel',
        location: 'Kapadokya, Türkiye',
        image: 'https://source.unsplash.com/1080x1080?cappadocia',
        likes: 1234,
        caption: 'Güneşin doğuşunu balonlarla karşılamak paha biçilemez 🎈 #kapadokya #seyahat',
        comments: [
            { username: 'fotografci', text: 'Muhteşem bir kare! 📸' },
            { username: 'tasarimci', text: 'Renkler harika!' }
        ],
        timestamp: '3 SAAT ÖNCE',
        isLiked: false,
        isSaved: false
    }
    // Daha fazla post eklenebilir
];

const suggestions = [
    {
        username: 'sanatci',
        image: 'https://source.unsplash.com/100x100?art',
        info: 'Senin için öneriliyor'
    }
    // Daha fazla öneri eklenebilir
];

// Hikayeleri yükle
function loadStories() {
    const storiesWrapper = document.querySelector('.stories-wrapper');
    if (!storiesWrapper) return;

    const storiesHTML = stories.map(story => `
        <div class="story-item" onclick="viewStory(${story.id})">
            <div class="story-avatar ${story.viewed ? 'viewed' : ''}">
                <img src="${story.image}" alt="${story.username}">
            </div>
            <span class="story-username">${story.username}</span>
        </div>
    `).join('');

    storiesWrapper.innerHTML = storiesHTML;
}

// Postları yükle
function loadPosts() {
    const postsContainer = document.querySelector('.posts-container');
    if (!postsContainer) return;

    const postsHTML = posts.map(post => `
        <article class="post">
            <div class="post-header">
                <div class="post-user-info">
                    <div class="post-avatar">
                        <img src="${post.userImage}" alt="${post.username}">
                    </div>
                    <div>
                        <h6>${post.username}</h6>
                        <span class="post-location">${post.location}</span>
                    </div>
                </div>
                <button class="action-button">
                    <i class="fas fa-ellipsis"></i>
                </button>
            </div>
            <div class="post-content" ondblclick="likePost(${post.id})">
                <img src="${post.image}" alt="Post">
            </div>
            <div class="post-actions">
                <div class="action-buttons">
                    <div class="action-buttons-left">
                        <button class="action-button ${post.isLiked ? 'liked' : ''}" onclick="likePost(${post.id})">
                            <i class="fa${post.isLiked ? 's' : 'r'} fa-heart"></i>
                        </button>
                        <button class="action-button" onclick="showComments(${post.id})">
                            <i class="far fa-comment"></i>
                        </button>
                        <button class="action-button">
                            <i class="far fa-paper-plane"></i>
                        </button>
                    </div>
                    <button class="action-button" onclick="savePost(${post.id})">
                        <i class="fa${post.isSaved ? 's' : 'r'} fa-bookmark"></i>
                    </button>
                </div>
                <div class="likes">
                    <strong>${post.likes.toLocaleString()} beğenme</strong>
                </div>
                <div class="caption">
                    <strong>${post.username}</strong> ${post.caption}
                </div>
                <button class="view-comments" onclick="showComments(${post.id})">
                    ${post.comments.length} yorumun tümünü gör
                </button>
                <span class="timestamp">${post.timestamp}</span>
            </div>
            <div class="post-comment">
                <input type="text" placeholder="Yorum ekle..." class="comment-input">
                <button class="post-comment-btn">Paylaş</button>
            </div>
        </article>
    `).join('');

    postsContainer.innerHTML = postsHTML;
}

// Önerileri yükle
function loadSuggestions() {
    const suggestionsList = document.querySelector('.suggestions-list');
    if (!suggestionsList) return;

    const suggestionsHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <div class="suggestion-info">
                <img src="${suggestion.image}" alt="${suggestion.username}" class="suggestion-avatar">
                <div>
                    <h6>${suggestion.username}</h6>
                    <small>${suggestion.info}</small>
                </div>
            </div>
            <button class="btn btn-primary btn-sm">Takip Et</button>
        </div>
    `).join('');

    suggestionsList.innerHTML = suggestionsHTML;
}

// Post beğenme
function likePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
        loadPosts();
    }
}

// Post kaydetme
function savePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.isSaved = !post.isSaved;
        loadPosts();
    }
}

// Hikaye görüntüleme
function viewStory(storyId) {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const storyModal = new bootstrap.Modal(document.getElementById('storyModal'));
    const storyContent = document.querySelector('.story-content img');
    const storyUsername = document.querySelector('.story-user-info h6');
    
    storyContent.src = story.image;
    storyUsername.textContent = story.username;
    story.viewed = true;
    
    storyModal.show();
    startStoryProgress();
}

// Hikaye progress
function startStoryProgress() {
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        const storyModal = bootstrap.Modal.getInstance(document.getElementById('storyModal'));
        storyModal?.hide();
    }, 5000);
}

// Yeni gönderi oluşturma
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imagePreview = document.getElementById('imagePreview');
        const img = imagePreview.querySelector('img');
        
        imagePreview.classList.remove('d-none');
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadStories();
    loadPosts();
    loadSuggestions();

    // Resim yükleme olayını dinle
    const postImageInput = document.getElementById('postImage');
    if (postImageInput) {
        postImageInput.addEventListener('change', handleImageUpload);
    }
});

// Double-click like özelliği
document.addEventListener('dblclick', (e) => {
    const postContent = e.target.closest('.post-content');
    if (postContent) {
        const post = postContent.closest('.post');
        const postId = parseInt(post.dataset.postId);
        likePost(postId);
    }
});