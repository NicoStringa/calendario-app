import { ReactNode } from 'react';

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <main className="w-screen my-6">{children}</main>;
}
