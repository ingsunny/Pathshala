import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/redux/provider";
import AccessibilityControls from "@/components/AccessibilityControls";
import TutorChat from "@/components/TutorChat";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export const metadata = {
  title: "Northstar | Build skills that change what comes next",
  description:
    "Focused courses, clear explanations, meaningful assessments, and verified proof of progress.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${newsreader.variable} font-sans`}>
        <ReduxProvider>
          {children}
          <AccessibilityControls />
          <TutorChat />
        </ReduxProvider>
      </body>
    </html>
  );
}
