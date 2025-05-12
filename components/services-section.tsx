"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Link from "next/link"
import { ChevronRight, Cloud, Database, Cog, Code, Shield, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText)

    // Initialize animations when component mounts
    const initAnimations = () => {
      const section = sectionRef.current
      const title = titleRef.current
      const subtitle = subtitleRef.current
      const intro = introRef.current
      const cardsContainer = cardsContainerRef.current

      if (!section || !title || !subtitle || !intro || !cardsContainer) return

      // Title animation with glitch effect
      const splitTitle = new SplitText(title, { type: "chars,words" })

      gsap.from(splitTitle.chars, {
        opacity: 0,
        y: 50,
        rotationX: -90,
        stagger: 0.02,
        duration: 0.8,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // Add a glitch effect to the title
      const glitchTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: title,
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
      gsap.set(subtitle, {
        backgroundImage: "linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6)",
        backgroundSize: "200% 200%",
        backgroundClip: "text",
        textFillColor: "transparent",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      })

      gsap.to(subtitle, {
        backgroundPosition: "200% 200%",
        duration: 8,
        repeat: -1,
        ease: "sine.inOut",
      })

      gsap.from(subtitle, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: subtitle,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      })

      // Animate the intro paragraphs with a more dynamic and consistent animation
      const servicesIntro = intro
      if (servicesIntro) {
        // Add a subtle gradient background to the intro section
        gsap.set(servicesIntro, {
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
          borderRadius: "1rem",
          padding: "2rem",
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)",
        })

        // Create a timeline for the intro animations
        const introTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: servicesIntro,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })

        // Animate the entire intro container first
        introTimeline.from(servicesIntro, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        })

        // Then animate each paragraph with a staggered character reveal
        const paragraphs = servicesIntro.querySelectorAll("p")

        paragraphs.forEach((paragraph, index) => {
          const splitParagraph = new SplitText(paragraph, { type: "chars,words,lines" })

          introTimeline.from(
            splitParagraph.chars,
            {
              opacity: 0,
              y: 10,
              rotationX: -20,
              stagger: 0.01,
              duration: 0.6,
              ease: "back.out(1.7)",
            },
            index === 0 ? "-=0.4" : "-=0.5",
          )

          // Add a subtle highlight animation to key words
          const keywords = paragraph.querySelectorAll(".keyword")
          if (keywords.length) {
            introTimeline.to(
              keywords,
              {
                color: "#3b82f6",
                fontWeight: "bold",
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.inOut",
              },
              "-=0.3",
            )
          }
        })

        // Add a subtle floating animation to the entire intro section
        gsap.to(servicesIntro, {
          y: 10,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2,
        })
      }

      // Add a subtle floating animation to the entire intro section
      gsap.to(intro, {
        y: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })

      // Service cards animations
      const serviceCards = cardsContainer.querySelectorAll(".service-card")

      // Create a staggered entrance for all cards
      gsap.from(serviceCards, {
        opacity: 0,
        y: 100,
        scale: 0.8,
        stagger: 0.15,
        duration: 1,
        ease: "elastic.out(1, 0.75)",
        scrollTrigger: {
          trigger: cardsContainer,
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

      // Add floating particles to the services section background
      const createParticles = () => {
        const particlesContainer = document.createElement("div")
        particlesContainer.className = "absolute inset-0 pointer-events-none overflow-hidden"
        section.style.position = "relative"
        section.appendChild(particlesContainer)

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

      // Why Us section animations with particle effects
      const whyUs = document.getElementById("why-us")
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
          // Staggered reveal for items - simplified animation to ensure visibility
          gsap.from(whyUsItems, {
            opacity: 0,
            y: 30,
            stagger: 0.1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: whyUs,
              start: "top 80%",
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
    }

    initAnimations()

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const services = [
    {
      title: "Cloud Services",
      description:
        "Cloud strategy, migration, security, application modernization, and DevSecOps for secure, scalable solutions.",
      icon: <Cloud className="w-8 h-8" />,
      color: "blue",
    },
    {
      title: "Data Services",
      description:
        "Data engineering, analytics, and science for scalable infrastructure, insights, and data-driven decisions.",
      icon: <Database className="w-8 h-8" />,
      color: "green",
    },
    {
      title: "Business Process Automation",
      description:
        "Custom applications, workflow automation, legacy system modernization, and mobile development for business efficiency.",
      icon: <Cog className="w-8 h-8" />,
      color: "purple",
    },
    {
      title: "Product Engineering",
      description: "End-to-end product development, modernization, and maintenance for optimal performance.",
      icon: <Code className="w-8 h-8" />,
      color: "orange",
    },
    {
      title: "Testing Services",
      description:
        "Functional, API, performance, security, and automated testing, including mobile, IoT, and Salesforce validation.",
      icon: <Shield className="w-8 h-8" />,
      color: "red",
    },
    {
      title: "See All Services",
      description: "",
      icon: <ArrowRight className="w-8 h-8" />,
      color: "blue",
      isButton: true,
    },
  ]

  return (
    <section ref={sectionRef} id="services" className="py-12 md:py-20 px-6 bg-white relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 ref={titleRef} className="services-title text-3xl md:text-4xl font-bold mb-3">
            Explore Our Services
          </h2>
          <p ref={subtitleRef} className="services-subtitle text-xl text-blue-600 max-w-3xl mx-auto">
            Empower Businesses with Cloud-driven Innovation and Growth
          </p>

          <div ref={introRef} className="services-intro max-w-4xl mx-auto text-center mb-12 relative overflow-hidden">
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              At <span className="keyword font-semibold">iNTEL-CS</span>, we deliver tailored{" "}
              <span className="keyword font-semibold">cloud solutions</span> that empower organizations to{" "}
              <span className="keyword font-semibold">innovate faster</span>, operate more efficiently, and{" "}
              <span className="keyword font-semibold">scale with confidence</span>. Our comprehensive suite of services
              leverages <span className="keyword font-semibold">cutting-edge technologies</span> to drive measurable
              business outcomes.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg">
              From strategic <span className="keyword font-semibold">cloud adoption planning</span> to implementation
              and ongoing optimization, we guide your{" "}
              <span className="keyword font-semibold">digital transformation journey</span> at every step. Our experts
              help you harness the full potential of cloud technologies, enabling you to focus on your{" "}
              <span className="keyword font-semibold">core business</span> while we handle the technological
              complexities.
            </p>

            {/* Add subtle decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <div ref={cardsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className={cn(
                "service-card bg-white p-8 rounded-lg shadow-lg border-t-4 transition-all duration-300 transform perspective-1000",
                service.isButton ? "bg-blue-600 text-white" : `border-${service.color}-500`,
              )}
            >
              {service.isButton ? (
                <div className="flex items-center justify-center h-full">
                  <Link href="#" className="text-white font-bold text-xl flex items-center">
                    See All Services <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div
                      className={`service-icon w-16 h-16 bg-${service.color}-100 rounded-full flex items-center justify-center text-${service.color}-600 mb-4`}
                    >
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <Link href="#" className={`text-${service.color}-600 font-semibold flex items-center group`}>
                    Read More{" "}
                    <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
