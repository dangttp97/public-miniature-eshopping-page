import { buttonClass } from "@/components/Button/Button";
import { Link } from "@koniwa/router";

type NotFoundProps = { title: string; message?: string };

export const NotFound = ({ title, message }: NotFoundProps) => (
  <div className="page">
    <h1>{title}</h1>
    {message && <p className="muted">{message}</p>}
    <Link to="/" className={buttonClass({ variant: "outline" })}>
      Về trang chủ
    </Link>
  </div>
);
