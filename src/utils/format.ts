const vndFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});
export const vnd = (amount: number) => vndFormat.format(amount);

export const discountPercent = (price: number, original: number) =>
  original > price ? Math.round((1 - price / original) * 100) : 0;

export const thumb = (url: string, width: number) => {
  const m = url.match(
    /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(\w\/\w\w)\/([^/]+)$/,
  );
  return m ? `${m[1]}/thumb/${m[2]}/${m[3]}/${width}px-${m[3]}` : url;
};
