"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CustomToast } from '@/components/ui/CustomToast';
import useUserStore from '@/stores/useUserStore';
import Image from 'next/image';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(1, 'نام کاربری فراموش نشود'),
  password: z.string().min(4, 'گذرواژه حداقل 4 رقم است')
});

const LoginPage = () => {
  const [token, setToken] = useState<null|string>(null)
  const router = useRouter();
  const { login } = useAuth();
  useEffect(() => {
    const accessToken=localStorage.getItem('bearerToken')
  accessToken&&router.replace('/')
  }, [token])

 
  // Form setup with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    
    try {
      setIsSubmitting(true);
    
      const response = await login(values.username, values.password);
      
      if (response?.access_token) {
        localStorage.setItem("bearerToken", response.access_token);
        localStorage.setItem("refreshToken",response.refresh_token)
        console.log(response);
        
        setToken(response.access_token)
        toast.custom((t) => (
          <CustomToast t={t} type="success" message=" ! ورود موفقیت آمیز" />
        ));
                router.push('/');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
toast.custom((t) => (
  <CustomToast t={t} type="error" message="! ورود ناموفق" />
));
    } finally {
      setIsSubmitting(false);
    }
  };
    useEffect(() => {
  //  router.replace('/dashboard')
    }, [])
    
  return (
    <div className="flex items-center justify-center h-[635px]  bg-transparent relative "
    
    >
      <Image alt='backgroundImage' src="/back.jpg" width={1200} height={1200} className='absolute w-full h-full'/>
      <Card
      dir='rtl'
      className="w-full max-w-md mx-4 z-50 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl">
      <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">سباد</CardTitle>
          <CardDescription className="text-center">
            سامانه  بی مدیریتی امور دانشجویی
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نام کاربری</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="نام کاربری را وارد نمایید"
                        autoComplete="username"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=''>رمز عبور</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="رمز عبور را وارد نمایید"
                        autoComplete="current-password"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full border border-black/[0.2] bg-green-500 cursor-pointer hover:brightness-125" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    
                  </>
                ) : (
                  'ورود'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      

    </div>
  );
};

export default LoginPage;