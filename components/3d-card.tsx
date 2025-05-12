"use client"

import { useRef, useState, useEffect, type ReactNode } from "react"
import { gsap } from "gsap"
import { cn } from "@/lib/utils"

interface ThreeDCardProps {
  children: ReactNode
  className?: string
  intensity?: number
  perspective?: number
  shadow?: boolean
}

export function ThreeDCard({
  children,
  className = "",
  intensity = 20,
  perspective = 1000,
  shadow = true,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return

      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const xPercent = (x / rect.width - 0.5) * intensity
      const yPercent = (y / rect.height - 0.5) * intensity

      gsap.to(card, {
        rotationY: xPercent,
        rotationX: -yPercent,
        transformPerspective: perspective,
        ease: "power1.out",
        duration: 0.5,
        boxShadow: shadow
          ? `
          ${-xPercent}px ${-yPercent}px 20px rgba(0, 0, 0, 0.2),
          0 10px 30px rgba(0, 0, 0, 0.1)
        `
          : undefined,
      })

      // Move inner elements for parallax effect
      const innerElements = card.querySelectorAll(".card-inner-element")
      innerElements.forEach((el, index) => {
        const depth = 1 - index * 0.1
        gsap.to(el, {
          x: xPercent * depth,
          y: yPercent * depth,
          ease: "power1.out",
          duration: 0.5,
        })
      })
    }

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
        duration: 0.5,
        ease: "power1.out",
      })

      // Reset inner elements
      const innerElements = card.querySelectorAll(".card-inner-element")
      innerElements.forEach((el) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          ease: "power1.out",
          duration: 0.5,
        })
      })
    }

    card.addEventListener("mouseenter", handleMouseEnter)
    card.addEventListener("mouseleave", handleMouseLeave)
    card.addEventListener("mousemove", handleMouseMove)

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter)
      card.removeEventListener("mouseleave", handleMouseLeave)
      card.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovered, intensity, perspective, shadow])

  return (
    <div ref={cardRef} className={cn("transform transition-all duration-300 perspective-1000", className)}>
      {children}
    </div>
  )
}
