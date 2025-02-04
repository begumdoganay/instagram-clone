
class StoriesComponent {
    constructor() {
        this.stories = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.storyDuration = 5000; // 5 seconds per story
        
        this.initializeStories();
        this.setupControls();
    }
 
    initializeStories() {
        document.querySelectorAll('.story-item').forEach(story => {
            story.addEventListener('click', () => this.openStory(story));
        });
    }
 
    openStory(storyElement) {
        const storyViewer = document.createElement('div');
        storyViewer.className = 'story-viewer';
        storyViewer.innerHTML = `
            <div class="story-content">
                <div class="story-header">
                    <div class="story-user">
                        <img src="${storyElement.dataset.userAvatar}" alt="">
                        <span>${storyElement.dataset.username}</span>
                    </div>
                    <div class="story-time">${this.getTimeAgo(storyElement.dataset.time)}</div>
                </div>
                <div class="story-progress"></div>
                <img src="${storyElement.dataset.media}" alt="">
            </div>
        `;
 
        document.body.appendChild(storyViewer);
        setTimeout(() => storyViewer.classList.add('active'), 0);
 
        this.setupStoryControls(storyViewer);
        this.startStoryProgress();
    }
 
    setupStoryControls(viewer) {
        // Touch Controls
        let touchStartX = 0;
        viewer.addEventListener('touchstart', e => {
            touchStartX = e.touches[0].clientX;
        });
 
        viewer.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
 
            if (Math.abs(diff) > 50) {
                if (diff > 0) this.nextStory();
                else this.previousStory();
            }
        });
 
        // Click Controls
        viewer.addEventListener('click', e => {
            const rect = viewer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            
            if (x < rect.width * 0.3) this.previousStory();
            else if (x > rect.width * 0.7) this.nextStory();
        });
    }
 
    startStoryProgress() {
        this.isPlaying = true;
        const progressBar = document.querySelector('.story-progress');
        
        progressBar.style.width = '0%';
        progressBar.style.transition = `width ${this.storyDuration}ms linear`;
        
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 50);
 
        this.progressTimer = setTimeout(() => {
            this.nextStory();
        }, this.storyDuration);
    }
 
    nextStory() {
        if (this.currentIndex < this.stories.length - 1) {
            this.currentIndex++;
            this.updateStory();
        } else {
            this.closeStory();
        }
    }
 
    previousStory() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateStory();
        }
    }
 
    updateStory() {
        clearTimeout(this.progressTimer);
        this.startStoryProgress();
        // Update story content
    }
 
    closeStory() {
        const viewer = document.querySelector('.story-viewer');
        viewer.classList.remove('active');
        setTimeout(() => viewer.remove(), 300);
    }
 
    getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + ' years ago';
        
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + ' months ago';
        
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + ' days ago';
        
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + ' hours ago';
        
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + ' minutes ago';
        
        return Math.floor(seconds) + ' seconds ago';
    }
 }