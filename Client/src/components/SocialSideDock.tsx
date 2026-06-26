import React, { useState } from "react";
import { Youtube, Facebook, Instagram, Accessibility, EyeOff, Sparkles, AlertTriangle } from "lucide-react";

interface SocialSideDockProps {
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textSize: "normal" | "large" | "extra-large";
  setTextSize: (size: "normal" | "large" | "extra-large") => void;
}

export default function SocialSideDock({
  highContrast,
  setHighContrast,
  textSize,
  setTextSize,
}: SocialSideDockProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleTwitterClick = () => {
    window.open("https://x.com/MinistryWCD", "_blank");
  };

  const handleFacebookClick = () => {
    window.open("https://www.facebook.com/ministrywcd/", "_blank");
  };

  const handleInstagramClick = () => {
    window.open("https://www.instagram.com/ministrywcd/", "_blank");
  };

  const handleYoutubeClick = () => {
    window.open("https://www.youtube.com/user/mwdindia", "_blank");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-stone-900 text-white p-2 rounded-l-md shadow-lg flex items-center justify-center hover:bg-stone-850"
        title="Open Social Dock"
      >
        <span className="text-[10px] uppercase font-extrabold tracking-widest [writing-mode:vertical-lr] rotate-180">
          SOCIALS 📁
        </span>
      </button>
    );
  }

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end shadow-xl rounded-l-lg overflow-hidden select-none" id="social-side-dock">
      
      {/* Black Collapse Close button precisely matching image */}
      <button
        onClick={() => setIsOpen(false)}
        className="w-10 h-10 bg-black text-white hover:bg-gray-900 flex items-center justify-center transition-all cursor-pointer border-b border-white/10"
        title="Collapse social dock"
      >
        <span className="text-[13px] font-black font-mono">✕</span>
      </button>

      {/* Twitter/X icon (blue or dark gray as requested in image) */}
      <button
        onClick={handleTwitterClick}
        className="w-10 h-10 bg-[#1DA1F2] hover:bg-[#1a91da] text-white flex items-center justify-center transition-all cursor-pointer"
        title="Follow Ministry of WCD on X (Twitter)"
      >
        {/* Custom SVG for X / Twitter */}
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </button>

      {/* Facebook item matching image */}
      <button
        onClick={handleFacebookClick}
        className="w-10 h-10 bg-[#3b5998] hover:bg-[#344e86] text-white flex items-center justify-center transition-all cursor-pointer"
        title="Visit Facebook Page"
      >
        <Facebook className="w-5 h-5 fill-white stroke-none" />
      </button>

      {/* Instagram (deep neon pink coordinates in image) */}
      <button
        onClick={handleInstagramClick}
        className="w-10 h-10 bg-linear-to-tr from-yellow-500 via-red-500 to-purple-600 hover:opacity-95 text-white flex items-center justify-center transition-all cursor-pointer"
        title="Visit Instagram Profile"
      >
        <Instagram className="w-5 h-5 stroke-[2.5px]" />
      </button>

      {/* YouTube element strictly matching */}
      <button
        onClick={handleYoutubeClick}
        className="w-10 h-10 bg-[#cd201f] hover:bg-[#b51c1b] text-white flex items-center justify-center transition-all cursor-pointer"
        title="Watch Youtube Channel"
      >
        <Youtube className="w-5 h-5 fill-white stroke-none" />
      </button>

      {/* Accessibility Option item styled pink/magenta color like shown in image */}
      <button
        onClick={() => {
          setHighContrast(!highContrast);
        }}
        className="w-10 h-10 bg-[#9c27b0] hover:bg-[#8e24aa] text-white flex items-center justify-center transition-all cursor-pointer"
        title="Accessibility Settings Toggle"
      >
        <Accessibility className="w-5 h-5" />
      </button>
    </div>
  );
}
