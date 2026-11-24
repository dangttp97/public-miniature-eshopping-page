import { register } from "@/api/auth";
import { setSession } from "@/api/session";
import { Field } from "@/components/Field/Field";
import { AuthForm } from "@/features/auth/AuthForm";
import { validateForm } from "@/lib/form";
import { ReplaceLink, useBack } from "@/lib/navigation";
import { useState } from "@koniwa/core";

import { registerSchema } from "./registerSchema";

export const Register = () => {
  const back = useBack();
  const [isBusy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    const data = validateForm(e.currentTarget as HTMLFormElement, registerSchema);
    if (!data) return;

    setBusy(true);
    try {
      setSession(await register(data.name, data.email, data.password));
      back();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <AuthForm
      title="Tạo tài khoản"
      lead="Theo dõi đơn hàng và thanh toán nhanh hơn ở lần sau."
      submitLabel="Tạo tài khoản"
      isBusy={isBusy}
      error={error}
      onSubmit={handleSubmit}
      footer={
        <p>
          Đã có tài khoản? <ReplaceLink to="/login">Đăng nhập</ReplaceLink>
        </p>
      }
    >
      <Field label="Họ và tên" name="name" autocomplete="name" required />
      <Field label="Email" name="email" type="email" autocomplete="email" required />
      <Field
        label="Mật khẩu"
        name="password"
        type="password"
        autocomplete="new-password"
        hint="Tối thiểu 6 ký tự"
        required
      />
      <Field
        label="Nhập lại mật khẩu"
        name="confirmPassword"
        type="password"
        autocomplete="new-password"
        required
      />
    </AuthForm>
  );
};
