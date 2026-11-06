import React, { useState, useEffect } from 'react'
import { Table, Input, Button, message, Drawer } from 'antd'
import { api } from '../lib/api'
import AdminSidebar from '../components/AdminSidebar'
import { PlusCircle, Pencil, Trash2 } from 'lucide-react'

const AdminCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [formValues, setFormValues] = useState({ name: '', slug: '', description: '' })
  const [editingCategory, setEditingCategory] = useState(null)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await api('/api/categories')
        setCategories(Array.isArray(result) ? result : [])
      } catch (e) {
        message.error('Failed to load categories')
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [])

  const handleShowForm = (category = null) => {
    setEditingCategory(category)
    if (category) {
      setFormValues({ name: category.name, slug: category.slug || '', description: category.description || '' })
    } else {
      setFormValues({ name: '', slug: '', description: '' })
    }
    setFormVisible(true)
  }

  const handleHideForm = () => {
    setFormVisible(false)
    setEditingCategory(null)
    setFormValues({ name: '', slug: '', description: '' })
  }

  const handleFormSubmit = async (e) => {
    e?.preventDefault?.()
    try {
      if (editingCategory) {
        const id = editingCategory._id || editingCategory.id
        const updated = await api(`/api/categories/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: formValues.name, slug: formValues.slug, description: formValues.description })
        })
        setCategories(categories.map(c => (c._id || c.id) === id ? updated : c))
        message.success('Category updated successfully')
      } else {
        const created = await api('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: formValues.name, slug: formValues.slug, description: formValues.description })
        })
        setCategories(prev => [created, ...prev])
        message.success('Category created successfully')
      }
      handleHideForm()
    } catch (e) {
      message.error('Failed to save category: ' + e.message)
    }
  }

  const handleCategoryDelete = async (id) => {
    if (!id) return
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api(`/api/categories/${id}`, { method: 'DELETE' })
        setCategories(categories.filter(c => (c._id || c.id) !== id))
        message.success('Category deleted successfully')
      } catch (e) {
        message.error('Failed to delete category')
      }
    }
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Slug', dataIndex: 'slug', key: 'slug' },
    { title: 'Description', dataIndex: 'description', key: 'description', width: '200px' },
    { title: 'Actions', render: (text, record) => (
      <div style={{ display: 'flex', gap: '8px' }}>
        <button onClick={() => handleShowForm(record)} style={{ padding: '4px 8px', fontSize: 12, background: 'var(--orbit-primary)', color: '#fff' }} title="Edit">
          <Pencil size={12} /> Edit
        </button>
        <button onClick={() => handleCategoryDelete(record._id || record.id)} style={{ padding: '4px 8px', fontSize: 12, color: 'var(--orbit-danger)' }} title="Delete">
          <Trash2 size={12} /> Delete
        </button>
      </div>
    ) }
  ]

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="ant-card" style={{ marginBottom: '24px' }}>
          <h2 style={{ color: '#111827', marginBottom: '16px' }}>Category Management</h2>
          <Button
            style={{ backgroundColor: '#00ACC1', borderColor: '#00ACC1' }}
            onClick={() => handleShowForm()}
            icon={<PlusCircle />}
            title="Add Category"
          >
            Add Category
          </Button>
        </div>
        {formVisible && (
          <Drawer
            title={editingCategory ? 'Edit Category' : 'Add Category'}
            open={formVisible}
            onClose={handleHideForm}
            footer={<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button onClick={handleHideForm}>Cancel</Button>
              <Button type="primary" onClick={handleFormSubmit}>{editingCategory ? 'Update' : 'Create'}</Button>
            </div>}
          >
            <form onSubmit={handleFormSubmit} style={{ maxWidth: '500px' }}>
              <label className="form-label" htmlFor="category-name">Category Name</label>
              <Input id="category-name" value={formValues.name} onChange={e => setFormValues(v => ({ ...v, name: e.target.value }))} required />
              <label className="form-label mt-3" htmlFor="category-slug">Slug (optional)</label>
              <Input id="category-slug" value={formValues.slug} onChange={e => setFormValues(v => ({ ...v, slug: e.target.value }))} />
              <label className="form-label mt-3" htmlFor="category-description">Description</label>
              <Input.TextArea id="category-description" rows={3} value={formValues.description} onChange={e => setFormValues(v => ({ ...v, description: e.target.value }))} />
            </form>
          </Drawer>
        )}
        <Table
          dataSource={categories}
          loading={loading}
          columns={columns}
          rowKey={record => record._id || record.id}
          size="small"
          scroll={{ x: 'max-content' }}
        />
        {categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '32px', color: '#888' }}>
            <PlusCircle style={{ fontSize: 48, marginBottom: '16px', color: '#888' }} />
            <h3>No categories yet</h3>
            <p>Add your first category to organize marketplace products</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminCategories