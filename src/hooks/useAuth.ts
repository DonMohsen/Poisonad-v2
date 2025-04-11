import { useState } from 'react';

const useAuth = () => {
  const [data, setData] = useState<any>(null); // To store the API response
  const [error, setError] = useState<string | null>(null); // To store error messages
  const [loading, setLoading] = useState<boolean>(false); // To track loading state

  const login = async (username: string, password: string) => {
    setLoading(true); // Set loading to true when the request starts
    setError(null); // Clear any previous errors
    setData(null); // Clear any previous data

    try {
      const postData = new URLSearchParams();
      postData.append('username', username);
      postData.append('password', password);
      postData.append('grant_type', 'password');
      postData.append('scope', 'read write');

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic c2FtYWQtbW9iaWxlOnNhbWFkLW1vYmlsZS1zZWNyZXQ'
        },
        body: postData.toString()
      };

      const res = await fetch('https://saba.nus.ac.ir/oauth/token', options);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error_description || 'Authentication failed');
      }

      const responseData = await res.json();
      setData(responseData); // Store the response data
    } catch (err: any) {
      setError(err.message || 'Something went wrong'); // Capture and set the error
    } finally {
      setLoading(false); // Set loading to false when the request completes
    }
  };

  return { login, data, error, loading };
};

export default useAuth;
