const DAY_MS = 24 * 60 * 60 * 1000;

const roundMoney = (value) => Math.round(value * 100) / 100;

/**
 * Works out what a product costs right now. A discount applies only between
 * its start date and the end of its end date (both inclusive).
 */
export function priceInfo(metas = {}, now = new Date()) {
  const price = roundMoney(Number(metas.price) || 0);
  const discount = Math.min(Math.max(Number(metas.discount) || 0, 0), 100);

  const start = metas.discount_start_date ? new Date(metas.discount_start_date).getTime() : NaN;
  const end = metas.discount_end_date ? new Date(metas.discount_end_date).getTime() + DAY_MS : NaN;
  const time = now.getTime();

  const hasDiscount = discount > 0 && start <= time && time < end;
  const discountPrice = roundMoney((price * (100 - discount)) / 100);

  return {
    price,
    discount_price: hasDiscount ? discountPrice : price,
    has_discount: hasDiscount,
    unit_price: hasDiscount ? discountPrice : price,
  };
}
