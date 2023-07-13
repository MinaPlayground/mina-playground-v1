import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UpdateFileTree } from "@/types";

export const fileTreeApi = createApi({
  reducerPath: "fileTreeApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  endpoints: (builder) => ({
    updateFileTree: builder.mutation({
      query({ id, body }: UpdateFileTree) {
        return {
          url: `fileTree/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteFileTreeItem: builder.mutation({
      query(data) {
        const { id, body } = data;
        return {
          url: `fileTree/${id}`,
          method: "DELETE",
          body,
        };
      },
    }),
  }),
});

export const { useUpdateFileTreeMutation, useDeleteFileTreeItemMutation } =
  fileTreeApi;
