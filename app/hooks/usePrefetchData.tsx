// import { QueryClient } from "@tanstack/react-query"

// export async function usePrefetchData<T>(
//   params: any,
//   limit: number,
//   action: (params: any, limit: number) => Promise<T>,
//   key: string
// ) {
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: [key],
//     queryFn: async () => await action(params, limit)
//   })
//   return queryClient
// }
