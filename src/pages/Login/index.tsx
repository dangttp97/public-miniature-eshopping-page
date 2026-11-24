import { login } from "@/api/auth";
import { setSession } from "@/api/session";
import { Field } from "@/components/Field/Field";
import { AuthForm } from "@/features/auth/AuthForm";
import { validateForm } from "@/lib/form";
import { ReplaceLink, useBack } from "@/lib/navigation";
import { useState } from "@koniwa/core";

import { loginSchema } from "./loginSchema";

export const Login = () => {
  const back = useBack();
  const [isBusy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    const data = validateForm(e.currentTarget as HTMLFormElement, loginSchema);
    if (!data) return;

    setBusy(true);
    try {
      setSession(await login(data.email, data.password));
      back();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthForm
      title="Đăng nhập"
      lead="Chào mừng trở lại. Nhập email và mật khẩu để tiếp tục."
      submitLabel="Đăng nhập"
      isBusy={isBusy}
      error={error}
      onSubmit={handleSubmit}
      footer={
        <>
          <p>
            Chưa có tài khoản? <ReplaceLink to="/register">Đăng ký</ReplaceLink>
          </p>
          {import.meta.env.DEV && (
            <p>
              Tài khoản thử: an@example.vn / matkhau123 hoặc binh@example.vn /
              123456.
            </p>
          )}
        </>
      }
    >
      <Field label="Email" name="email" type="email" autocomplete="email" required />
      <Field
        label="Mật khẩu"
        name="password"
        type="password"
        autocomplete="current-password"
        required
      />
    </AuthForm>
  );
};
