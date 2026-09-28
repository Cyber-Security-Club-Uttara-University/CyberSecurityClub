import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Announcement",
};

export default function CreateAnnouncementLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
