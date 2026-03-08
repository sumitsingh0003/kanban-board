// sections/Features.tsx
"use client";

import { Zap, Users, BarChart, Shield, Clock, Brain } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-time Updates",
    description: "See changes instantly as your team collaborates on tasks"
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description: "Get smart suggestions for task prioritization and deadlines"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    description: "Assign tasks, leave comments, and mention team members"
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Advanced Analytics",
    description: "Track team performance and project progress"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Time Tracking",
    description: "Monitor time spent on tasks and improve efficiency"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Powerful Features for
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Modern Teams</span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Everything you need to manage projects effectively and boost team productivity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}