"use client"

import { useEffect, useRef, useState } from "react"

export function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(false)

  useEffect(() => {
    // Create audio element with error handling
    try {
      // Check if Audio API is supported
      if (typeof Audio !== "undefined") {
        audioRef.current = new Audio()

        // Add error handling for the audio element
        audioRef.current.addEventListener("error", (e) => {
          console.log("Audio error occurred, disabling sound effects")
          setAudioEnabled(false)
        })

        // Only set the source after adding error listener
        audioRef.current.src = "/hover-sound.mp3"
        audioRef.current.volume = 0.2
        audioRef.current.load()

        // Test if audio can be played
        audioRef.current
          .play()
          .then(() => {
            // Successfully played, pause it immediately
            audioRef.current?.pause()
            audioRef.current!.currentTime = 0
            setAudioEnabled(true)
          })
          .catch((err) => {
            console.log("Audio playback failed, disabling sound effects:", err)
            setAudioEnabled(false)
          })
      }
    } catch (err) {
      console.log("Audio initialization failed, disabling sound effects")
      setAudioEnabled(false)
    }

    // Set up event listeners for interactive elements only if audio is enabled
    const playHoverSound = () => {
      if (!audioRef.current || !audioEnabled) return

      try {
        // Reset audio to beginning
        audioRef.current.currentTime = 0
        audioRef.current.volume = 0.2

        // Play with error handling
        const playPromise = audioRef.current.play()

        // Handle the play promise
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Audio playback failed:", error)
          })
        }
      } catch (err) {
        console.log("Error playing audio:", err)
      }
    }

    // Only add event listeners if audio is enabled
    if (audioEnabled) {
      const buttons = document.querySelectorAll("button, a")
      buttons.forEach((button) => {
        button.addEventListener("mouseenter", playHoverSound)
      })

      return () => {
        buttons.forEach((button) => {
          button.removeEventListener("mouseenter", playHoverSound)
        })

        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current = null
        }
      }
    }
  }, [audioEnabled])

  return null // This component doesn't render anything visible
}
