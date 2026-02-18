import React from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import features from '../../components/sections/Features'
import { Navigate, useNavigate } from 'react-router-dom'

function MaterialsHome() {
     const navigate = useNavigate();
  return (
    <div>
        <Header></Header>
        <section id="features" className="py-20 bg-white reveal">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-['Poppins'] font-bold text-gray-900 mb-4">
            Academic{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Overview
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience a revolutionary approach to learning with features
            designed to maximize your success
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
        </div>
      </div>
    </section>
        <Footer></Footer>
    </div>
  )
}

export default MaterialsHome