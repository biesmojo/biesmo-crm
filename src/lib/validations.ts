import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Nama harus memiliki setidaknya 2 karakter'),
    email: z.string().email('Email tidak valid'),
    password: z
    .string()
    .min(8, 'Password harus memiliki setidaknya 8 karakter')
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password harus mengandung setidaknya satu huruf kecil, satu huruf besar, dan satu angka'
    ),
});

export const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password harus diisi'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;