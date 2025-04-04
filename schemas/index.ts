import * as z from 'zod';


// schema validation referenced in /actions, this is where entered details are compared to the schema and errors are returned if they don't match

// Schema for user registration form validation
export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
 
  name: z.string().min(1, {
    message: 'Name is required',
  }),

  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
  passwordConfirmation: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

// Schema for user login form validation
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter a valid password",
  }),
});