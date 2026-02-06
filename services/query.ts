/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import api from "./api";

type Query = {
  route: string;
  query: string;
  params?: any;
  refetch?: any;
};

const headers: Record<string, string> = {
  Accept: "application/json",
};

//get data
export function useFetch({ route, query, params }: Query) {
  const handleFetchData = async () => {
    try {
      const { data } = await api.get(`${route}`, {
        headers: params?.headers ? params.headers : headers,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [query],
    queryFn: handleFetchData,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}
