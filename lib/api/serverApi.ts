import api from "./api";
import { cookies } from "next/headers";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CheckSessionResponse {
  success: boolean;
}

export const fetchNotes = async (
  page: number,
  perPage: number,
  search: string = "",
  tag: string = "",
): Promise<FetchNotesResponse> => {
  const cookieStore = await cookies();

  const response = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search ? { search } : {}),
      ...(tag && tag !== "All" ? { tag } : {}),
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();

  const response = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();

  const response = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};

export const checkSession = async (): Promise<CheckSessionResponse> => {
  const cookieStore = await cookies();

  const response = await api.get<CheckSessionResponse>("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
};
