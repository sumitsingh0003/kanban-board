// sections/TrustBadges.tsx
"use client";

import { Shield, Award, Lock, Server } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    { icon: <Shield className="w-8 h-8" />, text: "GDPR Compliant" },
    { icon: <Award className="w-8 h-8" />, text: "ISO 27001 Certified" },
    { icon: <Lock className="w-8 h-8" />, text: "256-bit Encryption" },
    { icon: <Server className="w-8 h-8" />, text: "99.9% Uptime SLA" }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-3 text-blue-600">
                {badge.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{badge.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}