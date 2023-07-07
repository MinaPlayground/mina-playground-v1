import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fileTreeApi = createApi({
  reducerPath: "fileTreeApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/" }),
  endpoints: (builder) => ({
    getPokemonByName: builder.query({
      query: (name) => `project/64a1f352851a7f64391ab7cc`,
    }),
    updateFileTree: builder.mutation({
      query(data) {
        const { id, body } = data;
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
