import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SalesList from './components/SalesList'
import SalesDetail from './components/SalesDetail'
import CreateSalesOpportunity from './components/CreateSalesOpportunity'
import EditSalesOpportunity from './components/EditSalesOpportunity'

const SalesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Routes>
        <Route index element={<SalesList />} />
        <Route path="create" element={<CreateSalesOpportunity />} />
        <Route path=":id" element={<SalesDetail />} />
        <Route path=":id/edit" element={<EditSalesOpportunity />} />
      </Routes>
    </div>
  )
}

export default SalesPage