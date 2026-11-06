export const categories = [
  { id: 'website-templates', name: 'Website Templates', icon: 'Layout' },
  { id: 'html', name: 'HTML Templates', icon: 'Code' },
  { id: 'bootstrap', name: 'Bootstrap Templates', icon: 'Grid' },
  { id: 'react', name: 'React Templates', icon: 'Atom' },
  { id: 'nextjs', name: 'Next.js Templates', icon: 'Zap' },
  { id: 'landing', name: 'Landing Pages', icon: 'Rocket' },
  { id: 'portfolio', name: 'Portfolio Templates', icon: 'User' },
  { id: 'dashboard', name: 'Admin Dashboards', icon: 'BarChart' },
  { id: 'mobile-ui', name: 'Mobile App UI Kits', icon: 'Smartphone' },
  { id: 'figma', name: 'Figma UI Kits', icon: 'Figma' },
  { id: 'design-systems', name: 'Design Systems', icon: 'Layers' },
  { id: 'icons', name: 'Icons & Illustrations', icon: 'Image' },
  { id: 'fonts', name: 'Fonts & Typography', icon: 'Type' },
  { id: 'graphics', name: 'Graphics & Digital Assets', icon: 'Palette' },
  { id: 'dev-tools', name: 'Developer Resources', icon: 'Terminal' },
  { id: 'free', name: 'Free Resources', icon: 'Gift' },
  { id: 'premium', name: 'Premium Resources', icon: 'Star' },
]

export const technologies = ['Bootstrap', 'React', 'HTML', 'Vue', 'Angular', 'Next.js', 'Figma', 'Tailwind']

