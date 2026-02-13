import Header from "./components/Header";
import Hero from "./components/hero"

export default function App() {
  return (
    <main className="relative overscroll-none">
      <img className="absolute top-0 right-0 opacity-60 -z-1" src="gradient.png" alt="gradient" />
      {/* Blur Effect */}
      <div className="h-0 w-[40rem] absolute top-[-20%] right-[-5%] -rotate-[30deg] -z-10 pointer-events-none" style={{ boxShadow: '0 0 900px 20px rgba(233, 155, 99, 0.8)' }}></div>
      <Header/>
      <Hero/>
    </main>
  )
}