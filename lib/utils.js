import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (
  error,
  defaultMessage = "Something went wrong",
) => {
  console.error(error);
  let errorMessage = defaultMessage;
  if (error instanceof Error && error.message.length < 100) {
    errorMessage = error.message;
  }
  return errorMessage;
};

export function getVisiblePages(currentPage, totalPages) {
  const delta = 2; // how many pages to show on each side of current
  const range = [];
  const rangeWithDots = [];
  let lastPage;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (lastPage) {
      if (i - lastPage === 2) {
        rangeWithDots.push(lastPage + 1);
      } else if (i - lastPage > 2) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    lastPage = i;
  }

  return rangeWithDots;
}
