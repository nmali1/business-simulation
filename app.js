// Business Analytics Simulation - TechFlow Inc.
// State Management

const simulationState = {
  activeAnalyticsTab: 'overview',
  currentQuarter: 1,
  totalQuarters: 8,
  currentView: 'welcome',
  
  // Initial metrics
  metrics: {
    revenue: 50,
    grossMargin: 65,
    netProfit: 15,
    marketShare: 20,
    customerSatisfaction: 75,
    cashPosition: 25,
    employeeProductivity: 80,
    basePrice: 100
  },
  
  // Historical data for all quarters
  history: [],
  
  // Decisions history
  decisionsHistory: [],
  
  // Current quarter decisions
  currentDecisions: {
    marketing: 50,
    quality: 50,
    pricing: 100,
    efficiency: 50
  },
  
  // Preview metrics
  previewMetrics: null,
  
  // What-if analysis state
  whatIfQuarter: 1,
  whatIfDecisions: {
    marketing: 50,
    quality: 50,
    pricing: 100,
    efficiency: 50
  }
};

// Initialize the app
function init() {
  // Store initial state in history
  simulationState.history.push({
    quarter: 0,
    ...JSON.parse(JSON.stringify(simulationState.metrics))
  });
  
  renderView();
}

// Main render function
function renderView() {
  const app = document.getElementById('app');
  
  switch(simulationState.currentView) {
    case 'welcome':
      app.innerHTML = renderWelcomeScreen();
      break;
    case 'dashboard':
      app.innerHTML = renderDashboard();
      break;
    case 'analytics':
      app.innerHTML = renderAnalytics();
      setTimeout(renderCharts, 100);
      break;
    case 'decisions':
      app.innerHTML = renderDecisions();
      attachSliderListeners();
      break;
    case 'results':
      app.innerHTML = renderResults();
      break;
    case 'final':
      app.innerHTML = renderFinalResults();
      setTimeout(renderFinalCharts, 100);
      break;
  }
}

// Welcome Screen
function renderWelcomeScreen() {
  return `
    <div class="welcome-screen">
      <h1>Business Analytics Simulation</h1>
      <h2>TechFlow Inc.</h2>
      
      <div class="welcome-content">
        <p><strong>Company Background:</strong> You are the analytics-driven manager of TechFlow Inc., a software-as-a-service company in the cloud analytics market.</p>
        
        <p><strong>Simulation Overview:</strong> Make quarterly business decisions for 8 quarters. Your goal is to maximize profitability while maintaining market position and customer satisfaction.</p>
        
        <div class="success-metrics">
          <div class="metric-item">
            <h3>Profitability</h3>
            <p>30% Weight</p>
          </div>
          <div class="metric-item">
            <h3>Growth</h3>
            <p>20% Weight</p>
          </div>
          <div class="metric-item">
            <h3>Market Position</h3>
            <p>20% Weight</p>
          </div>
          <div class="metric-item">
            <h3>Customer Loyalty</h3>
            <p>15% Weight</p>
          </div>
          <div class="metric-item">
            <h3>Operations</h3>
            <p>15% Weight</p>
          </div>
        </div>
      </div>
      
      <button class="btn btn-primary btn-large" onclick="startSimulation()">Start Simulation</button>
    </div>
  `;
}

// Dashboard View
function renderDashboard() {
  const m = simulationState.metrics;
  const prevMetrics = simulationState.history[simulationState.currentQuarter - 1];
  
  return `
    <div class="header">
      <div class="header-content">
        <h1>TechFlow Inc. Dashboard</h1>
        <div class="quarter-badge">Quarter ${simulationState.currentQuarter} of ${simulationState.totalQuarters}</div>
      </div>
    </div>
    
    <div class="container">
      <h2 style="margin-bottom: var(--space-24); color: var(--color-text);">Current Business Metrics</h2>
      
      <div class="dashboard-grid">
        ${renderMetricCard('Revenue', `$${m.revenue.toFixed(1)}M`, prevMetrics.revenue, m.revenue, 'M')}
        ${renderMetricCard('Gross Margin', `${m.grossMargin.toFixed(1)}%`, prevMetrics.grossMargin, m.grossMargin, '%')}
        ${renderMetricCard('Net Profit', `$${m.netProfit.toFixed(1)}M`, prevMetrics.netProfit, m.netProfit, 'M')}
        ${renderMetricCard('Market Share', `${m.marketShare.toFixed(1)}%`, prevMetrics.marketShare, m.marketShare, '%')}
        ${renderMetricCard('Customer Satisfaction', m.customerSatisfaction.toFixed(0), prevMetrics.customerSatisfaction, m.customerSatisfaction, '')}
        ${renderMetricCard('Cash Position', `$${m.cashPosition.toFixed(1)}M`, prevMetrics.cashPosition, m.cashPosition, 'M')}
        ${renderMetricCard('Employee Productivity', m.employeeProductivity.toFixed(0), prevMetrics.employeeProductivity, m.employeeProductivity, '')}
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary btn-large" onclick="goToDecisions()">Make Decision</button>
        <button class="btn btn-secondary btn-large" onclick="goToAnalytics()">Advanced Analytics</button>
      </div>
    </div>
  `;
}

function renderMetricCard(label, value, prevValue, currentValue, suffix) {
  const change = currentValue - prevValue;
  const changePercent = prevValue !== 0 ? ((change / prevValue) * 100).toFixed(1) : 0;
  const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';
  const arrow = change > 0 ? '↑' : change < 0 ? '↓' : '→';
  
  return `
    <div class="metric-card">
      <div class="metric-card-header">
        <div class="metric-label">${label}</div>
      </div>
      <div class="metric-value">${value}</div>
      <div class="metric-change ${changeClass}">
        <span>${arrow}</span>
        <span>${change > 0 ? '+' : ''}${change.toFixed(1)}${suffix} (${changePercent}%)</span>
      </div>
    </div>
  `;
}

// Analytics Dashboard with Tabs
function renderAnalytics() {
  const tabs = [
    { id: 'overview', icon: '📊', label: 'Data Overview' },
    { id: 'insights', icon: '🔍', label: 'Insights' },
    { id: 'predictions', icon: '🤖', label: 'Predictions' },
    { id: 'visualizations', icon: '📈', label: 'Visualizations' },
    { id: 'whatif', icon: '🎯', label: 'What-If Analysis' },
    { id: 'benchmarking', icon: '🏆', label: 'Benchmarking' },
    { id: 'ai', icon: '✨', label: 'AI Insights' },
    { id: 'export', icon: '⬇️', label: 'Export' }
  ];
  
  return `
    <div class="header">
      <div class="header-content">
        <h1>Advanced Analytics Dashboard</h1>
        <div class="quarter-badge">Quarter ${simulationState.currentQuarter} of ${simulationState.totalQuarters}</div>
      </div>
    </div>
    
    <div class="container">
      <div class="analytics-tabs">
        ${tabs.map(tab => `
          <button class="analytics-tab ${simulationState.activeAnalyticsTab === tab.id ? 'active' : ''}" 
                  onclick="switchAnalyticsTab('${tab.id}')">
            ${tab.icon} ${tab.label}
          </button>
        `).join('')}
      </div>
      
      <div class="analytics-content" id="analyticsContent">
        ${renderAnalyticsTab()}
      </div>
      
      <div class="action-buttons" style="margin-top: var(--space-32);">
        <button class="btn btn-primary btn-large" onclick="goToDecisions()">Make Decision</button>
        <button class="btn btn-secondary btn-large" onclick="goToDashboard()">Back to Dashboard</button>
      </div>
    </div>
  `;
}

