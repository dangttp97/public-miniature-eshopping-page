import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Vui lòng nhập họ và tên"),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.email("Email chưa đúng định dạng")),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
