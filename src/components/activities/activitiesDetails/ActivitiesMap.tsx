import MapIframe from "@/components/map/map-iframe";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { console } from "inspector";
import { LandPlot } from "lucide-react";

export default function ActivitiesMap({
  address,
  lat,
  lng,
}: {
  address: string;
  lat: string;
  lng: string;
}) {
  console.log("address", address);
  if (!lat || !lng) return;

  return (
    <Card className="w-full border-none">
      <Accordion type="single" collapsible defaultValue="policies">
        <AccordionItem value="policies" className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <div className="flex items-center gap-2">
              <LandPlot color="blue" className="h-5 w-5" />
              <span className="text-base font-bold">Location Map</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            {address}
            <MapIframe lat={lat} lng={lng} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
