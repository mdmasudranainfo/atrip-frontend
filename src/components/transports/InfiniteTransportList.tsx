"use client";

import TransportCard from "@/components/cards/transports/verticalCard/TransportCard";
import { ITransport } from "@/types/transportTypes";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getAllTransports } from "@/lib/actions/transport-actions";
import ResultNotFound from "@/components/notFound/page";
import ItemSorting from "@/components/hotels/hotelFilter/ItemSorting";
import { useRouter, useSearchParams } from "next/navigation";

type InfiniteTransportListProps = {
  initialData: ITransport[];
  initialTotal: number;
  initialParams: any;
  priceRange: any;
  attributes: any;
};

const ITEMS_PER_PAGE = 10;

export default function InfiniteTransportList({
  initialData,
  initialTotal,
  initialParams,
}: InfiniteTransportListProps) {
  const [transports, setTransports] = useState<ITransport[]>(initialData);
  const [offset, setOffset] = useState(ITEMS_PER_PAGE);
  const [hasMore, setHasMore] = useState(initialData.length < initialTotal);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px", // triggers earlier
  });

  const router = useRouter();
  const searchParams = useSearchParams();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const nextPage = Math.floor(offset / ITEMS_PER_PAGE) + 1;
    console.log(nextPage);

    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", String(nextPage));
    router.push(`?${newParams.toString()}`);

    const nextParams = {
      ...initialParams,
      page: nextPage,
    };

    const response = await getAllTransports(nextParams);

    if (response?.data?.length > 0) {
      setTransports((prev) => [...prev, ...response.data]);
      setOffset((prev) => prev + ITEMS_PER_PAGE);
      if (response.data.length < ITEMS_PER_PAGE) setHasMore(false);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadMore();
    }
  }, [inView, loading, hasMore]);

  if (!transports || transports.length === 0) {
    return <ResultNotFound />;
  }

  return (
    <div>
      <ItemSorting propertyCount={initialTotal || 0} label="transports" />

      {transports.map((transport, idx) => (
        <div className="mt-4" key={idx}>
          <TransportCard transport={transport} />
        </div>
      ))}

      {hasMore && (
        <div
          key={transports.length} // force re-render to re-register inView
          ref={ref}
          className="h-10 mt-8 flex justify-center items-center"
        >
          {loading ? "Loading more transports..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}
