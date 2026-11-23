import { type Child, mount } from "jsx-lite-renderer";

type Page = (props: {
  params: Record<string, string>;
}) => Child | Promise<Child>;
type Routes = Record<string, Page>;
type Views = { loading: () => Child; error: (e: Error) => Child };

let render: (showLoading?: boolean) => void;

export const navigate = (to: string) => {
  history.pushState({ from: location.pathname }, "", to);
  render();
  scrollTo(0, 0);
};

export const back = (fallback = "/") => {
  if (history.state?.from) return history.back();
  history.replaceState(null, "", fallback);
  render();
};

export const refresh = () => render(false);

export const startRouter = (
  { "*": notFound = () => "Not found", ...routes }: Routes,
  root: Element,
  views: Views,
) => {
  const table = Object.entries(routes).map(([pattern, page]) => {
    const keys = [...pattern.matchAll(/:(\w+)/g)].map((m) => m[1]);
    return {
      re: new RegExp(`^${pattern.replace(/:\w+/g, "([^/]+)")}/?$`),
      keys,
      page,
    };
  });

  const current = () => {
    for (const { re, keys, page } of table) {
      const match = re.exec(location.pathname);
      if (match)
        return page({
          params: Object.fromEntries(
            keys.map((k, i) => [k, decodeURIComponent(match[i + 1])]),
          ),
        });
    }
    return notFound({ params: {} });
  };

  let version = 0;
  render = (showLoading = true) => {
    const mine = ++version;
    const view = Promise.resolve().then(current);
    if (showLoading) mount(views.loading(), root);
    view.then(
      (child) => mine === version && mount(child, root),
      (e: Error) => mine === version && mount(views.error(e), root),
    );
  };

  addEventListener("popstate", () => render());
  document.addEventListener("click", (e) => {
    const a = (e.target as Element).closest("a");
    if (
      !a ||
      a.origin !== location.origin ||
      a.target ||
      e.ctrlKey ||
      e.metaKey ||
      e.shiftKey
    )
      return;
    e.preventDefault();
    navigate(a.pathname + a.search);
  });

  render();
};
