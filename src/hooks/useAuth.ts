import { useState } from 'react';

const useAuth = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    setData(null);

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

      const res = await fetch('https://saba.tvu.ac.ir/oauth/token', options);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error_description || 'Authentication failed');
      }

      const responseData = await res.json();
      setData(responseData);
      // console.log("the res of auth======>>>>",responseData);
      
      return responseData; // Return the data in case you want to use it directly
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      throw err; // Re-throw the error if you want to handle it in the component
    } finally {
      setLoading(false);
    }
  };

  return { login, data, error, loading };
};

export default useAuth;