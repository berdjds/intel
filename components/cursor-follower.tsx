"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

interface CursorFollowerProps {
  mousePosition: { x: number; y: number }
  cursorType: string
  cursorText: string
}

export function CursorFollower({ mousePosition, cursorType, cursorText }: CursorFollowerProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorTextRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorDot = cursorDotRef.current
    const cursorTextElement = cursorTextRef.current

    if (!cursor || !cursorDot || !cursorTextElement) return

    gsap.to(cursor, {
      x: mousePosition.x,
      y: mousePosition.y,
      duration: 0.5,
      ease: "power3.out",
    })

    gsap.to(cursorDot, {
      x: mousePosition.x,
      y: mousePosition.y,
      duration: 0.1,
    })

    gsap.to(cursorTextElement, {
      x: mousePosition.x,
      y: mousePosition.y + 40,
      duration: 0.3,
      ease: "power2.out",
    })

    // Apply different styles based on cursor type
    switch (cursorType) {
      case "button":
        gsap.to(cursor, {
          scale: 1.5,
          opacity: 0.7,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 1,
          scale: 1,
          duration: 0.3,
        })
        break

      case "link":
        gsap.to(cursor, {
          scale: 1.2,
          opacity: 0.7,
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
        })
        break

      case "card":
        gsap.to(cursor, {
          scale: 1.8,
          opacity: 0.4,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.05)",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
        })
        break

      case "image":
        gsap.to(cursor, {
          scale: 1.5,
          opacity: 0.5,
          borderColor: "#ffffff",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
        })
        break

      case "input":
        gsap.to(cursor, {
          scale: 0.5,
          opacity: 0.3,
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
        })
        break

      default:
        gsap.to(cursor, {
          scale: 1,
          opacity: 1,
          borderColor: "#3b82f6",
          backgroundColor: "transparent",
          duration: 0.3,
        })
        gsap.to(cursorDot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
        })
        gsap.to(cursorTextElement, {
          opacity: 0,
          scale: 0,
          duration: 0.3,
        })
    }
  }, [mousePosition, cursorType, cursorText])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-blue-500 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      ></div>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-blue-500 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 hidden md:block"
      ></div>
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 bg-blue-600 text-white text-xs font-medium py-1 px-2 rounded pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 opacity-0 scale-0 hidden md:block"
      >
        {cursorText}
      </div>
    </>
  )
}
