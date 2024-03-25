import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const minaPlaygroundApi = createApi({
  reducerPath: "snippetApi",
  baseQuery: fetchBaseQuery({ baseUrl: `/` }),
  endpoints: (builder) => ({
    faucetRequest: builder.mutation({
      query(data) {
        const { body } = data;
        return {
          url: `api/faucet`,
          method: "POST",
          body,
        };
      },
    }),
  }),
});

export const { useFaucetRequestMutation } = minaPlaygroundApi;
