// TimeFlow Pro - Main Application Entry Point
console.log('TimeFlow Pro v1.0 - Loading...');

// Basic app initialization for demo
class TimeFlowApp {
  private loadingScreen: HTMLElement;
  private mainNav: HTMLElement;
  private mainContent: HTMLElement;
  
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen')!;
    this.mainNav = document.getElementById('mainNav')!;
    this.mainContent = document.getElementById('mainContent')!;
    
    this.initialize();
  }
  
  private async initialize(): Promise<void> {
    try {
      // Simulate app loading
      await this.loadAppData();
      
      // Setup navigation
      this.setupNavigation();
      
      // Setup offline detection
      this.setupOfflineDetection();
      
      // Hide loading screen and show app
      this.showApp();
      
      // Load initial view
      this.loadDashboard();
      
      console.log('TimeFlow Pro initialized successfully');
    } catch (error) {
      console.error('Failed to initialize TimeFlow Pro:', error);
      this.showError('Failed to load application');
    }
  }
  
  private async loadAppData(): Promise<void> {
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Initialize localStorage if empty
    if (!localStorage.getItem('timeflow-initialized')) {
      localStorage.setItem('timeflow-initialized', 'true');
      localStorage.setItem('timeflow-version', '1.0.0');
      
      // Set default app state
      const defaultState = {
        currentTimer: {
          isRunning: false,
          currentDuration: 0
        },
        timeEntries: [],
        projects: [],
        tasks: [],
        ui: {
          activeView: 'dashboard',
          filters: {}
        },
        sync: {
          isOnline: navigator.onLine,
          pendingChanges: 0
        }
      };
      
      localStorage.setItem('timeflow-state', JSON.stringify(defaultState));
      console.log('TimeFlow Pro: Initial state created');
    }
  }
  
  private setupNavigation(): void {
    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        const view = target.dataset?.view;
        if (view) {
          this.navigateToView(view);
        }
      });
    });
  }
  
  private setupOfflineDetection(): void {
    const offlineBanner = document.getElementById('offlineBanner')!;
    
    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        offlineBanner.classList.remove('show');
      } else {
        offlineBanner.classList.add('show');
      }
    };
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Check initial status
    updateOnlineStatus();
  }
  
  private showApp(): void {
    this.loadingScreen.style.opacity = '0';
    this.loadingScreen.style.visibility = 'hidden';
    this.mainNav.style.display = 'grid';
    
    setTimeout(() => {
      this.loadingScreen.remove();
    }, 300);
  }
  
  private showError(message: string): void {
    const loadingSpinner = this.loadingScreen.querySelector('.loading-spinner')!;
    loadingSpinner.innerHTML = `
      <div style="color: var(--danger-color); text-align: center;">
        <h2>⚠️ Error</h2>
        <p>${message}</p>
        <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload App
        </button>
      </div>
    `;
  }
  
  private navigateToView(view: string): void {
    // Update active nav button
    document.querySelectorAll('.nav-button').forEach(btn => {
      const element = btn as HTMLElement;
      element.classList.toggle('active', element.dataset?.view === view);
    });
    
    // Load view content
    switch (view) {
      case 'dashboard':
        this.loadDashboard();
        break;
      case 'projects':
        this.loadProjects();
        break;
      case 'billing':
        this.loadBilling();
        break;
      case 'reports':
        this.loadReports();
        break;
      default:
        this.loadDashboard();
    }
  }
  
  private loadDashboard(): void {
    this.mainContent.innerHTML = `
      <div class="dashboard-grid">
        <section class="timer-section">
          <div class="section-header">
            <h2 class="section-title">⏱️ Active Timer</h2>
          </div>
          <div class="card">
            <div class="card-content" style="text-align: center;">
              <div style="font-family: var(--font-mono); font-size: 3rem; font-weight: bold; color: var(--primary-color); margin-bottom: 1rem;">
                00:00:00
              </div>
              <div style="display: flex; gap: 1rem; justify-content: center;">
                <button class="btn btn-primary" onclick="alert('Timer functionality will be implemented in Epic 1!')">
                  ▶️ Start Timer
                </button>
                <button class="btn btn-secondary">
                  ✏️ Manual Entry
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section class="projects-section">
          <div class="section-header">
            <h2 class="section-title">📁 Recent Projects</h2>
            <button class="btn btn-secondary">View All</button>
          </div>
          <div class="projects-grid">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Sample Project</h3>
                <span style="padding: 0.25rem 0.5rem; background: var(--success-light); color: var(--success-dark); border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
                  Active
                </span>
              </div>
              <div class="card-content">
                <p style="color: var(--text-muted); margin-bottom: 1rem;">Demo Client</p>
                <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">24h</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Total Hours</div>
                  </div>
                  <div style="text-align: center;">
                    <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">$2,400</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase;">Revenue</div>
                  </div>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                  <button class="btn btn-secondary">View</button>
                  <button class="btn btn-secondary">Edit</button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section class="summary-section">
          <div class="section-header">
            <h2 class="section-title">📊 Today's Summary</h2>
          </div>
          <div class="card">
            <div class="card-content">
              <div style="margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-secondary);">Time Tracked</span>
                  <span style="font-weight: 600; color: var(--text-primary);">0h 0m</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-secondary);">Billable Hours</span>
                  <span style="font-weight: 600; color: var(--success-color);">0h 0m</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <span style="color: var(--text-secondary);">Revenue</span>
                  <span style="font-weight: 600; color: var(--primary-color);">$0</span>
                </div>
              </div>
              <button class="btn btn-primary" style="width: 100%;">View Detailed Report</button>
            </div>
          </div>
        </section>
      </div>
    `;
  }
  
  private loadProjects(): void {
    this.mainContent.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div class="section-header">
          <h1 style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">📁 Projects</h1>
          <button class="btn btn-primary">+ New Project</button>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">Projects feature coming in Epic 2!</h3>
            <p style="color: var(--text-muted);">This will include project management, task tracking, and progress visualization.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  private loadBilling(): void {
    this.mainContent.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div class="section-header">
          <h1 style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">💰 Billing</h1>
          <button class="btn btn-primary">Generate Invoice</button>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">Billing system coming in Epic 4!</h3>
            <p style="color: var(--text-muted);">This will include the three-stage billing workflow, invoice generation, and payment tracking.</p>
          </div>
        </div>
      </div>
    `;
  }
  
  private loadReports(): void {
    this.mainContent.innerHTML = `
      <div style="max-width: 1400px; margin: 0 auto;">
        <div class="section-header">
          <h1 style="font-size: 2rem; font-weight: 700; color: var(--text-primary);">📈 Reports</h1>
          <button class="btn btn-secondary">Export Data</button>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center; padding: 3rem;">
            <h3 style="color: var(--text-secondary); margin-bottom: 1rem;">Analytics & reporting coming in Epic 5!</h3>
            <p style="color: var(--text-muted);">This will include comprehensive dashboards, charts, and export functionality.</p>
          </div>
        </div>
      </div>
    `;
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new TimeFlowApp();
});

// Handle app updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}