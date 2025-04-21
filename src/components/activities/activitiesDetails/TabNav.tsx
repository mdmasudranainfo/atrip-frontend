"use client";
import { ScrollBar } from "@/components/ui/scroll-area";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useEffect, useRef, useState } from "react";

export default function StickyTabs({ tabItems }: { tabItems: any }) {
  const stickyRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting);
      },
      { threshold: 1, rootMargin: "-1px 0px 0px 0px" }
    );

    if (stickyRef.current) {
      observer.observe(stickyRef.current);
    }

    return () => {
      if (stickyRef.current) {
        observer.unobserve(stickyRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Hidden Spacer */}
      <div ref={stickyRef} className="h-1" />

      {/* Sticky Tabs */}
      {isSticky && (
        <div className="sticky top-0 z-50 bg-white">
          <ScrollArea
            className="w-full"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <TabsList className="h-auto py-2.5 bg-white w-full flex-nowrap flex overflow-x-auto shadow-md border-b border-gray-200 justify-start [&::-webkit-scrollbar]:hidden">
              {tabItems.map((tab: any) => (
                <TabsTrigger
                  key={tab?.value}
                  value={tab?.value}
                  className="group px-3 py-1.5 text-sm font-medium text-gray-600 
                whitespace-nowrap
                data-[state=active]:text-blue-600 
                data-[state=active]:border-b-2 data-[state=active]:border-blue-600 
                hover:text-blue-600 rounded-none transition-all duration-200"
                >
                  <span className="text-sm">{tab?.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <ScrollBar orientation="horizontal" className="visible" />
          </ScrollArea>
        </div>
      )}
    </>
  );
}
