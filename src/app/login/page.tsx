"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    useEffect(() => {
      const storedToken = localStorage.getItem("bearerToken");
      if (storedToken) {
        setToken(storedToken);
        fetchAndStoreUser(storedToken); // ⬅️ fetch user on page load
      }
    }, []);
//!..............................................
const login = async () => {
  setLoading(true);
  setError(null);

  try {
    const res = await fetch("https://saba.nus.ac.ir/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic c2FtYWQtbW9iaWxlOnNhbWFkLW1vYmlsZS1zZWNyZXQ",
      },
      body: new URLSearchParams({
        username,
        password,
        grant_type: "password",
        scope: "read write",
      }).toString(),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();
    const accessToken = data.access_token;

    localStorage.setItem("bearerToken", accessToken);
    setToken(accessToken);
    console.log("userauth::::::", data);

    await fetchAndStoreUser(accessToken); // 👈 call right after login
    router.push("/dashboard");
  } catch (err: any) {
    setError(err.message || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};

const fetchAndStoreUser = async (accessToken: string) => {
  try {
    const res = await fetch("https://saba.nus.ac.ir/rest/users/me", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await res.json();
    setUserData(user);
    console.log("Fetched user data:", user);
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
};

const handleLogout = () => {
  localStorage.removeItem("bearerToken");
  setToken(null);
  setUserData(null);
};
const makeAuthenticatedRequest = async () => {
        if (!token) {
          console.error("No token found");
          return;
        }
    
        const url = "https://saba.nus.ac.ir/rest/users/me"; // Replace with your API endpoint
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        };
    
        try {
          const res = await fetch(url, {
            method: "GET", // or POST, PUT, etc.
            headers: headers,
          });
    
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
    
          const data = await res.json();
            setUserData(data.payload)
          console.log("Authenticated response data:", data);
        } catch (error) {
          console.error("Error during authenticated request:", error);
        }
      };
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // 🔥 prevent page refresh
        if (!username || !password) {
          setError("Username and password required");
          return;
        }
        login(); // 👈 your login logic stays here
      };
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && <p className="text-red-600">{error}</p>}
      </form>

      {token && userData && (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold">{`${userData.firstName} ${userData.lastName}`}</h2>
          <button
            onClick={makeAuthenticatedRequest}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            fetch the new user
          </button>
        </div>
      )}
    </div>
  );
}

      // const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
      //   e.preventDefault();
    
      //   const url = "https://saba.nus.ac.ir/oauth/token";
      //   const body = new URLSearchParams({
      //     username: username,
      //     password: password,
      //     grant_type: "password",
      //     scope: "read write",
      //   });
    
      //   const headers = {
      //     "Content-Type": "application/x-www-form-urlencoded",
      //     Authorization: "Basic c2FtYWQtbW9iaWxlOnNhbWFkLW1vYmlsZS1zZWNyZXQ",
      //   };
    
      //   try {
      //     const res = await fetch(url, {
      //       method: "POST",
      //       headers: headers,
      //       body: body.toString(),
      //     });
    
      //     if (!res.ok) {
      //       throw new Error(`HTTP error! status: ${res.status}`);
      //     }
    
      //     const data = await res.json();
      //     console.log("Response data:", data);
    
      //     // Store the token in localStorage and state
      //     if (data.access_token) {
      //       localStorage.setItem("bearerToken", data.access_token); // Store in localStorage
      //       setToken(data.access_token); // Store in state
      //     }
      //   } catch (error) {
      //     console.error("Error during fetch:", error);
      //   }
      // };
    
      // const makeAuthenticatedRequest = async () => {
      //   if (!token) {
      //     console.error("No token found");
      //     return;
      //   }
    
      //   const url = "https://saba.nus.ac.ir/rest/users/me"; // Replace with your API endpoint
      //   const headers = {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      //   };
    
      //   try {
      //     const res = await fetch(url, {
      //       method: "GET", // or POST, PUT, etc.
      //       headers: headers,
      //     });
    
      //     if (!res.ok) {
      //       throw new Error(`HTTP error! status: ${res.status}`);
      //     }
    
      //     const data = await res.json();
      //       setUserData(data)
      //     console.log("Authenticated response data:", data);
      //   } catch (error) {
      //     console.error("Error during authenticated request:", error);
      //   }
      // };
    
      // const handleLogout = () => {
      //   // Clear the token from localStorage and state
      //   localStorage.removeItem("bearerToken");
      //   setToken(null);
      //   console.log("Logged out successfully");
      // };
    