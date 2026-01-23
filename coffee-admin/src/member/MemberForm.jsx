import { useState } from 'react'

const initialForm = {
  email: '',
  password: '',
  name: '',
  phone: '',
  address: '',
}

export default function MemberForm({ editingId, editData, onSave, onCancel, showMessage }) {
  const [form, setForm] = useState(() => {
    if (editData) {
      return {
        email: editData.email || '',
        password: '',
        name: editData.name || '',
        phone: editData.phone || '',
        address: editData.address || '',
      }
    }
    return initialForm
  })

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validateForm() {
    if (!form.email.trim()) {
      showMessage('error', '이메일을 입력해주세요.')
      return false
    }
    if (!editingId && !form.password.trim()) {
      showMessage('error', '비밀번호를 입력해주세요.')
      return false
    }
    if (!form.name.trim()) {
      showMessage('error', '이름을 입력해주세요.')
      return false
    }
    return true
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validateForm()) return
    onSave(form)
  }

  function handleCancel() {
    setForm(initialForm)
    onCancel()
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h2>{editingId ? 'Edit Member' : 'Register New Member'}</h2>
          <p>{editingId ? '회원 정보를 수정합니다' : '새로운 회원을 등록합니다'}</p>
        </div>
        {editingId && (
          <button type="button" className="btn btn-ghost" onClick={handleCancel}>
            취소
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label required">이메일</label>
          <input
            name="email"
            type="email"
            className="form-input"
            placeholder="example@email.com"
            value={form.email}
            onChange={change}
          />
        </div>

        <div className="form-group">
          <label className="form-label required">비밀번호</label>
          <input
            name="password"
            type="password"
            className="form-input"
            placeholder={editingId ? '변경시에만 입력' : '비밀번호 입력'}
            value={form.password}
            onChange={change}
          />
          {editingId && <p className="form-hint">비워두면 기존 비밀번호가 유지됩니다.</p>}
        </div>

        <div className="form-group">
          <label className="form-label required">이름</label>
          <input
            name="name"
            className="form-input"
            placeholder="홍길동"
            value={form.name}
            onChange={change}
          />
        </div>

        <div className="form-group">
          <label className="form-label">전화번호</label>
          <input
            name="phone"
            className="form-input"
            placeholder="010-1234-5678"
            value={form.phone}
            onChange={change}
          />
        </div>

        <div className="form-group">
          <label className="form-label">주소</label>
          <input
            name="address"
            className="form-input"
            placeholder="서울시 강남구..."
            value={form.address}
            onChange={change}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg">
            {editingId ? '수정 완료' : '회원 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
