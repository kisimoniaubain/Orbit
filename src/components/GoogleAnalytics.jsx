import React, { useEffect } from 'react'

const GoogleAnalytics = ({ measurementId }) => {
  useEffect(() => {
    if (!measurementId) return

    // Load gtag.js dynamically
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag and configure ORBIT tracking
    window.dataLayer = window.dataLayer || []
    function gtag() { window.dataLayer.push(arguments) }
    gtag('js', new Date())

    gtag('config', measurementId)

    // Track ORBIT marketplace events
    const trackEvent = (eventName, params = {}) => {
      gtag('event', eventName, params)
    }

    // Export trackEvent for use in other components
    window.ORBITAnalytics = { trackEvent }

    // Cleanup on unmount
    return () => {
      document.head.removeChild(script)
      delete window.ORBITAnalytics
    }
  }, [measurementId])

  return null
}

export default GoogleAnalytics