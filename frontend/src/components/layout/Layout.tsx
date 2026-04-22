import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import styles from './Layout.module.css'

export function Layout() {
  return (
    <>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
