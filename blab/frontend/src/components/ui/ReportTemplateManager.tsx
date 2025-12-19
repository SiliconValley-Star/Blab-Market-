import React, { useState, useCallback, useMemo } from 'react'
import {
  DocumentDuplicateIcon,
  TrashIcon,
  PencilIcon,
  FolderIcon,
  FolderPlusIcon,
  StarIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ClockIcon,
  TagIcon,
  UserIcon,
  CalendarIcon,
  ChartBarIcon,
  DocumentIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

// Template Types
export interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  isPublic: boolean
  isFavorite: boolean
  createdBy: string
  createdAt: string
  updatedAt: string
  usageCount: number
  config: {
    layout: 'grid' | 'vertical' | 'horizontal'
    components: Array<{
      id: string
      type: 'chart' | 'kpi' | 'table' | 'text' | 'filter'
      position: { x: number; y: number; width: number; height: number }
      config: any
    }>
    settings: {
      theme: 'light' | 'dark'
      autoRefresh: number
      dateRange: string
    }
  }
  thumbnail?: string
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  templateCount: number
}

// Mock Template Categories
const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'sales',
    name: 'Satış Raporları',
    description: 'Satış performansı ve trendleri',
    icon: ChartBarIcon,
    color: 'bg-blue-500',
    templateCount: 12
  },
  {
    id: 'finance',
    name: 'Mali Raporlar',
    description: 'Gelir, gider ve karlılık analizleri',
    icon: DocumentIcon,
    color: 'bg-green-500',
    templateCount: 8
  },
  {
    id: 'customers',
    name: 'Müşteri Analizleri',
    description: 'Müşteri segmentasyonu ve davranış',
    icon: UserIcon,
    color: 'bg-purple-500',
    templateCount: 6
  },
  {
    id: 'operations',
    name: 'Operasyonel Raporlar',
    description: 'Süreç ve verimlilik analizleri',
    icon: ClockIcon,
    color: 'bg-orange-500',
    templateCount: 10
  },
  {
    id: 'executive',
    name: 'Yönetici Panosu',
    description: 'Üst düzey stratejik görünümler',
    icon: StarIcon,
    color: 'bg-red-500',
    templateCount: 5
  }
]

// Mock Templates
const MOCK_TEMPLATES: ReportTemplate[] = [
  {
    id: '1',
    name: 'Günlük Satış Özeti',
    description: 'Günlük satış performansı, trend ve karşılaştırma',
    category: 'sales',
    tags: ['günlük', 'satış', 'kpi'],
    isPublic: true,
    isFavorite: false,
    createdBy: 'Admin User',
    createdAt: '2024-01-15',
    updatedAt: '2024-02-20',
    usageCount: 45,
    config: {
      layout: 'grid',
      components: [],
      settings: {
        theme: 'light',
        autoRefresh: 300000,
        dateRange: 'today'
      }
    }
  },
  {
    id: '2',
    name: 'Aylık Finansal Rapor',
    description: 'Gelir, gider ve karlılık analizi',
    category: 'finance',
    tags: ['aylık', 'gelir', 'karlılık'],
    isPublic: true,
    isFavorite: true,
    createdBy: 'Finance Manager',
    createdAt: '2024-01-20',
    updatedAt: '2024-02-15',
    usageCount: 32,
    config: {
      layout: 'vertical',
      components: [],
      settings: {
        theme: 'light',
        autoRefresh: 0,
        dateRange: 'current_month'
      }
    }
  },
  {
    id: '3',
    name: 'Müşteri Segmentasyon Analizi',
    description: 'Müşteri grupları ve davranış analizleri',
    category: 'customers',
    tags: ['müşteri', 'segment', 'davranış'],
    isPublic: false,
    isFavorite: true,
    createdBy: 'Marketing Manager',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10',
    usageCount: 18,
    config: {
      layout: 'grid',
      components: [],
      settings: {
        theme: 'dark',
        autoRefresh: 0,
        dateRange: 'last_30_days'
      }
    }
  }
]

