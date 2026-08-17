import './BlogCard.css'

export default function BlogCard({ post }) {
  return (
    <article className="blog-card card">
      <div className="blog-card-body">
        {post.category && <span className="blog-card-category">{post.category}</span>}
        <h3>
          <a href={post.file}>{post.title}</a>
        </h3>
        {post.summary && <p>{post.summary}</p>}
        <a href={post.file} className="blog-card-read-link">
          Read article →
        </a>
      </div>
    </article>
  )
}
