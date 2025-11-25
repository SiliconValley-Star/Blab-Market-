import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import {
  ChartBarIcon,
  TableCellsIcon,
  Squares2X2Icon,
  PlusIcon,
  TrashIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  FunnelIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

// Report Component Types
export interface ReportComponent {
  id: string
  type: 'chart' | 'kpi' | 'table' | 'text' | 'filter' | 'date-range'
  title: string
  data?: any
  config?: {
    chartType?: 'line' | 'bar' | 'pie' | 'area' | 'scatter'
    dataSource?: string
    filters?: string[]
    columns?: string[]
    aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max'
    timeframe?: string
    groupBy?: string
    sortBy?: string
    limit?: number
  }
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface ReportTemplate {
  id: string
  name: string
  description: string
  components: ReportComponent[]
  createdAt: string
  updatedAt: string
  isPublic: boolean
  tags: string[]
  thumbnail?: string
}

// Available Widgets for Toolbar
const AVAILABLE_WIDGETS = [
  {
    type: 'chart',
    icon: ChartBarIcon,
    label: 'Grafik',
    description: 'Veri görselleştirme grafiği'
  },
  {
    type: 'kpi',
    icon: Squares2X2Icon,
    label: 'KPI Kartı',
    description: 'Anahtar performans göstergesi'
  },
  {
    type: 'table',
    icon: TableCellsIcon,
    label: 'Tablo',
    description: 'Veri tablosu'
  },
  {
    type: 'text',
    icon: DocumentTextIcon,
    label: 'Metin',
    description: 'Başlık ve açıklama metni'
  },
  {
    type: 'filter',
    icon: FunnelIcon,
    label: 'Filtre',
    description: 'Veri filtre kontrolü'
  },
  {
    type: 'date-range',
    icon: CalendarDaysIcon,
    label: 'Tarih Aralığı',
    description: 'Tarih seçici'
  }
]

// Draggable Widget Component
const DraggableWidget: React.FC<{
  widget: typeof AVAILABLE_WIDGETS[0]
  onDragStart: (type: string) => void
}> = ({ widget, onDragStart }) => {
  const Icon = widget.icon

  return (
    <div
      draggable
      onDragStart={() => onDragStart(widget.type)}
      className="p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-move hover:border-blue-400 hover:bg-blue-50 transition-colors"
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <Icon className="w-8 h-8 text-gray-600" />
        <div>
          <div className="text-sm font-medium text-gray-900">{widget.label}</div>
          <div className="text-xs text-gray-500">{widget.description}</div>
        </div>
      </div>
    </div>
  )
}

// Report Component in Canvas
const ReportComponentRenderer: React.FC<{
  component: ReportComponent
  isSelected: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<ReportComponent>) => void
  onMove: (id: string, position: { x: number; y: number }) => void
}> = ({ component, isSelected, onSelect, onDelete, onUpdate, onMove }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return // Only left click
    
    e.preventDefault()
    e.stopPropagation()
    
    const rect = elementRef.current?.getBoundingClientRect()
    if (!rect) return

    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
    setIsDragging(true)
    onSelect(component.id)

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!elementRef.current?.parentElement) return

      const parentRect = elementRef.current.parentElement.getBoundingClientRect()
      const newX = Math.max(0, Math.min(
        parentRect.width - component.size.width,
        moveEvent.clientX - parentRect.left - dragOffset.x
      ))
      const newY = Math.max(0, Math.min(
        parentRect.height - component.size.height,
        moveEvent.clientY - parentRect.top - dragOffset.y
      ))

      onMove(component.id, { x: newX, y: newY })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const renderComponentContent = () => {
    switch (component.type) {
      case 'chart':
        return (
          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <ChartBarIcon className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <div className="text-sm font-medium text-blue-700">
                {component.config?.chartType || 'Bar'} Chart
              </div>
              <div className="text-xs text-blue-600">
                {component.config?.dataSource || 'Veri Kaynağı Seçilmedi'}
              </div>
            </div>
          </div>
        )

      case 'kpi':
        return (
          <div className="w-full h-full bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">1,234</div>
              <div className="text-sm text-green-600">{component.title}</div>
              <div className="text-xs text-green-500 mt-1">↗ +12.5%</div>
            </div>
          </div>
        )

      case 'table':
        return (
          <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg p-2">
            <div className="text-center text-gray-500">
              <TableCellsIcon className="w-8 h-8 mx-auto mb-2" />
              <div className="text-sm">Veri Tablosu</div>
              <div className="text-xs">{component.config?.columns?.length || 0} sütun</div>
            </div>
          </div>
        )

      case 'text':
        return (
          <div className="w-full h-full bg-gray-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <DocumentTextIcon className="w-8 h-8 text-gray-500 mx-auto mb-2" />
              <div className="text-sm text-gray-700 font-medium">{component.title || 'Başlık'}</div>
            </div>
          </div>
        )

      case 'filter':
        return (
          <div className="w-full h-full bg-purple-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <FunnelIcon className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-sm text-purple-700">Filtre Kontrolü</div>
            </div>
          </div>
        )

      case 'date-range':
        return (
          <div className="w-full h-full bg-orange-50 rounded-lg p-4 flex items-center justify-center">
            <div className="text-center">
              <CalendarDaysIcon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-sm text-orange-700">Tarih Seçici</div>
            </div>
          </div>
        )

      default:
        return <div className="w-full h-full bg-gray-100 rounded-lg"></div>
    }
  }

  return (
    <div
      ref={elementRef}
      className={`absolute cursor-move select-none ${isDragging ? 'opacity-50' : ''} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: component.position.x,
        top: component.position.y,
        width: component.size.width,
        height: component.size.height,
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(component.id)
      }}
    >
      <div className="relative w-full h-full group">
        {renderComponentContent()}
        
        {/* Component Actions */}
        {isSelected && !isDragging && (
          <div className="absolute -top-2 -right-2 flex space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                // Open configuration modal
              }}
              className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
            >
              <Cog6ToothIcon className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(component.id)
              }}
              className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Resize Handles */}
        {isSelected && !isDragging && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize opacity-70 hover:opacity-100"></div>
        )}
      </div>
    </div>
  )
}

// Drop Canvas
const ReportCanvas: React.FC<{
  components: ReportComponent[]
  selectedComponentId: string | null
  onSelectComponent: (id: string | null) => void
  onAddComponent: (type: string, position: { x: number; y: number }) => void
  onDeleteComponent: (id: string) => void
  onUpdateComponent: (id: string, updates: Partial<ReportComponent>) => void
  onMoveComponent: (id: string, position: { x: number; y: number }) => void
  draggedWidgetType: string | null
}> = ({
  components,
  selectedComponentId,
  onSelectComponent,
  onAddComponent,
  onDeleteComponent,
  onUpdateComponent,
  onMoveComponent,
  draggedWidgetType
}) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (!draggedWidgetType || !canvasRef.current) return

    const canvasRect = canvasRef.current.getBoundingClientRect()
    const position = {
      x: e.clientX - canvasRect.left - 100, // Offset for component size
      y: e.clientY - canvasRect.top - 50
    }

    onAddComponent(draggedWidgetType, position)
  }

  return (
    <div
      ref={canvasRef}
      className={`relative flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg min-h-[600px] overflow-hidden ${
        isDragOver ? 'border-blue-400 bg-blue-50' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => onSelectComponent(null)}
    >
      {components.length === 0 && !isDragOver && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500 pointer-events-none">
          <div className="text-center">
            <Squares2X2Icon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <div className="text-lg font-medium mb-2">Rapor Tasarımına Başlayın</div>
            <div className="text-sm">
              Sol panelden bileşenleri sürükleyip bırakın
            </div>
          </div>
        </div>
      )}

      {components.map((component) => (
        <ReportComponentRenderer
          key={component.id}
          component={component}
          isSelected={selectedComponentId === component.id}
          onSelect={onSelectComponent}
          onDelete={onDeleteComponent}
          onUpdate={onUpdateComponent}
          onMove={onMoveComponent}
        />
      ))}

      {isDragOver && (
        <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center pointer-events-none">
          <div className="text-blue-600 font-medium">Bırakın</div>
        </div>
      )}
    </div>
  )
}