export const templates = [
  { id: 'nova', name: 'Nova', tagline: 'SaaS Landing Page', description: 'Conversion-focused SaaS landing page with hero, features, pricing, and FAQ.', category: 'Landing Pages', categoryId: 'landing', technologies: ['React', 'Bootstrap'], priceType: 'premium', price: 49, rating: 4.8, reviews: 124, downloads: 1240, version: '1.4.0', updated: '2026-09-12', license: 'Commercial', responsive: true, featured: true, tags: ['saas', 'landing', 'startup'], demoUrl: '', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=560&fit=crop' },
  { id: 'atelier', name: 'Atelier', tagline: 'Creative Portfolio', description: 'Refined portfolio template for designers and creatives.', category: 'Portfolio Templates', categoryId: 'portfolio', technologies: ['HTML', 'Bootstrap'], priceType: 'free', price: 0, rating: 4.6, reviews: 89, downloads: 3120, version: '1.2.0', updated: '2026-08-03', license: 'MIT', responsive: true, featured: true, tags: ['portfolio', 'creative'], demoUrl: '', image: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900&h=560&fit=crop' },
  { id: 'summit', name: 'Summit', tagline: 'Business Website', description: 'Professional multi-page business site.', category: 'Website Templates', categoryId: 'website-templates', technologies: ['Bootstrap', 'React'], priceType: 'premium', price: 59, rating: 4.7, reviews: 67, downloads: 890, version: '2.0.1', updated: '2026-09-28', license: 'Commercial', responsive: true, featured: true, tags: ['business', 'corporate'], demoUrl: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
  { id: 'commerce', name: 'Commerce', tagline: 'Online Storefront', description: 'Modern e-commerce template with product grids and cart.', category: 'Website Templates', categoryId: 'website-templates', technologies: ['Vue', 'Bootstrap'], priceType: 'premium', price: 79, rating: 4.9, reviews: 45, downloads: 640, version: '1.1.0', updated: '2026-07-19', license: 'Commercial', responsive: true, featured: true, tags: ['ecommerce', 'store'], demoUrl: '', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&h=560&fit=crop' },
  { id: 'launchpad', name: 'Launchpad', tagline: 'Startup Landing Page', description: 'Fast, minimal startup landing page.', category: 'Landing Pages', categoryId: 'landing', technologies: ['HTML', 'Bootstrap'], priceType: 'free', price: 0, rating: 4.5, reviews: 210, downloads: 4210, version: '1.0.0', updated: '2026-06-10', license: 'MIT', responsive: true, featured: true, tags: ['startup', 'landing'], demoUrl: '', image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=900&h=560&fit=crop' },
  { id: 'insight', name: 'Insight', tagline: 'Analytics Dashboard', description: 'Data-rich admin dashboard with charts and tables.', category: 'Admin Dashboards', categoryId: 'dashboard', technologies: ['React', 'Bootstrap'], priceType: 'premium', price: 89, rating: 4.8, reviews: 38, downloads: 520, version: '1.3.0', updated: '2026-09-05', license: 'Commercial', responsive: true, featured: true, tags: ['dashboard', 'analytics'], demoUrl: '', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&h=560&fit=crop' },
  { id: 'pulse', name: 'Pulse', tagline: 'Agency Website', description: 'Bold agency site with case studies.', category: 'Website Templates', categoryId: 'website-templates', technologies: ['Angular', 'Bootstrap'], priceType: 'premium', price: 69, rating: 4.4, reviews: 22, downloads: 310, version: '1.0.2', updated: '2026-05-22', license: 'Commercial', responsive: true, featured: false, tags: ['agency'], demoUrl: '', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&h=560&fit=crop' },
  { id: 'journal', name: 'Journal', tagline: 'Blog Template', description: 'Clean, readable blog.', category: 'Website Templates', categoryId: 'website-templates', technologies: ['HTML', 'Bootstrap'], priceType: 'free', price: 0, rating: 4.3, reviews: 150, downloads: 2780, version: '1.0.0', updated: '2026-04-15', license: 'MIT', responsive: true, featured: false, tags: ['blog'], demoUrl: '', image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=560&fit=crop' },
  { id: 'next-starter', name: 'NextStart', tagline: 'Next.js Starter', description: 'Next.js starter with auth and dashboard.', category: 'Next.js Templates', categoryId: 'nextjs', technologies: ['Next.js', 'React'], priceType: 'premium', price: 99, rating: 4.7, reviews: 31, downloads: 410, version: '1.0.0', updated: '2026-10-01', license: 'Commercial', responsive: true, featured: true, tags: ['nextjs', 'starter'], demoUrl: '', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&h=560&fit=crop' },
  { id: 'figma-kit', name: 'FigmaFlow', tagline: 'Figma UI Kit', description: 'Comprehensive Figma UI kit.', category: 'Figma UI Kits', categoryId: 'figma', technologies: ['Figma'], priceType: 'premium', price: 39, rating: 4.6, reviews: 54, downloads: 720, version: '1.2.0', updated: '2026-08-20', license: 'Commercial', responsive: true, featured: false, tags: ['figma', 'ui-kit'], demoUrl: '', image: 'https://images.unsplash.com/photo-1609921212050-c4c4f2c4e0b?w=900&h=560&fit=crop' },
  { id: 'icon-pack', name: 'IconSet', tagline: 'Icon Pack', description: '2000+ icons in multiple formats.', category: 'Icons & Illustrations', categoryId: 'icons', technologies: ['Figma', 'SVG'], priceType: 'free', price: 0, rating: 4.4, reviews: 300, downloads: 5100, version: '1.0.0', updated: '2026-03-15', license: 'MIT', responsive: true, featured: false, tags: ['icons'], demoUrl: '', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&h=560&fit=crop' },
  { id: 'mobile-ui', name: 'MobileKit', tagline: 'Mobile App UI Kit', description: 'iOS and Android UI kit.', category: 'Mobile App UI Kits', categoryId: 'mobile-ui', technologies: ['Figma', 'React Native'], priceType: 'premium', price: 59, rating: 4.5, reviews: 27, downloads: 330, version: '1.1.0', updated: '2026-07-08', license: 'Commercial', responsive: true, featured: false, tags: ['mobile'], demoUrl: '', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=900&h=560&fit=crop' },
]

export function getTemplate(id) { return templates.find(t => t.id === id) }
export function featuredTemplates() { return templates.filter(t => t.featured) }
export function freeTemplates() { return templates.filter(t => t.priceType === 'free') }
export function byCategory(id) { return templates.filter(t => t.categoryId === id) }

