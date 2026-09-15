"use client";

import { EyeIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function AccessibilityControls() {
  const [theme, setTheme] = useState("light");
  const [contrast, setContrast] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("northstar-theme") || "light";
    const savedContrast = localStorage.getItem("northstar-contrast") === "true";
    // Restore the user preference after hydration; localStorage is browser-only.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(savedTheme);
    setContrast(savedContrast);
    document.documentElement.dataset.theme = savedTheme;
    document.documentElement.dataset.contrast = String(savedContrast);
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("northstar-theme", next);
    document.documentElement.dataset.theme = next;
  }

  function toggleContrast() {
    const next = !contrast;
    setContrast(next);
    localStorage.setItem("northstar-contrast", String(next));
    document.documentElement.dataset.contrast = String(next);
  }

  return (
    <div
      className="northstar-floating-tools fixed bottom-5 left-5 z-[70] flex rounded-full border border-[#cbd8d0] bg-white/95 p-1 shadow-lg backdrop-blur"
      aria-label="Display preferences"
    >
      <button
        onClick={toggleTheme}
        className="rounded-full p-2.5 text-[#26362e] hover:bg-[#eaf4ee]"
        aria-label={`Use ${theme === "light" ? "dark" : "light"} theme`}
      >
        {theme === "light" ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </button>
      <button
        onClick={toggleContrast}
        className={`rounded-full p-2.5 ${contrast ? "bg-[#15231c] text-white" : "text-[#26362e] hover:bg-[#eaf4ee]"}`}
        aria-label="Toggle high readability"
      >
        <EyeIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
