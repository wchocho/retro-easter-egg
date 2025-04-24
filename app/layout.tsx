'use client';

import type React from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Smoke from './components/smoke';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { playSound, preloadSounds } from "@/lib/sound-manager";
import { Volume2, VolumeX } from "lucide-react";
import { SoundProvider, useSound } from "@/lib/SoundContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
      </head>
      <body>
        <SoundProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <TooltipProvider>
            <SoundToggleButton />
          </TooltipProvider>
          <Smoke />
        </SoundProvider>
      </body>
    </html>
  );
}

function SoundToggleButton() {
  const { soundEnabled, setSoundEnabled } = useSound();

  const handleSoundToggle = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    playSound("click", { enabled: newState });

    if (newState) {
      preloadSounds(true);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleSoundToggle}
          className="p-4 hover:bg-primary/20 text-green-500 rounded fixed bottom-4 right-4"
          aria-label={soundEnabled ? "Desactivar sonido" : "Activar sonido"}
        >
          {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{soundEnabled ? "Desactivar sonido" : "Activar sonido"}</p>
      </TooltipContent>
    </Tooltip>
  );
}