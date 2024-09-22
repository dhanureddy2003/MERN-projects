import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const Search = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debouncing the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search); // Set the debounced search value after 500ms
    }, 500);
    return () => clearTimeout(timer); // Clear the timeout if the user types again
  }, [search]);

  const {
    data: userData,
    isLoading,
    isRefetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["searchedUser", debouncedSearch], // Add debouncedSearch to queryKey
    queryFn: async () => {
      if (!debouncedSearch) return []; // Return an empty array if there's no search input

      try {
        const res = await fetch(
          `/api/user/search?username=${debouncedSearch}`,
          {
            method: "GET",
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    enabled: !!debouncedSearch, // Only run the query if debouncedSearch has a value
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div className="w-[100%] sm:w-[50%] h-screen p-3 flex flex-col items-center gap-3">
      <div className="search-box bg-[#202327] w-[80%] sm:w-[60%] p-2 rounded-3xl flex items-center gap-3 ">
        <FiSearch className="h-5 w-5" />
        <input
          type="text"
          value={search}
          name="search"
          onChange={handleSearch}
          placeholder="Search"
          autoComplete="off"
          className="w-full bg-[#202327] outline-none placeholder:text-[#494D51]"
        />
      </div>

      {(isLoading || isRefetching) && <LoadingSpinner />}

      {isError && <p className="text-red-500">{error.message}</p>}

      {!isLoading && !isError && !isRefetching && userData && userData.length > 0
        ? userData.map((user) => (
            <div key={user._id} className="w-[80%] sm:w-[60%]">
              <div className="flex justify-start items-center gap-2">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={user?.profileImg || "/avatar-placeholder.png"}
                    alt="profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                <Link to={`/profile/${user?.username}`}>
                  <div className="cursor-pointer">
                    <p className="text-[18px]">{user?.fullName}</p>
                    <p className="text-[16px]">@{user?.username}</p>
                  </div>
                </Link>
              </div>
            </div>
          ))
        : !isLoading &&
          debouncedSearch && <p className="text-gray-500">No users found.</p>}
          
    </div>
  );
};

export default Search;
