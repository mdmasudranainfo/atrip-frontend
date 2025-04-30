import { TransparentNavbar } from "@/components/header/transparentNav/TransparentNav";
import { ImageGallery } from "@/components/imageGellery/ImageGellery";
import { Button } from "@/components/ui/button";
import { getTransportsBySlug } from "@/lib/actions/transport-actions";
import { getComparePrice, getSellPrice } from "@/lib/utils";
import { MapPin } from "lucide-react";
import Link from "next/link";
import TransportExtraService from "@/components/cards/transports/transport-extra-service";
import RatingBadgeHorizontal from "@/components/rating-badge-horizontal";
import { notFound } from "next/navigation";
import DiscountPriceBadge from "@/components/booking/discount-price-badge";
import TransportTabSection from "@/components/transports/transport-tab-section";
import { getSelectedLocation } from "@/lib/actions/location-action";

const TransportDetails = async (context: {
  params: Promise<{ slug: string }>;
  searchParams: any;
}) => {
  const params = await context.params;
  const query = await context.searchParams;
  const slug = params.slug;

  if (!slug) {
    notFound();
  }

  const { data: transport, reviews } = await getTransportsBySlug(slug);
  if (!transport?.id) {
    notFound();
  }

  const locationIds = [];
  if (query.location_id) {
    locationIds.push(Number(query.location_id));
  }

  const selectedLocations = locationIds.length
    ? await getSelectedLocation(locationIds)
    : [];

  const sellPrice = getSellPrice(transport.price, transport.sale_price);
  const comparePrice = getComparePrice(transport.price, transport.sale_price);

  const elId = "transport-checkout";

  return (
    <div>
      <div className="relative h-full :max-h-[600px] bg-about-us w-full  from-blue-900 via-blue-950 to-blue-950">
        <div className="bg-[#00000066] h-full w-full absolute top-0 bottom-0"></div>
        <TransparentNavbar isBgWhite={false} />
      </div>
      <main className="w-[96%] sm:container m-auto min-h-screen  py-8  ">
        <div className="bg-white p-6 rounded-xl  ">
          {/* Back Link */}
          <Link
            href="/transports"
            className="text-blue-600 hover:text-blue-800 text-sm mb-4 inline-block"
          >
            Revisit the search list
          </Link>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {transport?.title}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{transport.address}</span>
              </div>
              {/* {!!transport.extra_info && <TransportExtraService info={transport.extra_info} />} */}
            </div>
          </div>

          <ImageGallery
            images={transport.gallery}
            title={"Activities"}
            star_rate={5}
            review_score={transport?.review_score}
            alt="Activities Images"
            reviews={reviews || []}
            review_count={0}
          />
        </div>

        {/* Tabs menu */}
        <div
          className="flex gap-8 w-full my-6 lg:flex-row flex-col-reverse"
          id={elId}
        >
          <TransportTabSection
            selectedLocations={selectedLocations}
            car={transport}
          />
        </div>
      </main>
    </div>
  );
};
export default TransportDetails;
