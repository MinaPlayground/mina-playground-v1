import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const versionControlApi = createApi({
  reducerPath: "versionControlApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  endpoints: (builder) => ({
    createCommit: builder.mutation({
      query(data) {
        const { body } = data;
        return {
          url: `versionControl`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateCommitMutation } = versionControlApi;
