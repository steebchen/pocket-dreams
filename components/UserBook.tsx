"use client";

import type { books, user_books } from "@prisma/client";
import { getUser } from "@/app/actions/user";
import { removeBookFromShelf } from "@/app/actions/userBooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Rating from "@/components/Rating";
import Link from "next/link";
import StarIcon from "@/components/icons/StarIcon";
import BookCover from "@/components/BookCover";

interface Props extends user_books {
  book: books;
}

export default function UserBook({ book }: { book: Props }) {
  const queryClient = useQueryClient();

  const { review, rating, read_at } = book;
  const { title, author_name, id, open_library_cover_edition_key } = book.book;
  const coverUrl = `https://covers.openlibrary.org/b/olid/${open_library_cover_edition_key}-L.jpg`;

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return getUser();
    },
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: () => {
      return removeBookFromShelf(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["user_with_books", user?.id],
      }),
    onError: () => {
      console.log("error");
    },
  });

  return (
    <div className="md:w-[200px] shrink-0 rounded p-4 border sm:p-0 sm:border-0 sm:space-y-6 inline-flex gap-4 sm:block">
      <Link href={`/book/${book.book_id}`} className="sm:flex-1 sm:block">
        <BookCover
          book={book.book}
          width={180}
          height={200}
          className="shadow-lg h-[120px] w-auto sm:h-[240px] lg:h-[260px] "
        />
      </Link>

      <div className="flex-1">
        <div>
          <Link href={`/book/${book.book_id}`}>
            <h2 className="text-sm font-medium mb-1">{title}</h2>
            <div className="flex gap-2 items-center text-sm text-gray-500 mb-2">
              <p>{author_name}</p>
              <div className="hidden sm:flex gap-0.5 text-xs items-center leading-none font-semibold">
                <StarIcon className="text-yellow-400 text-base -mt-px" />
                {rating}
              </div>
            </div>
          </Link>

          <div className="sm:hidden">
            <Rating rating={rating} className="text-lg" />
          </div>

          {review && (
            <p className="mt-3 line-clamp-5 text-sm italic text-ellipsis text-gray-500">
              {review}
            </p>
          )}
        </div>
        <button
          onClick={() => remove()}
          type="button"
          disabled={isRemoving}
          className="text-gray-500 text-xs underline text-left"
        >
          {isRemoving ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
}
