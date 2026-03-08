// sections/UserTestimonials.tsx
"use client";

import { 
  Star as StarIcon,
  FormatQuote as QuoteIcon 
} from "@mui/icons-material";

export default function UserTestimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Product Manager at TechCorp",
      content: "KanBanBord AI has transformed how our team manages projects. The AI suggestions are incredibly accurate.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Team Lead at StartupX",
      content: "Best Kanban tool I've ever used. The real-time collaboration is seamless.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      content: "Perfect for managing multiple client projects. The time tracking feature is a game-changer.",
      rating: 5,
      avatar: "ER"
    }
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-header">
        <h2>Loved by Teams Worldwide</h2>
        <p>See what our customers have to say</p>
      </div>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <QuoteIcon className="quote-icon" />
            
            <div className="testimonial-header">
              <div className="testimonial-avatar">
                {testimonial.avatar}
              </div>
              <div className="testimonial-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>

            <div className="testimonial-rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <StarIcon key={i} className="star-filled" />
              ))}
            </div>

            <p className="testimonial-content">{testimonial.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}