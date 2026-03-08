// sections/Hero.tsx
"use client";

import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              Task Management for
              <br />
              Modern Teams
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-lg">
              Experience the future of project management with real-time collaboration, 
              AI-driven insights, and intuitive Kanban boards.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/register" 
                className="group bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition" />
              </Link>
              <button className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center gap-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">Tasks Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>

          {/* Right Content - Dashboard Preview */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {['To Do', 'In Progress', 'Done'].map((status) => (
                  <div key={status} className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-sm mb-2">{status}</h3>
                    <div className="space-y-2">
                      <div className="bg-white p-2 rounded shadow-sm text-xs">Task 1</div>
                      <div className="bg-white p-2 rounded shadow-sm text-xs">Task 2</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}