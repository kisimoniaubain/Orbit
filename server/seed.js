require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./src/models/Product')

const sample = [
  { name: 'Nova', tagline: 'SaaS Landing Page', description: 'Conversion-focused SaaS landing page.', category: 'Landing Pages', categoryId: 'landing', technologies: ['React','Bootstrap'], priceType: 'premium', price: 49, rating: 4.8, reviews: 124, downloads: 1240, version: '1.4.0', license: 'Commercial', responsive: true, featured: true, tags: ['saas'], image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=560&fit=crop' },
  { name: 'Atelier', tagline: 'Creative Portfolio', description: 'Refined portfolio template.', category: 'Portfolio Templates', categoryId: 'portfolio', technologies: ['HTML','Bootstrap'], priceType: 'free', price: 0, rating: 4.6, reviews: 89, downloads: 3120, version: '1.2.0', license: 'MIT', responsive: true, featured: true, tags: ['portfolio'], image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&h=560&fit=crop' },
  { name: 'Summit', tagline: 'Business Website', description: 'Professional business site.', category: 'Website Templates', categoryId: 'website-templates', technologies: ['Bootstrap','React'], priceType: 'premium', price: 59, rating: 4.7, reviews: 67, downloads: 890, version: '2.0.1', license: 'Commercial', responsive: true, featured: true, tags: ['business'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
  { name: 'Launchpad', tagline: 'Startup Landing Page', description: 'Fast startup landing page.', category: 'Landing Pages', categoryId: 'landing', technologies: ['HTML','Bootstrap'], priceType: 'free', price: 0, rating: 4.5, reviews: 210, downloads: 4210, version: '1.0.0', license: 'MIT', responsive: true, featured: true, tags: ['startup'], image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=900&h=560&fit=crop' },
  { name: 'Insight', tagline: 'Analytics Dashboard', description: 'Data-rich admin dashboard.', category: 'Admin Dashboards', categoryId: 'dashboard', technologies: ['React','Bootstrap'], priceType: 'premium', price: 89, rating: 4.8, reviews: 38, downloads: 520, version: '1.3.0', license: 'Commercial', responsive: true, featured: true, tags: ['dashboard'], image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
]

;(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(sample)
    console.log('Seeded', sample.length, 'products')
  } else {
    console.log('Already has', count, 'products')
  }
  await mongoose.disconnect()
})()