function switchAnalyticsTab(tabId) {
  simulationState.activeAnalyticsTab = tabId;
  document.getElementById('analyticsContent').innerHTML = renderAnalyticsTab();
  
  // Update active tab styling
  document.querySelectorAll('.analytics-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  event.target.closest('.analytics-tab').classList.add('active');
  
  // Render charts if needed
  if (tabId === 'visualizations') {
    setTimeout(renderAdvancedCharts, 100);
  } else if (tabId === 'predictions') {
    setTimeout(renderPredictionCharts, 100);
  }
}

function renderAnalyticsTab() {
  switch(simulationState.activeAnalyticsTab) {
    case 'overview': return renderOverviewTab();
    case 'insights': return renderInsightsTab();
    case 'predictions': return renderPredictionsTab();
    case 'visualizations': return renderVisualizationsTab();
    case 'whatif': return renderWhatIfTab();
    case 'benchmarking': return renderBenchmarkingTab();
    case 'ai': return renderAIInsightsTab();
    case 'export': return renderExportTab();
    default: return renderOverviewTab();
  }
}

// Tab 1: Data Overview
function renderOverviewTab() {
  const stats = calculateDescriptiveStats();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">Complete Performance Data</h2>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h4>Avg Revenue</h4>
        <div class="value">$${stats.revenue.mean.toFixed(1)}M</div>
      </div>
      <div class="stat-card">
        <h4>Avg Profit</h4>
        <div class="value">$${stats.profit.mean.toFixed(1)}M</div>
      </div>
      <div class="stat-card">
        <h4>Avg Market Share</h4>
        <div class="value">${stats.marketShare.mean.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <h4>Avg Satisfaction</h4>
        <div class="value">${stats.satisfaction.mean.toFixed(0)}</div>
      </div>
      <div class="stat-card">
        <h4>Revenue Std Dev</h4>
        <div class="value">±${stats.revenue.stdDev.toFixed(1)}M</div>
      </div>
      <div class="stat-card">
        <h4>Profit Volatility</h4>
        <div class="value">±${stats.profit.stdDev.toFixed(1)}M</div>
      </div>
    </div>
    
    <div class="section-header">
      <h3>Quarterly Performance Data</h3>
      <button class="btn btn-secondary" onclick="downloadCSV()">Download CSV</button>
    </div>
    
    <div class="sortable-table">
      ${renderSortableDataTable()}
    </div>
    
    <div style="margin-top: var(--space-24);">
      <h3 style="margin-bottom: var(--space-16);">Decision History</h3>
      <div class="sortable-table">
        ${renderDecisionsTable()}
      </div>
    </div>
  `;
}

// Tab 2: Insights
function renderInsightsTab() {
  const insights = generateAdvancedInsights();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">Statistical Insights &amp; Correlations</h2>
    
    <div class="insights-grid">
      ${insights.map(insight => `
        <div class="insight-card ${insight.type}">
          <h4>${insight.title}</h4>
          <p>${insight.message}</p>
        </div>
      `).join('')}
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Correlation Analysis</h3>
    <p style="color: var(--color-text-secondary); margin-bottom: var(--space-16);">Understanding relationships between decisions and outcomes</p>
    
    <div class="heatmap-container">
      ${renderCorrelationHeatmap()}
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Key Performance Indicators</h3>
    <div class="stats-grid">
      ${renderKPIs()}
    </div>
  `;
}

// Tab 3: Predictions
function renderPredictionsTab() {
  const predictions = generatePredictions();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">Predictive Analytics <span class="ai-badge">🤖 ML-Powered</span></h2>
    
    <div class="insights-grid">
      <div class="prediction-panel">
        <h3>Revenue Forecast</h3>
        <div class="prediction-value">$${predictions.revenue.next1.toFixed(1)}M</div>
        <div class="confidence-interval">Next Quarter (Q${simulationState.currentQuarter + 1})</div>
        <div class="confidence-interval">Confidence Interval: $${predictions.revenue.lower.toFixed(1)}M - $${predictions.revenue.upper.toFixed(1)}M</div>
      </div>
      
      <div class="prediction-panel">
        <h3>Profit Projection</h3>
        <div class="prediction-value">$${predictions.profit.next1.toFixed(1)}M</div>
        <div class="confidence-interval">Next Quarter (Q${simulationState.currentQuarter + 1})</div>
        <div class="confidence-interval">Confidence Interval: $${predictions.profit.lower.toFixed(1)}M - $${predictions.profit.upper.toFixed(1)}M</div>
      </div>
      
      <div class="prediction-panel">
        <h3>Market Share Forecast</h3>
        <div class="prediction-value">${predictions.marketShare.next1.toFixed(1)}%</div>
        <div class="confidence-interval">Next Quarter (Q${simulationState.currentQuarter + 1})</div>
        <div class="confidence-interval">Trend: ${predictions.marketShare.trend}</div>
      </div>
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Forecast Visualization</h3>
    <div class="charts-grid">
      <div class="chart-container">
        <h3>Revenue Forecast (Linear Regression)</h3>
        <div class="chart-wrapper">
          <canvas id="revenueForecastChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Profit Trend &amp; Prediction</h3>
        <div class="chart-wrapper">
          <canvas id="profitForecastChart"></canvas>
        </div>
      </div>
    </div>
    
    <div class="narrative-box" style="margin-top: var(--space-24);">
      <h3>Prediction Methodology</h3>
      <p><strong>Linear Regression:</strong> Using historical data points to fit a trend line and project future values. 
      <strong>Moving Average:</strong> Smoothing technique to identify underlying patterns. 
      <strong>Confidence Intervals:</strong> Statistical range showing prediction uncertainty based on historical volatility.</p>
    </div>
  `;
}

// Tab 4: Visualizations
function renderVisualizationsTab() {
  return `
    <h2 style="margin-bottom: var(--space-24);">Comprehensive Data Visualization Suite</h2>
    
    <div class="charts-grid">
      <div class="chart-container">
        <h3>Revenue vs Market Share</h3>
        <div class="chart-wrapper">
          <canvas id="scatterChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Revenue &amp; Cost Dual-Axis</h3>
        <div class="chart-wrapper">
          <canvas id="dualAxisChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Revenue Breakdown by Quarter</h3>
        <div class="chart-wrapper">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Performance Index Comparison</h3>
        <div class="chart-wrapper">
          <canvas id="radarChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Customer Satisfaction vs Quality Investment</h3>
        <div class="chart-wrapper">
          <canvas id="satisfactionQualityChart"></canvas>
        </div>
      </div>
      
      <div class="chart-container">
        <h3>Price Elasticity Analysis</h3>
        <div class="chart-wrapper">
          <canvas id="priceElasticityChart"></canvas>
        </div>
      </div>
    </div>
  `;
}

function renderDataTable() {
  let rows = '';
  for (let i = 1; i <= simulationState.currentQuarter; i++) {
    const data = simulationState.history[i];
    if (data) {
      rows += `
        <tr>
          <td>Q${data.quarter}</td>
          <td>$${data.revenue.toFixed(1)}M</td>
          <td>${data.grossMargin.toFixed(1)}%</td>
          <td>$${data.netProfit.toFixed(1)}M</td>
          <td>${data.marketShare.toFixed(1)}%</td>
          <td>${data.customerSatisfaction.toFixed(0)}</td>
          <td>$${data.cashPosition.toFixed(1)}M</td>
        </tr>
      `;
    }
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Revenue</th>
          <th>Margin</th>
          <th>Profit</th>
          <th>Market Share</th>
          <th>Satisfaction</th>
          <th>Cash</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// Advanced Chart Rendering
function renderAdvancedCharts() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  const quarters = history.map(h => `Q${h.quarter}`);
  
  // Scatter: Revenue vs Market Share
  new Chart(document.getElementById('scatterChart'), {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Revenue vs Market Share',
        data: history.map(h => ({ x: h.marketShare, y: h.revenue })),
        backgroundColor: '#1FB8CD',
        borderColor: '#1FB8CD',
        pointRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: 'Market Share (%)' } },
        y: { title: { display: true, text: 'Revenue ($M)' } }
      }
    }
  });
  
  // Dual-axis: Revenue & Cost
  const costs = history.map(h => h.revenue * (1 - h.grossMargin / 100));
  new Chart(document.getElementById('dualAxisChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [
        {
          label: 'Revenue',
          data: history.map(h => h.revenue),
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          yAxisID: 'y',
          tension: 0.3
        },
        {
          label: 'Costs',
          data: costs,
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.1)',
          yAxisID: 'y',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { type: 'linear', position: 'left', title: { display: true, text: '$M' } }
      }
    }
  });
  
  // Pie: Revenue by Quarter
  new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
      labels: quarters,
      datasets: [{
        data: history.map(h => h.revenue),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325']
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  // Radar: Performance Index
  const latestQuarter = history[history.length - 1];
  new Chart(document.getElementById('radarChart'), {
    type: 'radar',
    data: {
      labels: ['Revenue', 'Profit', 'Market Share', 'Satisfaction', 'Cash', 'Productivity'],
      datasets: [{
        label: `Q${latestQuarter.quarter} Performance`,
        data: [
          (latestQuarter.revenue / 80) * 100,
          (latestQuarter.netProfit / 25) * 100,
          (latestQuarter.marketShare / 40) * 100,
          latestQuarter.customerSatisfaction,
          (latestQuarter.cashPosition / 40) * 100,
          latestQuarter.employeeProductivity
        ],
        backgroundColor: 'rgba(31, 184, 205, 0.2)',
        borderColor: '#1FB8CD',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: { min: 0, max: 100 }
      }
    }
  });
  
  // Satisfaction vs Quality
  if (decisions.length > 0) {
    new Chart(document.getElementById('satisfactionQualityChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Satisfaction vs Quality Investment',
          data: history.map((h, i) => ({
            x: decisions[i]?.quality || 50,
            y: h.customerSatisfaction
          })),
          backgroundColor: '#5D878F',
          borderColor: '#5D878F',
          pointRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Quality Investment (%)' } },
          y: { title: { display: true, text: 'Customer Satisfaction' } }
        }
      }
    });
    
    // Price Elasticity
    new Chart(document.getElementById('priceElasticityChart'), {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Price vs Market Share',
          data: history.map((h, i) => ({
            x: decisions[i]?.pricing || 100,
            y: h.marketShare
          })),
          backgroundColor: '#D2BA4C',
          borderColor: '#D2BA4C',
          pointRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Pricing (% of base)' } },
          y: { title: { display: true, text: 'Market Share (%)' } }
        }
      }
    });
  }
}

function renderCharts() {
  const quarters = simulationState.history.slice(1, simulationState.currentQuarter + 1).map(h => `Q${h.quarter}`);
  const revenue = simulationState.history.slice(1, simulationState.currentQuarter + 1).map(h => h.revenue);
  const profit = simulationState.history.slice(1, simulationState.currentQuarter + 1).map(h => h.netProfit);
  const marketShare = simulationState.history.slice(1, simulationState.currentQuarter + 1).map(h => h.marketShare);
  const satisfaction = simulationState.history.slice(1, simulationState.currentQuarter + 1).map(h => h.customerSatisfaction);
  
  // Revenue Chart
  new Chart(document.getElementById('revenueChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Revenue ($M)',
        data: revenue,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  // Profit Chart
  new Chart(document.getElementById('profitChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Net Profit ($M)',
        data: profit,
        borderColor: '#FFC185',
        backgroundColor: 'rgba(255, 193, 133, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  // Market Share Chart
  new Chart(document.getElementById('marketShareChart'), {
    type: 'bar',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Market Share (%)',
        data: marketShare,
        backgroundColor: '#B4413C'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
  
  // Satisfaction Chart
  new Chart(document.getElementById('satisfactionChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Customer Satisfaction',
        data: satisfaction,
        borderColor: '#5D878F',
        backgroundColor: 'rgba(93, 135, 143, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          min: 0,
          max: 100
        }
      }
    }
  });
}

// Decision Screen
function renderDecisions() {
  const d = simulationState.currentDecisions;
  
  return `
    <div class="header">
      <div class="header-content">
        <h1>Make Your Decision</h1>
        <div class="quarter-badge">Quarter ${simulationState.currentQuarter} of ${simulationState.totalQuarters}</div>
      </div>
    </div>
    
    <div class="container">
      <div class="decision-form">
        <div class="strategy-tips">
          <h3>💡 Strategy Tips</h3>
          <ul>
            <li>Review your analytics dashboard to understand current trends</li>
            <li>Balance short-term profitability with long-term growth</li>
            <li>Consider how each decision impacts multiple metrics</li>
            <li>Watch your cash position - don't overspend!</li>
          </ul>
        </div>
        
        ${simulationState.currentQuarter > 1 ? `
        <div class="narrative-box" style="background-color: var(--color-bg-1); border-color: var(--color-primary); margin-bottom: var(--space-20);">
          <h3><span class="ai-badge">✨ AI</span> Insights for This Decision</h3>
          ${generateDecisionInsights().map(insight => `<p>• ${insight}</p>`).join('')}
        </div>
        ` : ''}
        
        <div class="decision-category">
          <h3>Marketing Investment</h3>
          <div class="decision-value" id="marketingValue">$${d.marketing.toFixed(0)} million</div>
          <p class="decision-description">Increases market share and customer awareness. Higher spend = higher market share but reduces profit margins.</p>
          <div class="slider-container">
            <input type="range" min="0" max="100" value="${d.marketing}" class="slider" id="marketingSlider">
            <div class="slider-labels">
              <span>$0M</span>
              <span>$100M</span>
            </div>
          </div>
        </div>
        
        <div class="decision-category">
          <h3>Product Quality Investment</h3>
          <div class="decision-value" id="qualityValue">${d.quality.toFixed(0)}% of revenue</div>
          <p class="decision-description">Improves product quality and customer satisfaction. Higher investment = higher satisfaction and customer retention but increases costs.</p>
          <div class="slider-container">
            <input type="range" min="0" max="100" value="${d.quality}" class="slider" id="qualitySlider">
            <div class="slider-labels">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <div class="decision-category">
          <h3>Pricing Strategy</h3>
          <div class="decision-value" id="pricingValue">${d.pricing.toFixed(0)}% of base price</div>
          <p class="decision-description">Set product pricing relative to base price. Higher prices = higher margins but lower sales volume and market share.</p>
          <div class="slider-container">
            <input type="range" min="80" max="120" value="${d.pricing}" class="slider" id="pricingSlider">
            <div class="slider-labels">
              <span>80%</span>
              <span>120%</span>
            </div>
          </div>
        </div>
        
        <div class="decision-category">
          <h3>Operational Efficiency</h3>
          <div class="decision-value" id="efficiencyValue">${d.efficiency.toFixed(0)}% focus</div>
          <p class="decision-description">Invest in operational improvements. Higher focus = lower costs but requires strong execution.</p>
          <div class="slider-container">
            <input type="range" min="0" max="100" value="${d.efficiency}" class="slider" id="efficiencySlider">
            <div class="slider-labels">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary btn-large" onclick="goToAnalytics()">View Analytics</button>
          <button class="btn btn-primary btn-large" onclick="submitDecision()">Submit Decision</button>
        </div>
      </div>
    </div>
  `;
}

function attachSliderListeners() {
  document.getElementById('marketingSlider').addEventListener('input', (e) => {
    simulationState.currentDecisions.marketing = parseFloat(e.target.value);
    document.getElementById('marketingValue').textContent = `$${e.target.value} million`;
  });
  
  document.getElementById('qualitySlider').addEventListener('input', (e) => {
    simulationState.currentDecisions.quality = parseFloat(e.target.value);
    document.getElementById('qualityValue').textContent = `${e.target.value}% of revenue`;
  });
  
  document.getElementById('pricingSlider').addEventListener('input', (e) => {
    simulationState.currentDecisions.pricing = parseFloat(e.target.value);
    document.getElementById('pricingValue').textContent = `${e.target.value}% of base price`;
  });
  
  document.getElementById('efficiencySlider').addEventListener('input', (e) => {
    simulationState.currentDecisions.efficiency = parseFloat(e.target.value);
    document.getElementById('efficiencyValue').textContent = `${e.target.value}% focus`;
  });
}

// Results Screen
function renderResults() {
  const m = simulationState.metrics;
  const prevMetrics = simulationState.history[simulationState.currentQuarter - 1];
  const narrative = generateNarrative();
  const aiAnalysis = generateQuarterAIAnalysis();
  
  return `
    <div class="header">
      <div class="header-content">
        <h1>Quarter ${simulationState.currentQuarter} Results</h1>
        <div class="quarter-badge">Completed</div>
      </div>
    </div>
    
    <div class="container">
      <div class="results-header">
        <h2>Results for Quarter ${simulationState.currentQuarter}</h2>
      </div>
      
      <div class="narrative-box">
        <h3>What Happened</h3>
        <p>${narrative}</p>
      </div>
      
      <div class="narrative-box" style="background-color: var(--color-bg-5); border-color: var(--color-primary);">
        <h3><span class="ai-badge">🤖 AI</span> AI Analysis</h3>
        ${aiAnalysis.map(insight => `<p>• ${insight}</p>`).join('')}
      </div>
      
      <div class="dashboard-grid">
        ${renderMetricCard('Revenue', `$${m.revenue.toFixed(1)}M`, prevMetrics.revenue, m.revenue, 'M')}
        ${renderMetricCard('Gross Margin', `${m.grossMargin.toFixed(1)}%`, prevMetrics.grossMargin, m.grossMargin, '%')}
        ${renderMetricCard('Net Profit', `$${m.netProfit.toFixed(1)}M`, prevMetrics.netProfit, m.netProfit, 'M')}
        ${renderMetricCard('Market Share', `${m.marketShare.toFixed(1)}%`, prevMetrics.marketShare, m.marketShare, '%')}
        ${renderMetricCard('Customer Satisfaction', m.customerSatisfaction.toFixed(0), prevMetrics.customerSatisfaction, m.customerSatisfaction, '')}
        ${renderMetricCard('Cash Position', `$${m.cashPosition.toFixed(1)}M`, prevMetrics.cashPosition, m.cashPosition, 'M')}
        ${renderMetricCard('Employee Productivity', m.employeeProductivity.toFixed(0), prevMetrics.employeeProductivity, m.employeeProductivity, '')}
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary btn-large" onclick="continueToNextQuarter()">${simulationState.currentQuarter < 8 ? 'Continue to Next Quarter' : 'View Final Results'}</button>
        <button class="btn btn-secondary btn-large" onclick="goToAnalytics()">View Analytics</button>
      </div>
    </div>
  `;
}

function generateQuarterAIAnalysis() {
  const m = simulationState.metrics;
  const prev = simulationState.history[simulationState.currentQuarter - 1];
  const d = simulationState.currentDecisions;
  const analysis = [];
  
  // Profit analysis
  const profitChange = m.netProfit - prev.netProfit;
  if (profitChange > 2) {
    analysis.push(`You earned $${m.netProfit.toFixed(1)}M profit this quarter (+${((profitChange / prev.netProfit) * 100).toFixed(0)}% vs previous quarter). Excellent financial performance!`);
  } else if (profitChange < -2) {
    analysis.push(`Profit decreased to $${m.netProfit.toFixed(1)}M (${((profitChange / prev.netProfit) * 100).toFixed(0)}% vs previous quarter). Review cost structure and pricing.`);
  } else {
    analysis.push(`Stable profit performance at $${m.netProfit.toFixed(1)}M this quarter.`);
  }
  
  // Strategy effectiveness
  if (d.pricing > 110 && m.grossMargin > prev.grossMargin) {
    analysis.push('Your premium pricing strategy successfully improved margins.');
  } else if (d.pricing < 95 && m.marketShare > prev.marketShare) {
    analysis.push('Competitive pricing effectively drove market share growth.');
  }
  
  // Marketing effectiveness
  const marketShareGrowth = m.marketShare - prev.marketShare;
  if (d.marketing > 70 && marketShareGrowth > 1) {
    analysis.push(`Marketing investment paying off - market share increased by ${marketShareGrowth.toFixed(1)} percentage points.`);
  }
  
  // Quality investment
  const satisfactionChange = m.customerSatisfaction - prev.customerSatisfaction;
  if (d.quality > 70 && satisfactionChange > 3) {
    analysis.push(`Quality investment is working - customer satisfaction improved by ${satisfactionChange.toFixed(0)} points.`);
  }
  
  // Overall assessment
  if (m.netProfit > 18 && m.marketShare > 25) {
    analysis.push('Strong overall performance - you\'re balancing profitability with growth effectively.');
  }
  
  return analysis.length > 0 ? analysis : ['Continue monitoring your metrics and adjusting strategy as needed.'];
}

function generateNarrative() {
  const d = simulationState.currentDecisions;
  const m = simulationState.metrics;
  const prev = simulationState.history[simulationState.currentQuarter - 1];
  
  let narrative = [];
  
  // Marketing narrative
  if (d.marketing > 70) {
    narrative.push('Your aggressive marketing campaign significantly increased brand awareness');
  } else if (d.marketing < 30) {
    narrative.push('Limited marketing spend resulted in slower market share growth');
  }
  
  // Pricing narrative
  if (d.pricing > 110) {
    narrative.push('Premium pricing improved margins but reduced sales volume');
  } else if (d.pricing < 90) {
    narrative.push('Competitive pricing drove higher sales volume but compressed margins');
  }
  
  // Quality narrative
  if (d.quality > 70) {
    narrative.push('Heavy quality investments paid off with improved customer satisfaction');
  } else if (d.quality < 30) {
    narrative.push('Limited quality investment raised concerns about product excellence');
  }
  
  // Efficiency narrative
  if (d.efficiency > 70) {
    narrative.push('Strong operational focus reduced costs and improved productivity');
  }
  
  // Performance narrative
  if (m.netProfit > prev.netProfit) {
    narrative.push('Overall profitability improved this quarter');
  } else {
    narrative.push('Profitability declined due to increased costs');
  }
  
  return narrative.join('. ') + '.';
}

// Final Results
function renderFinalResults() {
  const score = calculateFinalScore();
  const benchmark = 70;
  const insights = generateLearningInsights();
  
  return `
    <div class="header">
      <div class="header-content">
        <h1>Simulation Complete!</h1>
        <div class="quarter-badge">Final Results</div>
      </div>
    </div>
    
    <div class="container">
      <div class="final-score">
        <h2>Your Performance Score</h2>
        <div class="score-display">${score}/100</div>
        <p class="benchmark">Benchmark: ${benchmark}/100</p>
        <p style="font-size: var(--font-size-lg); color: var(--color-text);">
          ${score >= benchmark ? '🎉 Excellent work! You exceeded the benchmark.' : '💪 Good effort! Continue improving your strategy.'}
        </p>
      </div>
      
      <h3 style="margin: var(--space-32) 0 var(--space-16) 0; color: var(--color-text);">Performance Over 8 Quarters</h3>
      
      <div class="charts-grid">
        <div class="chart-container">
          <h3>Revenue Trend</h3>
          <div class="chart-wrapper">
            <canvas id="finalRevenueChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Profitability Trend</h3>
          <div class="chart-wrapper">
            <canvas id="finalProfitChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Market Share Growth</h3>
          <div class="chart-wrapper">
            <canvas id="finalMarketChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Customer Satisfaction</h3>
          <div class="chart-wrapper">
            <canvas id="finalSatisfactionChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="learning-insights">
        <h3>🎓 Key Learning Insights</h3>
        <ul>
          ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background-color: var(--color-surface); border: 2px solid var(--color-primary); border-radius: var(--radius-lg); padding: var(--space-24); margin: var(--space-32) 0;">
        <h3 style="margin-bottom: var(--space-16);"><span class="ai-badge">✨ AI</span> Advanced Performance Analysis</h3>
        ${renderFinalAnalysisSummary()}
      </div>
      
      <h3 style="margin: var(--space-32) 0 var(--space-16) 0; color: var(--color-text);">Complete Performance Summary</h3>
      <div class="data-table">
        ${renderCompleteDataTable()}
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-secondary btn-large" onclick="goToAnalytics()">View Full Analytics</button>
        <button class="btn btn-secondary btn-large" onclick="downloadCompleteReport()">Download Report</button>
        <button class="btn btn-primary btn-large" onclick="restartSimulation()">Restart Simulation</button>
      </div>
    </div>
  `;
}

function renderCompleteDataTable() {
  let rows = '';
  for (let i = 1; i <= 8; i++) {
    const data = simulationState.history[i];
    if (data) {
      rows += `
        <tr>
          <td>Q${data.quarter}</td>
          <td>$${data.revenue.toFixed(1)}M</td>
          <td>${data.grossMargin.toFixed(1)}%</td>
          <td>$${data.netProfit.toFixed(1)}M</td>
          <td>${data.marketShare.toFixed(1)}%</td>
          <td>${data.customerSatisfaction.toFixed(0)}</td>
          <td>$${data.cashPosition.toFixed(1)}M</td>
          <td>${data.employeeProductivity.toFixed(0)}</td>
        </tr>
      `;
    }
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Revenue</th>
          <th>Margin</th>
          <th>Profit</th>
          <th>Market Share</th>
          <th>Satisfaction</th>
          <th>Cash</th>
          <th>Productivity</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderFinalCharts() {
  const quarters = simulationState.history.slice(1, 9).map(h => `Q${h.quarter}`);
  const revenue = simulationState.history.slice(1, 9).map(h => h.revenue);
  const profit = simulationState.history.slice(1, 9).map(h => h.netProfit);
  const marketShare = simulationState.history.slice(1, 9).map(h => h.marketShare);
  const satisfaction = simulationState.history.slice(1, 9).map(h => h.customerSatisfaction);
  
  new Chart(document.getElementById('finalRevenueChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Revenue ($M)',
        data: revenue,
        borderColor: '#1FB8CD',
        backgroundColor: 'rgba(31, 184, 205, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
  
  new Chart(document.getElementById('finalProfitChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Net Profit ($M)',
        data: profit,
        borderColor: '#FFC185',
        backgroundColor: 'rgba(255, 193, 133, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
  
  new Chart(document.getElementById('finalMarketChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Market Share (%)',
        data: marketShare,
        borderColor: '#B4413C',
        backgroundColor: 'rgba(180, 65, 60, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });
  
  new Chart(document.getElementById('finalSatisfactionChart'), {
    type: 'line',
    data: {
      labels: quarters,
      datasets: [{
        label: 'Customer Satisfaction',
        data: satisfaction,
        borderColor: '#5D878F',
        backgroundColor: 'rgba(93, 135, 143, 0.1)',
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { min: 0, max: 100 } }
    }
  });
}

function calculateFinalScore() {
  const history = simulationState.history.slice(1, 9);
  
  // Profitability (30%)
  const avgProfit = history.reduce((sum, h) => sum + h.netProfit, 0) / history.length;
  const profitScore = Math.min(100, (avgProfit / 20) * 100);
  
  // Growth (20%)
  const revenueGrowth = ((history[7].revenue - history[0].revenue) / history[0].revenue) * 100;
  const growthScore = Math.min(100, Math.max(0, revenueGrowth * 2));
  
  // Market Position (20%)
  const avgMarketShare = history.reduce((sum, h) => sum + h.marketShare, 0) / history.length;
  const marketScore = Math.min(100, (avgMarketShare / 35) * 100);
  
  // Customer Loyalty (15%)
  const avgSatisfaction = history.reduce((sum, h) => sum + h.customerSatisfaction, 0) / history.length;
  const satisfactionScore = avgSatisfaction;
  
  // Operational Health (15%)
  const finalCash = history[7].cashPosition;
  const avgProductivity = history.reduce((sum, h) => sum + h.employeeProductivity, 0) / history.length;
  const operationalScore = (finalCash > 15 ? 50 : 25) + (avgProductivity / 2);
  
  const totalScore = (
    profitScore * 0.30 +
    growthScore * 0.20 +
    marketScore * 0.20 +
    satisfactionScore * 0.15 +
    operationalScore * 0.15
  );
  
  return Math.round(totalScore);
}

function generateLearningInsights() {
  const insights = [];
  const history = simulationState.history.slice(1, 9);
  
  // Revenue trend
  const revenueGrowth = history[7].revenue - history[0].revenue;
  if (revenueGrowth > 20) {
    insights.push('Excellent revenue growth - you successfully scaled the business');
  } else if (revenueGrowth < 0) {
    insights.push('Revenue declined - consider balancing pricing and market investment');
  }
  
  // Profitability
  const avgProfit = history.reduce((sum, h) => sum + h.netProfit, 0) / history.length;
  if (avgProfit > 18) {
    insights.push('Strong profitability management throughout the simulation');
  } else if (avgProfit < 12) {
    insights.push('Profitability was challenged - watch spending on marketing and quality');
  }
  
  // Customer satisfaction
  const avgSatisfaction = history.reduce((sum, h) => sum + h.customerSatisfaction, 0) / history.length;
  if (avgSatisfaction > 80) {
    insights.push('You maintained high customer satisfaction - this drives long-term loyalty');
  } else if (avgSatisfaction < 65) {
    insights.push('Customer satisfaction needs attention - invest more in quality and service');
  }
  
  // Market share
  const marketShareGrowth = history[7].marketShare - history[0].marketShare;
  if (marketShareGrowth > 5) {
    insights.push('Great market share expansion through effective marketing');
  } else if (marketShareGrowth < -5) {
    insights.push('Market share declined - pricing and marketing balance is crucial');
  }
  
  // Cash position
  if (history[7].cashPosition < 10) {
    insights.push('Cash position became tight - maintain stronger financial reserves');
  } else if (history[7].cashPosition > 30) {
    insights.push('Strong cash reserves maintained - good financial management');
  }
  
  // General insights
  insights.push('Understanding trade-offs between growth and profitability is key to success');
  insights.push('Quality investments yield long-term benefits in customer retention');
  
  return insights;
}

// Business Logic - Calculate Quarterly Results
function calculateQuarterlyResults() {
  const d = simulationState.currentDecisions;
  const prev = simulationState.metrics;
  
  // Market growth factor (random 0-2%)
  const marketGrowth = Math.random() * 0.02;
  
  // Marketing effect on revenue
  const marketingEffect = (d.marketing / 100) * 0.15;
  
  // Pricing effect on revenue (negative for high prices)
  const pricingEffect = (d.pricing - 100) / 500;
  
  // Efficiency effect
  const efficiencyEffect = (d.efficiency / 100) * 0.05;
  
  // Calculate new revenue
  const revenueMultiplier = 1 + marketGrowth + marketingEffect - pricingEffect + efficiencyEffect;
  const newRevenue = prev.revenue * revenueMultiplier * (d.pricing / 100);
  
  // Calculate gross margin
  const qualityCostImpact = (d.quality / 100) * 10;
  const efficiencyMarginBoost = (d.efficiency / 100) * 5;
  let newMargin = prev.grossMargin - qualityCostImpact + efficiencyMarginBoost;
  newMargin = Math.max(40, Math.min(75, newMargin));
  
  // Calculate costs
  const marketingSpend = d.marketing * 0.5;
  const qualityCosts = newRevenue * (d.quality / 100);
  
  // Calculate net profit
  const grossProfit = newRevenue * (newMargin / 100);
  const newNetProfit = grossProfit - marketingSpend - qualityCosts;
  
  // Calculate market share
  const marketingShareBoost = (d.marketing / 100) * 2;
  const pricingShareImpact = (d.pricing - 100) / 50;
  const satisfactionImpact = (prev.customerSatisfaction - 75) / 100;
  let newMarketShare = prev.marketShare + marketingShareBoost - pricingShareImpact + satisfactionImpact;
  newMarketShare = Math.max(5, Math.min(45, newMarketShare));
  
  // Calculate customer satisfaction
  const qualityBoost = (d.quality / 100) * 8;
  const pricingPenalty = (d.pricing - 100) / 5;
  const efficiencyBoost = (d.efficiency / 100) * 2;
  let newSatisfaction = prev.customerSatisfaction + qualityBoost - pricingPenalty + efficiencyBoost;
  newSatisfaction = Math.max(40, Math.min(100, newSatisfaction));
  
  // Calculate cash position
  let newCash = prev.cashPosition + newNetProfit - marketingSpend - (d.quality * 0.3);
  newCash = Math.max(5, newCash);
  
  // Calculate employee productivity
  const productivityChange = (d.efficiency / 100) * 5 + (Math.random() * 5 - 3);
  let newProductivity = prev.employeeProductivity + productivityChange;
  newProductivity = Math.max(60, Math.min(100, newProductivity));
  
  // Update metrics
  simulationState.metrics = {
    revenue: newRevenue,
    grossMargin: newMargin,
    netProfit: newNetProfit,
    marketShare: newMarketShare,
    customerSatisfaction: newSatisfaction,
    cashPosition: newCash,
    employeeProductivity: newProductivity,
    basePrice: prev.basePrice
  };
  
  // Store in history
  simulationState.history.push({
    quarter: simulationState.currentQuarter,
    ...JSON.parse(JSON.stringify(simulationState.metrics))
  });
}

// Navigation Functions
function startSimulation() {
  simulationState.currentView = 'dashboard';
  renderView();
}

function goToDashboard() {
  simulationState.currentView = 'dashboard';
  renderView();
}

function goToAnalytics() {
  simulationState.currentView = 'analytics';
  renderView();
}

function goToDecisions() {
  simulationState.currentView = 'decisions';
  renderView();
}

function previewDecision() {
  alert('Preview: Your decisions will impact multiple metrics. Check the analytics dashboard to see trends before committing!');
}

function submitDecision() {
  // Store decisions in history
  simulationState.decisionsHistory.push({
    quarter: simulationState.currentQuarter,
    ...JSON.parse(JSON.stringify(simulationState.currentDecisions))
  });
  
  calculateQuarterlyResults();
  simulationState.currentView = 'results';
  renderView();
}

function continueToNextQuarter() {
  if (simulationState.currentQuarter < 8) {
    simulationState.currentQuarter++;
    // Reset decisions to defaults
    simulationState.currentDecisions = {
      marketing: 50,
      quality: 50,
      pricing: 100,
      efficiency: 50
    };
    simulationState.currentView = 'dashboard';
    renderView();
  } else {
    simulationState.currentView = 'final';
    renderView();
  }
}

function downloadReport() {
  alert('In a production version, this would download a PDF report with your complete performance summary!');
}

// Tab 5: What-If Analysis
function renderWhatIfTab() {
  const baseQuarter = simulationState.history[simulationState.whatIfQuarter];
  const whatIfResults = calculateWhatIfImpact();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">What-If Scenario Analysis</h2>
    
    <div class="narrative-box" style="margin-bottom: var(--space-24);">
      <h3>Scenario Simulation</h3>
      <p>Adjust decision variables to see estimated impact on key metrics without affecting your actual simulation. 
      This helps you understand the sensitivity of outcomes to different decisions.</p>
    </div>
    
    <div class="what-if-controls">
      <div style="margin-bottom: var(--space-20);">
        <label style="display: block; margin-bottom: var(--space-8); font-weight: var(--font-weight-medium);">Base Quarter</label>
        <select class="form-control" onchange="updateWhatIfQuarter(this.value)" style="max-width: 200px;">
          ${Array.from({length: simulationState.currentQuarter}, (_, i) => i + 1).map(q => `
            <option value="${q}" ${simulationState.whatIfQuarter === q ? 'selected' : ''}>Quarter ${q}</option>
          `).join('')}
        </select>
      </div>
      
      <div class="what-if-slider">
        <label>Marketing Investment: <strong id="whatIfMarketingValue">$${simulationState.whatIfDecisions.marketing}M</strong></label>
        <input type="range" min="0" max="100" value="${simulationState.whatIfDecisions.marketing}" 
               class="slider" oninput="updateWhatIfDecision('marketing', this.value)">
      </div>
      
      <div class="what-if-slider">
        <label>Quality Investment: <strong id="whatIfQualityValue">${simulationState.whatIfDecisions.quality}%</strong></label>
        <input type="range" min="0" max="100" value="${simulationState.whatIfDecisions.quality}" 
               class="slider" oninput="updateWhatIfDecision('quality', this.value)">
      </div>
      
      <div class="what-if-slider">
        <label>Pricing: <strong id="whatIfPricingValue">${simulationState.whatIfDecisions.pricing}%</strong></label>
        <input type="range" min="80" max="120" value="${simulationState.whatIfDecisions.pricing}" 
               class="slider" oninput="updateWhatIfDecision('pricing', this.value)">
      </div>
      
      <div class="what-if-slider">
        <label>Operational Efficiency: <strong id="whatIfEfficiencyValue">${simulationState.whatIfDecisions.efficiency}%</strong></label>
        <input type="range" min="0" max="100" value="${simulationState.whatIfDecisions.efficiency}" 
               class="slider" oninput="updateWhatIfDecision('efficiency', this.value)">
      </div>
    </div>
    
    <h3 style="margin: var(--space-24) 0 var(--space-16) 0;">Estimated Impact</h3>
    <div class="what-if-results">
      <div class="impact-card">
        <div class="label">Revenue Impact</div>
        <div class="impact ${whatIfResults.revenue.change >= 0 ? 'positive-cell' : 'negative-cell'}">
          ${whatIfResults.revenue.change >= 0 ? '+' : ''}${whatIfResults.revenue.change.toFixed(1)}%
        </div>
      </div>
      <div class="impact-card">
        <div class="label">Profit Impact</div>
        <div class="impact ${whatIfResults.profit.change >= 0 ? 'positive-cell' : 'negative-cell'}">
          ${whatIfResults.profit.change >= 0 ? '+' : ''}${whatIfResults.profit.change.toFixed(1)}%
        </div>
      </div>
      <div class="impact-card">
        <div class="label">Market Share Impact</div>
        <div class="impact ${whatIfResults.marketShare.change >= 0 ? 'positive-cell' : 'negative-cell'}">
          ${whatIfResults.marketShare.change >= 0 ? '+' : ''}${whatIfResults.marketShare.change.toFixed(1)}%
        </div>
      </div>
      <div class="impact-card">
        <div class="label">Satisfaction Impact</div>
        <div class="impact ${whatIfResults.satisfaction.change >= 0 ? 'positive-cell' : 'negative-cell'}">
          ${whatIfResults.satisfaction.change >= 0 ? '+' : ''}${whatIfResults.satisfaction.change.toFixed(1)} pts
        </div>
      </div>
    </div>
    
    <div class="insights-grid" style="margin-top: var(--space-24);">
      ${whatIfResults.insights.map(insight => `
        <div class="insight-card info">
          <h4>${insight}</h4>
        </div>
      `).join('')}
    </div>
  `;
}

// Tab 6: Benchmarking
function renderBenchmarkingTab() {
  const benchmarks = calculateBenchmarks();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">Competitive Benchmarking</h2>
    
    <div class="narrative-box" style="margin-bottom: var(--space-24);">
      <h3>Your Performance vs. Industry Standards</h3>
      <p>Compare your performance against industry benchmarks and competitor averages. 
      Percentile rankings show where you stand relative to other business managers.</p>
    </div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h4>Overall Ranking</h4>
        <div class="value" style="color: ${benchmarks.overall >= 70 ? 'var(--color-success)' : 'var(--color-warning)'}">
          Top ${100 - benchmarks.overall}%
        </div>
      </div>
      <div class="stat-card">
        <h4>Revenue Ranking</h4>
        <div class="value">Top ${100 - benchmarks.revenue}%</div>
      </div>
      <div class="stat-card">
        <h4>Profitability Ranking</h4>
        <div class="value">Top ${100 - benchmarks.profit}%</div>
      </div>
      <div class="stat-card">
        <h4>Growth Ranking</h4>
        <div class="value">Top ${100 - benchmarks.growth}%</div>
      </div>
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Metric-by-Metric Comparison</h3>
    <div class="benchmark-bars">
      <div class="benchmark-bar">
        <div class="label">Avg Revenue</div>
        <div class="bar">
          <div class="fill" style="width: ${benchmarks.revenuePercent}%"></div>
        </div>
        <div class="value">${benchmarks.revenuePercent}%</div>
      </div>
      <div class="benchmark-bar">
        <div class="label">Avg Profit</div>
        <div class="bar">
          <div class="fill" style="width: ${benchmarks.profitPercent}%"></div>
        </div>
        <div class="value">${benchmarks.profitPercent}%</div>
      </div>
      <div class="benchmark-bar">
        <div class="label">Market Share</div>
        <div class="bar">
          <div class="fill" style="width: ${benchmarks.marketSharePercent}%"></div>
        </div>
        <div class="value">${benchmarks.marketSharePercent}%</div>
      </div>
      <div class="benchmark-bar">
        <div class="label">Satisfaction</div>
        <div class="bar">
          <div class="fill" style="width: ${benchmarks.satisfactionPercent}%"></div>
        </div>
        <div class="value">${benchmarks.satisfactionPercent}%</div>
      </div>
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Areas of Excellence &amp; Improvement</h3>
    <div class="insights-grid">
      ${benchmarks.strengths.map(strength => `
        <div class="insight-card success">
          <h4>✅ ${strength.metric}</h4>
          <p>${strength.message}</p>
        </div>
      `).join('')}
      ${benchmarks.improvements.map(improvement => `
        <div class="insight-card warning">
          <h4>💡 ${improvement.metric}</h4>
          <p>${improvement.message}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// Tab 7: AI Insights
function renderAIInsightsTab() {
  const aiInsights = generateAIInsights();
  
  return `
    <h2 style="margin-bottom: var(--space-24);">AI-Powered Pattern Recognition <span class="ai-badge">✨ AI</span></h2>
    
    <div class="insights-grid">
      <div class="insight-card" style="grid-column: span 2;">
        <h4>🎯 Strategy Classification</h4>
        <p>Your strategy has been identified as: <span class="strategy-badge">${aiInsights.strategyType}</span></p>
        <p style="margin-top: var(--space-8);">${aiInsights.strategyDescription}</p>
      </div>
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Learning Curve Analysis</h3>
    <div class="narrative-box">
      <h3>📈 Decision Quality Improvement</h3>
      <p>${aiInsights.learningCurve}</p>
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Strategic Shifts Detected</h3>
    <div class="insights-grid">
      ${aiInsights.shifts.map(shift => `
        <div class="insight-card info">
          <h4>${shift.quarter}</h4>
          <p>${shift.description}</p>
        </div>
      `).join('')}
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">Anomaly Detection</h3>
    <div class="insights-grid">
      ${aiInsights.anomalies.map(anomaly => `
        <div class="insight-card warning">
          <h4>⚠️ ${anomaly.quarter}</h4>
          <p>${anomaly.reason}</p>
        </div>
      `).join('')}
    </div>
    
    <h3 style="margin: var(--space-32) 0 var(--space-16) 0;">AI Recommendations</h3>
    <div class="insights-grid">
      ${aiInsights.recommendations.map(rec => `
        <div class="insight-card success">
          <h4>💡 ${rec.title}</h4>
          <p>${rec.message}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// Tab 8: Export
function renderExportTab() {
  return `
    <h2 style="margin-bottom: var(--space-24);">Data Export &amp; Reports</h2>
    
    <div class="narrative-box" style="margin-bottom: var(--space-24);">
      <h3>💾 Export Your Data</h3>
      <p>Download your simulation data in various formats for external analysis in Excel, Python, R, or other tools. 
      All exports include complete historical data, decisions, and performance metrics.</p>
    </div>
    
    <div class="export-grid">
      <div class="export-card">
        <h4>📄 CSV Export</h4>
        <p>Download all performance metrics in CSV format for spreadsheet analysis</p>
        <button class="btn btn-primary" onclick="downloadCSV()">Download CSV</button>
      </div>
      
      <div class="export-card">
        <h4>📊 Decisions History</h4>
        <p>Export all your quarterly decisions in CSV format</p>
        <button class="btn btn-primary" onclick="downloadDecisionsCSV()">Download Decisions</button>
      </div>
      
      <div class="export-card">
        <h4>📝 JSON Data</h4>
        <p>Download raw JSON data for custom analysis and programming</p>
        <button class="btn btn-primary" onclick="downloadJSON()">Download JSON</button>
      </div>
      
      <div class="export-card">
        <h4>📊 Analytics Summary</h4>
        <p>Export statistical summaries and calculated insights</p>
        <button class="btn btn-primary" onclick="downloadAnalyticsSummary()">Download Summary</button>
      </div>
      
      <div class="export-card">
        <h4>📈 Complete Report</h4>
        <p>Generate comprehensive performance report with all metrics</p>
        <button class="btn btn-primary" onclick="downloadCompleteReport()">Generate Report</button>
      </div>
      
      <div class="export-card">
        <h4>🔗 Share Data</h4>
        <p>Copy data to clipboard for easy sharing</p>
        <button class="btn btn-secondary" onclick="copyDataToClipboard()">Copy to Clipboard</button>
      </div>
    </div>
  `;
}

function restartSimulation() {
  // Reset everything
  simulationState.currentQuarter = 1;
  simulationState.currentView = 'welcome';
  simulationState.metrics = {
    revenue: 50,
    grossMargin: 65,
    netProfit: 15,
    marketShare: 20,
    customerSatisfaction: 75,
    cashPosition: 25,
    employeeProductivity: 80,
    basePrice: 100
  };
  simulationState.history = [{
    quarter: 0,
    ...JSON.parse(JSON.stringify(simulationState.metrics))
  }];
  simulationState.currentDecisions = {
    marketing: 50,
    quality: 50,
    pricing: 100,
    efficiency: 50
  };
  renderView();
}

// Analytics Calculation Functions

function calculateDescriptiveStats() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  
  const calculateStats = (values) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);
    const sorted = [...values].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    return { mean, stdDev, median, min: Math.min(...values), max: Math.max(...values) };
  };
  
  return {
    revenue: calculateStats(history.map(h => h.revenue)),
    profit: calculateStats(history.map(h => h.netProfit)),
    marketShare: calculateStats(history.map(h => h.marketShare)),
    satisfaction: calculateStats(history.map(h => h.customerSatisfaction))
  };
}

function generateAdvancedInsights() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  const insights = [];
  
  // Revenue growth rate
  if (history.length >= 2) {
    const revenueGrowth = ((history[history.length - 1].revenue - history[0].revenue) / history[0].revenue) * 100;
    insights.push({
      type: revenueGrowth > 20 ? 'success' : revenueGrowth < 0 ? 'warning' : 'info',
      title: 'Revenue Growth Rate',
      message: `Your revenue has ${revenueGrowth >= 0 ? 'grown' : 'declined'} by ${Math.abs(revenueGrowth).toFixed(1)}% over ${history.length} quarters (${(revenueGrowth / history.length).toFixed(1)}% per quarter average).`
    });
  }
  
  // Profitability trend
  const avgProfit = history.reduce((sum, h) => sum + h.netProfit, 0) / history.length;
  const profitMargin = (avgProfit / history.reduce((sum, h) => sum + h.revenue, 0)) * history.length * 100;
  insights.push({
    type: profitMargin > 25 ? 'success' : profitMargin < 15 ? 'warning' : 'info',
    title: 'Profitability Analysis',
    message: `Average profit margin of ${profitMargin.toFixed(1)}%. ${profitMargin > 25 ? 'Excellent profitability!' : profitMargin < 15 ? 'Consider cost optimization.' : 'Healthy profit margins.'}`
  });
  
  // Market share volatility
  const msValues = history.map(h => h.marketShare);
  const msVolatility = Math.sqrt(msValues.reduce((sum, val, i, arr) => {
    const mean = arr.reduce((a, b) => a + b) / arr.length;
    return sum + Math.pow(val - mean, 2);
  }, 0) / msValues.length);
  insights.push({
    type: msVolatility < 2 ? 'success' : msVolatility > 5 ? 'warning' : 'info',
    title: 'Market Share Stability',
    message: `Market share volatility: ±${msVolatility.toFixed(1)}%. ${msVolatility < 2 ? 'Very stable position.' : msVolatility > 5 ? 'Highly volatile - consider consistency.' : 'Moderate fluctuation.'}`
  });
  
  // Customer satisfaction correlation
  if (decisions.length >= 2) {
    const qualityInvestments = decisions.map(d => d.quality);
    const satisfactionScores = history.map(h => h.customerSatisfaction);
    const correlation = calculateCorrelation(qualityInvestments, satisfactionScores);
    insights.push({
      type: correlation > 0.5 ? 'success' : 'info',
      title: 'Quality Investment Impact',
      message: `Correlation between quality investment and satisfaction: ${correlation.toFixed(2)}. ${correlation > 0.5 ? 'Strong positive relationship!' : 'Moderate relationship observed.'}`
    });
  }
  
  // Marketing ROI
  if (decisions.length >= 2) {
    const avgMarketing = decisions.reduce((sum, d) => sum + d.marketing, 0) / decisions.length;
    const avgRevenue = history.reduce((sum, h) => sum + h.revenue, 0) / history.length;
    const roi = ((avgRevenue - 50) / avgMarketing) * 100;
    insights.push({
      type: roi > 50 ? 'success' : roi < 20 ? 'warning' : 'info',
      title: 'Marketing ROI',
      message: `Average marketing spend: $${avgMarketing.toFixed(1)}M with ROI of ${roi.toFixed(0)}%. ${roi > 50 ? 'Excellent returns!' : roi < 20 ? 'Consider optimization.' : 'Decent returns.'}`
    });
  }
  
  // Price elasticity
  if (decisions.length >= 2) {
    const pricingDecisions = decisions.map(d => d.pricing);
    const marketShares = history.map(h => h.marketShare);
    const elasticity = calculateCorrelation(pricingDecisions, marketShares);
    insights.push({
      type: 'info',
      title: 'Price Elasticity',
      message: `Price-to-market-share correlation: ${elasticity.toFixed(2)}. ${elasticity < -0.3 ? 'High price sensitivity detected.' : 'Moderate price sensitivity.'}`
    });
  }
  
  return insights;
}

function calculateCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  const xMean = x.slice(0, n).reduce((a, b) => a + b) / n;
  const yMean = y.slice(0, n).reduce((a, b) => a + b) / n;
  
  let numerator = 0, xDenom = 0, yDenom = 0;
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenom += xDiff * xDiff;
    yDenom += yDiff * yDiff;
  }
  
  return numerator / Math.sqrt(xDenom * yDenom);
}

function generatePredictions() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  
  // Linear regression for revenue
  const revenueData = history.map((h, i) => ({ x: i + 1, y: h.revenue }));
  const revenuePrediction = linearRegression(revenueData);
  const revenueNext1 = revenuePrediction.predict(history.length + 1);
  const revenueStdDev = Math.sqrt(history.reduce((sum, h) => sum + Math.pow(h.revenue - (history.reduce((a, b) => a + b.revenue, 0) / history.length), 2), 0) / history.length);
  
  // Linear regression for profit
  const profitData = history.map((h, i) => ({ x: i + 1, y: h.netProfit }));
  const profitPrediction = linearRegression(profitData);
  const profitNext1 = profitPrediction.predict(history.length + 1);
  const profitStdDev = Math.sqrt(history.reduce((sum, h) => sum + Math.pow(h.netProfit - (history.reduce((a, b) => a + b.netProfit, 0) / history.length), 2), 0) / history.length);
  
  // Market share prediction
  const msData = history.map((h, i) => ({ x: i + 1, y: h.marketShare }));
  const msPrediction = linearRegression(msData);
  const msNext1 = msPrediction.predict(history.length + 1);
  const msTrend = msPrediction.slope > 0.5 ? 'Growing' : msPrediction.slope < -0.5 ? 'Declining' : 'Stable';
  
  return {
    revenue: {
      next1: revenueNext1,
      next2: revenuePrediction.predict(history.length + 2),
      lower: revenueNext1 - 1.96 * revenueStdDev,
      upper: revenueNext1 + 1.96 * revenueStdDev
    },
    profit: {
      next1: profitNext1,
      next2: profitPrediction.predict(history.length + 2),
      lower: profitNext1 - 1.96 * profitStdDev,
      upper: profitNext1 + 1.96 * profitStdDev
    },
    marketShare: {
      next1: msNext1,
      next2: msPrediction.predict(history.length + 2),
      trend: msTrend
    }
  };
}

function linearRegression(data) {
  const n = data.length;
  const sumX = data.reduce((sum, d) => sum + d.x, 0);
  const sumY = data.reduce((sum, d) => sum + d.y, 0);
  const sumXY = data.reduce((sum, d) => sum + d.x * d.y, 0);
  const sumX2 = data.reduce((sum, d) => sum + d.x * d.x, 0);
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  
  return {
    slope,
    intercept,
    predict: (x) => slope * x + intercept
  };
}

function renderPredictionCharts() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const quarters = history.map(h => `Q${h.quarter}`);
  const predictions = generatePredictions();
  
  // Revenue forecast
  const revenueData = history.map(h => h.revenue);
  const revenuePredictions = [predictions.revenue.next1, predictions.revenue.next2];
  
  new Chart(document.getElementById('revenueForecastChart'), {
    type: 'line',
    data: {
      labels: [...quarters, `Q${simulationState.currentQuarter + 1}`, `Q${simulationState.currentQuarter + 2}`],
      datasets: [
        {
          label: 'Actual Revenue',
          data: [...revenueData, null, null],
          borderColor: '#1FB8CD',
          backgroundColor: 'rgba(31, 184, 205, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Predicted Revenue',
          data: [...Array(history.length - 1).fill(null), revenueData[revenueData.length - 1], ...revenuePredictions],
          borderColor: '#FFC185',
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
  
  // Profit forecast
  const profitData = history.map(h => h.netProfit);
  const profitPredictions = [predictions.profit.next1, predictions.profit.next2];
  
  new Chart(document.getElementById('profitForecastChart'), {
    type: 'line',
    data: {
      labels: [...quarters, `Q${simulationState.currentQuarter + 1}`, `Q${simulationState.currentQuarter + 2}`],
      datasets: [
        {
          label: 'Actual Profit',
          data: [...profitData, null, null],
          borderColor: '#B4413C',
          backgroundColor: 'rgba(180, 65, 60, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Predicted Profit',
          data: [...Array(history.length - 1).fill(null), profitData[profitData.length - 1], ...profitPredictions],
          borderColor: '#D2BA4C',
          borderDash: [5, 5],
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

function renderCorrelationHeatmap() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  
  if (decisions.length < 2) {
    return '<p style="color: var(--color-text-secondary);">Correlation analysis requires at least 2 completed quarters.</p>';
  }
  
  const metrics = {
    'Marketing': decisions.map(d => d.marketing),
    'Quality': decisions.map(d => d.quality),
    'Pricing': decisions.map(d => d.pricing),
    'Revenue': history.map(h => h.revenue),
    'Profit': history.map(h => h.netProfit),
    'Market Share': history.map(h => h.marketShare),
    'Satisfaction': history.map(h => h.customerSatisfaction)
  };
  
  const metricNames = Object.keys(metrics);
  let html = '<table class="heatmap"><thead><tr><th></th>';
  
  metricNames.forEach(name => {
    html += `<th>${name}</th>`;
  });
  html += '</tr></thead><tbody>';
  
  metricNames.forEach(row => {
    html += `<tr><th>${row}</th>`;
    metricNames.forEach(col => {
      const corr = calculateCorrelation(metrics[row], metrics[col]);
      const color = corr > 0 ? `rgba(31, 184, 205, ${Math.abs(corr)})` : `rgba(180, 65, 60, ${Math.abs(corr)})`;
      html += `<td class="heatmap-cell" style="background-color: ${color};">${corr.toFixed(2)}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

function renderKPIs() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  
  const revenueGrowth = history.length > 1 ? ((history[history.length - 1].revenue - history[0].revenue) / history[0].revenue) * 100 : 0;
  const avgMargin = history.reduce((sum, h) => sum + h.grossMargin, 0) / history.length;
  const totalMarketing = decisions.reduce((sum, d) => sum + d.marketing, 0);
  const totalRevenue = history.reduce((sum, h) => sum + h.revenue, 0);
  const marketingROI = decisions.length > 0 ? ((totalRevenue - 50 * history.length) / totalMarketing) * 100 : 0;
  
  return `
    <div class="stat-card">
      <h4>Revenue Growth</h4>
      <div class="value ${revenueGrowth >= 0 ? 'positive-cell' : 'negative-cell'}">${revenueGrowth >= 0 ? '+' : ''}${revenueGrowth.toFixed(1)}%</div>
    </div>
    <div class="stat-card">
      <h4>Avg Gross Margin</h4>
      <div class="value">${avgMargin.toFixed(1)}%</div>
    </div>
    <div class="stat-card">
      <h4>Marketing ROI</h4>
      <div class="value">${marketingROI.toFixed(0)}%</div>
    </div>
    <div class="stat-card">
      <h4>Total Revenue</h4>
      <div class="value">$${totalRevenue.toFixed(1)}M</div>
    </div>
  `;
}

function calculateWhatIfImpact() {
  const baseQuarter = simulationState.history[simulationState.whatIfQuarter];
  const baseDecisions = simulationState.decisionsHistory[simulationState.whatIfQuarter - 1] || {
    marketing: 50, quality: 50, pricing: 100, efficiency: 50
  };
  const whatIf = simulationState.whatIfDecisions;
  
  // Calculate estimated changes
  const marketingDelta = (whatIf.marketing - baseDecisions.marketing) / 100;
  const qualityDelta = (whatIf.quality - baseDecisions.quality) / 100;
  const pricingDelta = (whatIf.pricing - baseDecisions.pricing) / 100;
  const efficiencyDelta = (whatIf.efficiency - baseDecisions.efficiency) / 100;
  
  const revenueChange = (marketingDelta * 15 - pricingDelta * 10 + efficiencyDelta * 5);
  const profitChange = (revenueChange * 0.5 - marketingDelta * 20 - qualityDelta * 15 + efficiencyDelta * 10);
  const marketShareChange = (marketingDelta * 20 - pricingDelta * 15);
  const satisfactionChange = (qualityDelta * 15 - pricingDelta * 5 + efficiencyDelta * 3);
  
  const insights = [];
  if (Math.abs(marketingDelta) > 0.2) {
    insights.push(`${marketingDelta > 0 ? 'Increasing' : 'Decreasing'} marketing by ${Math.abs(marketingDelta * 100).toFixed(0)}% would ${marketingDelta > 0 ? 'boost' : 'reduce'} revenue by ~${Math.abs(marketingDelta * 15).toFixed(1)}%`);
  }
  if (Math.abs(pricingDelta) > 0.05) {
    insights.push(`${pricingDelta > 0 ? 'Raising' : 'Lowering'} prices by ${Math.abs(pricingDelta * 100).toFixed(0)}% would impact market share by ${(pricingDelta * -15).toFixed(1)}%`);
  }
  if (Math.abs(qualityDelta) > 0.2) {
    insights.push(`${qualityDelta > 0 ? 'Increasing' : 'Decreasing'} quality investment would change satisfaction by ${(qualityDelta * 15).toFixed(0)} points`);
  }
  
  return {
    revenue: { change: revenueChange },
    profit: { change: profitChange },
    marketShare: { change: marketShareChange },
    satisfaction: { change: satisfactionChange },
    insights: insights.length > 0 ? insights : ['Adjust sliders to see estimated impacts']
  };
}

function calculateBenchmarks() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  
  const avgRevenue = history.reduce((sum, h) => sum + h.revenue, 0) / history.length;
  const avgProfit = history.reduce((sum, h) => sum + h.netProfit, 0) / history.length;
  const avgMarketShare = history.reduce((sum, h) => sum + h.marketShare, 0) / history.length;
  const avgSatisfaction = history.reduce((sum, h) => sum + h.customerSatisfaction, 0) / history.length;
  const revenueGrowth = history.length > 1 ? ((history[history.length - 1].revenue - history[0].revenue) / history[0].revenue) * 100 : 0;
  
  // Benchmarks (simulated industry standards)
  const revenueBenchmark = 60;
  const profitBenchmark = 16;
  const marketShareBenchmark = 25;
  const satisfactionBenchmark = 78;
  
  const revenuePercent = Math.min(100, (avgRevenue / revenueBenchmark) * 100);
  const profitPercent = Math.min(100, (avgProfit / profitBenchmark) * 100);
  const marketSharePercent = Math.min(100, (avgMarketShare / marketShareBenchmark) * 100);
  const satisfactionPercent = Math.min(100, (avgSatisfaction / satisfactionBenchmark) * 100);
  
  const overallScore = (revenuePercent + profitPercent + marketSharePercent + satisfactionPercent) / 4;
  
  const strengths = [];
  const improvements = [];
  
  if (revenuePercent >= 90) strengths.push({ metric: 'Revenue', message: 'Significantly above industry average' });
  else if (revenuePercent < 70) improvements.push({ metric: 'Revenue', message: 'Below industry benchmark - consider growth strategies' });
  
  if (profitPercent >= 90) strengths.push({ metric: 'Profitability', message: 'Excellent profit management' });
  else if (profitPercent < 70) improvements.push({ metric: 'Profitability', message: 'Focus on cost optimization and margin improvement' });
  
  if (marketSharePercent >= 90) strengths.push({ metric: 'Market Position', message: 'Strong competitive position' });
  else if (marketSharePercent < 70) improvements.push({ metric: 'Market Share', message: 'Increase marketing and competitive positioning' });
  
  if (satisfactionPercent >= 95) strengths.push({ metric: 'Customer Loyalty', message: 'Outstanding customer satisfaction' });
  else if (satisfactionPercent < 85) improvements.push({ metric: 'Customer Satisfaction', message: 'Invest more in quality and service' });
  
  return {
    overall: Math.round(overallScore),
    revenue: Math.round(revenuePercent),
    profit: Math.round(profitPercent),
    growth: Math.min(100, Math.max(0, 50 + revenueGrowth)),
    revenuePercent: Math.round(revenuePercent),
    profitPercent: Math.round(profitPercent),
    marketSharePercent: Math.round(marketSharePercent),
    satisfactionPercent: Math.round(satisfactionPercent),
    strengths,
    improvements
  };
}

function generateAIInsights() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  
  // Strategy classification
  let strategyType = 'Balanced';
  let strategyDescription = 'You maintain a balanced approach across all decision areas.';
  
  if (decisions.length > 0) {
    const avgMarketing = decisions.reduce((sum, d) => sum + d.marketing, 0) / decisions.length;
    const avgQuality = decisions.reduce((sum, d) => sum + d.quality, 0) / decisions.length;
    const avgPricing = decisions.reduce((sum, d) => sum + d.pricing, 0) / decisions.length;
    const avgEfficiency = decisions.reduce((sum, d) => sum + d.efficiency, 0) / decisions.length;
    
    if (avgMarketing > 70 && avgPricing < 95) {
      strategyType = 'Growth-Focused';
      strategyDescription = 'Your strategy prioritizes market expansion through aggressive marketing and competitive pricing.';
    } else if (avgQuality > 70 && avgEfficiency > 70) {
      strategyType = 'Quality & Efficiency';
      strategyDescription = 'You focus on operational excellence and product quality for sustainable competitive advantage.';
    } else if (avgPricing > 110 && avgEfficiency > 60) {
      strategyType = 'Profitability-Focused';
      strategyDescription = 'Your strategy emphasizes profit maximization through premium pricing and cost control.';
    } else if (avgQuality > 65 && avgMarketing > 65) {
      strategyType = 'Customer-Centric';
      strategyDescription = 'You balance quality and marketing to build strong customer relationships and brand loyalty.';
    }
  }
  
  // Learning curve
  let learningCurve = 'Continue refining your decision-making process.';
  if (history.length >= 4) {
    const firstHalfProfit = history.slice(0, Math.floor(history.length / 2)).reduce((sum, h) => sum + h.netProfit, 0) / Math.floor(history.length / 2);
    const secondHalfProfit = history.slice(Math.floor(history.length / 2)).reduce((sum, h) => sum + h.netProfit, 0) / Math.ceil(history.length / 2);
    const improvement = ((secondHalfProfit - firstHalfProfit) / firstHalfProfit) * 100;
    
    if (improvement > 15) {
      learningCurve = `Your decision quality improved significantly by ${improvement.toFixed(0)}% in the second half of the simulation. You're learning effectively!`;
    } else if (improvement > 5) {
      learningCurve = `Your performance improved by ${improvement.toFixed(0)}% as you progressed through the simulation.`;
    } else if (improvement < -10) {
      learningCurve = `Performance declined in later quarters. Review your early successful strategies.`;
    }
  }
  
  // Strategic shifts
  const shifts = [];
  if (decisions.length >= 3) {
    for (let i = 1; i < Math.min(decisions.length, 4); i++) {
      const prev = decisions[i - 1];
      const curr = decisions[i];
      const marketingChange = Math.abs(curr.marketing - prev.marketing);
      const pricingChange = Math.abs(curr.pricing - prev.pricing);
      
      if (marketingChange > 30) {
        shifts.push({
          quarter: `Q${i + 1}`,
          description: `Major ${curr.marketing > prev.marketing ? 'increase' : 'decrease'} in marketing investment`
        });
      }
      if (pricingChange > 15) {
        shifts.push({
          quarter: `Q${i + 1}`,
          description: `Significant pricing adjustment from ${prev.pricing}% to ${curr.pricing}%`
        });
      }
    }
  }
  if (shifts.length === 0) {
    shifts.push({ quarter: 'Overall', description: 'Consistent strategy maintained throughout simulation' });
  }
  
  // Anomaly detection (using z-scores)
  const anomalies = [];
  const profitValues = history.map(h => h.netProfit);
  const profitMean = profitValues.reduce((a, b) => a + b) / profitValues.length;
  const profitStdDev = Math.sqrt(profitValues.reduce((sum, val) => sum + Math.pow(val - profitMean, 2), 0) / profitValues.length);
  
  history.forEach((h, i) => {
    const zScore = (h.netProfit - profitMean) / profitStdDev;
    if (Math.abs(zScore) > 1.5) {
      anomalies.push({
        quarter: `Q${h.quarter}`,
        reason: `${zScore > 0 ? 'Exceptional' : 'Below-average'} profit performance (${zScore > 0 ? '+' : ''}${(zScore * profitStdDev).toFixed(1)}M deviation)`
      });
    }
  });
  if (anomalies.length === 0) {
    anomalies.push({ quarter: 'None detected', reason: 'Performance was consistent throughout all quarters' });
  }
  
  // Recommendations
  const recommendations = [];
  const latestQuarter = history[history.length - 1];
  const latestDecisions = decisions[decisions.length - 1] || {};
  
  if (latestQuarter.netProfit < 15) {
    recommendations.push({
      title: 'Improve Profitability',
      message: 'Focus on operational efficiency and review your cost structure. Consider optimizing quality investments and marketing spend.'
    });
  }
  if (latestQuarter.marketShare < 20) {
    recommendations.push({
      title: 'Grow Market Share',
      message: 'Increase marketing investment and consider more competitive pricing to expand market presence.'
    });
  }
  if (latestQuarter.customerSatisfaction < 70) {
    recommendations.push({
      title: 'Enhance Customer Satisfaction',
      message: 'Increase quality investments and ensure pricing aligns with value delivered to customers.'
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Maintain Excellence',
      message: 'Your performance is strong across all metrics. Continue your current strategy while monitoring market conditions.'
    });
  }
  
  return {
    strategyType,
    strategyDescription,
    learningCurve,
    shifts,
    anomalies,
    recommendations
  };
}

function renderSortableDataTable() {
  let rows = '';
  for (let i = 1; i <= simulationState.currentQuarter; i++) {
    const data = simulationState.history[i];
    if (data) {
      rows += `
        <tr>
          <td>Q${data.quarter}</td>
          <td>$${data.revenue.toFixed(1)}M</td>
          <td>${data.grossMargin.toFixed(1)}%</td>
          <td>$${data.netProfit.toFixed(1)}M</td>
          <td>${data.marketShare.toFixed(1)}%</td>
          <td>${data.customerSatisfaction.toFixed(0)}</td>
          <td>$${data.cashPosition.toFixed(1)}M</td>
          <td>${data.employeeProductivity.toFixed(0)}</td>
        </tr>
      `;
    }
  }
  
  return `
    <table>
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Revenue</th>
          <th>Margin %</th>
          <th>Net Profit</th>
          <th>Market Share</th>
          <th>Satisfaction</th>
          <th>Cash</th>
          <th>Productivity</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

function renderDecisionsTable() {
  const decisions = simulationState.decisionsHistory;
  if (decisions.length === 0) {
    return '<p style="padding: var(--space-16); color: var(--color-text-secondary);">No decisions recorded yet.</p>';
  }
  
  let rows = '';
  decisions.forEach(d => {
    rows += `
      <tr>
        <td>Q${d.quarter}</td>
        <td>$${d.marketing.toFixed(0)}M</td>
        <td>${d.quality.toFixed(0)}%</td>
        <td>${d.pricing.toFixed(0)}%</td>
        <td>${d.efficiency.toFixed(0)}%</td>
      </tr>
    `;
  });
  
  return `
    <table>
      <thead>
        <tr>
          <th>Quarter</th>
          <th>Marketing</th>
          <th>Quality</th>
          <th>Pricing</th>
          <th>Efficiency</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

// What-If Analysis Functions
function updateWhatIfQuarter(quarter) {
  simulationState.whatIfQuarter = parseInt(quarter);
  const content = document.getElementById('analyticsContent');
  if (content) content.innerHTML = renderWhatIfTab();
}

function updateWhatIfDecision(type, value) {
  simulationState.whatIfDecisions[type] = parseFloat(value);
  document.getElementById(`whatIf${type.charAt(0).toUpperCase() + type.slice(1)}Value`).textContent = 
    type === 'marketing' ? `$${value}M` : type === 'quality' || type === 'efficiency' ? `${value}%` : `${value}%`;
  
  // Update results
  const content = document.getElementById('analyticsContent');
  if (content) content.innerHTML = renderWhatIfTab();
}

// Export Functions
function downloadCSV() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  let csv = 'Quarter,Revenue,Gross Margin,Net Profit,Market Share,Customer Satisfaction,Cash Position,Employee Productivity\n';
  
  history.forEach(h => {
    csv += `${h.quarter},${h.revenue.toFixed(2)},${h.grossMargin.toFixed(2)},${h.netProfit.toFixed(2)},${h.marketShare.toFixed(2)},${h.customerSatisfaction.toFixed(0)},${h.cashPosition.toFixed(2)},${h.employeeProductivity.toFixed(0)}\n`;
  });
  
  downloadFile('simulation_data.csv', csv, 'text/csv');
}

function downloadDecisionsCSV() {
  const decisions = simulationState.decisionsHistory;
  let csv = 'Quarter,Marketing,Quality,Pricing,Efficiency\n';
  
  decisions.forEach(d => {
    csv += `${d.quarter},${d.marketing.toFixed(2)},${d.quality.toFixed(2)},${d.pricing.toFixed(2)},${d.efficiency.toFixed(2)}\n`;
  });
  
  downloadFile('decisions_history.csv', csv, 'text/csv');
}

function downloadJSON() {
  const data = {
    history: simulationState.history,
    decisions: simulationState.decisionsHistory,
    currentQuarter: simulationState.currentQuarter
  };
  
  downloadFile('simulation_data.json', JSON.stringify(data, null, 2), 'application/json');
}

function downloadAnalyticsSummary() {
  const stats = calculateDescriptiveStats();
  const predictions = generatePredictions();
  const insights = generateAdvancedInsights();
  
  const summary = {
    descriptiveStatistics: stats,
    predictions: predictions,
    insights: insights.map(i => ({ type: i.type, title: i.title, message: i.message }))
  };
  
  downloadFile('analytics_summary.json', JSON.stringify(summary, null, 2), 'application/json');
}

function downloadCompleteReport() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  const decisions = simulationState.decisionsHistory;
  
  let report = '=== BUSINESS ANALYTICS SIMULATION REPORT ===\n\n';
  report += `Generated: ${new Date().toLocaleString()}\n`;
  report += `Quarters Completed: ${simulationState.currentQuarter}\n\n`;
  
  report += '--- PERFORMANCE SUMMARY ---\n';
  const stats = calculateDescriptiveStats();
  report += `Average Revenue: $${stats.revenue.mean.toFixed(2)}M\n`;
  report += `Average Profit: $${stats.profit.mean.toFixed(2)}M\n`;
  report += `Average Market Share: ${stats.marketShare.mean.toFixed(2)}%\n`;
  report += `Average Satisfaction: ${stats.satisfaction.mean.toFixed(0)}\n\n`;
  
  report += '--- QUARTERLY DATA ---\n';
  history.forEach(h => {
    report += `Q${h.quarter}: Revenue=$${h.revenue.toFixed(1)}M, Profit=$${h.netProfit.toFixed(1)}M, Market Share=${h.marketShare.toFixed(1)}%\n`;
  });
  
  downloadFile('complete_report.txt', report, 'text/plain');
}

function copyDataToClipboard() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter + 1);
  let text = 'Quarter\tRevenue\tProfit\tMarket Share\tSatisfaction\n';
  
  history.forEach(h => {
    text += `Q${h.quarter}\t$${h.revenue.toFixed(1)}M\t$${h.netProfit.toFixed(1)}M\t${h.marketShare.toFixed(1)}%\t${h.customerSatisfaction.toFixed(0)}\n`;
  });
  
  navigator.clipboard.writeText(text).then(() => {
    alert('Data copied to clipboard!');
  }).catch(() => {
    alert('Could not copy to clipboard. Please try manual selection.');
  });
}

function renderFinalAnalysisSummary() {
  const finalScore = calculateFinalScore();
  const aiInsights = generateAIInsights();
  const benchmarks = calculateBenchmarks();
  const history = simulationState.history.slice(1, 9);
  
  // Calculate learning effectiveness
  const firstHalfAvg = history.slice(0, 4).reduce((sum, h) => sum + h.netProfit, 0) / 4;
  const secondHalfAvg = history.slice(4).reduce((sum, h) => sum + h.netProfit, 0) / 4;
  const learningImprovement = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  
  return `
    <div class="stats-grid" style="margin-bottom: var(--space-20);">
      <div class="stat-card">
        <h4>Strategic Effectiveness</h4>
        <div class="value">${finalScore}/100</div>
      </div>
      <div class="stat-card">
        <h4>Overall Ranking</h4>
        <div class="value">Top ${100 - benchmarks.overall}%</div>
      </div>
      <div class="stat-card">
        <h4>Learning Curve</h4>
        <div class="value ${learningImprovement >= 0 ? 'positive-cell' : 'negative-cell'}">${learningImprovement >= 0 ? '+' : ''}${learningImprovement.toFixed(0)}%</div>
      </div>
      <div class="stat-card">
        <h4>Strategy Type</h4>
        <div class="value" style="font-size: var(--font-size-base);">${aiInsights.strategyType}</div>
      </div>
    </div>
    
    <p style="color: var(--color-text); margin-bottom: var(--space-12);">
      <strong>Strategy Assessment:</strong> ${aiInsights.strategyDescription}
    </p>
    <p style="color: var(--color-text); margin-bottom: var(--space-12);">
      <strong>Learning Progress:</strong> ${aiInsights.learningCurve}
    </p>
    <p style="color: var(--color-text);">
      <strong>Key Achievement:</strong> ${finalScore >= 75 ? 'Outstanding performance - you demonstrated strong business acumen!' : finalScore >= 60 ? 'Good performance with room for optimization in future simulations.' : 'Valuable learning experience - review analytics to identify improvement areas.'}
    </p>
  `;
}

function generateDecisionInsights() {
  const history = simulationState.history.slice(1, simulationState.currentQuarter);
  const latest = history[history.length - 1];
  const insights = [];
  
  if (latest.netProfit < 12) {
    insights.push('Profitability is below target. Consider increasing operational efficiency or adjusting pricing strategy.');
  }
  
  if (latest.customerSatisfaction < 70) {
    insights.push('Customer satisfaction needs attention. Increasing quality investment could improve retention and loyalty.');
  }
  
  if (latest.marketShare < 18) {
    insights.push('Market share is declining. Consider boosting marketing investment or adjusting pricing to be more competitive.');
  }
  
  if (latest.revenue > history[0].revenue * 1.2) {
    insights.push('Revenue growth is strong! Continue your current growth trajectory while monitoring profitability.');
  }
  
  if (latest.cashPosition < 15) {
    insights.push('Cash reserves are getting low. Be cautious with spending on marketing and quality investments.');
  }
  
  if (insights.length === 0) {
    insights.push('Performance is solid across all metrics. Continue your current strategy.');
    insights.push('Consider using What-If Analysis in the Advanced Analytics to test alternative scenarios.');
  }
  
  return insights;
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);