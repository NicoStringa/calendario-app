import { NavLink } from '@/components/NavLink';
import { UserButton } from '@clerk/nextjs';
import { CalendarRangeIcon } from 'lucide-react';
import React, { ReactNode } from 'react';

export default function PrivateLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="flex py-2 max-w-[90%] m-auto border bg-card ">
        <nav className="font-medium flex items-center text-sm gap-6 w-full mx-10 justify-between">
          <div className="flex items-center gap-2 font-semibold mr-auto ">
            <CalendarRangeIcon className="size-6" />
            <span className="sr-only md:not-sr-only">Calendario</span>
          </div>
          <NavLink href="/events">Events</NavLink>
          <NavLink href="/schedule">Schedule</NavLink>
          <div className="ml-auto size-10">
            <UserButton />
          </div>
        </nav>
      </header>
      <main className="w-screen my-6 ">{children}</main>
    </>
  );
}
