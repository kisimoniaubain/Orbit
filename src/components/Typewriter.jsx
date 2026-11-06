import React, { useState, useEffect } from 'react'

export default function Typewriter({ text, speed = 40, delay = 0 }) {
  const [display, setDisplay] = useState('')
  useEffect(() => {
    let i = 0
    setDisplay('')
    const start = setTimeout(() => {
      const timer = setInterval(() => {
        i++
        setDisplay(text.slice(0, i))
        if (i >= text.length) clearInterval(timer)
      }, speed)
      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(start)
  }, [text, speed, delay])
  return <span>{display}<span className="typing-cursor">|</span></span>
}
