"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle, ChevronRight, BookOpen, ShoppingCart, PlayCircle } from "lucide-react";
import { FLOATING_GUIDE_SECTIONS, FLOATING_GUIDE_CONFIG } from "@/lib/constants";

// Icon mapping for guide sections
const iconMap = {
  book: BookOpen,
  shopping_cart: ShoppingCart,
  play_circle: PlayCircle,
};

export function FloatingGuide() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Only show on landing page
  if (pathname !== FLOATING_GUIDE_CONFIG.showOnPage) return null;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="rounded-full w-14 h-14 shadow-2xl shadow-primary/40 p-0 flex items-center justify-center animate-bounce-subtle"
            onClick={() => setIsOpen(true)}
          >
            <HelpCircle className="w-7 h-7" />
          </Button>
        </DialogTrigger>
        <DialogContent className={`${FLOATING_GUIDE_CONFIG.dialogMaxWidth} bg-white/95 backdrop-blur-md border-slate-200`}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight">Student Guide</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium">
              New here? Here is how to get the most out of EduStream.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {FLOATING_GUIDE_SECTIONS.map((section, idx) => {
              const IconComponent = iconMap[section.icon];
              return (
                <div
                  key={idx}
                  className="bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {IconComponent && <IconComponent className="w-5 h-5 text-blue-500" />}
                    <h3 className="font-bold text-slate-900">{section.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {section.steps.map((step, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <ChevronRight className="w-3 h-3 text-primary" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center">
            <Button variant="outline" asChild className="rounded-full w-full">
              <a href="/guide" onClick={() => setIsOpen(false)}>
                View Full Guide
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
