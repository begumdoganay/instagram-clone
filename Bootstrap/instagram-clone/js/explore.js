
class ExploreComponent {
    constructor() {
        this.currentCategory = 'all';
        this.page = 1;
        this.isLoading = false;
        this.initializeExplore();
    }
 
    initializeExplore() {
        this.setupCategories();
        this.setupSearch();
        this.setupInfiniteScroll();
        this.setupGridInteractions();
    }
 
    setupCategories() {
        document.querySelectorAll('.category-chip').forEach(category => {
            category.addEventListener('click', () => {
                this.switchCategory(category.dataset.category);
            });
        });
    }
 
    setupSearch() {
        const searchInput = document.querySelector('.explore-search input');
        let debounceTimer;
 
        searchInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                this.searchContent(searchInput.value);
            }, 300);
        });
    }
 
    setupInfiniteScroll() {
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && !this.isLoading) {
                    this.loadMoreContent();
                }
            },
            { rootMargin: '100px' }
        );
 
        observer.observe(document.querySelector('.load-more-sentinel'));
    }
 
    setupGridInteractions() {
        document.querySelectorAll('.explore-item').forEach(item => {
            item.addEventListener('click', () => this.openPost(item.dataset.postId));
            
            // Preview on hover for videos
            if (item.dataset.type === 'video') {
                item.addEventListener('mouseenter', () => this.previewVideo(item));
                item.addEventListener('mouseleave', () => this.stopPreview(item));
            }
        });
    }
 
    async switchCategory(category) {
        this.currentCategory = category;
        this.page = 1;
        
        document.querySelectorAll('.category-chip').forEach(chip => {
            chip.classList.toggle('active', chip.dataset.category === category);
        });
 
        const grid = document.querySelector('.explore-grid');
        grid.innerHTML = '<div class="loading-skeleton"></div>'.repeat(12);
 
        try {
            const content = await this.fetchContentByCategory(category);
            this.renderContent(content);
        } catch (error) {
            console.error('Error fetching category content:', error);
        }
    }
 
    async searchContent(query) {
        if (query.length < 2) return;
 
        try {
            const results = await this.fetchSearchResults(query);
            this.renderSearchResults(results);
        } catch (error) {
            console.error('Error searching content:', error);
        }
    }
 
    async loadMoreContent() {
        this.isLoading = true;
        try {
            const content = await this.fetchContentByCategory(
                this.currentCategory, 
                ++this.page
            );
            this.appendContent(content);
        } catch (error) {
            console.error('Error loading more content:', error);
        } finally {
            this.isLoading = false;
        }
    }
 
    previewVideo(item) {
        const video = item.querySelector('video');
        if (video) {
            video.muted = true;
            video.currentTime = 0;
            video.play();
        }
    }
 
    stopPreview(item) {
        const video = item.querySelector('video');
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    }
 
    renderContent(content) {
        const grid = document.querySelector('.explore-grid');
        grid.innerHTML = content.map(item => this.createGridItem(item)).join('');
        this.setupGridInteractions();
    }
 
    appendContent(content) {
        const grid = document.querySelector('.explore-grid');
        const newItems = content.map(item => this.createGridItem(item)).join('');
        grid.insertAdjacentHTML('beforeend', newItems);
        this.setupGridInteractions();
    }
 
    createGridItem(item) {
        return `
            <div class="explore-item" data-post-id="${item.id}" data-type="${item.type}">
                <img src="${item.thumbnail}" alt="${item.description}">
                <div class="item-overlay">
                    <div class="overlay-stat">
                        <i class="fas fa-heart"></i>
                        <span>${item.likes}</span>
                    </div>
                    <div class="overlay-stat">
                        <i class="fas fa-comment"></i>
                        <span>${item.comments}</span>
                    </div>
                </div>
                ${item.type === 'video' ? '<i class="fas fa-video media-indicator"></i>' : ''}
                ${item.type === 'carousel' ? '<i class="fas fa-clone media-indicator"></i>' : ''}
            </div>
        `;
    }
 }