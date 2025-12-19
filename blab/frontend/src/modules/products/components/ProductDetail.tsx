import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../store';
import {
  fetchProductById,
  selectSelectedProduct,
  selectProductsLoading,
  selectProductsError
} from '../../../store/slices/productsSlice';
import {
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  CubeIcon
} from '@heroicons/react/24/outline';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const product = useSelector(selectSelectedProduct);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Ürünler Listesine Dön
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">Ürün bulunamadı</p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Ürünler Listesine Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-1" />
            Geri Dön
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Detayları</h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Düzenle
          </button>
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <TrashIcon className="h-4 w-4 mr-2" />
            Sil
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center">
            <CubeIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-600">SKU: {product.sku}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Kategori</label>
                <p className="mt-1 text-sm text-gray-900">{product.category}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Birim</label>
                <p className="mt-1 text-sm text-gray-900">{product.unit}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Durum</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  product.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status === 'active' ? 'Aktif' : 'Pasif'}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Üretici</label>
                <p className="mt-1 text-sm text-gray-900">{product.manufacturer}</p>
              </div>
            </div>

            {/* Stock & Pricing */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Stok Miktarı</label>
                <p className="mt-1 text-sm text-gray-900">{product.stockQuantity} {product.unit}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Minimum Stok</label>
                <p className="mt-1 text-sm text-gray-900">{product.minStockLevel} {product.unit}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Satış Fiyatı</label>
                <p className="mt-1 text-lg font-semibold text-green-600">
                  ₺{product.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Maliyet</label>
                <p className="mt-1 text-sm text-gray-900">
                  ₺{product.costPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <label className="text-sm font-medium text-gray-700">Açıklama</label>
              <p className="mt-2 text-sm text-gray-900">{product.description}</p>
            </div>
          )}

          {/* Dates */}
          <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-700">Oluşturulma Tarihi</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(product.createdAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Son Güncellenme</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(product.updatedAt).toLocaleDateString('tr-TR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>

          {/* Stock Alert */}
          {product.stockQuantity <= product.minStockLevel && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Düşük Stok Uyarısı
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Bu ürünün stok miktarı minimum seviyede veya altında. Yeniden sipariş vermeyi düşünün.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;