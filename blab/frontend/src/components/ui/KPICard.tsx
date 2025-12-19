import React from 'react'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon
} from '@heroicons/react/24/outline'
import { KPIData } from '../../store/slices/analyticsSlice'

interface KPICardProps {
  title: string
  kpi: KPIData
  icon: React.ReactNode
  format?: 'currency' | 'number' | 'percentage'
  iconColor?: string
  size?: 'sm' | 'md' | 'lg'
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  kpi,
  icon,
  format = 'number',
  iconColor = 'bg-blue-100 text-blue-600',
  size = 'md'
}) => {
  const formatValue = (value: number, type: 'currency' | 'number' | 'percentage') => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('tr-TR', {
          style: 'currency',
          currency: 'TRY',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      case 'percentage':
        return `${value.toFixed(1)}%`
      default:
        return new Intl.NumberFormat('tr-TR').format(value)
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />
      case 'down':
        return <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />
      default:
        return <MinusIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getCardSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'p-4'
      case 'lg':
        return 'p-8'
      default:
        return 'p-6'
    }
  }

  const getIconSize = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8'
      case 'lg':
        return 'w-16 h-16'
      default:
        return 'w-12 h-12'
    }
  }

  const getTextSizes = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          title: 'text-sm',
          value: 'text-xl',
          change: 'text-xs'
        }
      case 'lg':
        return {
          title: 'text-lg',
          value: 'text-4xl',
          change: 'text-base'
        }
      default:
        return {
          title: 'text-base',
          value: 'text-2xl',
          change: 'text-sm'
        }
    }
  }

  const sizes = getTextSizes(size)

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${getCardSize(size)} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className={`${sizes.title} font-medium text-gray-600 mb-1`}>{title}</p>
          <p className={`${sizes.value} font-bold text-gray-900 mb-2`}>
            {formatValue(kpi.value, format)}
          </p>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {getTrendIcon(kpi.trend)}
              <span className={`${sizes.change} font-medium ${getTrendColor(kpi.trend)}`}>
                {kpi.changePercent >= 0 ? '+' : ''}{kpi.changePercent.toFixed(1)}%
              </span>
            </div>
            <span className={`${sizes.change} text-gray-500`}>
              {format === 'currency' 
                ? formatValue(Math.abs(kpi.change), 'currency')
                : new Intl.NumberFormat('tr-TR', { signDisplay: 'always' }).format(kpi.change)
              }
            </span>
          </div>
        </div>
        
        <div className={`${iconColor} ${getIconSize(size)} rounded-lg flex items-center justify-center flex-shrink-0 ml-4`}>
          {React.cloneElement(icon as React.ReactElement, { 
            className: size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-8 w-8' : 'h-6 w-6' 
          })}
        </div>
      </div>

      {/* Previous period comparison */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Önceki dönem</span>
          <span>{formatValue(kpi.previous, format)}</span>
        </div>
      </div>
    </div>
  )
}

export default KPICard