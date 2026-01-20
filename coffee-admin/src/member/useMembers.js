import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL + '/api/members'

export function useMembers() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  function showMessage(type, text) {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  function fetchMembers() {
    setLoading(true)
    fetch(API)
      .then(res => res.json())
      .then(data => {
        setMembers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '회원 목록을 불러오는데 실패했습니다.')
        setLoading(false)
      })
  }

  function saveMember(data, editingId) {
    setLoading(true)
    return fetch(editingId ? `${API}/${editingId}` : API, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) throw new Error('저장 실패')
        return res.json()
      })
      .then(saved => {
        setMembers(m =>
          editingId
            ? m.map(it => (it.memberId === saved.memberId ? saved : it))
            : [saved, ...m]
        )
        showMessage('success', editingId ? '회원이 수정되었습니다.' : '회원이 등록되었습니다.')
        return saved
      })
      .catch(err => {
        console.error(err)
        showMessage('error', '저장에 실패했습니다.')
        throw err
      })
      .finally(() => setLoading(false))
  }

  function deleteMember(id) {
    if (!confirm('정말 삭제하시겠습니까?\n삭제된 회원은 복구할 수 없습니다.')) {
      return Promise.resolve(false)
    }

    setLoading(true)
    return fetch(`${API}/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('삭제 실패')
        setMembers(m => m.filter(it => it.memberId !== id))
        showMessage('success', '회원이 삭제되었습니다.')
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
    fetchMembers()
  }, [])

  return {
    members,
    loading,
    message,
    showMessage,
    saveMember,
    deleteMember,
    fetchMembers,
  }
}
