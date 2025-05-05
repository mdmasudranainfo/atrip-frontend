import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { LandPlot } from "lucide-react";
const BestOption = ({ content }: any) => {
  return (
    <Card className="w-full border-none none rounded-none">
      <Accordion type="single" collapsible defaultValue="policies">
        <AccordionItem value="policies" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LandPlot color="blue" className="h-5 w-5" />
              <span className="text-base font-bold">Best option for</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="space-y-3 border-none shadow-none">
              <div
                className="text-sm font-normal leading-7"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default BestOption;
