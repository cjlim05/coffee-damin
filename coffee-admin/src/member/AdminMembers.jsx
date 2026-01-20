import { useState } from 'react'
import { useMembers } from './useMembers'
import MemberForm from './MemberForm'
import MemberList from './MemberList'
import './member.css'

export default function AdminMembers() {
  const { members, loading, message, showMessage, saveMember, deleteMember } = useMembers()
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState(null)

  function handleSave(data) {
    saveMember(data, editingId)
      .then(() => {
        setEditingId(null)
        setEditData(null)
      })
      .catch(() => {})
  }

  function handleEdit(member) {
    setEditingId(member.memberId)
    setEditData(member)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleCancel() {
    setEditingId(null)
    setEditData(null)
  }

  function handleDelete(id) {
    deleteMember(id)
  }

  return (
    <div className="admin-members">
      {message.text && (
        <div className={`toast toast-${message.type}`}>{message.text}</div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="page-header">
        <h1>회원 관리</h1>
        <p className="page-desc">회원 정보를 등록하고 관리합니다.</p>
      </div>

      <div className="content-grid">
        <section className="form-section">
          <MemberForm
            key={editingId || 'new'}
            editingId={editingId}
            editData={editData}
            onSave={handleSave}
            onCancel={handleCancel}
            showMessage={showMessage}
          />
        </section>

        <section className="list-section">
          <MemberList
            members={members}
            editingId={editingId}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </div>
  )
}
