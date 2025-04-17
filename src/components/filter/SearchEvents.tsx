import React from "react";

const SearchEvents = async () => {
  // const url = `${
  //     process.env.NEXT_PUBLIC_API_ENDPOINT
  //   }/event?name=${searchInput}`;

  return (
    <>
      <input
        type="text"
        className="md:flex-1 py-4 w-full border outline-none rounded-md px-3 font-bold text-dark text-[15px] placeholder:text-dark"
        placeholder="Name"
        // value={searchInput}
        // onChange={(e) => setSearchInput(e.target.value)}
      />
    </>
  );
};

export default SearchEvents;
