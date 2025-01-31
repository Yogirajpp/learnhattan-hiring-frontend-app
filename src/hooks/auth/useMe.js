import axios from "@/configs/axios.configs";
import { useQuery } from "@tanstack/react-query";

const fetchLoggedInUser = async (token) => {
    const response = await axios.get("/api/auth/me", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

const useMe = (token, config) => {
    const q = useQuery({
        queryKey: ["me"],
        queryFn: () => fetchLoggedInUser(token),
        retry: false,
        enabled: !!token,
        ...config,
    });

    return q
}

export default useMe;