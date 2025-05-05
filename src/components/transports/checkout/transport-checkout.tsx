"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import PhoneInput from "react-phone-number-input";
import { format } from "date-fns";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar1Icon,
  CalendarIcon,
  Loader2,
  User,
  UserRoundCog,
} from "lucide-react";
import { TransparentNavbar } from "@/components/header/transparentNav/TransparentNav";
import ActivityPriceSummery from "@/components/activities/checkout/activity-price-summery";

import { formatPrice } from "@/lib/utils";
import { getErrorMessage } from "@/lib/handle-error";
import { bookingUpdateCart } from "@/lib/actions/booking-actions";
import { BookingTicketType } from "@/types/activity";
import Image from "next/image";
import SearchLocation from "@/components/filter/search-location";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = [
  "08:00 AM",
  "10:00 AM",
  "12:00 PM",
  "02:00 PM",
  "04:00 PM",
  "06:00 PM",
];

const FormSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters." }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phoneNumber: z
    .string()
    .min(8, { message: "Please enter a valid phone number." }),
  pickupLocation: z.number(),
  dropLocation: z.number().optional(),
  start_date: z.date(),
  end_date: z.date(),
  time_slot: z.string(),
});

type FormSchema = z.infer<typeof FormSchema>;

export default function TransportCheckoutFinal({
  bookingData,
}: {
  bookingData: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any[]>([]);

  const form = useForm<FormSchema>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      start_date: new Date(bookingData?.booking?.start_date),
      end_date: new Date(bookingData?.booking?.end_date),
    },
  });

  // Prepare ticket packages
  let packages: BookingTicketType[] = [];

  try {
    const ticketTypes = bookingData?.service?.ticket_types;
    if (typeof ticketTypes === "string") {
      const parsed = JSON.parse(ticketTypes);
      if (Array.isArray(parsed)) {
        packages = parsed.map((item) => ({
          ...item,
          price: parseFloat(item.price),
        }));
      }
    } else if (Array.isArray(ticketTypes)) {
      packages = ticketTypes.map((item) => ({
        ...item,
        price: parseFloat(item.price),
      }));
    }
  } catch (error) {
    console.error("Error parsing ticket types:", error);
  }

  const allPackages = packages;

  const updateQuantity = (
    item: BookingTicketType,
    quantity: number,
    fromCardClick = false
  ) => {
    const isFirst = item.name === allPackages[0].name;
    const newQty = fromCardClick ? (isFirst ? 3 : 1) : quantity;

    const data = {
      name: item.name,
      des: item?.des,
      min: isFirst ? 3 : 0,
      max: item.max,
      price: item.price,
      display_price: item.price.toString(),
      number: newQty,
    };

    const updated: any[] = [];

    if (newQty > 0) {
      updated.push(data); // শুধু নতুন সিলেক্ট করা প্যাকেজ রাখো
    }

    setSelectedPackage(updated);
  };

  const totalPrice = packages.length
    ? selectedPackage.reduce((acc, item) => acc + item.number * item.price, 0)
    : bookingData.booking.total;

  const isValid = packages.length ? !!selectedPackage.length : true;

  const onSubmit = async (formData: FormSchema) => {
    try {
      setIsLoading(true);

      const payload = {
        service_id: bookingData?.booking?.object_id,
        service_type: bookingData?.booking?.object_model,
        ticket_types: selectedPackage,
        ...formData,
        start_date: formData.start_date
          ? format(formData.start_date, "yyyy-MM-dd")
          : null,
        end_date: formData.start_date
          ? format(formData.start_date, "yyyy-MM-dd")
          : null,
      };

      const { data, error } = await bookingUpdateCart(
        payload,
        bookingData?.booking?.code
      );

      if (data?.booking_code) {
        router.push(`/booking/${data.booking_code}`);
      } else {
        toast.error(`Error: ${error}`);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white">
      <TransparentNavbar isBgWhite />

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[70%,1fr] gap-4 py-6 md:p-5">
          <div className="space-y-4">
            {/* Banner */}
            <div className="bg-cover bg-center bg-[url(/images/bradcomed-banner.png)] p-4 rounded-xl text-white">
              <h1 className="md:text-2xl font-bold">
                {bookingData?.service?.title}
              </h1>
              <h2 className="pt-1 md:text-md text-sm font-semibold">
                {dayjs(bookingData?.booking?.start_date).format("D MMMM YYYY")}{" "}
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Guest Packages */}
                {!!packages.length && (
                  <Card className="md:p-4 p-2 space-y-6">
                    <CardHeader className="pb-0">
                      <CardTitle className="flex items-center gap-2 md:text-xl">
                        <User className="h-5 w-5 text-blue-600" />
                        Packages
                      </CardTitle>
                    </CardHeader>

                    <CardContent>
                      <div className="hidden md:grid grid-cols-3 gap-4 text-sm text-gray-500 mb-2">
                        <div>TITLE</div>
                        <div className="text-right mr-8">QUANTITY</div>
                        <div className="text-right">PRICE</div>
                      </div>

                      <div className="space-y-4">
                        {packages.map((pkg, i) => {
                          const selected = selectedPackage.find(
                            (it) => it.name === pkg.name
                          );
                          const val = selected?.number || 0;

                          return (
                            <div
                              key={i}
                              onClick={() =>
                                updateQuantity(pkg, pkg.number, true)
                              }
                              className={`bg-white rounded-md border p-4 transition-all duration-200 cursor-pointer ${
                                selected
                                  ? "border-blue-500 shadow-sm"
                                  : "border-gray-300"
                              }`}
                            >
                              <div className="flex flex-row md:flex-row md:items-center md:justify-between justify-between  md:gap-4">
                                {/* Title & Description */}
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-12 relative hidden md:block">
                                    <Image
                                      src="/images/imageCar.png"
                                      alt={pkg.name}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="font-medium text-base md:text-lg">
                                      {pkg.name}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                      {pkg.des}
                                    </p>
                                  </div>
                                </div>

                                {/* Quantity Controls (only show if first item) */}
                                {i === 0 && (
                                  <div
                                    className={`  flex items-center md:justify-end gap-0 md:gap-4 ${
                                      val >= 3 ? `block` : `hidden`
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      disabled={val <= 3}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(pkg, val - 1);
                                      }}
                                      className="h-8 w-8 rounded-full border hover:bg-gray-100 flex items-center justify-center text-xl"
                                    >
                                      −
                                    </button>

                                    <input
                                      type="number"
                                      value={val}
                                      onChange={(e) => {
                                        const newVal = parseInt(e.target.value);
                                        if (!isNaN(newVal))
                                          updateQuantity(pkg, newVal);
                                      }}
                                      className="w-12 h-8 text-center border-0 bg-transparent focus:ring-0"
                                    />

                                    <button
                                      type="button"
                                      disabled={val >= pkg.max}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateQuantity(pkg, val + 1);
                                      }}
                                      className="h-8 w-8 rounded-full border hover:bg-gray-100 flex items-center justify-center text-xl"
                                    >
                                      +
                                    </button>
                                  </div>
                                )}

                                {/* Price */}
                                <div className="text-right text-base font-semibold text-gray-800 w-[70px] max-w-full">
                                  {formatPrice(pkg.price)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Info */}
                <Card className="p-4 md:p-8 space-y-6 rounded-2xl">
                  <CardHeader className="pb-0">
                    <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-gray-800">
                      <UserRoundCog className="h-5 w-5 text-blue-600" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
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
                    </div>
                    <div className="md:col-span-2">
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
                    </div>

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
                                  <Calendar1Icon className="mr-2 h-4 w-4" />
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
                                      form.setValue("end_date", val, {
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
                      name="time_slot"
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

                    {["firstName", "lastName", "email", "phoneNumber"].map(
                      (fieldName) => (
                        <FormField
                          key={fieldName}
                          control={form.control}
                          name={fieldName as keyof FormSchema}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm md:text-base text-gray-700 capitalize">
                                {fieldName.replace(/([A-Z])/g, " $1")}
                              </FormLabel>
                              <FormControl>
                                {fieldName === "phoneNumber" ? (
                                  <PhoneInput
                                    international
                                    defaultCountry="AE"
                                    value={
                                      typeof field.value === "string"
                                        ? field.value
                                        : ""
                                    }
                                    onChange={field.onChange}
                                    className="phone-input w-full"
                                  />
                                ) : (
                                  <Input
                                    type={
                                      fieldName === "email" ? "email" : "text"
                                    }
                                    placeholder={`Enter your ${fieldName}`}
                                    {...field}
                                    value={
                                      field.value instanceof Date
                                        ? field.value.toISOString()
                                        : field.value
                                    }
                                    className="w-full h-11 px-4 text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )
                    )}
                  </CardContent>
                </Card>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={!isValid || isLoading}
                    className="bg-primary text-white py-7 px-5 rounded-lg font-bold"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      "Next Page"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Price Summary */}
          <ActivityPriceSummery
            timeSlot={bookingData?.booking?.time_slot}
            title={bookingData?.service?.title}
            date={bookingData?.booking?.start_date}
            isLoading={isLoading}
            packages={packages}
            selectedPackage={selectedPackage}
            totalPrice={totalPrice}
            isValid={isValid}
            onSubmit={form.handleSubmit(onSubmit)}
          />
        </div>
      </main>
    </div>
  );
}
