"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { SplitText } from "gsap/SplitText"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { Facebook, Twitter, Youtube, Phone, Mail, MapPin, TrendingUp, Menu, X, Clock, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ParticleBackground from "@/components/particle-background"
import { MagneticButton } from "@/components/magnetic-button"
import { TextReveal } from "@/components/text-reveal"
import { FloatingElements } from "@/components/floating-elements"
import { CursorFollower } from "@/components/cursor-follower"
import { ThreeDCard } from "@/components/3d-card"
import { CountUp } from "@/components/count-up"
import { ScrollProgress } from "@/components/scroll-progress"
import { AudioPlayer } from "@/components/audio-player"
import { ServicesSection } from "@/components/services-section"

// Custom hook for mouse position
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", updateMousePosition)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
    }
  }, [])

  return mousePosition
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isLoading, setIsLoading] = useState(true)
  const [cursorType, setCursorType] = useState("default")
  const [cursorText, setCursorText] = useState("")
  const mousePosition = useMousePosition()

  // Refs for animations
  const headerRef = useRef<HTMLElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const whyUsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const brandsRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const teamRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const loaderRef = useRef<HTMLDivElement>(null)
  const loaderTextRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Smooth scroll function
  const smoothScroll = useCallback((target: string) => {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: { y: target, offsetY: 80 },
      ease: "expo.inOut",
      onComplete: () => setActiveSection(target.substring(1)),
    })
  }, [])

  // Handle cursor interactions
  const handleCursorEnter = useCallback((type: string, text = "") => {
    setCursorType(type)
    setCursorText(text)
  }, [])

  const handleCursorLeave = useCallback(() => {
    setCursorType("default")
    setCursorText("")
  }, [])

  // Initialize loading animation
  useEffect(() => {
    if (loaderRef.current && mainRef.current && loaderTextRef.current) {
      // Hide main content during loading
      gsap.set(mainRef.current, { autoAlpha: 0 })

      // Create loading animation
      const tl = gsap.timeline({
        onComplete: () => {
          setIsLoading(false)
          // Reveal main content
          gsap.to(mainRef.current, {
            autoAlpha: 1,
            duration: 1,
            ease: "power2.inOut",
            delay: 0.2,
          })
        },
      })

      // Animate the progress bar
      tl.to(loaderRef.current.querySelector(".loader-progress"), {
        width: "100%",
        duration: 2,
        ease: "power2.inOut",
      })

      // Manually update the percentage text
      const loaderText = loaderTextRef.current
      const progress = { value: 0 }

      tl.to(
        progress,
        {
          value: 100,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            const percentage = Math.round(progress.value)
            loaderText.textContent = `${percentage}%`
          },
        },
        0,
      )

      // Animate the loader out
      tl.to(loaderRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: "power2.inOut",
      })
    }
  }, [])

  // Initialize all animations
  useEffect(() => {
    // Register GSAP plugins
    gsap.registerPlugin(
      ScrollTrigger,
      ScrollToPlugin,
      SplitText,
      MotionPathPlugin,
      MorphSVGPlugin,
      DrawSVGPlugin,
      ScrambleTextPlugin,
    )

    // Skip animations during loading
    if (isLoading) return

    // Initialize all animations
    initAnimations()

    // Setup horizontal scroll section
    if (horizontalScrollRef.current) {
      const horizontalSection = horizontalScrollRef.current
      const panelsContainer = horizontalSection.querySelector(".absolute")
      const panels = horizontalSection.querySelectorAll(".horizontal-panel")

      if (panelsContainer && panels.length) {
        // Reset any existing transforms
        gsap.set(panelsContainer, { clearProps: "all" })

        // Create the horizontal scroll animation
        gsap.to(panelsContainer, {
          x: () => -(panelsContainer.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: horizontalSection,
            pin: true,
            start: "top top",
            end: () => `+=${panelsContainer.scrollWidth - window.innerWidth}`,
            scrub: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.3 },
              delay: 0,
              ease: "power1.inOut",
            },
          },
        })
      }
    }

    // Setup WebGL canvas background
    if (canvasRef.current) {
      initWebGLBackground()
    }

    // Setup scroll-based color theme changes
    ScrollTrigger.create({
      trigger: whyUsRef.current,
      start: "top 50%",
      end: "bottom 50%",
      onEnter: () => document.body.classList.add("theme-dark"),
      onLeave: () => document.body.classList.remove("theme-dark"),
      onEnterBack: () => document.body.classList.add("theme-dark"),
      onLeaveBack: () => document.body.classList.remove("theme-dark"),
    })

    // Update active section on scroll
    const sections = ["home", "about", "services", "why-us", "stats", "brands", "contact", "team"]
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section),
      })
    })

    return () => {
      // Clean up all ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isLoading])

  // WebGL background initialization
  const initWebGLBackground = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const gl = canvas.getContext("webgl")

    if (!gl) return

    // WebGL initialization code would go here
    // This is a placeholder for actual WebGL implementation
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }

  const initAnimations = () => {
    // Header animation
    const header = headerRef.current
    if (header) {
      ScrollTrigger.create({
        start: "top -80",
        end: 99999,
        toggleClass: { className: "header-scrolled", targets: header },
      })

      // Animate header elements
      const logo = header.querySelector(".logo")
      const navItems = header.querySelectorAll(".nav-link")
      const ctaButton = header.querySelector(".header-cta")

      gsap.from([logo, ...navItems, ctaButton], {
        y: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: "elastic.out(1, 0.8)",
        delay: 0.5,
      })
    }

    // Hero section animations
    const hero = heroRef.current
    if (hero) {
      const heroTitle = hero.querySelector(".hero-title")
      const heroSubtitle = hero.querySelector(".hero-subtitle")
      const heroCta = hero.querySelector(".hero-cta")
      const heroBackground = hero.querySelector(".hero-bg")

      if (heroTitle && heroSubtitle && heroCta) {
        const splitTitle = new SplitText(heroTitle, { type: "chars,words" })
        const splitSubtitle = new SplitText(heroSubtitle, { type: "chars,words,lines" })

        const tl = gsap.timeline()

        // Glitch effect for title
        tl.from(splitTitle.chars, {
          opacity: 0,
          scale: 0,
          y: 80,
          rotationX: 180,
          transformOrigin: "0% 50% -50",
          stagger: 0.01,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
          .to(splitTitle.chars, {
            color: "#3b82f6",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.inOut",
          })
          .to(splitTitle.chars, {
            color: "white",
            duration: 0.3,
            stagger: 0.02,
            ease: "power2.inOut",
          })

        // Subtitle animation
        tl.from(
          splitSubtitle.lines,
          {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )

        // CTA buttons animation
        tl.from(
          heroCta.children,
          {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: "elastic.out(1, 0.8)",
          },
          "-=0.2",
        )

        // Parallax effect on hero background
        if (heroBackground) {
          gsap.to(heroBackground, {
            y: "30%",
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })

          // Animated gradient
          gsap.to(heroBackground.querySelector(".gradient-overlay"), {
            backgroundPosition: "100% 100%",
            duration: 15,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        }

        // Floating elements animation
        const floatingElements = hero.querySelectorAll(".floating-element")
        floatingElements.forEach((el, index) => {
          gsap.to(el, {
            y: `${index % 2 === 0 ? "-" : ""}20`,
            x: `${index % 3 === 0 ? "-" : ""}10`,
            rotation: index % 2 === 0 ? 10 : -10,
            duration: 3 + index,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2,
          })
        })
      }
    }

    // Partners section animation with 3D rotation
    const partners = document.querySelector(".partners-section")
    if (partners) {
      const partnerLogos = partners.querySelectorAll(".partner-logo")

      gsap.from(partnerLogos, {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: partners,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // 3D rotation on hover
      partnerLogos.forEach((logo) => {
        logo.addEventListener("mousemove", (e: any) => {
          const rect = logo.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top

          const xPercent = (x / rect.width - 0.5) * 30
          const yPercent = (y / rect.height - 0.5) * 30

          gsap.to(logo, {
            rotationY: xPercent,
            rotationX: -yPercent,
            transformPerspective: 1000,
            ease: "power1.out",
            duration: 0.5,
          })
        })

        logo.addEventListener("mouseleave", () => {
          gsap.to(logo, {
            rotationY: 0,
            rotationX: 0,
            duration: 0.5,
            ease: "power1.out",
          })
        })
      })
    }

    // About section animations with SVG morphing
    const about = aboutRef.current
    if (about) {
      const aboutTitle = about.querySelector(".about-title")
      const aboutText = about.querySelector(".about-text")
      const aboutCards = about.querySelectorAll(".about-card")
      const aboutSvg = about.querySelector(".about-svg")

      if (aboutTitle && aboutText) {
        // Simple fade-in animation for the title
        gsap.from(aboutTitle, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(aboutText, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: aboutText,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (aboutCards.length) {
        // Staggered 3D card reveal
        gsap.from(aboutCards, {
          opacity: 0,
          y: 100,
          rotationX: 45,
          transformOrigin: "center top",
          stagger: 0.2,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: aboutCards[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // SVG morphing animation
      if (aboutSvg) {
        const paths = aboutSvg.querySelectorAll("path")

        paths.forEach((path, index) => {
          const nextPath = paths[(index + 1) % paths.length]

          gsap.to(path, {
            morphSVG: nextPath,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.2,
          })
        })
      }
    }

    // Services section animations with advanced effects
    const services = servicesRef.current
    if (services) {
      const servicesTitle = services.querySelector(".services-title")
      const servicesSubtitle = services.querySelector(".services-subtitle")
      const servicesIntro = services.querySelector(".services-intro")
      const serviceCards = services.querySelectorAll(".service-card")

      if (servicesTitle && servicesSubtitle) {
        // Split text animation for title with glitch effect
        const splitTitle = new SplitText(servicesTitle, { type: "chars,words" })

        gsap.from(splitTitle.chars, {
          opacity: 0,
          y: 50,
          rotationX: -90,
          stagger: 0.02,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: servicesTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        // Add a glitch effect to the title
        const glitchTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: servicesTitle,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          delay: 1,
        })

        glitchTimeline
          .to(splitTitle.chars, {
            color: "#3b82f6",
            duration: 0.1,
            stagger: {
              each: 0.02,
              from: "random",
            },
          })
          .to(splitTitle.chars, {
            color: "inherit",
            duration: 0.1,
          })
          .to(splitTitle.chars, {
            x: () => Math.random() * 8 - 4,
            y: () => Math.random() * 8 - 4,
            duration: 0.1,
          })
          .to(splitTitle.chars, {
            x: 0,
            y: 0,
            duration: 0.2,
          })

        // Animated gradient background for subtitle
        gsap.set(servicesSubtitle, {
          backgroundImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6)",
          backgroundSize: "200% 200%",
          backgroundClip: "text",
          textFillColor: "transparent",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        })

        gsap.to(servicesSubtitle, {
          backgroundPosition: "200% 200%",
          duration: 8,
          repeat: -1,
          ease: "sine.inOut",
        })

        gsap.from(servicesSubtitle, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: servicesSubtitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Animate the intro paragraphs with line-by-line reveal
      if (servicesIntro) {
        const paragraphs = servicesIntro.querySelectorAll("p")

        paragraphs.forEach((paragraph, index) => {
          const splitParagraph = new SplitText(paragraph, { type: "lines" })

          gsap.from(splitParagraph.lines, {
            opacity: 0,
            y: 20,
            rotationX: -20,
            transformOrigin: "0 50% -50",
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: paragraph,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            delay: index * 0.2,
          })
        })

        // Add a subtle floating animation to the entire intro section
        gsap.to(servicesIntro, {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        })
      }

      if (serviceCards.length) {
        // Create a staggered entrance for all cards
        gsap.from(serviceCards, {
          opacity: 0,
          y: 100,
          scale: 0.8,
          stagger: 0.15,
          duration: 1,
          ease: "elastic.out(1, 0.75)",
          scrollTrigger: {
            trigger: serviceCards[0].parentElement,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        // Enhanced 3D card animations for each card
        serviceCards.forEach((card, index) => {
          // Animate the icon with continuous rotation
          const icon = card.querySelector(".service-icon")
          if (icon) {
            // Initial reveal animation
            gsap.from(icon, {
              scale: 0,
              rotation: -180,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: 0.3 + index * 0.1,
            })

            // Continuous subtle animation
            gsap.to(icon, {
              rotation: 360,
              duration: 20,
              repeat: -1,
              ease: "none",
              delay: 1 + index * 0.1,
            })

            // Pulse effect
            gsap.to(icon, {
              scale: 1.1,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 1.5 + index * 0.1,
            })
          }

          // Animate the title with character reveal
          const title = card.querySelector("h3")
          if (title) {
            const splitTitle = new SplitText(title, { type: "chars" })

            gsap.from(splitTitle.chars, {
              opacity: 0,
              y: 10,
              stagger: 0.03,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: 0.5 + index * 0.1,
            })
          }

          // Animate the description with line reveal
          const description = card.querySelector("p")
          if (description) {
            const splitDesc = new SplitText(description, { type: "lines" })

            gsap.from(splitDesc.lines, {
              opacity: 0,
              y: 20,
              stagger: 0.1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: 0.7 + index * 0.1,
            })
          }

          // Animate the "Read More" link
          const readMore = card.querySelector("a")
          if (readMore && !card.classList.contains("bg-blue-600")) {
            gsap.from(readMore, {
              opacity: 0,
              x: -20,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
              delay: 0.9 + index * 0.1,
            })

            // Add a continuous animation to the arrow
            const arrow = readMore.querySelector("svg")
            if (arrow) {
              gsap.to(arrow, {
                x: 5,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
                delay: 1 + index * 0.1,
              })
            }
          }

          // Enhanced 3D hover effect with parallax
          card.addEventListener("mousemove", (e: any) => {
            if (card.classList.contains("bg-blue-600")) return // Skip for the "See All" button

            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const xPercent = (x / rect.width - 0.5) * 20
            const yPercent = (y / rect.height - 0.5) * 20

            // Main card tilt
            gsap.to(card, {
              rotationY: xPercent,
              rotationX: -yPercent,
              transformPerspective: 1000,
              ease: "power1.out",
              duration: 0.5,
              boxShadow: `
                ${-xPercent}px ${-yPercent}px 20px rgba(59, 130, 246, 0.2),
                0 10px 30px rgba(0, 0, 0, 0.1)
              `,
            })

            // Parallax effect for inner elements
            const innerElements = [
              card.querySelector(".service-icon"),
              card.querySelector("h3"),
              card.querySelector("p"),
              card.querySelector("a"),
            ].filter(Boolean)

            innerElements.forEach((el, i) => {
              if (!el) return

              // Different depths for different elements
              const depth = 0.5 - i * 0.1 // Icon moves most, link moves least

              gsap.to(el, {
                x: xPercent * depth * 2,
                y: yPercent * depth * 2,
                ease: "power1.out",
                duration: 0.5,
              })
            })
          })

          card.addEventListener("mouseleave", () => {
            if (card.classList.contains("bg-blue-600")) return // Skip for the "See All" button

            // Reset card position and shadow
            gsap.to(card, {
              rotationY: 0,
              rotationX: 0,
              y: 0,
              scale: 1,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.05)",
              duration: 0.5,
              ease: "elastic.out(1, 0.75)",
            })

            // Reset inner elements
            const innerElements = [
              card.querySelector(".service-icon"),
              card.querySelector("h3"),
              card.querySelector("p"),
              card.querySelector("a"),
            ].filter(Boolean)

            innerElements.forEach((el) => {
              if (!el) return

              gsap.to(el, {
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.75)",
                duration: 0.5,
              })
            })
          })

          // Special animation for the "See All Services" button
          if (card.classList.contains("bg-blue-600")) {
            // Pulsing glow effect
            gsap.to(card, {
              boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })

            // Arrow animation
            const arrow = card.querySelector("svg")
            if (arrow) {
              gsap.to(arrow, {
                x: 10,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut",
              })
            }
          }
        })
      }

      // Add floating particles to the services section background
      const createParticles = () => {
        const particlesContainer = document.createElement("div")
        particlesContainer.className = "absolute inset-0 pointer-events-none overflow-hidden"
        services.style.position = "relative"
        services.appendChild(particlesContainer)

        for (let i = 0; i < 20; i++) {
          const particle = document.createElement("div")
          particle.className = "absolute rounded-full opacity-20"

          // Random size
          const size = 5 + Math.random() * 15
          particle.style.width = `${size}px`
          particle.style.height = `${size}px`

          // Random position
          particle.style.left = `${Math.random() * 100}%`
          particle.style.top = `${Math.random() * 100}%`

          // Random color
          const colors = ["bg-blue-500", "bg-purple-500", "bg-cyan-500", "bg-indigo-500"]
          particle.classList.add(colors[Math.floor(Math.random() * colors.length)])

          particlesContainer.appendChild(particle)

          // Animate each particle
          gsap.to(particle, {
            x: `${Math.random() * 200 - 100}`,
            y: `${Math.random() * 200 - 100}`,
            duration: 10 + Math.random() * 20,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: Math.random() * 5,
          })
        }
      }

      createParticles()
    }

    // Why Us section animations with particle effects
    const whyUs = whyUsRef.current
    if (whyUs) {
      const whyUsTitle = whyUs.querySelector(".why-us-title")
      const whyUsText = whyUs.querySelector(".why-us-text")
      const whyUsItems = whyUs.querySelectorAll(".why-us-item")

      if (whyUsTitle && whyUsText) {
        // Text reveal animation
        gsap.from(whyUsTitle, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: whyUsTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(whyUsText, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: whyUsText,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (whyUsItems.length) {
        // Staggered 3D reveal for items
        gsap.from(whyUsItems, {
          opacity: 0,
          scale: 0.8,
          rotationY: 45,
          transformOrigin: "center center",
          stagger: 0.1,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: whyUsItems[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })

        // Hover animations
        whyUsItems.forEach((item) => {
          item.addEventListener("mouseenter", () => {
            gsap.to(item, {
              scale: 1.05,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            })
          })

          item.addEventListener("mouseleave", () => {
            gsap.to(item, {
              scale: 1,
              backgroundColor: "#1f2937",
              color: "#ffffff",
              duration: 0.3,
              ease: "power2.out",
            })
          })
        })
      }
    }

    // Stats section animations with counter effect
    const stats = statsRef.current
    if (stats) {
      const statsTitle = stats.querySelector(".stats-title")
      const statsSubtitle = stats.querySelector(".stats-subtitle")
      const statItems = stats.querySelectorAll(".stat-item")

      if (statsTitle && statsSubtitle) {
        gsap.from(statsTitle, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(statsSubtitle, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsSubtitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (statItems.length) {
        // 3D flip animation for stat items
        statItems.forEach((item, index) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          })

          tl.from(item, {
            opacity: 0,
            rotationX: 90,
            transformOrigin: "center top",
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: index * 0.1,
          })

          // Counter animation
          const numberElement = item.querySelector(".stat-number")
          if (numberElement) {
            const finalValue = Number.parseInt(numberElement.textContent || "0", 10)
            const unit = numberElement.getAttribute("data-unit") || ""

            tl.from(
              numberElement,
              {
                textContent: 0,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 1 },
                stagger: 1,
                onUpdate: () => {
                  numberElement.textContent = Math.ceil(Number.parseFloat(numberElement.textContent || "0")) + unit
                },
              },
              "-=0.4",
            )
          }
        })
      }
    }

    // Brands section animation with 3D effects
    const brands = brandsRef.current
    if (brands) {
      const brandLogos = brands.querySelectorAll(".brand-logo")

      if (brandLogos.length) {
        // Staggered 3D reveal
        gsap.from(brandLogos, {
          opacity: 0,
          scale: 0.8,
          rotationY: 90,
          transformOrigin: "center center",
          stagger: 0.05,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: brands,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })

        // Hover animations
        brandLogos.forEach((logo) => {
          logo.addEventListener("mouseenter", () => {
            gsap.to(logo, {
              scale: 1.1,
              filter: "grayscale(0)",
              duration: 0.3,
              ease: "power2.out",
            })
          })

          logo.addEventListener("mouseleave", () => {
            gsap.to(logo, {
              scale: 1,
              filter: "grayscale(1)",
              duration: 0.3,
              ease: "power2.out",
            })
          })
        })
      }
    }

    // Contact section animations with form interactions
    const contact = contactRef.current
    if (contact) {
      const contactTitle = contact.querySelector(".contact-title")
      const contactText = contact.querySelector(".contact-text")
      const contactForm = contact.querySelector(".contact-form")
      const contactInfo = contact.querySelector(".contact-info")
      const formInputs = contact.querySelectorAll("input, textarea")

      if (contactTitle && contactText) {
        gsap.from(contactTitle, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(contactText, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: contactText,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (contactForm && contactInfo) {
        // 3D reveal animation
        gsap.from(contactForm, {
          opacity: 0,
          x: 50,
          rotationY: 10,
          transformOrigin: "left center",
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: contactForm,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(contactInfo, {
          opacity: 0,
          x: -50,
          rotationY: -10,
          transformOrigin: "right center",
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: contactInfo,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        // Form input animations
        formInputs.forEach((input) => {
          input.addEventListener("focus", () => {
            gsap.to(input, {
              scale: 1.02,
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)",
              duration: 0.3,
              ease: "power2.out",
            })
          })

          input.addEventListener("blur", () => {
            gsap.to(input, {
              scale: 1,
              boxShadow: "none",
              duration: 0.3,
              ease: "power2.out",
            })
          })
        })
      }
    }

    // Team section animations with 3D card effects
    const team = teamRef.current
    if (team) {
      const teamTitle = team.querySelector(".team-title")
      const teamSubtitle = team.querySelector(".team-subtitle")
      const teamMembers = team.querySelectorAll(".team-member")

      if (teamTitle && teamSubtitle) {
        gsap.from(teamTitle, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamTitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(teamSubtitle, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: teamSubtitle,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
      }

      if (teamMembers.length) {
        // Staggered 3D card reveal
        gsap.from(teamMembers, {
          opacity: 0,
          y: 100,
          rotationX: 45,
          transformOrigin: "center top",
          stagger: 0.2,
          duration: 1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: teamMembers[0],
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })

        // Advanced 3D hover effect
        teamMembers.forEach((member) => {
          member.addEventListener("mousemove", (e: any) => {
            const rect = member.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const xPercent = (x / rect.width - 0.5) * 20
            const yPercent = (y / rect.height - 0.5) * 20

            gsap.to(member, {
              rotationY: xPercent,
              rotationX: -yPercent,
              transformPerspective: 1000,
              ease: "power1.out",
              duration: 0.5,
              boxShadow: `
                ${-xPercent}px ${-yPercent}px 20px rgba(59, 130, 246, 0.2),
                0 10px 30px rgba(0, 0, 0, 0.1)
              `,
            })

            // Move inner elements for parallax effect
            const image = member.querySelector("img")
            const content = member.querySelector(".member-content")

            if (image && content) {
              gsap.to(image, {
                x: xPercent * 0.5,
                y: yPercent * 0.5,
                ease: "power1.out",
                duration: 0.5,
              })

              gsap.to(content, {
                x: xPercent * 0.3,
                y: yPercent * 0.3,
                ease: "power1.out",
                duration: 0.5,
              })
            }
          })

          member.addEventListener("mouseleave", () => {
            gsap.to(member, {
              rotationY: 0,
              rotationX: 0,
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
              duration: 0.5,
              ease: "power1.out",
            })

            // Reset inner elements
            const image = member.querySelector("img")
            const content = member.querySelector(".member-content")

            if (image && content) {
              gsap.to([image, content], {
                x: 0,
                y: 0,
                ease: "power1.out",
                duration: 0.5,
              })
            }
          })
        })
      }
    }

    // Footer animation with SVG drawing
    const footer = footerRef.current
    if (footer) {
      const footerLinks = footer.querySelectorAll(".footer-links")
      const footerForm = footer.querySelector(".footer-form")
      const footerSvg = footer.querySelector(".footer-svg")

      if (footerLinks.length && footerForm) {
        gsap.from(footerLinks, {
          opacity: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footer,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })

        gsap.from(footerForm, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerForm,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // SVG path drawing animation
      if (footerSvg) {
        const paths = footerSvg.querySelectorAll("path")

        gsap.from(paths, {
          drawSVG: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: footerSvg,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }
  }

  return (
    <>
      {/* Loading Screen */}
      <div
        ref={loaderRef}
        className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900 transition-transform duration-500 ${isLoading ? "" : "translate-y-full"}`}
      >
        <div className="text-5xl font-bold text-white mb-8">
          <span className="text-blue-500">iNTEL</span>-CS
        </div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div className="loader-progress h-full w-0 bg-blue-500 rounded-full"></div>
        </div>
        <div ref={loaderTextRef} className="text-white mt-4">
          0%
        </div>
      </div>

      {/* Cursor Follower */}
      <CursorFollower mousePosition={mousePosition} cursorType={cursorType} cursorText={cursorText} />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* WebGL Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] opacity-20"
      ></canvas>

      {/* Main Content */}
      <div ref={mainRef} className="relative pt-[32px]">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white py-2 px-4 md:px-8 fixed top-0 left-0 w-full z-[60]">
          <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex items-center space-x-4 mb-2 md:mb-0">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>+971 4 835 8795</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Dubai - UAE</span>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              <span>Mon-Fri: 8:30 AM - 5:30 PM</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header
          ref={headerRef}
          className="fixed top-[32px] left-0 w-full z-50 transition-all duration-300 py-4 px-6 md:px-12"
        >
          <div className="container mx-auto flex justify-between items-center">
            <div className="logo text-white font-bold text-2xl">
              <span className="text-blue-500">iNTEL</span>-CS
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: "Home", href: "#home" },
                { name: "Professional Services", href: "#services" },
                { name: "Managed Services", href: "#managed-services" },
                { name: "Partners", href: "#partners" },
                { name: "About", href: "#about" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-link text-white hover:text-blue-400 transition-colors relative",
                    activeSection === item.href.substring(1) && "text-blue-400",
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    smoothScroll(item.href)
                  }}
                  onMouseEnter={() => handleCursorEnter("link")}
                  onMouseLeave={handleCursorLeave}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300",
                      activeSection === item.href.substring(1) && "w-full",
                    )}
                  ></span>
                </Link>
              ))}
              <MagneticButton>
                <Button
                  className="header-cta bg-blue-600 hover:bg-blue-700 text-white"
                  onMouseEnter={() => handleCursorEnter("button", "Start")}
                  onMouseLeave={handleCursorLeave}
                >
                  Start Now
                </Button>
              </MagneticButton>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-white z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseEnter={() => handleCursorEnter("button", "Menu")}
              onMouseLeave={handleCursorLeave}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-full md:w-80 bg-gray-900/95 backdrop-blur-md z-40 transform transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="flex flex-col items-center mt-32 space-y-8 p-6">
            {[
              { name: "Home", href: "#home" },
              { name: "Professional Services", href: "#services" },
              { name: "Managed Services", href: "#managed-services" },
              { name: "Partners", href: "#partners" },
              { name: "About", href: "#about" },
            ].map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-white text-xl relative overflow-hidden group",
                  activeSection === item.href.substring(1) && "text-blue-400",
                )}
                onClick={(e) => {
                  e.preventDefault()
                  smoothScroll(item.href)
                  setIsMenuOpen(false)
                }}
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 transform translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></span>
              </Link>
            ))}
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full" onClick={() => setIsMenuOpen(false)}>
              Start Now
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <section
          id="home"
          ref={heroRef}
          className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex flex-col justify-center items-center text-center px-6 pt-40 pb-20 overflow-hidden"
        >
          {/* Particle Background */}
          <ParticleBackground />

          {/* Floating Elements */}
          <FloatingElements />

          <div className="hero-bg absolute top-0 left-0 w-full h-full opacity-20 z-0">
            <div className="gradient-overlay absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 bg-[length:200%_200%] bg-left-top"></div>
            <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] bg-repeat opacity-30"></div>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="flex items-center justify-center mb-4">
              <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 max-w-4xl">
                Welcome to <span className="text-blue-500">iNTEL</span>-CS{" "}
                <TrendingUp className="inline-block ml-2 h-8 w-8 text-blue-400" />
              </h1>
            </div>

            <p className="hero-subtitle text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              We provide cutting-edge IT systems that empower your business to reach its full potential.
            </p>

            <div className="hero-cta flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <MagneticButton scale={1.1}>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-md"
                  onMouseEnter={() => handleCursorEnter("button", "Contact")}
                  onMouseLeave={handleCursorLeave}
                >
                  Get in Touch
                </Button>
              </MagneticButton>
              <MagneticButton scale={1.1}>
                <Button
                  variant="outline"
                  className="border-white text-white bg-blue-900 hover:bg-blue-800 px-8 py-6 text-lg rounded-md"
                  onMouseEnter={() => handleCursorEnter("button", "Read")}
                  onMouseLeave={handleCursorLeave}
                >
                  Read More
                </Button>
              </MagneticButton>
            </div>

            <div className="mt-16 text-white text-xl font-light">
              <TextReveal text="Your Doorway to IT Modernization" />
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
            <div className="animate-bounce">
              <svg className="w-6 h-6 text-white" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>

          {/* Audio Player (hidden but functional) */}
          {typeof Audio !== "undefined" && <AudioPlayer />}
        </section>

        {/* Partners Section */}
        <section id="partners" className="partners-section py-10 md:py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-center text-2xl md:text-3xl font-bold mb-12 text-gray-900">Our 20+ Trusted Partners</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                <div
                  key={num}
                  className="partner-logo flex items-center justify-center p-4 transform perspective-1000"
                  onMouseEnter={() => handleCursorEnter("image")}
                  onMouseLeave={handleCursorLeave}
                >
                  <Image
                    src={`/partner-${num}.png`}
                    alt={`Partner ${num}`}
                    width={150}
                    height={80}
                    className="object-contain h-16 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-500 font-bold">Rating 4.9</span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-12 md:py-20 px-6 bg-gray-50 relative overflow-hidden">
          {/* SVG Background Animation */}
          <svg
            className="about-svg absolute top-0 left-0 w-full h-full opacity-5 z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C30,20 70,20 100,0 L100,100 L0,100 Z" fill="#3b82f6" />
            <path d="M0,0 C20,40 80,40 100,0 L100,100 L0,100 Z" fill="#2563eb" />
            <path d="M0,0 C40,30 60,30 100,0 L100,100 L0,100 Z" fill="#1d4ed8" />
          </svg>

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="about-title text-3xl md:text-4xl font-bold mb-4 text-blue-600">About Us</h2>
              <h3 className="text-xl md:text-2xl font-semibold text-blue-600 mb-6">
                Transforming IT Solutions for Businesses of All Sizes
              </h3>
              <p className="about-text text-gray-700 text-lg">
                iNTEL-CS, born in the cloud and thriving at the edge of innovation, is your partner for comprehensive IT
                modernization. Located in the UAE, our team of local experts is dedicated to transforming businesses
                using the power of cloud technology. We are not just service providers; we are pioneers shaping the
                future of digital landscapes.
              </p>
              <p className="about-text text-gray-700 text-lg mt-3">
                Our mission to safeguard the digital landscape in the UAE and beyond positions us at the forefront of
                cybersecurity, guided by our vision of a secure and resilient digital future.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <ThreeDCard className="about-card bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">VISION</h3>
                <p className="text-gray-700">
                  To be a leading provider of comprehensive IT modernization services, recognized for our expertise,
                  customer-centric approach, and commitment to excellence.
                </p>
              </ThreeDCard>

              <ThreeDCard className="about-card bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">MISSION</h3>
                <p className="text-gray-700">
                  To empower businesses through innovative IT solutions, enhancing their capabilities and driving growth
                  in a rapidly evolving digital landscape.
                </p>
              </ThreeDCard>
            </div>

            <div className="text-center mt-4">
              <MagneticButton>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onMouseEnter={() => handleCursorEnter("button", "Learn")}
                  onMouseLeave={handleCursorLeave}
                >
                  Learn More
                </Button>
              </MagneticButton>

              <div className="mt-6 text-gray-700">
                Call us anytime: <span className="font-semibold">(+971) 4 835 8795</span> or mail us:{" "}
                <span className="font-semibold">info@intel-cs.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Horizontal Scroll Section */}
        <section ref={horizontalScrollRef} className="relative h-[300vh] bg-white">
          <div className="sticky top-0 left-0 w-full h-screen flex overflow-hidden">
            {/* Create an absolute container to hold all panels */}
            <div className="absolute inset-0 flex">
              {/* Define each panel individually */}
              <div className="horizontal-panel flex-shrink-0 w-screen h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-700 text-white">
                <div className="text-center p-12">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">Cloud Innovation</h2>
                  <p className="text-xl max-w-2xl mx-auto">
                    Transforming businesses with cutting-edge cloud solutions that drive growth and efficiency.
                  </p>
                </div>
              </div>

              <div className="horizontal-panel flex-shrink-0 w-screen h-screen flex items-center justify-center bg-gradient-to-r from-purple-900 to-purple-700 text-white">
                <div className="text-center p-12">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">Data Intelligence</h2>
                  <p className="text-xl max-w-2xl mx-auto">
                    Unlocking the power of your data with advanced analytics and AI-driven insights.
                  </p>
                </div>
              </div>

              <div className="horizontal-panel flex-shrink-0 w-screen h-screen flex items-center justify-center bg-gradient-to-r from-green-950 to-green-900 text-white">
                <div className="text-center p-12 z-10 relative">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-md">Cybersecurity</h2>
                  <p className="text-xl max-w-2xl mx-auto text-white drop-shadow-md">
                    Protecting your digital assets with comprehensive security solutions and best practices.
                  </p>
                </div>
              </div>

              <div className="horizontal-panel flex-shrink-0 w-screen h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                <div className="text-center p-12">
                  <h2 className="text-4xl md:text-6xl font-bold mb-6">Digital Transformation</h2>
                  <p className="text-xl max-w-2xl mx-auto">
                    Guiding your journey to becoming a fully digital enterprise with innovative solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <ServicesSection />

        {/* Why Us Section */}
        <section
          id="why-us"
          ref={whyUsRef}
          className="py-12 md:py-20 px-6 bg-gray-900 text-white relative overflow-hidden"
        >
          {/* Particle Background */}
          <ParticleBackground color="#3b82f6" quantity={50} />

          <div className="container mx-auto relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="why-us-title text-3xl md:text-4xl font-bold mb-4">Why INTEL-CS?</h2>
              <p className="why-us-text text-xl text-blue-400">Empowering Your Business with Innovative Solutions</p>
            </div>

            <div className="mb-8">
              <p className="text-gray-300 max-w-4xl mx-auto text-center mb-8">
                At iNTEL-CS we provide tailored cloud solutions that align with your specific business objectives,
                ensuring a seamless journey from strategy development to implementation and optimization. Our
                partnerships with leading cloud providers like AWS and Microsoft Azure empower us to deliver
                unparalleled expertise.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Bespoke Solutions", icon: "🔧" },
                  { title: "Cloud Expertise", icon: "☁️" },
                  { title: "Security First", icon: "🔒" },
                  { title: "Seamless Migration", icon: "🚀" },
                  { title: "Cost Optimization", icon: "💰" },
                  { title: "Enhanced Productivity", icon: "📈" },
                  { title: "24/7 Managed Services", icon: "⏰" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="why-us-item bg-gray-800 p-6 rounded-lg transform transition-all duration-300 hover:scale-105 flex flex-col items-center text-center"
                    onMouseEnter={() => handleCursorEnter("card")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <MagneticButton>
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-md"
                  onMouseEnter={() => handleCursorEnter("button", "Book")}
                  onMouseLeave={handleCursorLeave}
                >
                  Book Your Free Consultation
                </Button>
              </MagneticButton>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" ref={statsRef} className="py-12 md:py-20 px-6 bg-white">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="stats-title text-3xl md:text-4xl font-bold mb-4 text-blue-600">
                Elevate Your Business With Cloud Solutions
              </h2>
              <p className="stats-subtitle text-gray-700 text-lg">
                In today's digital landscape, leveraging cloud technology is essential for driving innovation and
                achieving operational excellence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
              {[
                { number: 60, unit: "%", text: "Of the world's corporate data is stored in the cloud this" },
                { number: 90, unit: "%", text: "Of large enterprises have adopted a multi-cloud infrastructure" },
                { number: 200, unit: " ZB", text: "Of data will be stored in the cloud by 2025" },
                { number: 1, unit: " TN", text: "In revenue generated annually through cloud infrastructure service" },
                { number: 150, unit: " BN", text: "The cloud applications market worth" },
                { number: 178, unit: " BN", text: "Revenue generated per year by cloud infrastructure services" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="stat-item bg-gray-50 p-8 rounded-lg text-center transform perspective-1000"
                  onMouseEnter={() => handleCursorEnter("card")}
                  onMouseLeave={handleCursorLeave}
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    <CountUp end={stat.number} suffix={stat.unit} duration={2.5} />
                  </div>
                  <p className="stat-text text-gray-700">{stat.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section id="brands" ref={brandsRef} className="py-10 md:py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-3 text-gray-900">Trusted By Global Brands</h2>
              <p className="text-gray-700">Join Millions Of Customers Around The Globe</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <div
                  key={num}
                  className="brand-logo flex items-center justify-center p-4 transform perspective-1000"
                  onMouseEnter={() => handleCursorEnter("image")}
                  onMouseLeave={handleCursorLeave}
                >
                  <Image
                    src={`/brand-${num}.png`}
                    alt={`Brand ${num}`}
                    width={120}
                    height={60}
                    className="object-contain h-12 grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          ref={contactRef}
          className="py-12 md:py-20 px-6 bg-blue-600 text-white relative overflow-hidden"
        >
          {/* Animated background */}
          <div className="absolute inset-0 z-0">
            <svg className="footer-svg w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,0 C30,40 70,40 100,0 L100,100 L0,100 Z" fill="#ffffff" />
            </svg>
          </div>

          <div className="container mx-auto relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="contact-info">
                <h2 className="contact-title text-3xl md:text-4xl font-bold mb-6">Get In Touch</h2>
                <p className="contact-text text-xl mb-8">
                  Looking for the best Cloud business solutions? Call for a consultation now!
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <Phone className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Call for a consultation now!</h3>
                      <p className="text-xl">(+971) 4 835 8795</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Write to Us</h3>
                      <p className="text-xl">info@intel-cs.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 mr-4 mt-1" />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-xl">Dubai - UAE</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-form bg-white text-gray-900 p-8 rounded-lg shadow-xl transform perspective-1000">
                <h3 className="text-2xl font-bold mb-6 text-blue-600">Send Us a Message</h3>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        className="w-full"
                        onFocus={() => handleCursorEnter("input")}
                        onBlur={handleCursorLeave}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="w-full"
                        onFocus={() => handleCursorEnter("input")}
                        onBlur={handleCursorLeave}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      className="w-full"
                      onFocus={() => handleCursorEnter("input")}
                      onBlur={handleCursorLeave}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Your message..."
                      className="w-full min-h-[120px]"
                      onFocus={() => handleCursorEnter("input")}
                      onBlur={handleCursorLeave}
                    />
                  </div>

                  <MagneticButton>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onMouseEnter={() => handleCursorEnter("button", "Submit")}
                      onMouseLeave={handleCursorLeave}
                    >
                      Submit
                    </Button>
                  </MagneticButton>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section id="team" ref={teamRef} className="py-12 md:py-20 px-6 bg-white">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="team-title text-3xl md:text-4xl font-bold mb-3 text-blue-600">Our Team</h2>
              <p className="team-subtitle text-xl text-gray-700">We Have A Dynamic And Genius Team To Serve You</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Mohammad Darras",
                  position: "Chief Executive Officer & Managing Director",
                  image: "/team-1.jpg",
                },
                {
                  name: "Ameen Abodabash",
                  position: "Chief Technology Officer",
                  image: "/team-2.png",
                },
                {
                  name: "Mohammad Mohiealdeen",
                  position: "Cloud Operational Officer",
                  image: "/team-3.png",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="team-member bg-white rounded-lg shadow-lg overflow-hidden transform perspective-1000"
                  onMouseEnter={() => handleCursorEnter("card")}
                  onMouseLeave={handleCursorLeave}
                >
                  <div className="relative">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={400}
                      height={400}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 w-full">
                        <h3 className="text-xl font-bold text-white">{member.name}</h3>
                        <p className="text-blue-300">{member.position}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 member-content">
                    <div className="flex space-x-4 mt-4">
                      <a
                        href="#"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                        onMouseEnter={() => handleCursorEnter("link")}
                        onMouseLeave={handleCursorLeave}
                      >
                        <Facebook className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-blue-400 transition-colors"
                        onMouseEnter={() => handleCursorEnter("link")}
                        onMouseLeave={handleCursorLeave}
                      >
                        <Twitter className="h-5 w-5" />
                      </a>
                      <a
                        href="#"
                        className="text-gray-600 hover:text-red-600 transition-colors"
                        onMouseEnter={() => handleCursorEnter("link")}
                        onMouseLeave={handleCursorLeave}
                      >
                        <Youtube className="h-5 w-5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer ref={footerRef} className="bg-gray-900 text-white pt-12 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
              <div>
                <div className="text-2xl font-bold mb-6">
                  <span className="text-blue-500">iNTEL</span>-CS
                </div>
                <p className="text-gray-400 mb-6">
                  Born in the cloud, iNTEL-CS is your complete IT modernization partner, focused on delivering
                  customer-centric solutions.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => handleCursorEnter("link")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => handleCursorEnter("link")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => handleCursorEnter("link")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <Youtube className="h-5 w-5" />
                  </a>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                    onMouseEnter={() => handleCursorEnter("link")}
                    onMouseLeave={handleCursorLeave}
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                </div>
              </div>

              <div className="footer-links">
                <h3 className="text-lg font-bold mb-6">Useful Links</h3>
                <ul className="space-y-3">
                  {[
                    { name: "Home", href: "#home" },
                    { name: "About Us", href: "#about" },
                    { name: "Contact Us", href: "#contact" },
                    { name: "Join Our Team", href: "#" },
                    { name: "Privacy Policy", href: "#" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                        onMouseEnter={() => handleCursorEnter("link")}
                        onMouseLeave={handleCursorLeave}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-links">
                <h3 className="text-lg font-bold mb-6">Services</h3>
                <ul className="space-y-3">
                  {[
                    { name: "Professional Services", href: "#services" },
                    { name: "Managed Services", href: "#managed-services" },
                    { name: "Microsoft Services", href: "#" },
                    { name: "AWS Services", href: "#" },
                  ].map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                        onMouseEnter={() => handleCursorEnter("link")}
                        onMouseLeave={handleCursorLeave}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-form">
                <h3 className="text-lg font-bold mb-6">Subscribe Now</h3>
                <p className="text-gray-400 mb-4">Don't miss our future updates! Get Subscribed Today!</p>

                <form className="space-y-4">
                  <Input
                    placeholder="Your email address"
                    className="bg-gray-800 border-gray-700 text-white"
                    onFocus={() => handleCursorEnter("input")}
                    onBlur={handleCursorLeave}
                  />
                  <MagneticButton>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onMouseEnter={() => handleCursorEnter("button", "Subscribe")}
                      onMouseLeave={handleCursorLeave}
                    >
                      Subscribe
                    </Button>
                  </MagneticButton>
                </form>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
              <p>©2024. One Right Solution . All Rights Reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
