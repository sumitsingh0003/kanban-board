// sections/Testimonials.tsx
"use client";

import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Product Manager at TechCorp",
    content: "KanBanBord AI has transformed how our team manages projects. The AI suggestions are incredibly accurate.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    name: "Michael Chen",
    role: "Team Lead at StartupX",
    content: "Best Kanban tool I've ever used. The real-time collaboration is seamless and the interface is beautiful.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=2"
  },
  {
    name: "Emily Rodriguez",
    role: "Freelance Designer",
    content: "Perfect for managing multiple client projects. The time tracking feature is a game-changer.",
    rating: 5,
    image: "https://i.pravatar.cc/150?img=3"
  }
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Teams Worldwide</h2>
          <p className="mt-4 text-gray-600">See what our customers have to say</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}