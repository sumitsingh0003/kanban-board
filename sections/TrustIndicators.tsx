// sections/TrustIndicators.tsx
"use client";

import { 
  Security as ShieldIcon,
  Verified as AwardIcon,
  Lock as LockIcon,
  Storage as ServerIcon 
} from "@mui/icons-material";

export default function TrustIndicators() {
  const badges = [
    { icon: ShieldIcon, text: "GDPR Compliant" },
    { icon: AwardIcon, text: "ISO 27001 Certified" },
    { icon: LockIcon, text: "256-bit Encryption" },
    { icon: ServerIcon, text: "99.9% Uptime SLA" }
  ];

  return (
    <section className="trust-section">
      <div className="trust-grid">
        {badges.map((Badge, index) => {
          const IconComponent = Badge.icon;
          return (
            <div key={index} className="trust-item">
              <div className="trust-icon">
                <IconComponent />
              </div>
              <p className="trust-text">{Badge.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}