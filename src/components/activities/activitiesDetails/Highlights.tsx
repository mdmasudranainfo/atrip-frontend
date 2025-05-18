import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { AppWindowMac } from "lucide-react";
import CancelationPolicy from "@/components/activities/activitiesDetails/CancelationPolicy";
import Inclusions from "@/components/activities/activitiesDetails/Inclusions";
import MyTickets from "@/components/activities/activitiesDetails/MyTickets";
import OperatingHours from "@/components/activities/activitiesDetails/OperatingHours";
import ActivitiesMap from "@/components/activities/activitiesDetails/ActivitiesMap";
import NeedToKnow from "@/components/activities/activitiesDetails/NeedToKnow";
import TravelersAsking from "./TravelersAsking";
import FAQAccordion from "@/components/share/FAQAccordion";

const ActivitiesHighlights = ({ data }: { data: any }) => {
  return (
    <div>
      <div className="w-full bg-white -mt-2">
        <Accordion type="single" collapsible defaultValue="policies">
          <AccordionItem value="policies" className="border-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <AppWindowMac
                  color="blue"
                  className="h-10 w-10 bg-blue-50 p-2 rounded-lg"
                />
                <span className="text-lg leading-[26px] font-semibold">
                  Highlights
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 font-inter">
              <div className="w-full">
                <article className="prose prose-slate prose-lead:text-secondary-foreground dark:prose-invert xl:prose-md w-full mx-auto max-w-4xl">
                  <div
                    className="font-normal leading-7"
                    dangerouslySetInnerHTML={{ __html: data?.content }}
                  />
                </article>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="">
        <Inclusions content={data?.include} />
      </div>
      <div className="">
        <OperatingHours
          data={data?.operating_hours_title}
          operatingHours={data?.operating_hours}
        />
      </div>
      <div className="">
        <NeedToKnow NeedToKnowData={data?.need_to_know} />
      </div>
      <div className="">
        <CancelationPolicy cancelationPolicyData={data?.cancellation_policy} />
      </div>
      <div className="">
        <ActivitiesMap
          address={data?.address}
          lat={data?.map_lat}
          lng={data?.map_lng}
        />
      </div>
      <div className="">
        <MyTickets myTicket={data?.my_ticket} />
      </div>
      <div className="">
        <FAQAccordion faqs={data?.faqs} />
      </div>
    </div>
  );
};

export default ActivitiesHighlights;