// Template Card Component
const TemplateCard: React.FC<{
  template: ReportTemplate
  onUse: (template: ReportTemplate) => void
  onEdit: (template: ReportTemplate) => void
  onDelete: (template: ReportTemplate) => void
  onToggleFavorite: (template: ReportTemplate) => void
  onPreview: (template: ReportTemplate) => void
}> = ({ template, onUse, onEdit, onDelete, onToggleFavorite, onPreview }) => {
  const category = TEMPLATE_CATEGORIES.find(c => c.id === template.category)
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-t-lg relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <ChartBarIcon className="w-12 h-12 text-gray-400" />
        </div>
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={() => onToggleFavorite(template)}
            className="p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            {template.isFavorite ? (
              <StarIconSolid className="w-4 h-4 text-yellow-500" />
            ) : (
              <StarIcon className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {template.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {template.description}
            </p>
          </div>
        </div>

        {/* Tags */}
        {template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {template.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{template.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-2">
            {category && (
              <div className={`w-3 h-3 rounded-full ${category.color}`} />
            )}
            <span>{category?.name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <EyeIcon className="w-3 h-3" />
            <span>{template.usageCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onUse(template)}
            className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors mr-2"
          >
            Kullan
          </button>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onPreview(template)}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              title="Önizle"
            >
              <EyeIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(template)}
              className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
              title="Düzenle"
            >
              <PencilIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(template)}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
              title="Sil"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Category Selector
const CategorySelector: React.FC<{
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}> = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className="space-y-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
          selectedCategory === null
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        Tüm Kategoriler ({MOCK_TEMPLATES.length})
      </button>
      
      {TEMPLATE_CATEGORIES.map(category => {
        const Icon = category.icon
        const categoryTemplates = MOCK_TEMPLATES.filter(t => t.category === category.id)
        
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${category.color} mr-3`} />
              <Icon className="w-4 h-4 mr-2" />
              <span className="flex-1">{category.name}</span>
              <span className="text-xs text-gray-500">
                ({categoryTemplates.length})
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Template Create Modal
const CreateTemplateModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSave: (template: Partial<ReportTemplate>) => void
}> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'sales',
    tags: '',
    isPublic: false
  })

  const handleSave = () => {
    if (!formData.name.trim()) return

    const template: Partial<ReportTemplate> = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      isPublic: formData.isPublic,
      isFavorite: false,
      createdBy: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      usageCount: 0,
      config: {
        layout: 'grid',
        components: [],
        settings: {
          theme: 'light',
          autoRefresh: 0,
          dateRange: 'today'
        }
      }
    }

    onSave(template)
    setFormData({
      name: '',
      description: '',
      category: 'sales',
      tags: '',
      isPublic: false
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Yeni Şablon Oluştur</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şablon Adı
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Şablon adını girin"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Şablon açıklaması"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {TEMPLATE_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Etiketler (virgül ile ayırın)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="etiket1, etiket2, etiket3"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
              Herkese açık şablon
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.name.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Oluştur
          </button>
        </div>
      </div>
    </div>
  )
}

// Main Template Manager Component
const ReportTemplateManager: React.FC<{
  onUseTemplate?: (template: ReportTemplate) => void
  onCreateNew?: () => void
}> = ({ onUseTemplate, onCreateNew }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'usage' | 'date'>('usage')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [templates, setTemplates] = useState(MOCK_TEMPLATES)

  // Filter and sort templates
  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'usage':
          return b.usageCount - a.usageCount
        case 'date':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [templates, selectedCategory, searchQuery, sortBy])

  // Event handlers
  const handleUseTemplate = useCallback((template: ReportTemplate) => {
    // Update usage count
    setTemplates(prev => prev.map(t =>
      t.id === template.id ? { ...t, usageCount: t.usageCount + 1 } : t
    ))
    
    onUseTemplate?.(template)
  }, [onUseTemplate])

  const handleToggleFavorite = useCallback((template: ReportTemplate) => {
    setTemplates(prev => prev.map(t =>
      t.id === template.id ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }, [])

  const handleDeleteTemplate = useCallback((template: ReportTemplate) => {
    if (window.confirm(`"${template.name}" şablonunu silmek istediğinizden emin misiniz?`)) {
      setTemplates(prev => prev.filter(t => t.id !== template.id))
    }
  }, [])

  const handleCreateTemplate = useCallback((templateData: Partial<ReportTemplate>) => {
    const newTemplate: ReportTemplate = {
      ...templateData as ReportTemplate,
      id: `template-${Date.now()}`
    }
    setTemplates(prev => [newTemplate, ...prev])
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Rapor Şablonları</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Yeni Şablon"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Şablonlarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex-1 overflow-y-auto p-4">
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sıralama:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="usage">En Çok Kullanılan</option>
                  <option value="date">En Yeni</option>
                  <option value="name">İsim (A-Z)</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredAndSortedTemplates.length} şablon
              </div>
            </div>

            <button
              onClick={onCreateNew}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Yeni Rapor Oluştur
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAndSortedTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onUse={handleUseTemplate}
                  onEdit={(template) => console.log('Edit template:', template)}
                  onDelete={handleDeleteTemplate}
                  onToggleFavorite={handleToggleFavorite}
                  onPreview={(template) => console.log('Preview template:', template)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentDuplicateIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Şablon bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Arama kriterlerinize uygun şablon bulunamadı.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                }}
                className="text-blue-600 hover:text-blue-500"
              >
                Filtreleri temizle
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Template Modal */}
      <CreateTemplateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSave={handleCreateTemplate}
      />
    </div>
  )
}

export default ReportTemplateManager