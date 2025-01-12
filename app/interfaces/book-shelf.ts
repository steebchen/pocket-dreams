import { user_books } from ".prisma/client";
import { books } from "@prisma/client";

export interface BookShelfResponse {
  totalCount: number;
  favorites: Array<user_books & { book: books }>;
  byMonth: BookShelfMonth[];
  bestMonth?: number;
  bestMonthCount?: number;
  year: number;
}

export interface BookShelfMonth {
  month: number;
  count: number;
  user_books: Array<user_books & { book: books }>;
}
