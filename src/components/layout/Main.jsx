import Footer from "./Footer";
import Header from "./Header";

export default function Main({ className, children }) {

  return (
    <>
      <Header />
      <main className={className}>
        {children}
      </main>
      <Footer />
    </>
  )

}