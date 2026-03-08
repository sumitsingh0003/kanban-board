// sections/Pricing.tsx
"use client";

import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for individuals",
    features: [
      "Up to 3 boards",
      "Basic analytics",
      "24h support response",
      "2 team members"
    ]
  },
  {
    name: "Pro",
    price: "$12",
    period: "per user/month",
    description: "Best for growing teams",
    features: [
      "Unlimited boards",
      "Advanced analytics",
      "Priority support",
      "Unlimited members",
      "AI-powered insights",
      "Time tracking"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "SSO authentication",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee"
    ]
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-gray-600">Choose the plan that's right for you</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-8 ${
                plan.popular 
                  ? 'bg-blue-600 text-white shadow-xl scale-105' 
                  : 'bg-white border border-gray-200'
              }`}
            >
              {plan.popular && (
                <span className="bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mt-4">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className={plan.popular ? 'text-blue-100' : 'text-gray-600'}>
                    {' '}{plan.period}
                  </span>
                )}
              </div>
              <p className={`mt-2 ${plan.popular ? 'text-blue-100' : 'text-gray-600'}`}>
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.popular ? 'text-white' : 'text-blue-600'}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/register"
                className={`mt-8 block text-center py-3 px-6 rounded-lg transition ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}