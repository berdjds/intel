"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { gsap } from "gsap"

interface MagneticButtonProps {
  children: ReactNode
  scale?: number
  tolerance?: number
  speed?: number
  className?: string
}

export function MagneticButton({
  children,
  scale = 1.2,
  tolerance = 0.8,
  speed = 0.3,
  className = "",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const button = buttonRef.current
    if (!button) return

    const bounds = button.getBoundingClientRect()
    const buttonCenterX = bounds.left + bounds.width / 2
    const buttonCenterY = bounds.top + bounds.height / 2

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return

      const mouseX = e.clientX
      const mouseY = e.clientY

      const distanceX = mouseX - buttonCenterX
      const distanceY = mouseY - buttonCenterY

      gsap.to(button, {
        x: distanceX * tolerance,
        y: distanceY * tolerance,
        duration: speed,
        ease: "power2.out",
      })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
      gsap.to(button, {
        scale: scale,
        duration: speed,
        ease: "power2.out",
      })
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(button, {
        x: 0,
        y: 0,
        scale: 1,
        duration: speed,
        ease: "elastic.out(1, 0.3)",
      })
    }

    button.addEventListener("mouseenter", handleMouseEnter)
    button.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      button.removeEventListener("mouseenter", handleMouseEnter)
      button.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovered, scale, tolerance, speed])

  return (
    <div ref={buttonRef} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
