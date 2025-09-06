import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/sections/Features'
import Footer from '../components/Footer'
import Pricing from '../components/sections/Pricing'
import Testimonials from '../components/sections/Testimonials'

export default function Landing(){
  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Pricing/>
      <Testimonials/>
      <Footer />
    </div>
  )
}