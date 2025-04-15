import { addTestimonial, deleteTestimonial, getGoodTestimonials } from "@/actions/testimonials"
import { ITestimonial } from "@/types/index"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const testimonialsKeys = {
  all: "testimonials" as const
  // list: (productId: string) => [...testimonialsKeys.all, productId] as const
}

const useQueryTestimonials = (productId: string) => {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => getGoodTestimonials(productId)
    // staleTime: 0,
    // gcTime: 0
  })
}
// useQuery({
//   queryKey: testimonialsKeys.list(productId),
//   queryFn: () => getGoodTestimonials(productId)
// })

const useMutateAddTestimonial = (productId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: ITestimonial) => addTestimonial(values),
    onSuccess: _returnedData => {
      if (_returnedData.success) {
        queryClient.invalidateQueries({ queryKey: ["testimonials"] })
        toast.success(_returnedData.message || "Дані додано")
      }
    },
    onError: () => {
      toast.error("Помилка при створенні")
    }
  })
}

const useMutateDeleteTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (testimonialId: string) => deleteTestimonial(testimonialId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] })
      toast.success("Дані видалено")
    },
    onError: () => {
      toast.error("Помилка при видаленні")
    }
  })
}

// const useMutateDeleteTestimonial = (productId: string) => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: async (testimonialId: string) => {
//       const result = await deleteTestimonial(testimonialId)
//       console.log("deleteTestimonial result:", result)
//       return result
//     },
//     onSuccess: returnedData => {
//       console.log("deleteTestimonial response:", returnedData)
//       if (returnedData?.success) {
//         console.log("Refetching queries for key:", testimonialsKeys.list(productId))
//         queryClient.refetchQueries({ queryKey: testimonialsKeys.list(productId) })
//         toast.success(returnedData.message || "Дані видалено")
//       }
//     },

//     onError: () => {
//       toast.error("Помилка при видаленні")
//     }
//   })
// }

// const testimonialsKeys = {
//   all: []
// }

// const useQueryTestimonials = (productId: string) =>
//   useQuery({
//     queryKey: testimonialsKeys.all,
//     queryFn: () => getGoodTestimonials(productId)
//   })

// const useMutateAddTestimonial = (productId: string) => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: (values: ITestimonial) => addTestimonial(values),
//     onSuccess: _returnedData => {
//       if (_returnedData.success) queryClient.refetchQueries({ queryKey: testimonialsKeys.all })
//       toast.success(_returnedData.message || "Дані додано")
//     },
//     onError: () => {
//       toast.error("Помилка при створенні")
//     }
//   })
// }

// const useMutateDeleteTestimonial = () => {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: (testimonialId: string) => deleteTestimonial(testimonialId),
//     onSuccess: returnedData => {
//       if (returnedData?.success) {
//         toast.success(returnedData.message || "Відгук видалено")
//         queryClient.invalidateQueries({
//           predicate: query => query.queryKey[0] === "Alltestimonials"
//         })
//       }
//     },
//     onError: () => {
//       toast.error("Помилка при видаленні")
//     }
//   })
// }

export {
  testimonialsKeys,
  useMutateAddTestimonial,
  useMutateDeleteTestimonial,
  useQueryTestimonials
}
