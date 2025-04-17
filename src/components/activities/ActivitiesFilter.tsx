"use client";
import { FilterAttribute } from "@/types/booking";
import RatingFilter from "@/components/multifilter/rating-filter";
import MultiFilterOption from "@/components/multifilter/multi-filter-option";
import PriceFilter from "@/components/multifilter/price-filter";

export default function ActivitiesFilter({attributes, params, baseUrl, priceRange}: {attributes: FilterAttribute[], params: any, baseUrl: string, priceRange?: number[]}) {
  return (
    <div className="w-full lg:max-w-xs bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="divide-y divide-white-frosted">
        <RatingFilter name="review_score[]" label="Review Score" params={params} baseUrl={baseUrl} />
        <PriceFilter
          range={priceRange || [0, 100]}
          name="price_range" 
          params={params}
          baseUrl={baseUrl}
        />
        <MultiFilterOption attributes={attributes} params={params} baseUrl={baseUrl} />
      </div>
    </div>
  );
}
