import { Ticket } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

export default function MyTickets({ myTicket }: any) {
  return (
    <div className="w-full bg-white border-t-2">
      <Accordion type="single" collapsible defaultValue="policies">
        <AccordionItem value="policies" className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <Ticket color="blue" className="h-5 w-5" />
              <p className="text-base font-bold">My Tickets</p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <CardContent className="space-y-6 text-base font-normal leading-6 text-dark">
              <div className="w-full">
                <div
                  className="text-base font-normal leading-7"
                  dangerouslySetInnerHTML={{ __html: myTicket }}
                />
              </div>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