// Property Panel
const PropertyPanel: React.FC<{
  component: ReportComponent | null
  onUpdateComponent: (id: string, updates: Partial<ReportComponent>) => void
}> = ({ component, onUpdateComponent }) => {
  if (!component) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Cog6ToothIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <div className="font-medium mb-2">Özellik Paneli</div>
          <div className="text-sm">Bir bileşen seçin</div>
        </div>
      </div>
    )
  }

  const handleConfigChange = (key: string, value: any) => {
    onUpdateComponent(component.id, {
      config: {
        ...component.config,
        [key]: value
      }
    })
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
      <div className="space-y-6">
        {/* Basic Properties */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Temel Özellikler</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Başlık
              </label>
              <input
                type="text"
                value={component.title}
                onChange={(e) => onUpdateComponent(component.id, { title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genişlik
                </label>
                <input
                  type="number"
                  value={component.size.width}
                  onChange={(e) => onUpdateComponent(component.id, {
                    size: { ...component.size, width: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yükseklik
                </label>
                <input
                  type="number"
                  value={component.size.height}
                  onChange={(e) => onUpdateComponent(component.id, {
                    size: { ...component.size, height: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Type-specific Properties */}
        {component.type === 'chart' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Grafik Ayarları</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Grafik Tipi
                </label>
                <select
                  value={component.config?.chartType || 'bar'}
                  onChange={(e) => handleConfigChange('chartType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="bar">Sütun Grafik</option>
                  <option value="line">Çizgi Grafik</option>
                  <option value="pie">Pasta Grafik</option>
                  <option value="area">Alan Grafik</option>
                  <option value="scatter">Nokta Grafik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veri Kaynağı
                </label>
                <select
                  value={component.config?.dataSource || ''}
                  onChange={(e) => handleConfigChange('dataSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="sales">Satış Verileri</option>
                  <option value="customers">Müşteri Verileri</option>
                  <option value="products">Ürün Verileri</option>
                  <option value="finance">Finansal Veriler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zaman Aralığı
                </label>
                <select
                  value={component.config?.timeframe || '30d'}
                  onChange={(e) => handleConfigChange('timeframe', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="7d">Son 7 Gün</option>
                  <option value="30d">Son 30 Gün</option>
                  <option value="90d">Son 90 Gün</option>
                  <option value="365d">Son 1 Yıl</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {component.type === 'table' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tablo Ayarları</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Veri Kaynağı
                </label>
                <select
                  value={component.config?.dataSource || ''}
                  onChange={(e) => handleConfigChange('dataSource', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="sales">Satış Verileri</option>
                  <option value="customers">Müşteri Verileri</option>
                  <option value="products">Ürün Verileri</option>
                  <option value="finance">Finansal Veriler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Satır Limiti
                </label>
                <input
                  type="number"
                  value={component.config?.limit || 10}
                  onChange={(e) => handleConfigChange('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sıralama
                </label>
                <select
                  value={component.config?.sortBy || ''}
                  onChange={(e) => handleConfigChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Varsayılan</option>
                  <option value="name">İsim</option>
                  <option value="value">Değer</option>
                  <option value="date">Tarih</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main Drag Drop Report Builder Component
const DragDropReportBuilder: React.FC<{
  template?: ReportTemplate
  onSave?: (template: ReportTemplate) => void
  onPreview?: (components: ReportComponent[]) => void
}> = ({ template, onSave, onPreview }) => {
  const [components, setComponents] = useState<ReportComponent[]>(template?.components || [])
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)
  const [reportName, setReportName] = useState(template?.name || 'Yeni Rapor')
  const [draggedWidgetType, setDraggedWidgetType] = useState<string | null>(null)

  const selectedComponent = useMemo(() => 
    components.find(c => c.id === selectedComponentId) || null,
    [components, selectedComponentId]
  )

  const handleDragStart = (type: string) => {
    setDraggedWidgetType(type)
  }

  const handleAddComponent = useCallback((type: string, position: { x: number; y: number }) => {
    const newComponent: ReportComponent = {
      id: `component-${Date.now()}`,
      type: type as any,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Bileşeni`,
      position: {
        x: Math.max(0, position.x),
        y: Math.max(0, position.y)
      },
      size: {
        width: type === 'text' ? 300 : type === 'filter' || type === 'date-range' ? 200 : 400,
        height: type === 'text' || type === 'filter' || type === 'date-range' ? 80 : type === 'kpi' ? 120 : 300
      },
      config: {}
    }

    setComponents(prev => [...prev, newComponent])
    setSelectedComponentId(newComponent.id)
    setDraggedWidgetType(null)
  }, [])

  const handleDeleteComponent = useCallback((id: string) => {
    setComponents(prev => prev.filter(c => c.id !== id))
    setSelectedComponentId(null)
  }, [])

  const handleUpdateComponent = useCallback((id: string, updates: Partial<ReportComponent>) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ))
  }, [])

  const handleMoveComponent = useCallback((id: string, position: { x: number; y: number }) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, position } : c
    ))
  }, [])

  const handleSave = () => {
    const reportTemplate: ReportTemplate = {
      id: template?.id || `template-${Date.now()}`,
      name: reportName,
      description: `${components.length} bileşenli özel rapor`,
      components,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPublic: false,
      tags: ['custom', 'dashboard']
    }

    onSave?.(reportTemplate)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Widget Toolbar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Bileşenler</h2>
          <p className="text-sm text-gray-600">Sürükle ve bırak</p>
        </div>

        <div className="space-y-4">
          {AVAILABLE_WIDGETS.map((widget) => (
            <DraggableWidget 
              key={widget.type} 
              widget={widget} 
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 px-2 py-1 rounded"
              />
              <span className="text-sm text-gray-500">
                {components.length} bileşen
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPreview?.(components)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 inline mr-2" />
                Önizle
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 p-4">
          <ReportCanvas
            components={components}
            selectedComponentId={selectedComponentId}
            onSelectComponent={setSelectedComponentId}
            onAddComponent={handleAddComponent}
            onDeleteComponent={handleDeleteComponent}
            onUpdateComponent={handleUpdateComponent}
            onMoveComponent={handleMoveComponent}
            draggedWidgetType={draggedWidgetType}
          />
        </div>
      </div>

      {/* Property Panel */}
      <PropertyPanel
        component={selectedComponent}
        onUpdateComponent={handleUpdateComponent}
      />
    </div>
  )
}

export default DragDropReportBuilder