import React, { useMemo } from 'react'
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

interface ChartData {
  label: string
  value: number
  color?: string
  trend?: number
  target?: number
  category?: string
}

interface AdvancedChartProps {
  data: ChartData[]
  type: 'line' | 'bar' | 'pie' | 'area' | 'comparison' | 'trend' | 'heatmap'
  title: string
  subtitle?: string
  height?: number
  showLegend?: boolean
  showGrid?: boolean
  showTrend?: boolean
  showTargets?: boolean
  timeframe?: string
  comparison?: {
    previous: ChartData[]
    period: string
  }
  forecast?: {
    data: ChartData[]
    confidence?: number
  }
  filters?: string[]
  onFilter?: (filter: string) => void
  className?: string
}

const AdvancedChart: React.FC<AdvancedChartProps> = ({
  data,
  type,
  title,
  subtitle,
  height = 300,
  showLegend = true,
  showGrid = true,
  showTrend = false,
  showTargets = false,
  timeframe,
  comparison,
  forecast,
  filters,
  onFilter,
  className = ''
}) => {
  // Calculate chart dimensions and scales
  const chartMetrics = useMemo(() => {
    const values = data.map(d => d.value)
    const max = Math.max(...values)
    const min = Math.min(...values)
    const range = max - min
    
    // Add forecast data if available
    if (forecast) {
      const forecastValues = forecast.data.map(d => d.value)
      const forecastMax = Math.max(...forecastValues)
      const forecastMin = Math.min(...forecastValues)
      return {
        max: Math.max(max, forecastMax),
        min: Math.min(min, forecastMin),
        range: Math.max(range, forecastMax - forecastMin),
        hasComparison: !!comparison,
        hasForecast: !!forecast
      }
    }
    
    return { max, min, range, hasComparison: !!comparison, hasForecast: false }
  }, [data, comparison, forecast])

  // Format value for display
  const formatValue = (value: number, includeSign = false) => {
    const sign = includeSign && value > 0 ? '+' : ''
    if (value >= 1000000) {
      return `${sign}${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${sign}${(value / 1000).toFixed(1)}K`
    }
    return `${sign}${value.toFixed(0)}`
  }

  // Calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Render Line Chart
  const renderLineChart = () => {
    const width = 100
    const padding = 10
    const chartHeight = height - 80

    return (
      <div className="relative">
        <svg width="100%" height={height} className="overflow-visible">
          {/* Grid lines */}
          {showGrid && (
            <g className="grid-lines">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1={padding}
                  y1={(y / 100) * chartHeight + 20}
                  x2={width - padding}
                  y2={(y / 100) * chartHeight + 20}
                  stroke="#e5e7eb"
                  strokeWidth={y === 0 ? 2 : 1}
                  strokeDasharray={y === 0 ? "none" : "2,2"}
                />
              ))}
            </g>
          )}
          
          {/* Main data line */}
          <path
            d={data.map((item, index) => {
              const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
              const y = chartHeight - (item.value / chartMetrics.max) * chartHeight + 20
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
            }).join(' ')}
            stroke="#3b82f6"
            strokeWidth={3}
            fill="none"
          />
          
          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
            const y = chartHeight - (item.value / chartMetrics.max) * chartHeight + 20
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r={4}
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth={2}
                />
                {/* Value labels */}
                <text
                  x={x}
                  y={y - 10}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-600"
                >
                  {formatValue(item.value)}
                </text>
              </g>
            )
          })}
          
          {/* Comparison line if available */}
          {comparison && (
            <path
              d={comparison.previous.map((item, index) => {
                const x = (index / (comparison.previous.length - 1)) * (width - 2 * padding) + padding
                const y = chartHeight - (item.value / chartMetrics.max) * chartHeight + 20
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="5,5"
              fill="none"
            />
          )}
          
          {/* Forecast line if available */}
          {forecast && (
            <path
              d={forecast.data.map((item, index) => {
                const x = ((data.length - 1 + index) / (data.length + forecast.data.length - 2)) * (width - 2 * padding) + padding
                const y = chartHeight - (item.value / chartMetrics.max) * chartHeight + 20
                return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="3,3"
              fill="none"
            />
          )}
          
          {/* X-axis labels */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding
            return (
              <text
                key={index}
                x={x}
                y={height - 15}
                textAnchor="middle"
                className="text-xs fill-gray-500"
              >
                {item.label}
              </text>
            )
          })}
        </svg>
      </div>
    )
  }

  // Render Bar Chart
  const renderBarChart = () => {
    const barWidth = 100 / data.length * 0.8
    const gap = 100 / data.length * 0.2
    
    return (
      <div className="flex items-end justify-between h-full space-x-1">
        {data.map((item, index) => {
          const barHeight = (item.value / chartMetrics.max) * (height - 60)
          const change = item.trend || 0
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Value label */}
              <div className="mb-2 text-xs font-medium text-gray-600">
                {formatValue(item.value)}
                {change !== 0 && (
                  <div className={`flex items-center mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change > 0 ? (
                      <ArrowTrendingUpIcon className="w-3 h-3 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-3 h-3 mr-1" />
                    )}
                    <span>{Math.abs(change).toFixed(1)}%</span>
                  </div>
                )}
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full rounded-t transition-all duration-300 hover:opacity-80 ${
                  item.color || 'bg-blue-500'
                }`}
                style={{ height: `${barHeight}px` }}
              />
              
              {/* Target line if available */}
              {showTargets && item.target && (
                <div 
                  className="w-full border-t-2 border-red-400 border-dashed"
                  style={{ 
                    position: 'absolute',
                    bottom: `${60 + (item.target / chartMetrics.max) * (height - 60)}px`
                  }}
                />
              )}
              
              {/* Label */}
              <div className="mt-2 text-xs text-center text-gray-500">
                {item.label}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Render Pie Chart
  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let currentAngle = 0
    const radius = Math.min(height, 250) / 3
    const centerX = radius + 20
    const centerY = radius + 20

    return (
      <div className="flex items-center space-x-8">
        <svg width={radius * 2 + 40} height={radius * 2 + 40}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const angle = (item.value / total) * 360
            const startAngle = currentAngle
            const endAngle = currentAngle + angle
            
            currentAngle += angle
            
            // Calculate path for pie slice
            const startAngleRad = (startAngle * Math.PI) / 180
            const endAngleRad = (endAngle * Math.PI) / 180
            
            const x1 = centerX + radius * Math.cos(startAngleRad)
            const y1 = centerY + radius * Math.sin(startAngleRad)
            const x2 = centerX + radius * Math.cos(endAngleRad)
            const y2 = centerY + radius * Math.sin(endAngleRad)
            
            const largeArcFlag = angle > 180 ? 1 : 0
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')
            
            const colors = [
              '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
              '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
            ]
            
            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={item.color || colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                <title>{`${item.label}: ${percentage.toFixed(1)}%`}</title>
              </g>
            )
          })}
        </svg>
        
        {/* Legend */}
        {showLegend && (
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const colors = [
                '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
                '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
              ]
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || colors[index % colors.length] }}
                  />
                  <span className="text-sm text-gray-600">
                    {item.label}: <span className="font-medium">{percentage.toFixed(1)}%</span>
                  </span>
                  <span className="text-xs text-gray-400">
                    ({formatValue(item.value)})
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Timeframe selector */}
          {timeframe && (
            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
              {timeframe}
            </span>
          )}
          
          {/* Info tooltip */}
          <InformationCircleIcon className="w-5 h-5 text-gray-400 cursor-help" />
        </div>
      </div>

      {/* Filters */}
      {filters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilter?.(filter)}
              className="px-3 py-1 text-sm text-gray-600 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Chart Container */}
      <div style={{ height: `${height}px` }} className="relative">
        {type === 'line' && renderLineChart()}
        {type === 'area' && renderLineChart()}
        {type === 'bar' && renderBarChart()}
        {type === 'pie' && renderPieChart()}
        {type === 'comparison' && renderBarChart()}
        {type === 'trend' && renderLineChart()}
      </div>

      {/* Chart Legend and Stats */}
      {(comparison || forecast) && (
        <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-1 bg-blue-500 rounded" />
            <span className="text-gray-600">Mevcut</span>
          </div>
          
          {comparison && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-green-500 rounded" style={{ borderStyle: 'dashed' }} />
              <span className="text-gray-600">{comparison.period}</span>
            </div>
          )}
          
          {forecast && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-1 bg-yellow-500 rounded" style={{ borderStyle: 'dashed' }} />
              <span className="text-gray-600">
                Tahmin {forecast.confidence && `(${forecast.confidence}% güven)`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdvancedChart