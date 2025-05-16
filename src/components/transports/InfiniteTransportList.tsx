"use client";

import TransportCard from "@/components/cards/transports/verticalCard/TransportCard";
import { ITransport } from "@/types/transportTypes";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ResultNotFound from "@/components/notFound/page";
import ItemSorting from "@/components/hotels/hotelFilter/ItemSorting";
import { useSearchParams } from "next/navigation";

type InfiniteTransportListProps = {
  initialData: ITransport[];
  initialTotal: number;
  initialParams: any;
};

const ITEMS_PER_PAGE = 5;

const fetchTransports = async (params: any = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  });

  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/transport?${searchParams.toString()}&limit=${ITEMS_PER_PAGE}&page=${
      params.page || 1
    }`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  const data = await response.json();

  return {
    data: data?.rows?.data ?? [],
    currentPage: data?.rows?.current_page || 1,
    lastPage: data?.rows?.last_page || 0,
    total: data?.rows?.total || 0,
  };
};

export default function InfiniteTransportList({
  initialData,
  initialTotal,
  initialParams,
}: InfiniteTransportListProps) {
  const [transports, setTransports] = useState<ITransport[]>(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialData.length < initialTotal);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px",
  });

  const searchParams = useSearchParams();

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    const nextPage = currentPage + 1;

    const nextParams = {
      ...initialParams,
      page: nextPage,
    };

    const response = await fetchTransports(nextParams);

    if (response.data.length > 0) {
      setTransports((prev) => [...prev, ...response.data]);
      setCurrentPage(nextPage);

      if (nextPage >= response.lastPage) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView]);

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
          key={transports.length}
          ref={ref}
          className="h-10 mt-8 flex justify-center items-center text-gray-600 text-sm"
        >
          {loading ? "Loading more transports..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}
