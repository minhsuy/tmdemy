import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
export { manrope };

export const formatMoney = (money: number) => {
  return Number(money.toFixed(1)).toLocaleString();
};
export const createOrderCode = () => {
  const code = new Date().getTime().toString().slice(-6);
  return `DH-${code}`;
};
