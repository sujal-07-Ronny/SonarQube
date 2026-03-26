import React, { useState, useEffect } from 'react';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { 
  BarChart2, PieChart, Clock, MessageSquare, 
  X, Download, RefreshCw, Filter
} from 'lucide-react';
import { Chart as ChartJS, 
  ArcElement, Tooltip, Legend, 
  CategoryScale, LinearScale, 
  BarElement, PointElement, LineElement, 
  Title 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale, BarElement, PointElement, LineElement, Title
);

const AnalyticsDashboard = ({ onClose }) => {
  // Sample data - in a real app, you'd fetch this from localStorage/API
  const [analyticsData, setAnalyticsData] = useState({
    totalGenerations: 0,
    popularStyles: {},
    frequentPrompts: {},
    generationTimes: {},
    userActivity: {},
    creditsUsed: {}
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true);
      
      // Simulate loading delay
      setTimeout(() => {
        const storedData = localStorage.getItem('aiImageAnalytics');
        
        if (storedData) {
          setAnalyticsData(JSON.parse(storedData));
        } else {
          // Default sample data
          setAnalyticsData({
            totalGenerations: 1247,
            popularStyles: {
              'Realistic': 35,
              'Anime': 28,
              'Cyberpunk': 18,
              'Watercolor': 12,
              'Pixel Art': 7
            },
            frequentPrompts: {
              'Portrait of a warrior': 42,
              'Cyberpunk cityscape': 38,
              'Fantasy landscape': 35,
              'Cute anime character': 31,
              'Abstract art': 27
            },
            generationTimes: {
              'Morning': 120,
              'Afternoon': 210,
              'Evening': 185,
              'Night': 92
            },
            userActivity: {
              'Mon': 45,
              'Tue': 78,
              'Wed': 92,
              'Thu': 84,
              'Fri': 103,
              'Sat': 65,
              'Sun': 32
            },
            creditsUsed: {
              'Jan': 1200,
              'Feb': 1800,
              'Mar': 2100,
              'Apr': 1950,
              'May': 2400,
              'Jun': 3200
            }
          });
        }
        
        setIsLoading(false);
      }, 800);
    };

    loadData();
  }, [timeRange]);

  // Chart data configurations
  const styleChartData = {
    labels: Object.keys(analyticsData.popularStyles),
    datasets: [
      {
        data: Object.values(analyticsData.popularStyles),
        backgroundColor: [
          'rgba(79, 70, 229, 0.7)',
          'rgba(99, 102, 241, 0.7)',
          'rgba(129, 140, 248, 0.7)',
          'rgba(167, 139, 250, 0.7)',
          'rgba(217, 70, 239, 0.7)'
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(99, 102, 241, 1)',
          'rgba(129, 140, 248, 1)',
          'rgba(167, 139, 250, 1)',
          'rgba(217, 70, 239, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const promptChartData = {
    labels: Object.keys(analyticsData.frequentPrompts),
    datasets: [
      {
        label: 'Usage Count',
        data: Object.values(analyticsData.frequentPrompts),
        backgroundColor: 'rgba(79, 70, 229, 0.7)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 1,
      },
    ],
  };

  const timeChartData = {
    labels: Object.keys(analyticsData.generationTimes),
    datasets: [
      {
        label: 'Generations',
        data: Object.values(analyticsData.generationTimes),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
        tension: 0.1,
        fill: true
      },
    ],
  };

  const activityChartData = {
    labels: Object.keys(analyticsData.userActivity),
    datasets: [
      {
        label: 'Daily Activity',
        data: Object.values(analyticsData.userActivity),
        backgroundColor: 'rgba(167, 139, 250, 0.7)',
        borderColor: 'rgba(167, 139, 250, 1)',
        borderWidth: 2,
        tension: 0.4
      },
    ],
  };

  const creditsChartData = {
    labels: Object.keys(analyticsData.creditsUsed),
    datasets: [
      {
        label: 'Credits Used',
        data: Object.values(analyticsData.creditsUsed),
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      },
    ],
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analyticsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportName = `ai-image-analytics-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
  };

  const refreshData = () => {
    // In a real app, you might fetch fresh data here
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">AI Image Generation Analytics</h1>
            <p className="opacity-90">Insights into your creative workflow</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button 
              onClick={refreshData}
              className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors ${isLoading ? 'animate-spin' : ''}`}
              disabled={isLoading}
            >
              <RefreshCw size={18} />
            </button>
            <button 
              onClick={exportData}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1"
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-1">
            {['24h', '7d', '30d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-md text-sm ${timeRange === range ? 'bg-white text-indigo-600' : 'hover:bg-white/10'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 overflow-y-auto flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-indigo-600">Total Generations</p>
                    <p className="text-3xl font-bold text-gray-800">{analyticsData.totalGenerations}</p>
                  </div>
                  <div className="bg-indigo-100 p-3 rounded-lg">
                    <BarChart2 className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600">Most Popular Style</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {Object.keys(analyticsData.popularStyles).reduce((a, b) => 
                        analyticsData.popularStyles[a] > analyticsData.popularStyles[b] ? a : b
                      )}
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <PieChart className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600">Top Prompt</p>
                    <p className="text-lg font-bold text-gray-800 truncate">
                      {Object.keys(analyticsData.frequentPrompts).reduce((a, b) => 
                        analyticsData.frequentPrompts[a] > analyticsData.frequentPrompts[b] ? a : b
                      )}
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600">Peak Time</p>
                    <p className="text-xl font-bold text-gray-800">
                      {Object.keys(analyticsData.generationTimes).reduce((a, b) => 
                        analyticsData.generationTimes[a] > analyticsData.generationTimes[b] ? a : b
                      )}
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Style Distribution Pie Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Art Style Distribution</h3>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Filter size={16} />
                  </button>
                </div>
                <div className="h-64">
                  <Pie 
                    data={styleChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              const label = context.label || '';
                              const value = context.raw || 0;
                              const total = context.dataset.data.reduce((a, b) => a + b, 0);
                              const percentage = Math.round((value / total) * 100);
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Frequent Prompts Bar Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Most Frequent Prompts</h3>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Filter size={16} />
                  </button>
                </div>
                <div className="h-64">
                  <Bar 
                    data={promptChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 5
                          }
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: function(context) {
                              return `${context.parsed.y} generations`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* Generation Times Line Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Generations by Time of Day</h3>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Filter size={16} />
                  </button>
                </div>
                <div className="h-64">
                  <Line 
                    data={timeChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>

              {/* User Activity Line Chart */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-800">Weekly User Activity</h3>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Filter size={16} />
                  </button>
                </div>
                <div className="h-64">
                  <Line 
                    data={activityChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Credits Usage */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-800">Monthly Credits Usage</h3>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <Filter size={16} />
                </button>
              </div>
              <div className="h-64">
                <Line 
                  data={creditsChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Insights Section */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <h3 className="text-lg font-medium text-indigo-800 mb-4">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">Top Performing Styles</h4>
                  <ul className="space-y-3">
                    {Object.entries(analyticsData.popularStyles)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 3)
                      .map(([style, count]) => (
                        <li key={style} className="flex justify-between items-center">
                          <span className="text-gray-700">{style}</span>
                          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                            {count} generations
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-800">User Behavior Patterns</h4>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">Most Active Day</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                        {Object.keys(analyticsData.userActivity).reduce((a, b) => 
                          analyticsData.userActivity[a] > analyticsData.userActivity[b] ? a : b
                        )}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">Peak Generation Time</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {Object.keys(analyticsData.generationTimes).reduce((a, b) => 
                          analyticsData.generationTimes[a] > analyticsData.generationTimes[b] ? a : b
                        )}
                      </span>
                    </li>
                    <li className="flex justify-between items-center">
                      <span className="text-gray-700">Avg. Daily Generations</span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        {Math.round(Object.values(analyticsData.userActivity).reduce((a, b) => a + b, 0) / 7)}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;