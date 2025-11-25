import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'
import { AppDispatch } from '../../store'
import { 
  fetchProducts, 
  selectProducts, 
  selectProductsLoading, 
  selectProductsError,
  selectProductsSummary,
  Product 
} from '../../store/slices/productsSlice'
import ProductsList from './components/ProductsList'
import ProductDetail from './components/ProductDetail'
import CreateProduct from './components/CreateProduct'
import EditProduct from './components/EditProduct'

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const products = useSelector(selectProducts)
  const isLoading = useSelector(selectProductsLoading)
  const error = useSelector(selectProductsError)
  const summary = useSelector(selectProductsSummary)

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    lowStock: 'false',
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc',
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  useEffect(() => {
    dispatch(fetchProducts({
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
            <ProductsList
              products={products}
              isLoading={isLoading}
              error={error}
              summary={summary}
              filters={filters}
              onFilterChange={handleFilterChange}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          } 
        />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/:id" element={<ProductDetail />} />
        <Route path="/:id/edit" element={<EditProduct />} />
      </Routes>
    </div>
  )
}

export default ProductsPage