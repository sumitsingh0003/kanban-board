// sections/About.tsx
"use client";

import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Transforming How Teams Work
              <span className="block text-blue-600">Since 2024</span>
            </h2>
            <p className="text-gray-600 mb-6">
              KanBanBord AI was born from a simple idea: teams deserve better tools. 
              We've combined the simplicity of Kanban with the power of artificial 
              intelligence to create a task management solution that actually works.
            </p>
            
            <div className="space-y-4">
              {[
                "Trusted by 1000+ companies worldwide",
                "99.9% uptime guarantee",
                "24/7 customer support",
                "Regular feature updates"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600">500+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600">50K+</div>
              <div className="text-gray-600">Users</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600">150+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg text-center">
              <div className="text-3xl font-bold text-blue-600">4.9</div>
              <div className="text-gray-600">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}