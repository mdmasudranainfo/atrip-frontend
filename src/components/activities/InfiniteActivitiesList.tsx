"use client";

import ActivitiesCard from "@/components/cards/activities/verticalCard/ActivitiesCard";
import { EventActivityRow } from "@/types/activity";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ResultNotFound from "@/components/notFound/page";
import ItemSorting from "@/components/hotels/hotelFilter/ItemSorting";
import { FilterAttribute } from "@/types/booking";

const ITEMS_PER_PAGE = 10;

export default function InfiniteActivitiesList({
  initialParams,
}: {
  initialParams: any;
}) {
  const [activities, setActivities] = useState<EventActivityRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: false,
    rootMargin: "200px",
  });

  const fetchActivities = async (params: any = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });

    searchParams.set("limit", String(ITEMS_PER_PAGE));
    searchParams.set("page", String(params.page || 1));

    const url = `${
      process.env.NEXT_PUBLIC_API_ENDPOINT
    }/event?${searchParams.toString()}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        data: (data?.rows?.data ?? []) as EventActivityRow[],
        total: data?.rows?.total || 0,
        currentPage: data?.rows?.current_page || 1,
        lastPage: data?.rows?.last_page || 0,
      };
    }

    return { data: [], total: 0 };
  };

  const loadActivities = async (pageNum: number) => {
    if (loading || !hasMore) return;
    setLoading(true);

    const params = {
      ...initialParams,
      page: pageNum,
    };

    const result = await fetchActivities(params);

    if (result.data.length > 0) {
      setActivities((prev) => [...prev, ...result.data]);
      setTotal(result.total);
      setHasMore(result.data.length === ITEMS_PER_PAGE);
      setPage(pageNum); // move here, after successful fetch
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  // First load
  useEffect(() => {
    setActivities([]);
    setPage(1);
    setHasMore(true);
    loadActivities(1);
  }, [initialParams]);

  // Trigger loading more when in view
  useEffect(() => {
    if (inView && !loading && hasMore) {
      loadActivities(page + 1);
    }
  }, [inView]);

  if (!activities || activities.length === 0) {
    return <ResultNotFound />;
  }

  return (
    <div>
      <ItemSorting propertyCount={total} label="activities" />
      {activities.map((activity, idx) => (
        <div className="mt-4" key={idx}>
          <ActivitiesCard
            activity={activity}
            location_id={initialParams.location_id}
          />
        </div>
      ))}
      {hasMore && (
        <div
          ref={ref}
          className="h-10 mt-8 flex justify-center items-center text-gray-500 text-sm"
        >
          {loading ? "Loading more activities..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}
