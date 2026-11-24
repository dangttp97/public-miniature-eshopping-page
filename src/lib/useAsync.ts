import { type DependencyList, useEffect, useState } from "@koniwa/core";

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "done"; data: T };

export const useAsync = <T>(load: () => Promise<T>, deps: DependencyList) => {
  const [state, setState] = useState<AsyncState<T>>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let isCurrent = true;
    setState((prev) => (prev.status === "loading" ? prev : { status: "loading" }));
    load().then(
      (data) => isCurrent && setState({ status: "done", data }),
      (error: Error) => isCurrent && setState({ status: "error", error }),
    );
    return () => {
      isCurrent = false;
    };
  }, [...deps, attempt]);

  const retry = () => setAttempt((n) => n + 1);
  return { ...state, retry };
};
