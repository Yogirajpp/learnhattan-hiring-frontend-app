import axios from "@/configs/axios.configs"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import useAuth from "./useAuth"

const sendAndFetchAuthTokens = async ({ code, redirect_url }) => {
    const response = await axios.post('/api/auth/oauth/github', { code, redirect_url })

    return response.data
}


export const useGitHubOAuth = (data, config) => {
    const { login, logout } = useAuth();

    const q = useQuery({
        queryKey: ["auth-github", data],
        queryFn: () => sendAndFetchAuthTokens(data),
        retry: false,
        enabled: !!data.code,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        ...config,
    })

    useEffect(() => {
        if (q.isSuccess) {
            const queryData = q.data;
            if (queryData.success) {
                login(queryData.data);
            } else {
                logout();
            }
        } else if (q.isError) {
            logout();
        }
    }, [q.data, q.isSuccess, q.isError, login, logout])

    return q
}