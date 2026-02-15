import React from 'react';
import { Heart, Users, Globe, Award, Target, Zap, Shield, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About HippeKorea</h1>
          <p className="text-xl md:text-2xl text-purple-100">
            Connecting travelers with authentic Korean cultural experiences since 2024
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Mission Statement */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Target size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We believe the best way to understand Korean culture is through immersive, hands-on experiences. 
              From traditional tea ceremonies to exploring UNESCO World Heritage sites, we curate unique 
              experiences that go beyond typical tourist attractions.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our small group tours and workshops are led by passionate local experts who love sharing 
              Korean culture with visitors from around the world.
            </p>
          </div>
        </div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
              <Heart className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Passion</h3>
            <p className="text-gray-600 leading-relaxed">
              We're passionate about Korean culture and love sharing it with others. Every experience 
              is designed to be authentic, engaging, and memorable. Our enthusiasm is contagious!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
              <Users className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Small Groups</h3>
            <p className="text-gray-600 leading-relaxed">
              We keep our groups intimate (8-20 people) to ensure everyone gets a personalized 
              experience and plenty of opportunities to ask questions and interact.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-4">
              <Globe className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Local Experts</h3>
            <p className="text-gray-600 leading-relaxed">
              Our guides are Korean culture enthusiasts who know the hidden gems and can share 
              fascinating stories you won't find in guidebooks. They're locals, not just tour guides.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mb-4">
              <Award className="text-white" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Quality First</h3>
            <p className="text-gray-600 leading-relaxed">
              We carefully select each location and activity to ensure the highest quality. 
              Your satisfaction is our top priority, and we stand behind every experience.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl shadow-2xl p-8 md:p-12 mb-8 text-white">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">2,500+</div>
              <div className="text-purple-200">Happy Guests</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-purple-200">Unique Events</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4.9★</div>
              <div className="text-purple-200">Average Rating</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-purple-200">Authentic</div>
            </div>
          </div>
        </div>

        {/* What We Offer */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-purple-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Zap size={24} className="text-purple-500" />
                Cultural Workshops
              </h3>
              <p className="text-gray-600">
                Learn traditional Korean arts like calligraphy, tea ceremony, hanbok wearing, 
                and pottery from skilled artisans who've mastered their craft.
              </p>
            </div>
            
            <div className="border-l-4 border-pink-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Shield size={24} className="text-pink-500" />
                Heritage Tours
              </h3>
              <p className="text-gray-600">
                Explore palaces, temples, and UNESCO World Heritage sites with expert guides who 
                bring history to life with engaging stories and insights.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp size={24} className="text-orange-500" />
                Food Experiences
              </h3>
              <p className="text-gray-600">
                Discover Korean cuisine through market tours, cooking classes, and food tastings at 
                authentic local establishments frequented by Seoul residents.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-6 py-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <Users size={24} className="text-blue-500" />
                K-Drama Tours
              </h3>
              <p className="text-gray-600">
                Visit famous filming locations from your favorite K-dramas and learn about Korean 
                entertainment culture from industry insiders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
