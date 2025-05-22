import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HandPlatter } from "lucide-react";
import React, { useState, useRef } from "react";

const Essentials = ({ essential }: { essential?: string }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const content = essential || "";
  const charLimit = 1500;
  const shouldTruncate = content.length > charLimit;
  const visibleContent = showFullContent
    ? content
    : content.slice(0, charLimit);

  const handleToggle = () => {
    // If collapsing content, scroll to top of content
    if (showFullContent && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setShowFullContent(!showFullContent);
  };

  return (
    <Card className="w-full border-none rounded-none">
      <Accordion
        type="single"
        collapsible
        defaultValue="policies"
        className="border-none"
      >
        <AccordionItem value="policies" className="border-none">
          <AccordionTrigger className="px-6 pt-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <HandPlatter
                color="blue"
                className="h-10 w-10 bg-blue-50 p-2 rounded-lg"
              />
              <span className="text-base font-bold">Service Provided</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="md:px-6 px-2 pb-6">
            <div className="w-full" ref={contentRef}>
              <article className="prose prose-slate prose-lead:text-secondary-foreground dark:prose-invert xl:prose-md w-full mx-auto max-w-4xl">
                <div
                  className="font-normal leading-7"
                  dangerouslySetInnerHTML={{ __html: visibleContent }}
                />
                {shouldTruncate && (
                  <button
                    onClick={handleToggle}
                    className="mt-4 text-blue-600 hover:underline px-2 flex items-center gap-1"
                  >
                    <span>{showFullContent ? "See less" : "See more"}</span>
                    {showFullContent ? (
                      <ChevronUp className="" />
                    ) : (
                      <ChevronDown className="mt-1" />
                    )}
                  </button>
                )}
              </article>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default Essentials;
