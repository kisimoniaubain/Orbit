import React, { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { loadProducts } from '../lib/products'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import TemplateCard from '../components/TemplateCard'
import FilterSidebar from '../components/FilterSidebar'
import SortDropdown from '../components/SortDropdown'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import Skeleton from '../components/Skeleton'

export default function Templates() {
  const [params] = useSearchParams()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: params.get('c') || 'all', tech: [], price: params.get('price') || 'all' })
  const [sort, setSort] = useState('Recommended')
  const [page, setPage] = useState(1)
  const [loading] = useState(false)
  const pageSize = 6

  const [all, setAll] = useState([])
  useEffect(() => { loadProducts().then(setAll) }, [])
  const filtered = useMemo(() => {
    let list = [...all]
    if (filters.category !== 'all') list = list.filter(t => t.categoryId === filters.category)
    if (filters.tech.length) list = list.filter(t => filters.tech.some(x => t.technologies.includes(x)))
    if (filters.price !== 'all') list = list.filter(t => t.priceType === filters.price)
    if (sort === 'Newest') list.sort((a,b) => b.updated.localeCompare(a.updated))
    if (sort === 'Most Popular') list.sort((a,b) => b.downloads - a.downloads)
    if (sort === 'Price Low to High') list.sort((a,b) => a.price - b.price)
    if (sort === 'Price High to Low') list.sort((a,b) => b.price - a.price)
    return list
  }, [search, filters, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = filtered.slice((page-1)*pageSize, page*pageSize)

  const clear = () => setFilters({ category: 'all', tech: [], price: 'all' })

  return (
    <>
      <Navbar />
      <main className="container-orbit" style={{ padding: '40px 24px 64px' }}>
        <h1 className="orbit-h2 mb-1">Explore Website Templates</h1>
        <p className="orbit-body mb-4">Find the right foundation for your next project.</p>
        <div className="mb-3"><SearchBar value={search} onChange={setSearch} /></div>
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div className="orbit-small">{filtered.length} results</div>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
        <div className="row g-4">
          <div className="col-lg-3">
            <FilterSidebar filters={filters} setFilters={setFilters} onClear={clear} />
          </div>
          <div className="col-lg-9">
            {loading ? (
              <div className="row g-4">{Array.from({length:6}).map((_,i)=><div className="col-md-6 col-lg-4" key={i}><Skeleton height={260}/></div>)}</div>
            ) : paged.length === 0 ? (
              <EmptyState />
            ) : (
              <>
                <div className="row g-4">
                  {paged.map(t => (
                    <div className="col-md-6 col-lg-4" key={t.id}>
                      <TemplateCard t={t} />
                    </div>
                  ))}
                </div>
                <Pagination page={page} total={totalPages} onChange={setPage} />
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
