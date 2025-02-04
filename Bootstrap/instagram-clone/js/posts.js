// posts.js
class PostsComponent {
    constructor() {
        this.currentPage = 1;
        this.isLoading = false;
        this.initializePosts();
    }
 
    initializePosts() {
        this.setupPostInteractions();
        this.setupImageCarousels();
    }
 
    setupPostInteractions() {
        document.querySelectorAll('.post').forEach(post => {
            // Like button
            const likeBtn = post.querySelector('.like-button');
            likeBtn?.addEventListener('click', () => this.handleLike(post));
 
            // Double tap to like
            let lastTap = 0;
            post.addEventListener('touchstart', e => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    this.handleLike(post);
                }
                lastTap = currentTime;
            });
 
            // Comments
            const commentForm = post.querySelector('.comment-form');
            commentForm?.addEventListener('submit', e => {
                e.preventDefault();
                this.handleComment(post);
            });
 
            // Share
            const shareBtn = post.querySelector('.share-button');
            shareBtn?.addEventListener('click', () => this.handleShare(post));
        });
    }
 
    setupImageCarousels() {
        document.querySelectorAll('.post-carousel').forEach(carousel => {
            const images = carousel.querySelectorAll('img');
            const dotsContainer = carousel.querySelector('.carousel-dots');
            let currentIndex = 0;
 
            // Create dots
            images.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
                dotsContainer?.appendChild(dot);
            });
 
            // Navigation
            const prevBtn = carousel.querySelector('.carousel-prev');
            const nextBtn = carousel.querySelector('.carousel-next');
 
            prevBtn?.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    this.updateCarousel(carousel, currentIndex);
                }
            });
 
            nextBtn?.addEventListener('click', () => {
                if (currentIndex < images.length - 1) {
                    currentIndex++;
                    this.updateCarousel(carousel, currentIndex);
                }
            });
        });
    }
 
    updateCarousel(carousel, index) {
        const container = carousel.querySelector('.carousel-container');
        container.style.transform = `translateX(-${index * 100}%)`;
 
        // Update dots
        carousel.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
 
    handleLike(post) {
        const likeBtn = post.querySelector('.like-button');
        const likeCount = post.querySelector('.like-count');
        const isLiked = likeBtn.classList.toggle('active');
 
        if (isLiked) {
            this.showLikeAnimation(post);
            likeCount.textContent = parseInt(likeCount.textContent) + 1;
        } else {
            likeCount.textContent = parseInt(likeCount.textContent) - 1;
        }
    }
 
    showLikeAnimation(post) {
        const heart = document.createElement('div');
        heart.className = 'like-animation';
        heart.innerHTML = '<i class="fas fa-heart"></i>';
        post.appendChild(heart);
 
        heart.addEventListener('animationend', () => heart.remove());
    }
 
    handleComment(post) {
        const input = post.querySelector('.comment-input');
        const text = input.value.trim();
        
        if (text) {
            this.addComment(post, {
                username: 'currentUser',
                text: text,
                timestamp: new Date()
            });
            input.value = '';
        }
    }
 
    addComment(post, comment) {
        const commentsContainer = post.querySelector('.comments-container');
        const commentEl = document.createElement('div');
        commentEl.className = 'comment';
        commentEl.innerHTML = `
            <span class="comment-username">${comment.username}</span>
            <span class="comment-text">${comment.text}</span>
        `;
        commentsContainer.appendChild(commentEl);
    }
 
    async loadMorePosts() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        try {
            const response = await fetch(`/api/posts?page=${this.currentPage + 1}`);
            const posts = await response.json();
            
            if (posts.length) {
                this.currentPage++;
                this.renderPosts(posts);
            }
        } catch (error) {
            console.error('Error loading posts:', error);
        } finally {
            this.isLoading = false;
        }
    }
 
    renderPosts(posts) {
        const container = document.querySelector('.posts-container');
        posts.forEach(post => {
            const postElement = this.createPostElement(post);
            container.appendChild(postElement);
        });
    }
 }