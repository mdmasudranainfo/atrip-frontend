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
import BookingAttraction from "../layouts/booking-attraction";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Calendar2 } from "../ui/calendar2";
import BestOption from "../cars/carDetails/Best_option";
import DatePickerModal from "../dataPiker/DatePickerModal";

const formSchema = z.object({
  // pickupLocation: z.number({ message: "Select pickup location" }),
  // returnLocation: z.number({ message: "Select return location" }),
  start_date: z.date(),
  // end_date: z.date(),
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

      // pickupLocation: location_id ? Number(location_id) : undefined,
      // returnLocation: location_id ? Number(location_id) : undefined,

      start_date: (_sDate ? parseUrlStrDate(_sDate) : undefined) || undefined,
      // end_date: (_eDate ? parseUrlStrDate(_sDate) : undefined) || undefined,
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
        end_date: formData.start_date
          ? format(formData.start_date, "yyyy-MM-dd")
          : null,
        // extra_price: selectedPackage || [],
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

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
              <TabsContent value="essentials" className="border-none">
                <Essentials essential={car?.pre_pick_up} />
              </TabsContent>

              {/* Provided */}
              <TabsContent value="choice" className="border-none">
                <GreatChoice greatChoice={car?.great_choice} />
              </TabsContent>
              <TabsContent value="include" className="border-none">
                <Included include={car?.include} />
              </TabsContent>
              <TabsContent value="Best_option_for" className="border-none">
                <BestOption content={car?.best_option} />
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
      <div className="md:block hidden flex-1 lg:max-w-md w-full mx-auto">
        <div className=" sticky top-0">
          <Card className="w-full  xl:max-w-md mx-auto shadow-none  ">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="p-6 space-y-4">
                  {/* Header */}
                  <div className="">
                    {/* <h2 className="text-xl font-semibold">{car.title}</h2> */}
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium">
                        {formatPrice(sellPrice)} /{" "}
                        <span className="text-sm text-primary">Par Hour</span>
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        {/* <FormLabel className="text-base">Pick-up Date</FormLabel> */}
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setCalendarOpen(true)} // open modal instead
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
                            {/* <PopoverContent className="w-auto p-0" align="start">
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
                          </PopoverContent> */}
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Book Now Button */}
                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Check Availability"
                    )}
                  </Button>
                </CardContent>
              </form>
            </Form>
          </Card>

          <BookingAttraction />
        </div>
      </div>

      {/* Mobile Responsive design  */}
      {/* button */}
      <div className="fixed flex justify-between items-center bottom-0 left-0 right-0 bg-white p-2 lg:hidden">
        <p className="text-lg font-medium">
          {formatPrice(sellPrice)} /{" "}
          <span className="text-sm text-primary">Par Hour</span>
        </p>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
          type="button" // important to prevent form submit
          className="h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Check Availability"
          )}
        </Button>
      </div>

      {/* modal */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg">
            <div className="flex justify-end items-center p-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <CardContent className="p-6 pt-0 space-y-4">
              {/* Reuse the same form here */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <>
                            <Button
                              variant="outline"
                              onClick={() => setCalendarOpen(true)}
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "yyyy-MM-dd")
                              ) : (
                                <span>Select date</span>
                              )}
                            </Button>

                            <DatePickerModal
                              open={calendarOpen}
                              onOpenChange={setCalendarOpen}
                              value={field.value}
                              onSelect={(val) => {
                                form.setValue("start_date", val, {
                                  shouldValidate: true,
                                });
                              }}
                            />
                          </>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full h-11 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Check Availability"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </div>
        </div>
      )}

      <Dialog open={calendarOpen} onOpenChange={setCalendarOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Select a Date</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center">
            <Calendar2
              mode="single"
              selected={form.watch("start_date")}
              onSelect={(val: any) => {
                if (val) {
                  form.setValue("start_date", val, { shouldValidate: true });
                  setCalendarOpen(false);
                }
              }}
              initialFocus
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
