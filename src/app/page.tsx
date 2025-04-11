"use client"
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const LoginComponent = () => {
  const { login, data, error, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string|null>(null)
  const router=useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };
  useEffect(() => {
    const storedToken = localStorage.getItem("bearerToken");
    if (storedToken) {
      router.push('/dashboard')
      setToken(storedToken)
    }
  }, [token]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
      <input
          type="text"
          autoComplete="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 rounded-md"
        />
        <input
          type="password"
          autoComplete="current-password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 bg-gray-100 rounded-md"
        />
        <button type="submit" disabled={loading}>Login</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {data && <p>Logged in successfully! Access Token: {data.access_token}</p>}
    </div>
  );
};

export default LoginComponent;
