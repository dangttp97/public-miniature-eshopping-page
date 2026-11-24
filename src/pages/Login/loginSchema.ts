import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Email chưa đúng định dạng")),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
