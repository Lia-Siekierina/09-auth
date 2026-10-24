"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api/clientApi";
import Modal from "@/components/Modal/Modal";
import css from "@/app/(private routes)/notes/[id]/NoteDetails.module.css";

export default function NotePreviewClient() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      {isLoading && <p>Loading note...</p>}

      {isError && <p>Something went wrong. Please try again.</p>}
      {!isLoading && !isError && !data && <p>Note not found</p>}
      {data && (
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
      )}
    </Modal>
  );
}
