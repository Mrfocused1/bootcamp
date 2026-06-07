import { BookingClient } from "@/components/BookingClient";

export const metadata = {
  title: "Book your sessions — Urban AI",
};

export default function BookPage() {
  const todayISO = new Date().toISOString().slice(0, 10);
  return <BookingClient todayISO={todayISO} />;
}
