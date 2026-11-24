import { Button } from "@/components/Button/Button";
import type { AsyncState } from "@/lib/useAsync";

type PageStatusProps = {
  state: Exclude<AsyncState<unknown>, { status: "done" }> & {
    retry: () => void;
  };
};

export const PageStatus = ({ state }: PageStatusProps) =>
  state.status === "loading" ? (
    <div className="page" aria-busy="true" aria-label="Đang tải">
      <div className="skeleton" style={{ height: "160px" }} />
      <div className="skeleton" style={{ height: "320px" }} />
    </div>
  ) : (
    <div className="page">
      <h1>Không tải được dữ liệu</h1>
      <p className="muted">
        {state.error.message}. Kiểm tra WireMock đã chạy chưa (yarn mock).
      </p>
      <Button onClick={state.retry}>Thử lại</Button>
    </div>
  );
