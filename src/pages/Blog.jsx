import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { blogPosts } from '../data/blog'
import BlogCard from '../components/BlogCard.jsx'
import './Blog.css'

const PER_PAGE = 9

export default function Blog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.max(1, Math.ceil(blogPosts.length / PER_PAGE))

  const requestedPage = parseInt(searchParams.get('page') || '1', 10) || 1
  const page = Math.min(Math.max(1, requestedPage), totalPages)

  const pagePosts = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return blogPosts.slice(start, start + PER_PAGE)
  }, [page])

  // Clamp out-of-range ?page values (e.g. ?page=99) back into the URL.
  useEffect(() => {
    if (requestedPage !== page) {
      setSearchParams(page === 1 ? {} : { page: String(page) })
    }
  }, [requestedPage, page, setSearchParams])

  function goToPage(p) {
    setSearchParams(p === 1 ? {} : { page: String(p) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="section blog-page">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Writing</span>
          <h1>Blog</h1>
          <p>Case studies, field research, and problem-solving write-ups. Each one opens as its own full read.</p>
        </div>

        <div className="blog-masonry">
          {pagePosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {totalPages > 1 && (
          <nav className="blog-pagination" aria-label="Blog pagination">
            <button
              type="button"
              className="blog-pagination-arrow"
              disabled={page === 1}
              onClick={() => goToPage(page - 1)}
            >
              ← Prev
            </button>

            <div className="blog-pagination-pages">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`blog-pagination-page ${p === page ? 'is-active' : ''}`}
                  aria-current={p === page ? 'page' : undefined}
                  onClick={() => goToPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="blog-pagination-arrow"
              disabled={page === totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
