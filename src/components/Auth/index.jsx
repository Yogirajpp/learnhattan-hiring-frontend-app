import { useLocation } from 'react-router-dom';
import { getGitHubOAuthUrl } from '../../lib/auth';
import { Button } from "../ui/button";

const Auth = () => {
    const location = useLocation();

    const handleSignInClick = () => {
        const from = location.state?.from.pathname || '/auth';

        const url = getGitHubOAuthUrl(from)
        window.location.href = url;
    }

    return (
        <div className='flex items-center justify-center h-screen'>
            <div className='flex flex-col items-center gap-2'>
                <h1 className='text-4xl font-bold'>GitHub Auth</h1>
                <Button onClick={handleSignInClick}>
                    Sign in with GitHub
                </Button>
            </div>
        </div>
    )
}

export default Auth;