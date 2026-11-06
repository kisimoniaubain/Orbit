import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import About from './pages/About'
import AdminAddTemplate from './pages/AdminAddTemplate'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminCategories from './pages/AdminCategories'
import AdminEditTemplate from './pages/AdminEditTemplate'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import AdminNotifications from './pages/AdminNotifications'
import AdminOrders from './pages/AdminOrders'
import AdminReviews from './pages/AdminReviews'
import AdminSettings from './pages/AdminSettings'
import AdminTemplates from './pages/AdminTemplates'
import AdminUsers from './pages/AdminUsers'
import Cart from './pages/Cart'
import Categories from './pages/Categories'
import Contact from './pages/Contact'
import Downloads from './pages/Downloads'
import Favorites from './pages/Favorites'
import Help from './pages/Help'
import Licensing from './pages/Licensing'
import NotFound from './pages/NotFound'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Preview from './pages/Preview'
import Profile from './pages/Profile'
import Purchases from './pages/Purchases'
import RequireAdmin from './components/RequireAdmin'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import SignIn from './pages/SignIn'
import TemplateDetails from './pages/TemplateDetails'
import Templates from './pages/Templates'
import Verify from './pages/Verify'
import GoogleAnalytics from './components/GoogleAnalytics'
import IntercomWidget from './components/IntercomWidget'

const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null

const App = () => {
  return (
    <Container fluid={true}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:id" element={<TemplateDetails />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/free" element={<Navigate to="/templates?price=free" replace />} />
        <Route path="/premium" element={<Navigate to="/templates?price=premium" replace />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/downloads" element={<Downloads />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/preview/:id" element={<Preview />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/licensing" element={<Licensing />} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/templates" element={<RequireAdmin><AdminTemplates /></RequireAdmin>} />
        <Route path="/admin/add" element={<RequireAdmin><AdminAddTemplate /></RequireAdmin>} />
        <Route path="/admin/edit/:id" element={<RequireAdmin><AdminEditTemplate /></RequireAdmin>} />
        <Route path="/admin/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
        <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/reviews" element={<RequireAdmin><AdminReviews /></RequireAdmin>} />
        <Route path="/admin/analytics" element={<RequireAdmin><AdminAnalytics /></RequireAdmin>} />
        <Route path="/admin/notifications" element={<RequireAdmin><AdminNotifications /></RequireAdmin>} />
        <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {stripePromise ? (
        <Elements stripe={stripePromise}>
          <div id="__stripe_root"></div>
        </Elements>
      ) : null}

      <GoogleAnalytics measurementId={import.meta.env.VITE_GA_MEASUREMENT_ID} />
      <IntercomWidget appId={import.meta.env.VITE_INTERCOM_APP_ID} />
    </Container>
  )
}

export default App