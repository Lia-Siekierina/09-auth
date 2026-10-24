"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import css from "./NoteDetails.module.css";

export default function NoteDetails() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading note...</p>;
  }

  if (isError) {
    return <p>Something went wrong. Please try again.</p>;
  }

  if (!data) {
    return <p>Note not found</p>;
  }

  return (
    <main className={css.main}>
      <div className={css.container}>
        <article className={css.item}>
          <div className={css.header}>
            <h2>{data.title}</h2>
            <span className={css.tag}>{data.tag}</span>
          </div>

          <p className={css.content}>{data.content}</p>

          <p className={css.date}>
            Created: {new Date(data.createdAt).toLocaleString()}
          </p>
        </article>
      </div>
    </main>
  );
}
