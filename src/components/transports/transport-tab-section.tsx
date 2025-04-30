"use client";
import CarFAQs from "@/components/cars/carDetails/CarFaq";
import Essentials from "@/components/cars/carDetails/Essentials";
import GreatChoice from "@/components/cars/carDetails/GreatChoice";
import Included from "@/components/cars/carDetails/Include";
import CarOverview from "@/components/cars/carDetails/Overview";
import TripExtras from "@/components/cars/carDetails/TripExtras";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookCheck,
  Hotel,
  ShieldQuestion,
  SlidersHorizontal,
  SquarePlus,
  LandPlot,
  CalendarIcon,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { HiOutlineSpeakerphone } from "react-icons/hi";
import { Location } from "@/lib/actions/location-action";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { CountryDropdown } from "@/components/ui/country-dropdown";
import SearchLocation from "@/components/filter/search-location";
import { useSearchParams } from "next/navigation";
import { formatPrice, getSellPrice, parseUrlStrDate } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { format } from "date-fns";
import { bookingAddToCart } from "@/lib/actions/booking-actions";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/handle-error";
import { toast } from "sonner";
import StickyTabs from "../activities/activitiesDetails/TabNav";
import TermsAndC from "../cars/carDetails/TermsAndC";

const formSchema = z.object({
  pickupLocation: z.number({ message: "Select pickup location" }),
  returnLocation: z.number({ message: "Select return location" }),
  start_date: z.date(),
  end_date: z.date(),
});

type FormSchema = z.infer<typeof formSchema>;

export default function TransportTabSection({
  selectedLocations,
  car,
}: {
  selectedLocations: Location[];
  car: any;
}) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const sellPrice = getSellPrice(car.price, car.sale_price);
  const [selectedPackage, setSelectedPackage] = useState<any[]>([]);

  const extraPrice =
    selectedPackage?.reduce((acc, item) => acc + item.price * item.number, 0) ||
    0;

  const _sDate = searchParams.get("start");
  const _eDate = searchParams.get("end");
  const location_id = searchParams.get("location_id");

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // fullName: "",
      // email: "",
      // phoneNumber: "",
      // driverAge: "30-50",
      // licenseCountry: "AE",
      // flightNumber: "",

      pickupLocation: location_id ? Number(location_id) : undefined,
      returnLocation: location_id ? Number(location_id) : undefined,

      start_date: (_sDate ? parseUrlStrDate(_sDate) : undefined) || undefined,
      end_date: (_eDate ? parseUrlStrDate(_sDate) : undefined) || undefined,
    },
  });

  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabItems = [
    { value: "overview", label: "Car Highlights" },
    { value: "essentials", label: "Service Provided" }, //essentials
    { value: "choice", label: "Great choice for" },
    { value: "include", label: "Inclusions" },
    { value: "Best_option_for", label: "Best option for" },
    { value: "term", label: "Terms and conditions" }, // Best option for ->
    { value: "t&c", label: "Travelers Asking" },
  ];

  async function onSubmit(formData: FormSchema) {
    try {
      setIsLoading(true);
      const payload = {
        service_id: car.id,
        service_type: "transport",
        step: 0,
        guests: 1,
        number: 1,
        ...formData,
        start_date: formData.start_date
          ? format(formData.start_date, "yyyy-MM-dd")
          : null,
        end_date: formData.end_date
          ? format(formData.end_date, "yyyy-MM-dd")
          : null,
        extra_price: selectedPackage || [],
      };

      const { data, error } = await bookingAddToCart(payload);
      if (data?.booking_code) {
        router.push(`/booking/${data?.booking_code}`);
      } else {
        toast.error(`Error: ${error}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex gap-8 w-full my-6 lg:flex-row flex-col-reverse">
      <div className="lg:w-[70%] w-full rounded-lg">
        <div className="w-full rounded-lg">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <StickyTabs tabItems={tabItems} />
            <ScrollArea className="w-full">
              <TabsContent value="overview" className="border-none mt-0">
                <CarOverview carTabData={car} />
              </TabsContent>
              <TabsContent value="choice" className="border-none">
                <GreatChoice greatChoice={car?.great_choice} />
              </TabsContent>
              <TabsContent value="include" className="border-none">
                <Included include={car?.include} />
              </TabsContent>
              <TabsContent value="essentials" className="border-none">
                <Essentials essential={car?.pre_pick_up} />
              </TabsContent>
              <TabsContent value="term" className="border-none space-y-2">
                <TermsAndC content={car?.term} />
              </TabsContent>
              <TabsContent value="t&c" className="border-none">
                <CarFAQs faqs={car?.faqs} />
              </TabsContent>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </Tabs>
        </div>
      </div>
      <div className="flex-1 lg:max-w-md w-full mx-auto">
        <Card className="w-full  xl:max-w-md mx-auto shadow-none ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{car.title}</h2>
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">
                      {formatPrice(sellPrice)}
                    </p>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Pick-Up Location
                      </FormLabel>
                      <FormControl>
                        <SearchLocation
                          error={undefined}
                          locationId={field.value}
                          placeholder="Select location"
                          initialLocations={selectedLocations || []}
                          onChangeValue={field.onChange}
                          inputSize={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="returnLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">
                        Return Location
                      </FormLabel>
                      <FormControl>
                        <SearchLocation
                          error={undefined}
                          locationId={field.value}
                          placeholder="Select location"
                          initialLocations={selectedLocations || []}
                          onChangeValue={field.onChange}
                          inputSize={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Pick-up Date</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(val) => {
                                if (val) {
                                  field.onChange(val);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Return Time</FormLabel>
                      <FormControl>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(val) => {
                                if (val) {
                                  field.onChange(val);
                                }
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Location and Date Selection */}
                <div className="space-y-4">
                  <div className="pb-4 border-b border-b-[#dadfe6] flex justify-between items-center">
                    <span className="font-medium text-[#1a1a1a] text-sm">
                      Protection & Extra
                    </span>
                    <span className="font-medium text-[#1a1a1a] text-sm">
                      {formatPrice(extraPrice)}
                    </span>
                  </div>
                </div>

                {/* Collapsible Sections */}
                <div className="space-y-2">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full justify-between items-center">
                      <span className="font-medium">Deposit</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <p className="text-sm text-gray-600">
                        Deposit details here
                      </p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full justify-between items-center">
                      <span className="font-medium">Fuel Policy</span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <p className="text-sm text-gray-600">
                        Fuel policy details here
                      </p>
                    </CollapsibleContent>
                  </Collapsible>

                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full justify-between items-center">
                      <span className="font-medium">
                        Modification cancelation refund policy
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-2">
                      <p className="text-sm text-gray-600">
                        Cancellation policy details here
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Book Now Button */}
                <Button
                  disabled={isLoading}
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Reserve"
                  )}
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
