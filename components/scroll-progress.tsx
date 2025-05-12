"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function ScrollProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const progress = progressRef.current
    if (!progress) return

    gsap.to(progress, {
      width: "100%",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    })
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div ref={progressRef} className="h-full bg-blue-600 w-0"></div>
    </div>
  )
}
