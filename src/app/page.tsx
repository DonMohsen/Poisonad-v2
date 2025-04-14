"use client"
import useAuth from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  
  const router = useRouter();
  useEffect(() => {
 router.replace('/food')
  }, [])
  
  return (
    <div>
      
    </div>
  );
};

export default HomePage;