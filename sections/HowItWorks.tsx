// sections/HowItWorks.tsx
"use client";

import { UserPlus, Layout, Zap } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    title: "Create Account",
    description: "Sign up in seconds with your email or Google account"
  },
  {
    icon: <Layout className="w-8 h-8" />,
    title: "Set Up Board",
    description: "Create your first Kanban board and customize columns"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Start Collaborating",
    description: "Add tasks, invite team members, and boost productivity"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-gray-600">Get started in minutes, not hours</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-2/3 w-full h-0.5 bg-gray-200"></div>
              )}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full text-blue-600 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}