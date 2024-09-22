import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
const UseFollowUser = () => {
  const queryClient = useQueryClient();
  const { mutate: follow } = useMutation({
    mutationFn: async (userId) => {
      try {
        const res = await fetch(`/api/user/followUnfollow/${userId}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        if (data.error) throw new Error(data.error);
        return data;
      } catch (error) {
        console.log(error);
        throw Error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suggestedUsers"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["user"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
        refetchType: "all",
      });
    },
  });

  return { follow };
};

export default UseFollowUser;
