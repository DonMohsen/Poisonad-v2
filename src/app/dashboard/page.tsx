"use client"
import { useUserInfo } from '@/hooks/useUserInfo';

export default function DashboardPage() {
  const { loading, error, data } = useUserInfo();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      {data?.firstName} {data?.lastName}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}