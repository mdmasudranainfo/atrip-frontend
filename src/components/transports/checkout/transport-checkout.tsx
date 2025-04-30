"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import dayjs from "dayjs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserRoundCog, Calendar as CalendarIcon } from "lucide-react";

import { TransparentNavbar } from "@/components/header/transparentNav/TransparentNav";
// Ensure correct path
import CarPriceSummery from "@/components/cars/checkout/car-price-summery";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  confirmBooking,
  bookingUpdateCart,
} from "@/lib/actions/booking-actions";
import { getErrorMessage } from "@/lib/handle-error";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { format } from "date-fns";
import SearchLocation from "@/components/filter/search-location";

const timeSlots = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

const FormSchema = z.object({
  travelerName: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z
    .string()
    .min(8, { message: "Please enter a valid phone number." }),
  accepted: z.literal(true, {
    errorMap: () => ({ message: "Please confirm terms and conditions" }),
  }),
  pickupLocation: z
    .number()
    .min(1, { message: "Pick-up location is required." })
    .optional(),
  dropLocation: z.number().optional(),
  start_date: z.date({ required_error: "Pickup date is required" }),
  end_date: z.date({ required_error: "Pickup date is required" }),
  start_time: z.string().min(1, { message: "Pickup time is required" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function TransportCheckoutFinal({
  bookingData,
}: {
  bookingData: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      travelerName: "",
      email: "",
      phoneNumber: "",
      accepted: true,
      // pickupLocation: "",
      // dropLocation: "",
      start_date: bookingData?.booking?.start_date
        ? new Date(bookingData.booking.start_date)
        : new Date(),
      end_date: bookingData?.booking?.end_date
        ? new Date(bookingData.booking.end_date)
        : new Date(),
      start_time: "",
    },
  });

  async function onFinalSubmit() {
    try {
      const payload = {
        code: bookingData.booking.code,
        coupon_code: "",
        credit: 0,
        term_conditions: "on",
        payment_gateway: "stripe",
        time_slot: form.getValues("start_time"),
      };
      // console.log("payload", payload);
      // return;
      const { data, error } = await confirmBooking(payload);
      if (error) {
        toast.error(`Error: ${getErrorMessage(error)}`);
      } else if (data) {
        window.location.href = data.url;
      } else {
        toast.error(`Error: ${error}`);
        setIsLoading(false);
      }
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function onSubmit(formData: FormSchemaType) {
    try {
      setIsLoading(true);
      const payload = {
        service_id: bookingData?.booking?.object_id,
        service_type: bookingData?.booking?.object_model,
        ...formData,
      };

      const { data, error } = await bookingUpdateCart(
        payload,
        bookingData?.booking?.code
      );

      if (data?.booking_code) {
        await onFinalSubmit();
      } else {
        setIsLoading(false);
        toast.error(`Error: ${error}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <TransparentNavbar isBgWhite={true} />

      <main className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[70%,1fr] gap-4 md:p-5 px-0 py-6 grid-cols-1">
          <div className="space-y-4">
            <div className="border rounded-xl p-4 bg-cover bg-center bg-[url(/images/bradcomed-banner.png)]">
              <h1 className="md:text-2xl font-bold text-white">
                {bookingData?.service?.title}
              </h1>
              <h2 className="pt-1 md:text-md text-sm font-semibold text-white">
                {dayjs(bookingData?.booking?.start_date).format("D MMMM YYYY")}
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <Card className="p-4 space-y-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <UserRoundCog className="h-5 w-5 text-blue-600" />
                      <h2 className="text-xl">Travelers Information</h2>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
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
                              locationId={Number(field.value)}
                              placeholder="Select location"
                              inputSize={2}
                              onChangeValue={field.onChange}
                              initialLocations={[]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dropLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Drop Off Location
                          </FormLabel>
                          <FormDescription className="text-xs mt-0">
                            Optional, Required for one way transfer only
                          </FormDescription>
                          <FormControl>
                            <SearchLocation
                              locationId={
                                field.value ? Number(field.value) : undefined
                              }
                              placeholder="Select location"
                              inputSize={2}
                              onChangeValue={field.onChange}
                              initialLocations={[]}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-3 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Pickup Date
                            </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value
                                      ? format(field.value, "yyyy-MM-dd")
                                      : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(val) => {
                                      if (val) {
                                        form.setValue("start_date", val, {
                                          shouldValidate: true,
                                        });
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
                            <FormLabel className="text-base">
                              Return Date
                            </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value
                                      ? format(field.value, "yyyy-MM-dd")
                                      : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(val) => {
                                      if (val) {
                                        form.setValue("start_date", val, {
                                          shouldValidate: true,
                                        });
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
                        name="start_time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">
                              Pickup Time
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Time Slot" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="travelerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">
                            Mobile Number
                          </FormLabel>
                          <FormControl>
                            <PhoneInput
                              value={field.value}
                              onChange={field.onChange}
                              international
                              defaultCountry="AE"
                              className="flex-1 border-[#ddd] border rounded-md px-3 py-2 text-base"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Email</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your email address"
                              type="email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <FormField
                  control={form.control}
                  name="accepted"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-start space-x-3 border p-4 shadow rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="leading-tight text-sm">
                          <FormLabel>
                            By proceeding, I acknowledge that I have read and
                            agree to the{" "}
                            <Link
                              href="/terms-and-condition"
                              target="_blank"
                              className="underline"
                            >
                              Terms and Conditions
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/acceptable-use-policy"
                              target="_blank"
                              className="underline"
                            >
                              Privacy Policy
                            </Link>
                          </FormLabel>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-primary text-white py-7 px-5 rounded-lg mb-4 font-bold"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Next Page"
                  )}
                </Button>
              </form>
            </Form>
          </div>

          <CarPriceSummery
            isLoading={isLoading}
            bookingData={bookingData}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}
