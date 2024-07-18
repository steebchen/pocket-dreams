"use client";

import { getUserBooks, getYears } from "@/app/actions/userBooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/app/actions/user";
import BooksByMonth from "@/components/BooksByMonth";
import BooksByYear from "@/components/BooksByYear";
import { useState } from "react";
import Link from "next/link";
import Stats from "@/components/Stats";
import { useRouter } from "next/navigation";

export default function BookShelf({ year }: { year: number }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState(year);

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return getUser();
    },
  });

  const { isLoading, data, error } = useQuery({
    queryKey: ["user_with_books", user?.id, selectedYear],
    queryFn: () => {
      return getUserBooks(selectedYear);
    },
  });

  const { data: years } = useQuery({
    queryKey: ["years"],
    queryFn: () => {
      return getYears();
    },
  });
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    queryClient.invalidateQueries({
      queryKey: ["user_with_books", user?.id, e.target.value],
    });
    setSelectedYear(parseInt(e.target.value));
    router.push(`/?year=${e.target.value}`);
  };

  console.log({ years });

  const [view, setView] = useState<"monthly" | "yearly">("monthly");

  if (!user) {
    return <></>;
  }

  if (isLoading) {
    return <>Loading books...</>;
  }

  const classNames = {
    base: "font-medium px-3 hover:bg-gray-100 rounded py-2 px-3",
    active: "bg-gray-100",
  };

  return (
    <>
      <div className="flex items-baseline justify-between gap-3 border-b pb-2">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold">
          Books read in {selectedYear}
        </h1>
        {years ? (
          <select
            className="p-2 rounded-md border"
            value={selectedYear}
            onChange={handleYearChange}
          >
            {years.map((year) => (
              <option key={year.year} value={year.year}>
                {year.year}
              </option>
            ))}
          </select>
        ) : (
          <></>
        )}
      </div>
      {data && <Stats data={data} />}
      <div className="flex items-baseline justify-between gap-3 border-b pb-2">
        <div className="flex gap-3">
          <button
            type="button"
            className={`${classNames.base} ${view === "monthly" && classNames.active}`}
            onClick={() => setView("monthly")}
          >
            Monthly
          </button>
          <button
            type="button"
            className={`${classNames.base} ${view === "yearly" && classNames.active}`}
            onClick={() => setView("yearly")}
          >
            Yearly
          </button>
        </div>

        <Link
          href="/add"
          type="button"
          className="bg-black text-white px-4 py-2 font-medium rounded-md"
        >
          Add book
        </Link>
      </div>

      {data && view === "monthly" && <BooksByMonth data={data} />}
      {data && view === "yearly" && <BooksByYear data={data} />}
    </>
  );
}
