import { ICommentItem } from "@/types/type";
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
// Tạo cấu trúc dạng cây từ mảng phẳng
export function buildCommentTree(comments: ICommentItem[]) {
  const map = new Map<string, ICommentItem & { children?: ICommentItem[] }>();
  const roots: (ICommentItem & { children?: ICommentItem[] })[] = [];

  for (const comment of comments) {
    map.set(comment._id, { ...comment, children: [] });
  }

  for (const comment of comments) {
    if (comment.parentId) {
      const parent = map.get(comment.parentId.toString());
      if (parent) {
        parent.children!.push(map.get(comment._id)!);
      }
    } else {
      roots.push(map.get(comment._id)!);
    }
  }

  return roots;
}
