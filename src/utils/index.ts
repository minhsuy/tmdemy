import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});
export { manrope };

export const formatMoney = (money: number) => {
  return Number(money.toFixed(1)).toLocaleString();
};
