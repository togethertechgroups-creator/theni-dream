import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  title: "Theni Dream Photography - Capturing Your Beautiful Moments",
  description: "Theni Dream Photography offers professional wedding, candid, maternity, baby, and event photography services. Capturing milestones with premium cinematic and traditional styles in Tamil Nadu.",
  keywords: "photography, theni, wedding photography, candid photography, maternity shoot, baby shoot, drone coverage, cinematic video, event photography",
  authors: [{ name: "Theni Dream Photography" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SmoothScrollProvider>
          <div className="main-wrapper">
            <Navbar />
            <main className="content-container">{children}</main>
            <Footer />
          </div>
        </SmoothScrollProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}

