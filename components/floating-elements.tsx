"use client"

import { useEffect } from "react"
import { gsap } from "gsap"

export function FloatingElements() {
  useEffect(() => {
    const elements = document.querySelectorAll(".floating-element")

    elements.forEach((el, index) => {
      const delay = index * 0.2
      const duration = 3 + Math.random() * 2

      gsap.to(el, {
        y: `${Math.random() > 0.5 ? "-" : ""}${20 + Math.random() * 20}`,
        x: `${Math.random() > 0.5 ? "-" : ""}${10 + Math.random() * 15}`,
        rotation: Math.random() > 0.5 ? 15 : -15,
        duration: duration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      })
    })
  }, [])

  return (
    <>
      <div className="floating-element absolute top-[20%] left-[10%] w-16 h-16 bg-blue-500/20 rounded-full blur-md"></div>
      <div className="floating-element absolute top-[60%] left-[20%] w-24 h-24 bg-purple-500/20 rounded-full blur-md"></div>
      <div className="floating-element absolute top-[30%] right-[15%] w-20 h-20 bg-cyan-500/20 rounded-full blur-md"></div>
      <div className="floating-element absolute bottom-[20%] right-[10%] w-16 h-16 bg-blue-500/20 rounded-full blur-md"></div>
      <div className="floating-element absolute top-[40%] left-[50%] w-32 h-32 bg-indigo-500/10 rounded-full blur-md"></div>
    </>
  )
}
