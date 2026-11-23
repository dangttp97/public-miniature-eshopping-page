const vndFormatter = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" });

export const formatVnd = (amount: number) => vndFormatter.format(amount);

export const discountPercent = (price: number, originalPrice: number) => {
  if (originalPrice <= price) return 0;
  return Math.round((1 - price / originalPrice) * 100);
};

const WIKIMEDIA_FILE = /^(?<base>https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/(?<hashDir>\w\/\w\w)\/(?<fileName>[^/]+)$/;

export const wikimediaThumbnail = (imageUrl: string, width: number) => {
  const match = imageUrl.match(WIKIMEDIA_FILE);
  if (!match?.groups) return imageUrl;

  const { base, hashDir, fileName } = match.groups;
  return `${base}/thumb/${hashDir}/${fileName}/${width}px-${fileName}`;
};
