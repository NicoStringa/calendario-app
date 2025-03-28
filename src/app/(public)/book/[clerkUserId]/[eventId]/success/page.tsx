import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/drizzle/db';
import { formatDateTime } from '@/lib/formatters';
import { clerkClient } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';

export const revalidate = 0;

type tParams = Promise<{ clerkUserId: string; eventId: string }>;
type tSearchParams = Promise<{ startTime: string }>;

export default async function SuccessPage(props: {
  params: tParams;
  searchParams: tSearchParams;
}) {
  const { clerkUserId, eventId } = await props.params;
  const { startTime } = await props.searchParams;
  const event = await db.query.EventTable.findFirst({
    where: ({ clerkUserId: userIdCol, isActive, id }, { eq, and }) =>
      and(eq(isActive, true), eq(userIdCol, clerkUserId), eq(id, eventId)),
  });

  if (event == null) notFound();

  const clerk = await clerkClient();
  const calendarUser = await clerk.users.getUser(clerkUserId);
  const startTimeDate = new Date(startTime);

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          Successfully Booked {event.name} with {calendarUser.fullName}
        </CardTitle>
        <CardDescription>{formatDateTime(startTimeDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        You should receive an email confirmation shortly. You can safely close
        this page now.
      </CardContent>
    </Card>
  );
}
