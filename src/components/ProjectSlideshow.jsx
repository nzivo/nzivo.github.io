import { useCallback, useEffect, useState } from 'react'
import './ProjectSlideshow.css'

export default function ProjectSlideshow({ images, title }) {
  const [index, setIndex] = useState(0)
  const hasImages = images && images.length > 0
  const hasMultiple = hasImages && images.length > 1

  const goTo = useCallback(
    (next) => {
      if (!hasImages) return
      setIndex(((next % images.length) + images.length) % images.length)
    },
    [hasImages, images]
  )

  const prev = useCallback(() => goTo(index - 1), [goTo, index])
  const next = useCallback(() => goTo(index + 1), [goTo, index])

  useEffect(() => {
    if (!hasMultiple) return
    function onKeyDown(e) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [hasMultiple, prev, next])

  if (!hasImages) {
    return (
      <div className="project-detail-media" aria-hidden="true">
        <span>{title.charAt(0)}</span>
      </div>
    )
  }

  return (
    <div className="project-slideshow" role="group" aria-roledescription="carousel" aria-label={`${title} screenshots`}>
      <div className="project-slideshow-viewport">
        <img
          key={images[index]}
          src={images[index]}
          alt={`${title} screenshot ${index + 1} of ${images.length}`}
          className="project-slideshow-image"
        />

        {hasMultiple && (
          <>
            <button type="button" className="project-slideshow-nav prev" onClick={prev} aria-label="Previous image">
              ‹
            </button>
            <button type="button" className="project-slideshow-nav next" onClick={next} aria-label="Next image">
              ›
            </button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="project-slideshow-dots">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              className={`project-slideshow-dot ${i === index ? 'is-active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>
  )
}
