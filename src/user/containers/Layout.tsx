import Header from "./Header";
import Footer from "./Footer"
import styles from "./Layout.module.scss"
import clsx from "clsx";

export const Layout = (props:any) => {
  return <section className={clsx(styles.Layout)}>
    <Header/>
    <main className={clsx(styles.Main)}>
      {props.children}
    </main>
    <Footer/>
  </section>
}