import { ArrowDownWideNarrow } from "lucide-react";
import type React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function NeedToKnow({ NeedToKnowData }: any) {
  return (
    <div className="w-full border-none bg-white">
      <Accordion type="single" collapsible defaultValue="policies">
        <AccordionItem value="policies" className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <ArrowDownWideNarrow className="h-5 w-5" />
              <span className="text-base font-bold">Need to know</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="w-full">
              {NeedToKnowData ? (
                <div
                  className="text-base font-normal leading-7"
                  dangerouslySetInnerHTML={{ __html: NeedToKnowData }}
                />
              ) : (
                <p className="text-gray-500">No information available.</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
