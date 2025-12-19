import { configureStore } from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'
import customersSlice from './slices/customersSlice'
import productsSlice from './slices/productsSlice'
import salesSlice from './slices/salesSlice'
import suppliersSlice from './slices/suppliersSlice'
import financeSlice from './slices/financeSlice'
import tasksSlice from './slices/tasksSlice'
import reportsSlice from './slices/reportsSlice'
import analyticsSlice from './slices/analyticsSlice'
import automationSlice from './slices/automationSlice'
import settingsSlice from './slices/settingsSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    customers: customersSlice,
    products: productsSlice,
    sales: salesSlice,
    suppliers: suppliersSlice,
    finance: financeSlice,
    tasks: tasksSlice,
    reports: reportsSlice,
    analytics: analyticsSlice,
    automation: automationSlice,
    settings: settingsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch