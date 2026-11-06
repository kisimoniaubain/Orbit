const mongoose = require('mongoose')
require('dotenv').config()
const Product = require('./src/models/Product')
const templates = require('../templates.cjs')

const extra = [
  { id: 'html-starter', name: 'HTML Starter', tagline: 'HTML Boilerplate', description: 'Clean HTML5 starter template.', category: 'HTML Templates', categoryId: 'html', technologies: ['HTML', 'Bootstrap'], priceType: 'free', price: 0, rating: 4.2, reviews: 100, downloads: 2000, version: '1.0.0', updated: '2026-01-01', license: 'MIT', responsive: true, featured: false, tags: ['html'], demoUrl: '', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&h=560&fit=crop' },
  { id: 'bootstrap-dashboard', name: 'Bootstrap Admin', tagline: 'Bootstrap Dashboard', description: 'Bootstrap 5 admin dashboard.', category: 'Bootstrap Templates', categoryId: 'bootstrap', technologies: ['Bootstrap', 'HTML'], priceType: 'premium', price: 49, rating: 4.6, reviews: 40, downloads: 600, version: '1.0.0', updated: '2026-02-01', license: 'Commercial', responsive: true, featured: false, tags: ['bootstrap', 'dashboard'], demoUrl: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
  { id: 'react-landing', name: 'React Landing', tagline: 'React Landing Page', description: 'React-based landing page.', category: 'React Templates', categoryId: 'react', technologies: ['React', 'Bootstrap'], priceType: 'premium', price: 59, rating: 4.7, reviews: 50, downloads: 700, version: '1.0.0', updated: '2026-03-01', license: 'Commercial', responsive: true, featured: false, tags: ['react', 'landing'], demoUrl: '', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=900&h=560&fit=crop' },
  { id: 'design-system', name: 'Design System', tagline: 'Design System Kit', description: 'Comprehensive design system.', category: 'Design Systems', categoryId: 'design-systems', technologies: ['Figma'], priceType: 'premium', price: 69, rating: 4.5, reviews: 20, downloads: 300, version: '1.0.0', updated: '2026-04-01', license: 'Commercial', responsive: true, featured: false, tags: ['design-system'], demoUrl: '', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=900&h=560&fit=crop' },
  { id: 'font-pack', name: 'Font Pack', tagline: 'Typography Pack', description: 'Curated font collection.', category: 'Fonts & Typography', categoryId: 'fonts', technologies: ['Figma'], priceType: 'free', price: 0, rating: 4.3, reviews: 80, downloads: 1500, version: '1.0.0', updated: '2026-05-01', license: 'MIT', responsive: true, featured: false, tags: ['fonts'], demoUrl: '', image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&h=560&fit=crop' },
  { id: 'graphics-pack', name: 'Graphics Pack', tagline: 'Digital Graphics', description: 'Digital graphics and assets.', category: 'Graphics & Digital Assets', categoryId: 'graphics', technologies: ['Figma', 'SVG'], priceType: 'free', price: 0, rating: 4.4, reviews: 90, downloads: 1800, version: '1.0.0', updated: '2026-06-01', license: 'MIT', responsive: true, featured: false, tags: ['graphics'], demoUrl: '', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop' },
  { id: 'dev-tools', name: 'Dev Tools', tagline: 'Developer Resources', description: 'Developer utilities and resources.', category: 'Developer Resources', categoryId: 'dev-tools', technologies: ['HTML'], priceType: 'free', price: 0, rating: 4.2, reviews: 60, downloads: 1200, version: '1.0.0', updated: '2026-07-01', license: 'MIT', responsive: true, featured: false, tags: ['dev-tools'], demoUrl: '', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=900&h=560&fit=crop' },
  { id: 'free-bundle', name: 'Free Bundle', tagline: 'Free Resources', description: 'Bundle of free resources.', category: 'Free Resources', categoryId: 'free', technologies: ['HTML'], priceType: 'free', price: 0, rating: 4.1, reviews: 200, downloads: 3000, version: '1.0.0', updated: '2026-08-01', license: 'MIT', responsive: true, featured: false, tags: ['free'], demoUrl: '', image: 'https://images.unsplash.com/photo-1557804506-667056656457?w=900&h=560&fit=crop' },
  { id: 'premium-bundle', name: 'Premium Bundle', tagline: 'Premium Resources', description: 'Bundle of premium resources.', category: 'Premium Resources', categoryId: 'premium', technologies: ['React'], priceType: 'premium', price: 129, rating: 4.8, reviews: 30, downloads: 200, version: '1.0.0', updated: '2026-09-01', license: 'Commercial', responsive: true, featured: false, tags: ['premium'], demoUrl: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
]

const all = templates.concat(extra)

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  await Product.deleteMany({})
  const docs = all.map(t => ({
    name: t.name, tagline: t.tagline, description: t.description, category: t.category, categoryId: t.categoryId,
    technologies: t.technologies, priceType: t.priceType, price: t.price, rating: t.rating, reviews: t.reviews,
    downloads: t.downloads, version: t.version, license: t.license, responsive: t.responsive, featured: t.featured,
    tags: t.tags, demoUrl: '/uploads/orbit-demo.html?name=' + encodeURIComponent(t.name) + '&tagline=' + encodeURIComponent(t.tagline || '') + '&color=' + encodeURIComponent({ 'landing':'#6366f1','portfolio':'#0f172a','website-templates':'#1e3a8a','dashboard':'#7c3aed','nextjs':'#000000','figma':'#a259ff','icons':'#f59e0b','mobile-ui':'#2563eb','html':'#ea580c','bootstrap':'#0d6efd','react':'#61dafb','design-systems':'#8b5cf6','fonts':'#111827','graphics':'#ec4899','dev-tools':'#10b981','free':'#22c55e','premium':'#eab308' }[t.categoryId] || '#00ACC1'), image: t.image, published: true,
    downloadUrl: '/uploads/orbit-sample-template.zip',
  }))
  await Product.insertMany(docs)
  console.log('seeded', docs.length)
  process.exit(0)
}).catch(e => { console.error(e); process.exit(1) })
