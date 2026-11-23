import { type Child, mount } from "jsx-lite-renderer";

type Params = Record<string, string>;
type Page = (props: { params: Params }) => Child | Promise<Child>;
type Routes = Record<string, Page>;
type Views = { loading: () => Child; error: (error: Error) => Child };

type Route = { pattern: RegExp; paramNames: string[]; page: Page };

let routes: Route[] = [];
let notFoundPage: Page = () => "Not found";
let root: Element;
let views: Views;
let latestRenderId = 0;

const toRoute = (path: string, page: Page): Route => {
  const paramNames = [...path.matchAll(/:(\w+)/g)].map(([, name]) => name);
  const pattern = new RegExp(`^${path.replace(/:\w+/g, "([^/]+)")}/?$`);
  return { pattern, paramNames, page };
};

const findPage = (pathname: string) => {
  for (const route of routes) {
    const match = route.pattern.exec(pathname);
    if (!match) continue;

    const values = match.slice(1).map(decodeURIComponent);
    const params = Object.fromEntries(route.paramNames.map((name, i) => [name, values[i]]));
    return { page: route.page, params };
  }
  return { page: notFoundPage, params: {} };
};

const render = async ({ showLoading = true } = {}) => {
  const renderId = ++latestRenderId;
  const isOutdated = () => renderId !== latestRenderId;

  if (showLoading) mount(views.loading(), root);

  const { page, params } = findPage(location.pathname);
  try {
    const view = await page({ params });
    if (!isOutdated()) mount(view, root);
  } catch (error) {
    if (!isOutdated()) mount(views.error(error as Error), root);
  }
};

export const navigate = (to: string) => {
  history.pushState({ from: location.pathname }, "", to);
  void render();
  scrollTo(0, 0);
};

const cameFromThisSite = () => Boolean(history.state?.from);

export const back = (fallback = "/") => {
  if (cameFromThisSite()) return history.back();
  history.replaceState(null, "", fallback);
  void render();
};

export const refresh = () => void render({ showLoading: false });

const findInternalLink = (event: MouseEvent) => {
  const link = (event.target as Element).closest("a");
  if (!link || link.origin !== location.origin || link.target) return null;
  if (event.ctrlKey || event.metaKey || event.shiftKey) return null;
  return link;
};

const onLinkClick = (event: MouseEvent) => {
  const link = findInternalLink(event);
  if (!link) return;
  event.preventDefault();
  navigate(link.pathname + link.search);
};

export const startRouter = ({ "*": notFound, ...pages }: Routes, container: Element, pageViews: Views) => {
  routes = Object.entries(pages).map(([path, page]) => toRoute(path, page));
  if (notFound) notFoundPage = notFound;
  root = container;
  views = pageViews;

  addEventListener("popstate", () => void render());
  document.addEventListener("click", onLinkClick);
  void render();
};
