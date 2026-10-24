"use client";

import { useState } from "react";
import Link from "next/link";
import { useDebouncedCallback } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";

import css from "./NotesPage.module.css";

type NotesClientProps = {
  tag: string;
};

export default function NotesClient({ tag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", tag, currentPage, search],
    queryFn: () =>
      fetchNotes(currentPage, 12, search, tag === "all" ? "" : tag),
    placeholderData: (previousData) => previousData,
    refetchOnMount: false,
  });

  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 300);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />

        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note
        </Link>
      </header>

      <main>
        {isLoading && <p>Loading notes...</p>}

        {isError && <p>Something went wrong. Please try again.</p>}

        {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      </main>
    </div>
  );
}
