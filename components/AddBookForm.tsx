"use client";

import { books } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addUserBook } from "@/app/actions/userBooks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Error from "./Error";
import { getUser } from "@/app/actions/user";
import RatingInput from "@/components/RatingInput";
import Button from "@/components/Button";

export default function AddBookForm({ book }: { book: books }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [read_at, setReadAt] = useState(new Date().toISOString().split("T")[0]);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      return getUser();
    },
  });

  const {
    mutate: add,
    isPending,
    error,
  } = useMutation({
    mutationFn: () => {
      return addUserBook({
        book_id: book.id,
        review,
        rating,
        read_at: new Date(read_at),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user_with_books", user?.id],
      });
      router.push("/");
    },
  });
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    add();
  };

  return (
    <form className="grid gap-6" onSubmit={submit}>
      <div>
        <h2 className="text-xl font-semibold">{book.title}</h2>
        <p>by {book.author_name}</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="review" className="font-medium">
          Review <span className="font-normal">(optional)</span>{" "}
        </label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Your thoughts on this book"
          name="review"
          className="w-full max-w-lg rounded-md ring-1 ring-gray-500/20 px-3 py-2"
        ></textarea>
      </div>

      <div className="grid gap-2">
        <label htmlFor="rating" className="font-medium">
          Rating <span className="font-normal">(optional)</span>{" "}
        </label>
        <RatingInput value={rating} onChange={(value) => setRating(value)} />
      </div>

      <div className="grid gap-2 max-w-[12rem]">
        <label htmlFor="read_at" className="font-medium">
          Read on
        </label>
        <input
          type="date"
          name="read_at"
          id="read_at"
          className="rounded-md ring-1 ring-gray-500/20 px-3 py-2"
          value={read_at}
          onChange={(e) => setReadAt(e.target.value)}
        />
      </div>

      <div className="mt-6">
        <Button
          className="px-8"
          type="submit"
          pending={isPending}
          pendingText="Adding..."
        >
          Add to shelf
        </Button>
      </div>

      {error && <Error error={error} />}
    </form>
  );
}
