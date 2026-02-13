import 'boxicons/css/boxicons.min.css'
import React from 'react'

const Header = () => {
  //Simple function to toggel the mobile menu
  const toggleMobileMenu = () => {
      //Get the mobile element
      const mobileMenu = document.getElementById('mobileMenu')

      //If it hass the 'hidden' class,remove it. otherwise, add it
      if(mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden'); }
      else {
        mobileMenu.classList.add('hidden');
      }
  }





  return (
    <header className='flex justify-between items-center py-4 px-4 lg:px-20'>
        <h1 className="text-3xl md:text-4xl lg:text-5xl m-0"> <img className='h-20 w-40' src='preview.png' alt='Logo' /> </h1>
    <nav className='hidden md:flex items-center gap-12'>

      {/* Desktop Navigation */}
      <a href="#company" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> COMPANY</a>
      <a href="#services" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> SERVICES</a>
      <a href="#portfolio" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> PORTFOLIO</a>
      <a href="#contact" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> CONTACT</a>
    </nav>
    <button className="hidden md:block bg-[#a7a7a7] text-black py-3 px-8 rounded-full border-none font-medium transition-all duration-500 hover:bg-white cursor-pointer z-50">HIRE ME</button>
    {/* Mobile Menu Button */}
    <button onClick={toggleMobileMenu} className="lg:hidden md:hidden text-3xl p-2 z-50">
      <i class='bx bx-code'></i>
    </button>
    {/* Mobile Menu */}
    <div id="mobileMenu" className='hidden fixed top-16 bottom-0 right-0 left-0 p-5 md:hidden z-40 bg-black bg-opacity-70 backdrop-blur- md'>
      <nav className='flex flex-col gap-6 items-center '>

      {/* Desktop Navigation */}
      <a href="#company" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> COMPANY</a>
      <a href="#services" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> SERVICES</a>
      <a href="#portfolio" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> PORTFOLIO</a>
      <a href="#contact" className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"> CONTACT</a>
    </nav>
    </div>
    
    </header>
  )
}

export default Header
