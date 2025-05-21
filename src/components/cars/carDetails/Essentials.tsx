import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { formatStaticPrice } from "@/lib/utils";
import { LandPlot } from "lucide-react";
import React from "react";

const Essentials = ({ essential }: { essential?: string }) => {
  return (
    <Card className="w-full border-none none rounded-none">
      <Accordion
        type="single"
        collapsible
        defaultValue="policies"
        className="border-none"
      >
        <AccordionItem value="policies" className="border-none">
          <AccordionTrigger className="px-6 pt-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LandPlot color="blue" className="h-5 w-5" />
              <span className="text-base font-bold">Service Provided</span>
            </div>
          </AccordionTrigger>

          <AccordionContent className="md:px-6 px-2 pb-6">
            <div className="w-full">
              <article className="prose prose-slate prose-lead:text-secondary-foreground dark:prose-invert xl:prose-md w-full mx-auto max-w-4xl">
                <div
                  className="font-normal leading-7"
                  dangerouslySetInnerHTML={{ __html: essential ?? "" }}
                />
              </article>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};

export default Essentials;
