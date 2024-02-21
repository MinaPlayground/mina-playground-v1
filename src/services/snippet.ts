import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const snippetApi = createApi({
  reducerPath: "snippetApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  endpoints: (builder) => ({
    createSnippet: builder.mutation({
      query(data) {
        const { body } = data;
        return {
          url: `snippet`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateSnippetMutation } = snippetApi;
