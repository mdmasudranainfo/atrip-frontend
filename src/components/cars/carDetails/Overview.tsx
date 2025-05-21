import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { LandPlot } from "lucide-react";
import CarFAQs from "@/components/cars/carDetails/CarFaq";
import Essentials from "@/components/cars/carDetails/Essentials";
import GreatChoice from "@/components/cars/carDetails/GreatChoice";
import Included from "@/components/cars/carDetails/Include";
import TermsAndC from "./TermsAndC";
import BestOption from "./Best_option";

const CarOverview = ({ carTabData }: any) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const content = carTabData?.content || "";
  const charLimit = 1500;

  const shouldTruncate = content.length > charLimit;
  const visibleContent = showFullContent
    ? content
    : content.slice(0, charLimit);

  return (
    <div>
      <Card className="w-full border-none rounded-none border -t">
        <Accordion type="single" collapsible defaultValue="policies">
          <AccordionItem value="policies" className="border-none">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <LandPlot color="blue" className="h-5 w-5" />
                <span className="text-base font-bold">Car Overview</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="md:px-6 px-2 pb-6">
              <div className="w-full">
                <article className="prose prose-slate prose-lead:text-secondary-foreground dark:prose-invert xl:prose-md w-full mx-auto max-w-4xl">
                  <div
                    className="font-normal leading-7"
                    dangerouslySetInnerHTML={{ __html: visibleContent }}
                  />
                  {shouldTruncate && (
                    <button
                      onClick={() => setShowFullContent(!showFullContent)}
                      className="mt-4 text-blue-600 hover:underline"
                    >
                      {showFullContent ? "See less" : "See more"}
                    </button>
                  )}
                </article>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>

      <div className="border-t">
        <Essentials essential={carTabData?.pre_pick_up} />
      </div>
      <div className="border-t">
        <GreatChoice greatChoice={carTabData?.great_choice} />
      </div>
      <div className="border-t">
        <Included include={carTabData?.include} />
      </div>
      <div className="border-t">
        <BestOption content={carTabData?.best_option} />
      </div>
      <div className="border-t">
        <TermsAndC content={carTabData?.term} />
      </div>
      <div className="border-t">
        <CarFAQs faqs={carTabData?.faqs} />
      </div>
    </div>
  );
};

export default CarOverview;
