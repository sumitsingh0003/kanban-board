// sections/AppShowcase.tsx
"use client";

import {
  PhoneIphone as MobileIcon,
  TabletMac as TabletIcon,
  Computer as DesktopIcon,
  Sync as SyncIcon,
  Wifi as WifiIcon,
  BatteryFull as BatteryIcon
} from "@mui/icons-material";

export default function AppShowcase() {
  return (
    <section className="showcase-section-modern">
      <div className="showcase-container">
        <div className="showcase-content">
          <h2>Access Anywhere, Anytime</h2>
          <p>Seamless experience across all your devices</p>

          <div className="device-showcase">
            <div className="device-mockup desktop">
              <DesktopIcon />
              <span>Desktop</span>
            </div>
            <div className="device-mockup tablet">
              <TabletIcon />
              <span>Tablet</span>
            </div>
            <div className="device-mockup mobile">
              <MobileIcon />
              <span>Mobile</span>
            </div>
          </div>

          <div className="sync-status">
            <SyncIcon />
            <span>Real-time sync across all devices</span>
          </div>

          <div className="app-badges">
            <button className="app-store-badge">
              <svg viewBox="0 0 384 512" width="24" height="24">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-111.9-61.7-111.9z"/>
              </svg>
              <div className="badge-text">
                <small>Download on the</small>
                <strong>App Store</strong>
              </div>
            </button>

            <button className="play-store-badge">
              <svg viewBox="0 0 512 512" width="24" height="24">
                <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"/>
              </svg>
              <div className="badge-text">
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </div>
            </button>
          </div>

          <div className="offline-capability">
            <WifiIcon className="wifi-icon" />
            <BatteryIcon className="battery-icon" />
            <span>Works offline • Syncs when online</span>
          </div>
        </div>
      </div>
    </section>
  );
}