"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface CountUpProps {
  end: number
  start?: number
  duration?: number
  delay?: number
  prefix?: string
  suffix?: string
  decimals?: number
  useEasing?: boolean
}

export function CountUp({
  end,
  start = 0,
  duration = 2.5,
  delay = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  useEasing = true,
}: CountUpProps) {
  const [value, setValue] = useState(start)
  const elementRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const element = elementRef.current
    if (!element) return

    const animate = () => {
      if (hasAnimated.current) return

      gsap.to(
        { value: start },
        {
          value: end,
          duration: duration,
          delay: delay,
          ease: useEasing ? "power2.out" : "none",
          onUpdate: function () {
            setValue(this.targets()[0].value)
          },
        },
      )

      hasAnimated.current = true
    }

    // Trigger animation on scroll
    ScrollTrigger.create({
      trigger: element,
      start: "top 90%",
      onEnter: animate,
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [end, start, duration, delay, useEasing])

  const formattedValue = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()

  return (
    <span ref={elementRef}>
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  )
}
