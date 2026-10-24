"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNoteStore } from "@/lib/store/noteStore";
import { createNote } from "@/lib/api/clientApi";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      clearDraft();
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });

  function handleSubmit(formData: FormData) {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "");

    if (title.length < 3 || title.length > 50) {
      return;
    }

    if (content.length > 500 || !tags.includes(tag as NoteTag)) {
      return;
    }

    createNoteMutation.mutate({
      title,
      content,
      tag: tag as NoteTag,
    });
  }

  return (
    <form className={css.form} action={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          className={css.input}
          id="title"
          name="title"
          type="text"
          minLength={3}
          maxLength={50}
          required
          value={draft.title}
          onChange={(event) =>
            setDraft({ ...draft, title: event.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          className={css.textarea}
          id="content"
          name="content"
          rows={5}
          maxLength={500}
          value={draft.content}
          onChange={(event) =>
            setDraft({ ...draft, content: event.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          className={css.select}
          id="tag"
          name="tag"
          value={draft.tag}
          onChange={(event) =>
            setDraft({ ...draft, tag: event.target.value as NoteTag })
          }
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {createNoteMutation.isError && (
        <p className={css.error}>Something went wrong. Please try again.</p>
      )}

      <div className={css.actions}>
        <button
          className={css.cancelButton}
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          className={css.submitButton}
          type="submit"
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
