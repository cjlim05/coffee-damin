import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL + '/api/orders'
const MEMBERS_API = import.meta.env.VITE_API_URL + '/api/members'
const PRODUCTS_API = import.meta.env.VITE_API_URL + '/api/products'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [members, setMembers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  function fetchOrders() {
    setLoading(true)
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '주문 목록을 불러오는데 실패했습니다.')
        setLoading(false)
      })
  }

  function fetchMembers() {
    fetch(MEMBERS_API)
      .then(res => res.json())
      .then(setMembers)
      .catch(console.error)
  }

  function fetchProducts() {
    fetch(PRODUCTS_API)
      .then(res => res.json())
      .then(setProducts)
      .catch(console.error)
  }

  function createOrder(data) {
    setLoading(true)
    return fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) throw new Error('저장 실패')
        return res.json()
      })
      .then(saved => {
        setOrders(o => [saved, ...o])
        showMessage('success', '주문이 등록되었습니다.')
        return saved
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '저장에 실패했습니다.')
        throw err
      })
      .finally(() => setLoading(false))
  }

  function updateOrderStatus(id, status) {
    setLoading(true)
    return fetch(`${API}/${id}/status?status=${status}`, {
      method: 'PATCH',
    })
      .then(res => {
        if (!res.ok) throw new Error('상태 변경 실패')
        return res.json()
      })
      .then(updated => {
        setOrders(o => o.map(it => (it.orderId === updated.orderId ? updated : it)))
        showMessage('success', '주문 상태가 변경되었습니다.')
        return updated
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '상태 변경에 실패했습니다.')
        throw err
      })
      .finally(() => setLoading(false))
  }

  function deleteOrder(id) {
    if (!confirm('정말 삭제하시겠습니까?\n삭제된 주문은 복구할 수 없습니다.')) {
      return Promise.resolve(false)
    }

    setLoading(true)
    return fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('삭제 실패')
        setOrders(o => o.filter(it => it.orderId !== id))
        showMessage('success', '주문이 삭제되었습니다.')
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
    fetchOrders()
    fetchMembers()
    fetchProducts()
  }, [])

  return {
    orders,
    members,
    products,
    loading,
    message,
    showMessage,
    createOrder,
    updateOrderStatus,
    deleteOrder,
    fetchOrders,
  }
}
