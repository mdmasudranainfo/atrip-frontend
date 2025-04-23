"use client";

import { useState } from "react";
import { Loader2, CreditCard } from "lucide-react";
import { TransparentNavbar } from "@/components/header/transparentNav/TransparentNav";
import { Checkbox } from "@/components/ui/checkbox";
import VisaPriceSummery from "@/components/visa/checkout/price-summery";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "react-phone-number-input/style.css";
import { confirmBooking } from "@/lib/actions/booking-actions";
import { getErrorMessage } from "@/lib/handle-error";
import Link from "next/link";
import ActivityPriceSummery from "./activity-price-summery";
import dayjs from "dayjs";

// Luhn validation for card numbers
function isValidCreditCard(number: string): boolean {
  const digits = number.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let shouldDouble = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

const FormSchema = z.object({
  accepted: z
    .boolean({ message: "Please confirm terms and conditions" })
    .refine((val) => val, "Please confirm terms and conditions"),
  cardHolderName: z
    .string()
    .min(3, { message: "Name must be at least 3 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    }),
  cardNumber: z.string().refine((val) => isValidCreditCard(val), {
    message: "Invalid card number",
  }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
      message: "Expiry must be in MM/YY format",
    })
    .refine(
      (val) => {
        const [month, year] = val.split("/");
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        return expiry > new Date();
      },
      { message: "Card has expired" }
    ),
  cvcNumber: z.string().regex(/^[0-9]{3,4}$/, {
    message: "CVC must be 3 or 4 digits",
  }),
});

type FormSchema = z.infer<typeof FormSchema>;

export default function ActivityCheckoutFinal({
  bookingData,
}: {
  bookingData: any;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const packages = bookingData?.booking?.ticket_types || [];
  const selectedPackage: any[] = bookingData?.booking?.ticket_types || [];

  const totalPrice = packages?.length
    ? selectedPackage?.reduce((acc, item) => acc + item.number * item.price, 0)
    : bookingData.booking.total;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      accepted: false,
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvcNumber: "",
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        code: bookingData.booking.code,
        coupon_code: "",
        credit: 0,
        term_conditions: formData.accepted ? "on" : "off",
        payment_gateway: "offline_payment",
      };

      setIsLoading(true);
      const { data, error } = await confirmBooking(payload);
      if (error) {
        toast.error(`Error: ${getErrorMessage(error)}`);
      } else if (data) {
        window.location = data.url;
      } else {
        toast.error(`Unknown error occurred.`);
      }
    } catch (error) {
      toast.error(`Error: ${getErrorMessage(error)}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white">
      <TransparentNavbar isBgWhite={true} />
      <main className="container mx-auto px-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-[70%,1fr] gap-4 md:p-5 px-0 py-6 grid-cols-1">
              <div className="space-y-4">
                <div className="border rounded-xl p-4 h-content overflow-hidden bg-cover bg-center bg-[url(/images/bradcomed-banner.png)]">
                  <h1 className="md:text-2xl font-bold text-white">
                    {bookingData?.service?.title}
                  </h1>
                  <h2 className="pt-1 md:text-md text-sm font-semibold text-white">
                    {dayjs(bookingData?.booking?.start_date).format(
                      "D MMMM YYYY"
                    )}
                  </h2>
                </div>

                <div className="border p-4 rounded-md ">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold">Pay with Card</h2>
                  </div>

                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="cardHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Holder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mb-2">
                    <FormField
                      control={form.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                              {...field}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const formatted = val
                                  .replace(/(\d{4})/g, "$1 ")
                                  .trim();
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-2 grid-cols-1 ">
                    <FormField
                      control={form.control}
                      name="expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry (MM/YY)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="MM/YY"
                              maxLength={5}
                              {...field}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                const formatted =
                                  val.length <= 2
                                    ? val
                                    : `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                                field.onChange(formatted);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cvcNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CVC</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="123"
                              maxLength={4}
                              type="password"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="accepted"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-row items-start space-x-3 rounded-md border p-4 shadow">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              By proceeding, I acknowledge that I have read and
                              agree to the{" "}
                              <Link
                                href={"/terms-and-condition"}
                                target="_blank"
                                className="underline"
                              >
                                Terms and Conditions
                              </Link>{" "}
                              and{" "}
                              <Link
                                href={"/acceptable-use-policy"}
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

                  <div className="space-x-2 mt-2">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Book Now"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <ActivityPriceSummery
                title={bookingData?.service?.title}
                isLoading={isLoading}
                packages={packages}
                selectedPackage={selectedPackage}
                totalPrice={totalPrice}
                isValid={true}
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
}
