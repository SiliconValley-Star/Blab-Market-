import React from 'react'

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface LineChartDataPoint {
  x: string | number
  y: number
}

interface ChartProps {
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  data: ChartDataPoint[] | LineChartDataPoint[]
  title?: string
  height?: number
  width?: number
  showLegend?: boolean
  showTooltip?: boolean
  colors?: string[]
}

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  title,
  height = 300,
  width = 400,
  showLegend = true,
  showTooltip = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']
}) => {
  const getMaxValue = () => {
    if (type === 'line') {
      return Math.max(...(data as LineChartDataPoint[]).map(d => d.y))
    }
    return Math.max(...(data as ChartDataPoint[]).map(d => d.value))
  }

  const renderBarChart = () => {
    const chartData = data as ChartDataPoint[]
    const maxValue = getMaxValue()
    const barWidth = Math.floor((width - 100) / chartData.length) - 10

    return (
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={60}
              y1={height - 80 - (height - 120) * ratio}
              x2={width - 20}
              y2={height - 80 - (height - 120) * ratio}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
            <text
              x={50}
              y={height - 75 - (height - 120) * ratio}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {Math.round(maxValue * ratio).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Bars */}
        {chartData.map((item, index) => {
          const barHeight = (item.value / maxValue) * (height - 120)
          const x = 80 + index * (barWidth + 10)
          const color = item.color || colors[index % colors.length]

          return (
            <g key={index}>
              <rect
                x={x}
                y={height - 80 - barHeight}
                width={barWidth}
                height={barHeight}
                fill={color}
                rx={4}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
              <text
                x={x + barWidth / 2}
                y={height - 60}
                textAnchor="middle"
                className="text-xs fill-gray-700"
              >
                {item.label.length > 10 ? `${item.label.slice(0, 10)}...` : item.label}
              </text>
              {showTooltip && (
                <title>{`${item.label}: ${item.value.toLocaleString()}`}</title>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  const renderLineChart = () => {
    const chartData = data as LineChartDataPoint[]
    const maxValue = getMaxValue()
    const stepX = (width - 100) / (chartData.length - 1)
    
    const points = chartData.map((item, index) => {
      const x = 70 + index * stepX
      const y = height - 80 - (item.y / maxValue) * (height - 120)
      return `${x},${y}`
    }).join(' ')

    return (
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={60}
              y1={height - 80 - (height - 120) * ratio}
              x2={width - 20}
              y2={height - 80 - (height - 120) * ratio}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
            <text
              x={50}
              y={height - 75 - (height - 120) * ratio}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {Math.round(maxValue * ratio).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={colors[0]}
          strokeWidth={3}
          className="drop-shadow-sm"
        />

        {/* Data points */}
        {chartData.map((item, index) => {
          const x = 70 + index * stepX
          const y = height - 80 - (item.y / maxValue) * (height - 120)

          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={4}
                fill={colors[0]}
                className="hover:r-6 transition-all cursor-pointer"
              />
              <text
                x={x}
                y={height - 60}
                textAnchor="middle"
                className="text-xs fill-gray-700"
              >
                {String(item.x).length > 8 ? `${String(item.x).slice(0, 8)}...` : String(item.x)}
              </text>
              {showTooltip && (
                <title>{`${item.x}: ${item.y.toLocaleString()}`}</title>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  const renderPieChart = () => {
    const chartData = data as ChartDataPoint[]
    const total = chartData.reduce((sum, item) => sum + item.value, 0)
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 60

    let currentAngle = -90

    return (
      <div className="flex items-center">
        <svg width={width} height={height} className="overflow-visible">
          {chartData.map((item, index) => {
            const percentage = item.value / total
            const angle = percentage * 360
            const startAngle = (currentAngle * Math.PI) / 180
            const endAngle = ((currentAngle + angle) * Math.PI) / 180

            const x1 = centerX + radius * Math.cos(startAngle)
            const y1 = centerY + radius * Math.sin(startAngle)
            const x2 = centerX + radius * Math.cos(endAngle)
            const y2 = centerY + radius * Math.sin(endAngle)

            const largeArcFlag = angle > 180 ? 1 : 0
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ')

            currentAngle += angle
            const color = item.color || colors[index % colors.length]

            return (
              <g key={index}>
                <path
                  d={pathData}
                  fill={color}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                {showTooltip && (
                  <title>{`${item.label}: ${item.value.toLocaleString()} (${(percentage * 100).toFixed(1)}%)`}</title>
                )}
              </g>
            )
          })}
          
          {/* Center circle for doughnut effect */}
          {type === 'doughnut' && (
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.6}
              fill="#ffffff"
            />
          )}
        </svg>

        {/* Legend */}
        {showLegend && (
          <div className="ml-6 space-y-2">
            {chartData.map((item, index) => {
              const color = item.color || colors[index % colors.length]
              const percentage = ((item.value / total) * 100).toFixed(1)
              
              return (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-700">
                    {item.label} ({percentage}%)
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'line':
        return renderLineChart()
      case 'pie':
      case 'doughnut':
        return renderPieChart()
      default:
        return <div>Unsupported chart type</div>
    }
  }

  return (
    <div className="bg-white rounded-lg p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <div className="flex items-center justify-center">
        {renderChart()}
      </div>
    </div>
  )
}

export default Chart