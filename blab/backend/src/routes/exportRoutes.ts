import { Router, Request, Response } from 'express'
import reportExportService from '../services/reportExportService'
import reportSchedulingService from '../services/reportSchedulingService'

const router = Router()

// Export Routes
router.post('/export', async (req: Request, res: Response) => {
  try {
    const { config, data } = req.body

    if (!config || !config.type) {
      return res.status(400).json({
        success: false,
        message: 'Export configuration is required'
      })
    }

    let result: Buffer | string
    let filename: string
    let mimeType: string

    switch (config.type) {
      case 'pdf':
        result = await reportExportService.exportToPDF(config, data)
        filename = `report_${Date.now()}.pdf`
        mimeType = 'application/pdf'
        break

      case 'excel':
        result = await reportExportService.exportToExcel(config, data)
        filename = `report_${Date.now()}.xlsx`
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        break

      case 'csv':
        result = await reportExportService.exportToCSV(data)
        filename = `report_${Date.now()}.csv`
        mimeType = 'text/csv'
        break

      case 'png':
        if (!data.charts || data.charts.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'Chart data is required for PNG export'
          })
        }
        result = await reportExportService.exportToPNG(data.charts[0], config.content?.chartResolution)
        filename = `chart_${Date.now()}.png`
        mimeType = 'image/png'
        break

      default:
        return res.status(400).json({
          success: false,
          message: `Unsupported export type: ${config.type}`
        })
    }

    // Set headers for file download
    res.setHeader('Content-Type', mimeType)
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', result instanceof Buffer ? result.length : Buffer.byteLength(result))

    // Send file
    if (result instanceof Buffer) {
      res.send(result)
    } else {
      res.send(Buffer.from(result as string, 'utf-8'))
    }

    console.log(`📤 Export completed: ${filename} (${mimeType})`)

  } catch (error) {
    console.error('Export error:', error)
    res.status(500).json({
      success: false,
      message: 'Export failed',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Preview Export Route
router.post('/export/preview', async (req: Request, res: Response) => {
  try {
    const { config, data } = req.body

    // Generate a lightweight preview/metadata
    const preview = {
      type: config.type,
      estimatedSize: estimateFileSize(config, data),
      pageCount: estimatePageCount(config, data),
      includesCharts: config.content?.includeCharts && data.charts?.length > 0,
      includesData: config.content?.includeData && data.tables?.length > 0,
      chartsCount: data.charts?.length || 0,
      tablesCount: data.tables?.length || 0,
      totalDataRows: data.tables?.reduce((sum: number, table: any) => sum + table.rows.length, 0) || 0
    }

    res.json({
      success: true,
      preview
    })

  } catch (error) {
    console.error('Export preview error:', error)
    res.status(500).json({
      success: false,
      message: 'Preview generation failed',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Schedule Routes
router.post('/schedules', async (req: Request, res: Response) => {
  try {
    const scheduleData = req.body

    // Validate required fields
    if (!scheduleData.name || !scheduleData.reportId || !scheduleData.frequency) {
      return res.status(400).json({
        success: false,
        message: 'Name, reportId, and frequency are required'
      })
    }

    if (!scheduleData.recipients || scheduleData.recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one recipient is required'
      })
    }

    // Set default values
    const schedule = await reportSchedulingService.createSchedule({
      ...scheduleData,
      createdBy: req.body.userId || 'unknown',
      timezone: scheduleData.timezone || 'UTC'
    })

    res.status(201).json({
      success: true,
      schedule
    })

    console.log(`📅 Schedule created: ${schedule.name}`)

  } catch (error) {
    console.error('Schedule creation error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create schedule',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.get('/schedules', (req: Request, res: Response) => {
  try {
    const { active } = req.query
    
    let schedules = reportSchedulingService.getAllSchedules()
    
    if (active === 'true') {
      schedules = reportSchedulingService.getActiveSchedules()
    }

    res.json({
      success: true,
      schedules,
      count: schedules.length
    })

  } catch (error) {
    console.error('Get schedules error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedules',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.get('/schedules/:id', (req: Request, res: Response) => {
  try {
    const schedule = reportSchedulingService.getSchedule(req.params.id)
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      })
    }

    res.json({
      success: true,
      schedule
    })

  } catch (error) {
    console.error('Get schedule error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch schedule',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.put('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const schedule = await reportSchedulingService.updateSchedule(req.params.id, req.body)
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      })
    }

    res.json({
      success: true,
      schedule
    })

    console.log(`📅 Schedule updated: ${schedule.name}`)

  } catch (error) {
    console.error('Schedule update error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update schedule',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.delete('/schedules/:id', async (req: Request, res: Response) => {
  try {
    const deleted = await reportSchedulingService.deleteSchedule(req.params.id)
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      })
    }

    res.json({
      success: true,
      message: 'Schedule deleted successfully'
    })

  } catch (error) {
    console.error('Schedule deletion error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete schedule',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Execution History Routes
router.get('/schedules/:id/executions', (req: Request, res: Response) => {
  try {
    const executions = reportSchedulingService.getExecutionHistory(req.params.id)
    
    res.json({
      success: true,
      executions,
      count: executions.length
    })

  } catch (error) {
    console.error('Get executions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution history',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.get('/executions', (req: Request, res: Response) => {
  try {
    const executions = reportSchedulingService.getExecutionHistory()
    
    res.json({
      success: true,
      executions,
      count: executions.length
    })

  } catch (error) {
    console.error('Get all executions error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch execution history',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Statistics Route
router.get('/schedules/stats/overview', (req: Request, res: Response) => {
  try {
    const stats = reportSchedulingService.getStatistics()
    
    res.json({
      success: true,
      statistics: stats
    })

  } catch (error) {
    console.error('Get statistics error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Manual Trigger Route
router.post('/schedules/:id/trigger', async (req: Request, res: Response) => {
  try {
    const schedule = reportSchedulingService.getSchedule(req.params.id)
    
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: 'Schedule not found'
      })
    }

    // Manually trigger execution
    reportSchedulingService.emit('manualTrigger', schedule)

    res.json({
      success: true,
      message: 'Schedule triggered manually',
      scheduleId: schedule.id
    })

    console.log(`🚀 Manual trigger: ${schedule.name}`)

  } catch (error) {
    console.error('Manual trigger error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to trigger schedule',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Service Management Routes
router.post('/service/start', (req: Request, res: Response) => {
  try {
    reportSchedulingService.start()
    
    res.json({
      success: true,
      message: 'Scheduling service started'
    })

  } catch (error) {
    console.error('Service start error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to start service',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

router.post('/service/stop', (req: Request, res: Response) => {
  try {
    reportSchedulingService.stop()
    
    res.json({
      success: true,
      message: 'Scheduling service stopped'
    })

  } catch (error) {
    console.error('Service stop error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to stop service',
      error: error instanceof Error ? error.message : String(error)
    })
  }
})

// Helper functions
function estimateFileSize(config: any, data: any): string {
  let baseSize = 1024 // 1KB base

  if (config.content?.includeCharts && data.charts) {
    baseSize += data.charts.length * 50 * 1024 // ~50KB per chart
  }

  if (config.content?.includeData && data.tables) {
    const totalRows = data.tables.reduce((sum: number, table: any) => sum + table.rows.length, 0)
    baseSize += totalRows * 100 // ~100 bytes per row
  }

  if (baseSize < 1024) return `${baseSize} B`
  if (baseSize < 1048576) return `${Math.round(baseSize / 1024)} KB`
  return `${Math.round(baseSize / 1048576)} MB`
}

function estimatePageCount(config: any, data: any): number {
  let pages = 1 // Base page

  if (config.format?.includeCover) pages += 1
  if (config.content?.includeCharts && data.charts) {
    pages += Math.ceil(data.charts.length / 2) // 2 charts per page
  }
  if (config.content?.includeData && data.tables) {
    pages += data.tables.length // 1 table per page
  }

  return pages
}

export default router