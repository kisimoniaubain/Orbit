import React, { useEffect } from 'react'

const IntercomWidget = ({ appId }) => {
  useEffect(() => {
    if (!appId) return

    // Load Intercom widget
    const script = document.createElement('script')
    script.async = true
    script.src = `https://widget.intercom.io/widget/${appId}`
    document.body.appendChild(script)

    // Cleanup on unmount
    return () => {
      document.body.removeChild(script)
    }
  }, [appId])

  return null
}

export default IntercomWidget