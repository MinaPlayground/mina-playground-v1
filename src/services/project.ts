import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UpdateFileTree } from "@/types";

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
    updateProject: builder.mutation({
      query({
        id,
        body,
      }: {
        id: string;
        body: { name: string; visibility: boolean };
      }) {
        return {
          url: `project/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    deleteProject: builder.mutation({
      query(data) {
        const { id } = data;
        return {
          url: `project/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} = projectApi;
