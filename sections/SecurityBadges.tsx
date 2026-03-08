// sections/SecurityBadges.tsx
"use client";

import {
  Security as SecurityIcon,
  VerifiedUser as VerifiedIcon,
  Lock as LockIcon,
  Fingerprint as FingerprintIcon,
  Badge as BadgeIcon,
  GppGood as GppIcon
} from "@mui/icons-material";

export default function SecurityBadges() {
  const badges = [
    { icon: SecurityIcon, text: "256-bit Encryption", color: "#2563eb" },
    { icon: VerifiedIcon, text: "SOC 2 Type II", color: "#16a34a" },
    { icon: LockIcon, text: "GDPR Compliant", color: "#9333ea" },
    { icon: FingerprintIcon, text: "Biometric Auth", color: "#dc2626" },
    { icon: BadgeIcon, text: "ISO 27001", color: "#ea580c" },
    { icon: GppIcon, text: "Zero Trust", color: "#0891b2" }
  ];

  return (
    <section className="security-section">
      <div className="security-header">
        <h2>Enterprise-Grade Security</h2>
        <p>Your data is protected with bank-level encryption</p>
      </div>

      <div className="security-grid">
        {badges.map((Badge, index) => {
          const IconComponent = Badge.icon;
          return (
            <div key={index} className="security-card">
              <div className="security-icon-wrapper" style={{ background: `${Badge.color}15` }}>
                <IconComponent style={{ color: Badge.color }} />
              </div>
              <span className="security-text">{Badge.text}</span>
            </div>
          );
        })}
      </div>

      <div className="security-footer">
        <div className="certificate-badge">
          <span className="cert-icon">✓</span>
          <span>ISO 27001:2024 Certified</span>
        </div>
        <div className="certificate-badge">
          <span className="cert-icon">🔒</span>
          <span>GDPR & CCPA Compliant</span>
        </div>
      </div>
    </section>
  );
}