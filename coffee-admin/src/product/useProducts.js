import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL + '/api/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // 메시지 표시
  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  // 목록 조회
  function fetchProducts() {
    setLoading(true)
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '상품 목록을 불러오는데 실패했습니다.')
        setLoading(false)
      })
  }

  // 상품 저장 (등록/수정)
  function saveProduct(formData, editingId) {
    setLoading(true)

    return fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      body: formData,
    })
      .then(res => {
        if (!res.ok) throw new Error('저장 실패')
        return res.json()
      })
      .then(saved => {
        setProducts(p =>
          editingId
            ? p.map(it => (it.productId === saved.productId ? saved : it))
            : [saved, ...p]
        )
        showMessage('success', editingId ? '상품이 수정되었습니다.' : '상품이 등록되었습니다.')
        return saved
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '저장에 실패했습니다.')
        throw err
      })
      .finally(() => setLoading(false))
  }

  // 상품 삭제
  function deleteProduct(id) {
    if (!confirm('정말 삭제하시겠습니까?\n삭제된 상품은 복구할 수 없습니다.')) {
      return Promise.resolve(false)
    }

    setLoading(true)
    return fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('삭제 실패')
        setProducts(p => p.filter(it => it.productId !== id))
        showMessage('success', '상품이 삭제되었습니다.')
        return true
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '삭제에 실패했습니다.')
        return false
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    message,
    showMessage,
    saveProduct,
    deleteProduct,
    fetchProducts,
  }
}
