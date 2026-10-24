import type { Metadata } from "next";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

type NotesPageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: NotesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0];

  const filterTitle = tag === "all" ? "All notes" : `${tag} notes`;

  const description =
    tag === "all"
      ? "Browse and manage all your notes in NoteHub."
      : `Browse and manage your ${tag} notes in NoteHub.`;

  return {
    title: `${filterTitle} | NoteHub`,
    description,
    openGraph: {
      title: `${filterTitle} | NoteHub`,
      description,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub — Notes",
        },
      ],
    },
  };
}

export default async function NotesPage({ params }: NotesPageProps) {
  const { slug } = await params;
  const tag = slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", tag, 1, ""],
    queryFn: () => fetchNotes(1, 12, "", tag === "all" ? "" : tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
