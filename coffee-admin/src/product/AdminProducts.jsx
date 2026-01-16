import { useState } from 'react'
import { useProducts } from './useProducts'
import ProductForm from './ProductForm'
import ProductList from './ProductList'
import './product.css'

export default function AdminProducts() {
  const { products, loading, message, showMessage, saveProduct, deleteProduct } = useProducts()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(null)

  // 저장 처리
  function handleSave(formData) {
    saveProduct(formData, editingId)
      .then(() => {
        setEditingId(null)
        setEditData(null)
      })
      .catch(() => {})
  }

  // 수정 모드
  function handleEdit(product) {
    setEditingId(product.productId)
    setEditData(product)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 취소
  function handleCancel() {
    setEditingId(null)
    setEditData(null)
  }

  // 삭제
  function handleDelete(id) {
    deleteProduct(id)
  }

  return (
    <div className="admin-products">
      {/* 토스트 메시지 */}
      {message.text && (
        <div className={`toast toast-${message.type}`}>{message.text}</div>
      )}

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <h1>상품 관리</h1>
        <p className="page-desc">원두 상품을 등록하고 관리합니다.</p>
      </div>

      <div className="content-grid">
        {/* 폼 */}
        <section className="form-section">
          <ProductForm
            key={editingId || 'new'}
            editingId={editingId}
            editData={editData}
            onSave={handleSave}
            onCancel={handleCancel}
            showMessage={showMessage}
          />
        </section>

        {/* 목록 */}
        <section className="list-section">
          <ProductList
            products={products}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  )
}
