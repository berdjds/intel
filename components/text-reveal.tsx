"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import type { JSX } from "react/jsx-runtime"

interface TextRevealProps {
  text: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  stagger?: number
  duration?: number
  delay?: number
}

// Reduce animation stagger time for more compact text appearance
export function TextReveal({
  text,
  as: Component = "div",
  className = "",
  stagger = 0.03, // Reduced from 0.05
  duration = 0.6, // Reduced from 0.8
  delay = 0,
}: TextRevealProps) {
  const textRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    const element = textRef.current
    if (!element) return

    const split = new SplitText(element, { type: "chars,words,lines" })

    gsap.from(split.chars, {
      opacity: 0,
      y: 20,
      rotationX: -90,
      stagger: stagger,
      duration: duration,
      delay: delay,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    })

    return () => {
      split.revert()
    }
  }, [text, stagger, duration, delay])

  return (
    <Component ref={textRef} className={className}>
      {text}
    </Component>
  )
}
