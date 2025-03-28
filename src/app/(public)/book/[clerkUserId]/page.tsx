import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { db } from '@/drizzle/db';
import { formatEventDescription } from '@/lib/formatters';
import { clerkClient } from '@clerk/nextjs/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

type tParams = Promise<{ clerkUserId: string; eventId: string }>;

export default async function BookingPage(props: { params: tParams }) {
  const { clerkUserId } = await props.params;

  const events = await db.query.EventTable.findMany({
    where: ({ clerkUserId: userIdCol, isActive }, { eq, and }) =>
      and(eq(userIdCol, clerkUserId), eq(isActive, true)),
    orderBy: ({ name }, { asc, sql }) => asc(sql`lower(${name})`),
  });

  if (events.length === 0) return notFound();

  const user = await (await clerkClient()).users.getUser(clerkUserId);
  const { fullName } = user;

  return (
    <div className="flex flex-col w-screen max-w-[90%] mx-auto align-center ">
      <div className="text-4xl md:text-5xl font-semibold mb-4 text-center ">
        {fullName}
      </div>
      <div className="text-muted-foreground mb-6 max-w-sm mx-auto text-center  ">
        Welcome to my scheduling page. Please follow the instructions to add an
        event to my calendar
      </div>
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
        {events.map((event) => (
          <EventCard key={event.id} {...event} />
        ))}
      </div>
    </div>
  );
}

type EventCardProps = {
  id: string;
  name: string;
  clerkUserId: string;
  description: string | null;
  durationInMinutes: number;
};

function EventCard({
  id,
  name,
  description,
  clerkUserId,
  durationInMinutes,
}: EventCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description !== null && <CardContent>{description}</CardContent>}
      <CardFooter className="flex justify-end gap-2 mt-auto">
        <Button asChild>
          <Link href={`/book/${clerkUserId}/${id}`}>Select</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
