import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/` }),
  endpoints: (builder) => ({
    createProject: builder.mutation({
      query(data) {
        const { body } = data;
        return {
          url: `project`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useCreateProjectMutation } = projectApi;
