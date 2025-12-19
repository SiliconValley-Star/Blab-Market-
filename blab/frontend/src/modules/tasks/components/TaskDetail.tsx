import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTaskById, addTaskComment, updateTaskStatus } from '../../../store/slices/tasksSlice'

interface TaskDetailProps {
  taskId: string
  onClose?: () => void
  onEdit?: (id: string) => void
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onClose, onEdit }) => {
  const dispatch = useDispatch() as any
  const { selectedTask, loading } = useSelector((state: any) => state.tasks)
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId))
    }
  }, [dispatch, taskId])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      await dispatch(addTaskComment({ id: taskId, content: newComment }))
      setNewComment('')
    } catch (error) {
      console.error('Yorum eklenirken hata:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await dispatch(updateTaskStatus({ id: taskId, status: newStatus }))
    } catch (error) {
      console.error('Durum güncellenirken hata:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      todo: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }

    const statusTexts = {
      todo: 'Bekliyor',
      in_progress: 'Devam Ediyor',
      completed: 'Tamamlandı',
      cancelled: 'İptal Edildi'
    }

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
        {statusTexts[status as keyof typeof statusTexts] || status}
      </span>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    }

    const priorityTexts = {
      low: 'Düşük',
      medium: 'Orta',
      high: 'Yüksek',
      urgent: 'Acil'
    }

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityColors[priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'}`}>
        {priorityTexts[priority as keyof typeof priorityTexts] || priority}
      </span>
    )
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading || !selectedTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedTask.title}
          </h1>
          {getStatusBadge(selectedTask.status)}
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedTask.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="todo">Bekliyor</option>
            <option value="in_progress">Devam Ediyor</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal Edildi</option>
          </select>
          {onEdit && (
            <button
              onClick={() => onEdit(selectedTask.id)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Düzenle
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Task Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Görev Detayları</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Bilgiler</h2>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Öncelik:</dt>
                  <dd className="text-sm">{getPriorityBadge(selectedTask.priority)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Kategori:</dt>
                  <dd className="text-sm font-medium text-gray-900">{selectedTask.category}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Atanan:</dt>
                  <dd className="text-sm text-gray-900">{selectedTask.assignedToName || 'Atanmamış'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Oluşturan:</dt>
                  <dd className="text-sm text-gray-900">{selectedTask.createdByName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Oluşturma Tarihi:</dt>
                  <dd className="text-sm text-gray-900">{formatDateTime(selectedTask.createdAt)}</dd>
                </div>
                {selectedTask.dueDate && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-500">Vade Tarihi:</dt>
                    <dd className="text-sm text-gray-900">{formatDateTime(selectedTask.dueDate)}</dd>
                  </div>
                )}
              </dl>
            </div>

            {selectedTask.tags.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Etiketler</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag: string, index: number) => (
                    <span key={index} className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">İlerlemekatsla.taskId</h2>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tahmini Süre:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedTask.estimatedHours} saat
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Harcanan Süre:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {selectedTask.actualHours} saat
                  </span>
                </div>
                {selectedTask.estimatedHours > 0 && (
                  <>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>İlerleme</span>
                      <span>
                        {((selectedTask.actualHours / selectedTask.estimatedHours) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((selectedTask.actualHours / selectedTask.estimatedHours) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedTask.workflow && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">İş Akışı</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{selectedTask.workflow.name}</h3>
                  <div className="space-y-2">
                    {selectedTask.workflow.steps.map((step: string, index: number) => (
                      <div key={index} className={`flex items-center space-x-2 ${
                        step === selectedTask.workflow?.currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          step === selectedTask.workflow?.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Yorumlar ({selectedTask.comments.length})</h2>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="border border-gray-300 rounded-lg">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-0 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Yorum ekleyin..."
                disabled={submittingComment}
              />
              <div className="px-3 py-2 bg-gray-50 border-t flex justify-end">
                <button
                  type="submit"
                  disabled={!newComment.trim() || submittingComment}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Ekleniyor...' : 'Yorum Ekle'}
                </button>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {selectedTask.comments.map((comment: any) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{comment.userName}</span>
                  <span className="text-sm text-gray-500">{formatDateTime(comment.createdAt)}</span>
                </div>
                <p className="text-gray-700">{comment.content}</p>
              </div>
            ))}
            {selectedTask.comments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>Henüz yorum yok</p>
                <p className="text-sm">İlk yorumu siz ekleyin!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail