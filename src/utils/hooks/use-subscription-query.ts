// import useSupabase from "./use-supabase";

// function useOrganizationQuery(organizationId: number) {
//     const client = useSupabase();
//     const queryKey = ['organization', organizationId];

//     const queryFn = async () => {
//       return getOrganizationById(client, organizationId).then(
//         (result) => result.data
//       );
//     };

//     return useQuery({ queryKey, queryFn });
//   }

//   export default useOrganizationQuery;
