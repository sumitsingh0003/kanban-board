// sections/CTA.tsx
"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Join thousands of teams already using KanBanBord AI
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/register"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center"
          >
            Start Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link
            href="/#contact"
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
          >
            Contact Sales
          </Link>
        </div>
        <p className="mt-4 text-sm text-blue-100">
          No credit card required • 14-day free trial
        </p>
      </div>
    </section>
  );
}