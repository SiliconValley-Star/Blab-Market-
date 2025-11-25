import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { AppDispatch } from '../../store'
import { 
  fetchCustomers, 
  selectCustomers, 
  selectCustomersLoading, 
  selectCustomersError,
  Customer 
} from '../../store/slices/customersSlice'
import CustomersList from './components/CustomersList'
import CustomerDetail from './components/CustomerDetail'
import CreateCustomer from './components/CreateCustomer'
import EditCustomer from './components/EditCustomer'

const CustomersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const customers = useSelector(selectCustomers)
  const isLoading = useSelector(selectCustomersLoading)
  const error = useSelector(selectCustomersError)

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    segment: 'all',
    city: 'all',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchCustomers({
      page: currentPage,
      limit: itemsPerPage,
      ...filters
    }))
  }, [dispatch, currentPage, itemsPerPage, filters])

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="space-y-6">
      <Routes>
        <Route 
          path="/" 
          element={
            <CustomersList
              customers={customers}
              isLoading={isLoading}
              error={error}
              filters={filters}
              onFilterChange={handleFilterChange}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          } 
        />
        <Route path="/create" element={<CreateCustomer />} />
        <Route path="/:id" element={<CustomerDetail />} />
        <Route path="/:id/edit" element={<EditCustomer />} />
      </Routes>
    </div>
  )
}

export default CustomersPage