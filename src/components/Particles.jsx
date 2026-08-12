import { useEffect } from 'react'
import './Particles.css'

const config = {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 1200 } },
    color: { value: '#f29f05' },
    shape: {
      type: 'circle',
      stroke: { width: 0, color: '#000000' },
      polygon: { nb_sides: 5 },
    },
    opacity: {
      value: 0.5,
      random: false,
      anim: { enable: false, speed: 1, opacity_min: 0.1, sync: false },
    },
    size: {
      value: 3,
      random: true,
      anim: { enable: true, speed: 40, size_min: 0.1, sync: false },
    },
    line_linked: { enable: true, distance: 150, color: '#ffffff', opacity: 0.4, width: 1 },
    move: {
      enable: true,
      speed: 6,
      direction: 'none',
      random: false,
      straight: false,
      out_mode: 'out',
      bounce: false,
      attract: { enable: false, rotateX: 600, rotateY: 1200 },
    },
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'repulse' },
      onclick: { enable: true, mode: 'push' },
      resize: true,
    },
    modes: {
      grab: { distance: 400, line_linked: { opacity: 1 } },
      bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
      repulse: { distance: 200, duration: 0.4 },
      push: { particles_nb: 4 },
      remove: { particles_nb: 2 },
    },
  },
  retina_detect: true,
}

export default function Particles({ id = 'particles-js' }) {
  useEffect(() => {
    let cancelled = false

    import('../vendor/particles.js').then(() => {
      if (cancelled || typeof window.particlesJS !== 'function') return
      window.particlesJS(id, config)
    })

    return () => {
      cancelled = true
      const dom = window.pJSDom || []
      const instance = dom.find((d) => d?.pJS?.canvas?.el?.closest(`#${id}`))
      instance?.pJS?.fn?.vendors?.destroypJS?.()
      window.pJSDom = dom.filter((d) => d !== instance)
    }
  }, [id])

  return <div id={id} className="particles-layer" aria-hidden="true" />
}
