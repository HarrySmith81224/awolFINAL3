'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import CardWrapper from './card-wrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginSchema } from '@/schemas';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { login } from '@/actions/login';
import { FormError } from './form-error';
import Link from 'next/link';

const LoginForm = () => {
  // State management for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with Zod validation schema
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    setLoading(true);
    // Call login.ts  from /action and handle response
    login(data).then((res) => {
      if (res.error) {
        // Display error message if login fails
        setError(res.error);
        setLoading(false);
      }
      else {
        // Clear error message if login succeeds
        setError('');
        setLoading(false);
      }
    });
  };

  return (
    <CardWrapper
      headerLabel="Log in to your account"
      title="Login"
      backButtonHref="/auth/register"
      backButtonLabel="make an account"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Email input */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe@email.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password input */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Display error message */}
          <FormError message={error} />
          {/* Submit button with loading state */}
          <Button type="submit" className="w-full">
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
