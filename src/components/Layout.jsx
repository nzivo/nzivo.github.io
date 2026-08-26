import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import PageviewTracker from './PageviewTracker.jsx'

export default function Layout() {
  return (
    <>
      <ScrollToTop />
      <PageviewTracker />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
