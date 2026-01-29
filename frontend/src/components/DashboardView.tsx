import { useState, useRef, useEffect } from 'react';
import { Search, Grid3x3, Moon, Sun, User, Settings, BarChart3, FileText, Database, LogOut, UserCog, Send, Bot, Sparkles, GripVertical, Trash2, Plus, ArrowLeft, Undo2, Redo2, Save, Download, ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ProfileSettings from './ProfileSettings';
import SaveExportModal from './SaveExportModal';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface DashboardViewProps {
  onNavigate: (screen: 'home' | 'workspace' | 'builder' | 'dataview') => void;
  onLogout: () => void;
  darkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
  dashboard: any;
}

interface DashboardItem {
  id: string;
  name: string;
  type: 'Report' | 'Chart' | 'Table';
  icon: any;
  color: string;
}

interface CanvasItem extends DashboardItem {
  order: number; // Simple ordering for vertical stack
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const DraggableDashboardItem = ({ item, onQuickAdd }: { item: DashboardItem; onQuickAdd: (item: DashboardItem) => void }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'dashboard-item',
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onDoubleClick={() => onQuickAdd(item)}
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-all cursor-move group relative ${
        isDragging ? 'opacity-50' : ''
      }`}
      title="Drag to canvas or double-click to quick add"
    >
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <item.icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-gray-900 dark:text-white text-sm truncate">{item.name}</h4>
          <p className="text-gray-500 dark:text-gray-400 text-xs">{item.type}</p>
        </div>
        <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onQuickAdd(item);
        }}
        className="absolute top-2 right-2 p-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded opacity-0 group-hover:opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
        title="Quick add"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

const CanvasDroppedItem = ({ 
  item, 
  onDelete, 
  isSelected,
  onSelect
}: { 
  item: CanvasItem; 
  onDelete: (id: string) => void; 
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'canvas-item',
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const sampleData = [
    { name: 'East', value: 6603.75, percentage: 43.05 },
    { name: 'Central', value: 2975.73, percentage: 19.40 },
    { name: 'West', value: 5760.62, percentage: 37.55 },
  ];

  const pieData = [
    { name: 'Electronics', value: 4330 },
    { name: 'Furniture', value: 2720 },
  ];

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Get chart-specific insights
  const getInsights = () => {
    if (item.name === 'Monthly Revenue Analysis') {
      return [
        'Revenue increased 15.3% compared to last quarter',
        'East region leads with 43% of total revenue',
        'Peak performance recorded in December at $6,604',
        'All regions showing positive growth trends'
      ];
    } else if (item.name === 'Category Growth Trends') {
      return [
        'Electronics category dominates with 61% market share',
        'Furniture segment shows steady 12% growth',
        'West region outperformed expectations by 23%',
        'Q4 2025 marks highest quarterly revenue to date'
      ];
    } else if (item.name === 'Product Performance Report') {
      return [
        'Top 3 products account for 67% of total sales',
        'Customer retention rate improved to 89%',
        'Average order value increased by $47',
        'Product line expansion shows 34% revenue uplift'
      ];
    } else if (item.name === 'E-commerce Sales Data') {
      return [
        'Total sales reached $15,340 this quarter',
        'Average transaction value: $127.50',
        'Peak sales day: December 15th ($2,340)',
        'Mobile conversions up 28% year-over-year'
      ];
    }
    return [
      'Data analysis shows positive trends',
      'Performance metrics exceeded targets',
      'Growth trajectory remains strong'
    ];
  };

  // Get key metrics
  const getKeyMetrics = () => {
    const total = sampleData.reduce((sum, d) => sum + d.value, 0);
    const average = total / sampleData.length;
    const highest = Math.max(...sampleData.map(d => d.value));
    
    return [
      { label: 'Total', value: `$${total.toLocaleString(undefined, {maximumFractionDigits: 0})}`, trend: 'up', change: '+15%' },
      { label: 'Average', value: `$${average.toLocaleString(undefined, {maximumFractionDigits: 0})}`, trend: 'up', change: '+8%' },
      { label: 'Peak', value: `$${highest.toLocaleString(undefined, {maximumFractionDigits: 0})}`, trend: 'up', change: '+23%' },
    ];
  };

  const renderChart = () => {
    if (item.type === 'Report') {
      if (item.name === 'Monthly Revenue Analysis') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <YAxis className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      } else if (item.name === 'Category Growth Trends') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sampleData}>
              <defs>
                <linearGradient id={`colorValue-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <YAxis className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" fillOpacity={1} fill={`url(#colorValue-${item.id})`} />
            </AreaChart>
          </ResponsiveContainer>
        );
      } else if (item.name === 'Product Performance Report') {
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampleData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
              <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <YAxis className="text-gray-600 dark:text-gray-400" fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      }
    } else if (item.type === 'Table') {
      return (
        <div className="w-full h-full overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Region</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Revenue</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">Share</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{row.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">${row.value.toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{row.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sampleData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-600" />
          <XAxis dataKey="name" className="text-gray-600 dark:text-gray-400" fontSize={11} />
          <YAxis className="text-gray-600 dark:text-gray-400" fontSize={11} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const insights = getInsights();
  const keyMetrics = getKeyMetrics();

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect(item.id);
      }}
      className={`bg-white dark:bg-gray-800 rounded-xl border-2 ${
        isSelected 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-200 dark:border-gray-700'
      } hover:shadow-md transition-all group relative ${
        isDragging ? 'opacity-50' : ''
      } mb-6 overflow-hidden`}
    >
      {/* Header with title and actions */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div ref={drag} className="cursor-move p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
            <GripVertical className="w-5 h-5 text-gray-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-medium">{item.name}</h3>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main content: 50% Chart + 50% Insights */}
      <div className="flex">
        {/* Left 50%: Chart Area */}
        <div className="w-1/2 p-6 border-r border-gray-200 dark:border-gray-700">
          <div className="w-full h-96">
            {renderChart()}
          </div>
        </div>

        {/* Right 50%: Insights Area */}
        <div className="w-1/2 p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '450px' }}>
          {/* AI Insights Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">AI Insights</h4>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Metrics Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Key Metrics</h4>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {keyMetrics.map((metric, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{metric.label}</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${metric.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-emerald-500" />
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">Summary</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {item.name === 'Monthly Revenue Analysis' && 
                'Q4 2025 revenue performance exceeded projections with strong growth across all regions. The East region continues to be the primary revenue driver, while Central and West regions show promising upward momentum.'}
              {item.name === 'Category Growth Trends' && 
                'Product categories demonstrate robust growth with Electronics maintaining market leadership. Strategic expansion in the Furniture segment shows excellent potential for continued revenue diversification.'}
              {item.name === 'Product Performance Report' && 
                'Product line performance indicates healthy portfolio balance with top performers driving substantial revenue while newer products gain market traction. Customer metrics suggest high satisfaction and repeat purchase rates.'}
              {item.name === 'E-commerce Sales Data' &&
                'E-commerce operations show exceptional performance with increasing average order values and improving conversion rates. Mobile platform optimization resulted in significant traffic and sales uplift.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardView({ onNavigate, onLogout, darkMode, onToggleDarkMode, dashboard }: DashboardViewProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [dashboardItems] = useState<DashboardItem[]>([
    { id: 'r1', name: 'Monthly Revenue Analysis', type: 'Report', icon: FileText, color: 'bg-blue-500' },
    { id: 'r2', name: 'Category Growth Trends', type: 'Report', icon: FileText, color: 'bg-emerald-500' },
    { id: 'r3', name: 'Product Performance Report', type: 'Report', icon: FileText, color: 'bg-indigo-500' },
    { id: 't1', name: 'E-commerce Sales Data', type: 'Table', icon: Database, color: 'bg-emerald-500' },
  ]);

  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);
  const [history, setHistory] = useState<CanvasItem[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const reports = dashboardItems.filter(item => item.type === 'Report');
  const tables = dashboardItems.filter(item => item.type === 'Table');

  // Initialize with pre-populated dashboard items
  useEffect(() => {
    const initialItems: CanvasItem[] = [
      {
        id: 'default-1',
        name: 'Monthly Revenue Analysis',
        type: 'Report',
        icon: FileText,
        color: 'bg-blue-500',
        order: 0,
      },
      {
        id: 'default-2',
        name: 'Category Growth Trends',
        type: 'Report',
        icon: FileText,
        color: 'bg-emerald-500',
        order: 1,
      },
      {
        id: 'default-3',
        name: 'Product Performance Report',
        type: 'Report',
        icon: FileText,
        color: 'bg-indigo-500',
        order: 2,
      },
    ];
    setCanvasItems(initialItems);
    setHistory([initialItems]);
  }, []);

  const addToHistory = (newItems: CanvasItem[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newItems);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasItems(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasItems(history[historyIndex + 1]);
    }
  };

  const handleQuickAdd = (item: DashboardItem) => {
    if (canvasItems.find(ci => ci.id === item.id)) {
      return;
    }

    const maxOrder = canvasItems.length > 0 ? Math.max(...canvasItems.map(i => i.order)) : -1;

    const newItem: CanvasItem = {
      ...item,
      order: maxOrder + 1,
    };

    const newItems = [...canvasItems, newItem];
    setCanvasItems(newItems);
    addToHistory(newItems);
    setSelectedItemId(newItem.id);
  };

  const handleDrop = (item: DashboardItem) => {
    if (canvasItems.find(ci => ci.id === item.id)) {
      return;
    }

    const maxOrder = canvasItems.length > 0 ? Math.max(...canvasItems.map(i => i.order)) : -1;

    const newItem: CanvasItem = {
      ...item,
      order: maxOrder + 1,
    };

    const newItems = [...canvasItems, newItem];
    setCanvasItems(newItems);
    addToHistory(newItems);
    setSelectedItemId(newItem.id);
  };

  const handleDeleteCanvasItem = (id: string) => {
    const newItems = canvasItems.filter(item => item.id !== id);
    setCanvasItems(newItems);
    addToHistory(newItems);
    if (selectedItemId === id) {
      setSelectedItemId(null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      
      if (cmdOrCtrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedItemId) {
        e.preventDefault();
        handleDeleteCanvasItem(selectedItemId);
      }

      if (e.key === 'Escape') {
        setSelectedItemId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedItemId, historyIndex, history]);

  const CanvasDropZone = () => {
    const [{ isOver }, drop] = useDrop(() => ({
      accept: ['dashboard-item', 'canvas-item'],
      drop: (item: any) => {
        if (item.id && !canvasItems.find(ci => ci.id === item.id)) {
          handleDrop(item);
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }));

    return (
      <div
        ref={drop}
        id="dashboard-canvas"
        onClick={() => setSelectedItemId(null)}
        className={`flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto transition-colors h-full relative ${
          isOver ? 'bg-blue-50 dark:bg-blue-900/10' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto p-6">
          {canvasItems.length === 0 && !isOver && (
            <div className="h-full flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-gray-900 dark:text-white mb-2">Build Your Dashboard</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-4">
                  Drag and drop reports, charts, and tables from the left sidebar
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  💡 Tip: Double-click any item to add it instantly
                </p>
              </div>
            </div>
          )}

          {isOver && canvasItems.length === 0 && (
            <div className="h-full flex items-center justify-center py-32">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Plus className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-blue-900 dark:text-blue-100 mb-2">Drop Here</h3>
                <p className="text-blue-700 dark:text-blue-300">Release to add to dashboard</p>
              </div>
            </div>
          )}

          {canvasItems.length > 0 && (
            <div className="space-y-0">
              {canvasItems
                .sort((a, b) => a.order - b.order)
                .map(item => (
                  <CanvasDroppedItem
                    key={item.id}
                    item={item}
                    onDelete={handleDeleteCanvasItem}
                    isSelected={selectedItemId === item.id}
                    onSelect={setSelectedItemId}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => onNavigate('workspace')}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                  <h2 className="text-gray-900 dark:text-white">{dashboard.name}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {autoSave ? 'Auto-saved' : 'Last saved'} 2 min ago
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex items-center space-x-2">
                <button 
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo (Cmd/Ctrl+Z)"
                >
                  <Undo2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo (Cmd/Ctrl+Y)"
                >
                  <Redo2 className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2"></div>
                <label className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Auto-save</span>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onToggleDarkMode(!darkMode)}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button 
                  onClick={() => setShowSaveModal(true)}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button 
                  onClick={() => setShowExportModal(true)}
                  className="hidden lg:flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-1 min-h-0">
          {/* Left Sidebar */}
          {!sidebarCollapsed && (
            <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 h-full flex flex-col">
              <div className="p-6 flex-shrink-0">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 dark:text-white mb-2">Dashboard Items</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag or double-click to add</p>
                  </div>
                  <button
                    onClick={() => setSidebarCollapsed(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title="Collapse sidebar"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search items..."
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 dark:text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <FileText className="w-4 h-4" />
                      <span>Reports</span>
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {reports.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {reports.map(item => (
                      <DraggableDashboardItem key={item.id} item={item} onQuickAdd={handleQuickAdd} />
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                      <Database className="w-4 h-4" />
                      <span>Dataset</span>
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {tables.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {tables.map(item => (
                      <DraggableDashboardItem key={item.id} item={item} onQuickAdd={handleQuickAdd} />
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {sidebarCollapsed && (
            <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex items-start pt-6 px-2">
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Expand sidebar"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          )}

          <CanvasDropZone />
        </div>

        {showSettings && (
          <ProfileSettings
            onClose={() => setShowSettings(false)}
            onLogout={onLogout}
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
          />
        )}

        {showSaveModal && (
          <SaveExportModal
            isOpen={true}
            type="save"
            onClose={() => setShowSaveModal(false)}
            onConfirm={(name, description) => {
              console.log('Saving dashboard:', name, description);
              setShowSaveModal(false);
            }}
          />
        )}

        {showExportModal && (
          <SaveExportModal
            isOpen={true}
            type="export"
            context="dashboard"
            simpleExport={true}
            onClose={() => setShowExportModal(false)}
            onConfirm={(name, description, format) => {
              console.log('Exporting dashboard as PDF:', format);
              setShowExportModal(false);
            }}
          />
        )}
      </div>
    </DndProvider>
  );
}