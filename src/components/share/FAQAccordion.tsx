"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "../ui/card";
import { LandPlot } from "lucide-react";

interface FAQItem {
  title: string;
  content: string;
}

export default function FAQAccordion({ faqs }: { faqs: string }) {
  const data = JSON.parse(faqs).map((item: FAQItem) => ({
    title: item.title.trim(),
    content: item.content.trim(),
  }));

  return (
    <div className="w-full bg-white border-t-2">
      <Accordion type="single" collapsible defaultValue="policies">
        <AccordionItem value="policies" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LandPlot color="blue" className="h-5 w-5" />
              <h3 className="text-base font-bold">
                Frequently Asked Questions
              </h3>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 border-none ">
            <Card className="w-full border-none bg-white shadow-none ">
              <CardContent className="shadow-none border-none ">
                <div className="w-full">
                  <section className="w-full px-4">
                    <Accordion type="single" collapsible className="space-y-4">
                      {data?.map((faq: FAQItem, index: number) => (
                        <AccordionItem
                          key={index}
                          value={`item-${index}`}
                          className="rounded-lg px-6"
                        >
                          <AccordionTrigger className="hover:no-underline py-4 text-base font-bold text-[#1A1A1A]">
                            {faq.title}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 pb-4">
                            {faq.content}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </section>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const FAQItem = <></>;

{
  /* <Card className="bg-white border-none border-t">
<section className="w-full px-4 py-16">
  <Accordion type="single" collapsible className="space-y-4">
    {data?.map((faq: FAQItem, index: number) => (
      <AccordionItem
        key={index}
        value={`item-${index}`}
        className="rounded-lg px-6"
      >
        <AccordionTrigger className="hover:no-underline py-4 text-base font-bold text-[#1A1A1A]">
          {faq.title}
        </AccordionTrigger>
        <AccordionContent className="text-gray-600 pb-4">
          {faq.content}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
</section>
</Card> */
}
