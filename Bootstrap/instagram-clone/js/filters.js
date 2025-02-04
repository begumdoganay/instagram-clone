
class FiltersComponent {
    constructor() {
        this.activeFilter = 'normal';
        this.adjustments = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            warmth: 0
        };
        this.initializeFilters();
    }
 
    initializeFilters() {
        this.setupFilterOptions();
        this.setupAdjustmentSliders();
    }
 
    setupFilterOptions() {
        document.querySelectorAll('.filter-option').forEach(filter => {
            filter.addEventListener('click', () => {
                this.applyFilter(filter.dataset.filter);
                this.updateFilterSelection(filter);
            });
        });
    }
 
    setupAdjustmentSliders() {
        document.querySelectorAll('.adjustment-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const type = e.target.dataset.type;
                this.adjustments[type] = e.target.value;
                this.updateImageAdjustments();
            });
        });
    }
 
    applyFilter(filterName) {
        const image = document.querySelector('.filtered-image');
        image.className = `filtered-image filter-${filterName}`;
        this.activeFilter = filterName;
    }
 
    updateFilterSelection(selectedFilter) {
        document.querySelectorAll('.filter-option').forEach(filter => {
            filter.classList.toggle('active', filter === selectedFilter);
        });
    }
 
    updateImageAdjustments() {
        const image = document.querySelector('.filtered-image');
        image.style.filter = `
            brightness(${this.adjustments.brightness}%)
            contrast(${this.adjustments.contrast}%)
            saturate(${this.adjustments.saturation}%)
            sepia(${this.adjustments.warmth}%)
        `;
    }
 
    async saveImage() {
        const canvas = document.createElement('canvas');
        const image = document.querySelector('.filtered-image');
        
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.filter = window.getComputedStyle(image).filter;
        ctx.drawImage(image, 0, 0);
 
        return new Promise((resolve) => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/jpeg', 0.9);
        });
    }
 
    // Filter presets
    getFilterPresets() {
        return {
            clarendon: { brightness: 110, contrast: 120, saturation: 135 },
            gingham: { brightness: 105, warmth: 10, saturation: 90 },
            moon: { brightness: 110, contrast: 110, saturation: 0 },
            lark: { brightness: 110, contrast: 95, saturation: 110 },
            reyes: { brightness: 110, contrast: 90, saturation: 75 }
        };
    }
 
    applyPreset(presetName) {
        const preset = this.getFilterPresets()[presetName];
        if (preset) {
            Object.entries(preset).forEach(([adjustment, value]) => {
                this.adjustments[adjustment] = value;
                const slider = document.querySelector(`[data-type="${adjustment}"]`);
                if (slider) slider.value = value;
            });
            this.updateImageAdjustments();
        }
    }
 }