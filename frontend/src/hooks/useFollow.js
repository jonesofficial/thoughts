import { useMutation, useQueryClient } from "@tanstack/react-query";

import { baseUrl } from "../constant/url";

import toast from "react-hot-toast";

const useFollow = () => {
  const queryClient = useQueryClient();
  const { mutate: follow, isPending } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`${baseUrl}/api/users/follow/${userId}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      Promise.all([queryClient.invalidateQueries({ queryKey: ["authUser"] })]); //promise used to make the follow unfollow work simultaneously
    },
    onError: () => {
      toast.error("Error ! try again");
    },
  });
  return { follow, isPending };
};

export default useFollow;
