"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>();
const router=useRouter()
  // Check token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("bearerToken");
    if (storedToken) {
      setToken(storedToken);
      makeAuthenticatedRequest(storedToken);
    }
  }, []);

  // Handle login logic
  // const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   localStorage.removeItem("bearerToken");
  //   setToken(null);
    
  //   const url = "https://saba.nus.ac.ir/oauth/token";
  //   const body = new URLSearchParams({
  //     username: username,
  //     password: password,
  //     grant_type: "password",
  //     scope: "read write",
  //   });

  //   try {
  //     const res = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //         Authorization: "Basic c2FtYWQtbW9iaWxlOnNhbWFkLW1vYmlsZS1zZWNyZXQ",
  //       },
  //       body: body.toString(),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.error_description || `HTTP error! status: ${res.status}`);
  //     }

  //     const data = await res.json();
  //     console.log("Token response:", data);

  //     if (data.access_token) {
  //       localStorage.setItem("bearerToken", data.access_token);
  //       setToken(data.access_token);
  //       // makeAuthenticatedRequest(data.access_token);
  //       router.push('/dashboard')
  //     }
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
  
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        body: formData, // Send as FormData
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
  
      localStorage.setItem("bearerToken", data.token);
      setToken(data.token);
      router.push('/dashboard');
      
    } catch (error) {
      console.error('Login failed:', error);
      alert(error instanceof Error ? error.message : 'Login failed');
    }
  };
  // Make authenticated request using fetch
  const makeAuthenticatedRequest = async (token: string) => {
    const url = `https://saba.nus.ac.ir/rest/users/me`;
    
    try {
      console.log("Making request with token:", token);
      
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        credentials: "omit"
      });

      console.log("Response status:", res.status);
      
      if (!res.ok) {
        // Try to get error details from response
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("User data response:", data);
      
      if (!data?.payload) {
        throw new Error("Invalid user data structure");
      }

      setUserData(data.payload);
    } catch (error) {
      console.error("Fetch user error:", error);
      
      // If unauthorized, clear the invalid token
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem("bearerToken");
        setToken(null);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("bearerToken");
    setToken(null);
    setUserData(null);
    console.log("Logged out successfully");
  };

  return (
    <div className="flex items-center justify-center w-full h-fit min-h-[100vh] flex-col gap-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-4"
      >
        <input
          name="username"
          type="text"
          autoComplete="username"
          onChange={(e) => setUsername(e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-md w-full"
          placeholder="Username"
          value={username}
        />
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
          className="bg-gray-100 px-4 py-2 rounded-md w-full"
          placeholder="Password"
          value={password}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>

      {token && (
        <>
          <button 
            onClick={() => makeAuthenticatedRequest(token)}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Refresh User Data
          </button>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Logout
          </button>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            {userData ? (
              <>
                <h1 className="text-xl font-bold">{`${userData.firstName} ${userData.lastName}`}</h1>
                <pre className="mt-2 text-sm">{JSON.stringify(userData, null, 2)}</pre>
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}