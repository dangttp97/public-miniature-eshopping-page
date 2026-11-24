import { type Child, useEffect } from "@koniwa/core";
import { useNavigate } from "@koniwa/router";

const isLandingEntry = () => history.state?.landing === true;

export const markLandingEntry = () => history.replaceState({ landing: true }, "");

export const useReplace = () => {
  const navigate = useNavigate();
  return (to: string) => {
    const wasLanding = isLandingEntry();
    navigate(to, { replace: true });
    if (wasLanding) markLandingEntry();
  };
};

export const useBack = () => {
  const navigate = useNavigate();
  const replace = useReplace();
  return (fallback = "/") => {
    if (isLandingEntry()) replace(fallback);
    else navigate(-1);
  };
};

const isModifiedClick = (event: MouseEvent) =>
  event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey;

export const ReplaceLink = ({ to, children, ...attributes }: { to: string; children?: Child; [attribute: string]: unknown }) => {
  const replace = useReplace();
  const handleClick = (event: MouseEvent) => {
    if (isModifiedClick(event)) return;
    event.preventDefault();
    replace(to);
  };
  return (
    <a {...attributes} href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export const Redirect = ({ to, replace = false }: { to: string; replace?: boolean }) => {
  const navigate = useNavigate();
  const replaceTo = useReplace();
  useEffect(() => {
    if (replace) replaceTo(to);
    else navigate(to);
  }, [to]);
  return null;
};
