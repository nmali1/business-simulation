// Business Analytics Simulation - TechFlow Inc.
// State Management

const simulationState = {
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
  
  // Current quarter decisions
  currentDecisions: {
    marketing: 50,
    quality: 50,
    pricing: 100,
    efficiency: 50
  },
  
  // Preview metrics
  previewMetrics: null
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
        <button class="btn btn-secondary btn-large" onclick="goToAnalytics()">View Analytics</button>
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

// Analytics Dashboard
function renderAnalytics() {
  return `
    <div class="header">
      <div class="header-content">
        <h1>Analytics Dashboard</h1>
        <div class="quarter-badge">Quarter ${simulationState.currentQuarter} of ${simulationState.totalQuarters}</div>
      </div>
    </div>
    
    <div class="container">
      <h2 style="margin-bottom: var(--space-24); color: var(--color-text);">Performance Trends</h2>
      
      <div class="charts-grid">
        <div class="chart-container">
          <h3>Revenue Over Time</h3>
          <div class="chart-wrapper">
            <canvas id="revenueChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Net Profit Over Time</h3>
          <div class="chart-wrapper">
            <canvas id="profitChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Market Share Trend</h3>
          <div class="chart-wrapper">
            <canvas id="marketShareChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <h3>Customer Satisfaction</h3>
          <div class="chart-wrapper">
            <canvas id="satisfactionChart"></canvas>
          </div>
        </div>
      </div>
      
      <h3 style="margin: var(--space-32) 0 var(--space-16) 0; color: var(--color-text);">Quarterly Performance Data</h3>
      <div class="data-table">
        ${renderDataTable()}
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-primary btn-large" onclick="goToDecisions()">Make Decision</button>
        <button class="btn btn-secondary btn-large" onclick="goToDashboard()">Back to Dashboard</button>
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
          <button class="btn btn-secondary btn-large" onclick="previewDecision()">Preview Impact</button>
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
      </div>
    </div>
  `;
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
      
      <h3 style="margin: var(--space-32) 0 var(--space-16) 0; color: var(--color-text);">Complete Performance Summary</h3>
      <div class="data-table">
        ${renderCompleteDataTable()}
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-secondary btn-large" onclick="downloadReport()">Download Report</button>
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

// Initialize on load
window.addEventListener('DOMContentLoaded', init);