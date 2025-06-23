// Dashboard JavaScript
class RiverDashboard {
    constructor() {
        this.init();
    }

    init() {
        this.updateLastUpdateTime();
        this.setupEventListeners();
        this.loadInitialData();
        
        // Update data every 5 minutes
        setInterval(() => {
            this.updateData();
        }, 300000);
        
        // Update time every minute
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 60000);
    }updateLastUpdateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = timeString;
    }    setupEventListeners() {
        // Footer Controls
        document.getElementById('refresh-data').addEventListener('click', () => this.updateData());
        document.getElementById('export-data').addEventListener('click', () => this.exportData());
        
        // Window resize handler 
        window.addEventListener('resize', () => this.handleResize());
    }    loadInitialData() {
        // Simulate loading initial data
        this.showLoading();
        
        setTimeout(() => {
            this.updateEnvironmentalData();
            this.updateBiodiversityData();
            this.hideLoading();
        }, 1500);
    }

    updateData() {
        this.showLoading();
        this.updateLastUpdateTime();
        
        // Simulate API calls
        setTimeout(() => {
            this.updateEnvironmentalData();
            this.updateBiodiversityData();
            this.updateProgress();
            this.updateAlerts();
            this.hideLoading();
        }, 1000);
    }

    updateEnvironmentalData() {
        // Simulate environmental data updates
        const waterQuality = Math.floor(Math.random() * 30) + 70; // 70-100
        const temperature = (Math.random() * 10 + 15).toFixed(1); // 15-25°C
        const phValue = (Math.random() * 2 + 6.5).toFixed(1); // 6.5-8.5
        
        document.getElementById('water-quality').textContent = `${waterQuality}%`;
        document.getElementById('temperature').textContent = `${temperature}°C`;
        document.getElementById('ph-value').textContent = phValue;
        
        // Update colors based on values
        this.updateValueColor('water-quality', waterQuality, 80, 90);
        this.updateValueColor('temperature', parseFloat(temperature), 18, 22);
        this.updateValueColor('ph-value', parseFloat(phValue), 7, 8);
    }

    updateBiodiversityData() {
        const fishSpecies = Math.floor(Math.random() * 5) + 8; // 8-12
        const plantSpecies = Math.floor(Math.random() * 10) + 25; // 25-35
        
        document.getElementById('fish-species').textContent = fishSpecies;
        document.getElementById('plant-species').textContent = plantSpecies;
    }

    updateProgress() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            const currentWidth = parseInt(bar.style.width);
            const newWidth = Math.min(currentWidth + Math.floor(Math.random() * 3), 100);
            bar.style.width = `${newWidth}%`;
            
            const valueSpan = bar.parentElement.parentElement.querySelector('.progress-value');
            if (valueSpan) {
                valueSpan.textContent = `${newWidth}%`;
            }
        });
    }    updateAlerts() {
        const alertsContainer = document.querySelector('#alerts .widget-content');
        const alerts = [
            { type: 'info', icon: 'ℹ️', text: 'New sensor data available' },
            { type: 'success', icon: '✅', text: 'Water quality stable' },
            { type: 'info', icon: '📊', text: 'Weekly report generated' },
            { type: 'success', icon: '🌱', text: 'New vegetation discovered' }
        ];
        
        const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
        
        // Add new alert at the top
        const newAlert = document.createElement('div');
        newAlert.className = `alert-item ${randomAlert.type}`;
        newAlert.innerHTML = `
            <span class="alert-icon">${randomAlert.icon}</span>
            <span class="alert-text">${randomAlert.text}</span>
        `;
        
        alertsContainer.insertBefore(newAlert, alertsContainer.firstChild);
        
        // Remove old alerts if more than 3
        const allAlerts = alertsContainer.querySelectorAll('.alert-item');
        if (allAlerts.length > 3) {
            allAlerts[allAlerts.length - 1].remove();
        }
    }    updateValueColor(elementId, value, goodMin, goodMax) {
        const element = document.getElementById(elementId);
        if (value >= goodMin && value <= goodMax) {
            element.style.color = '#30d158'; // Apple Green for good values
        } else {
            element.style.color = '#ff9f0a'; // Apple Orange for concerning values
        }
    }

    showLoading() {
        const loadingElements = document.querySelectorAll('.value');
        loadingElements.forEach(el => {
            el.classList.add('loading');
        });
    }

    hideLoading() {
        const loadingElements = document.querySelectorAll('.value');
        loadingElements.forEach(el => {
            el.classList.remove('loading');
        });
    }

    exportData() {
        // Simulate data export
        const data = {
            timestamp: new Date().toISOString(),
            environmentalData: {
                waterQuality: document.getElementById('water-quality').textContent,
                temperature: document.getElementById('temperature').textContent,
                phValue: document.getElementById('ph-value').textContent
            },
            biodiversity: {
                fishSpecies: document.getElementById('fish-species').textContent,
                plantSpecies: document.getElementById('plant-species').textContent
            }
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `river-dashboard-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showNotification('Data exported successfully!');
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #30d158;
            color: white;
            padding: 12px 16px;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(48, 209, 88, 0.3);
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            font-size: 14px;
            font-weight: 500;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }    handleResize() {
        // Handle responsive changes if needed
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RiverDashboard();
});

// Handle image loading error
document.getElementById('river-map').addEventListener('error', function() {
    this.style.display = 'none';
    const placeholder = document.createElement('div');
    placeholder.style.cssText = `
        width: 100%;
        height: 400px;
        background: linear-gradient(45deg, #e0e0e0 25%, transparent 25%), 
                    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e0e0e0 75%), 
                    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #666;
        font-size: 1.2rem;
        border-radius: 8px;
    `;    placeholder.textContent = 'Map image loading...';
    this.parentElement.appendChild(placeholder);
});
