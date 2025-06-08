import PageNotFound from "@/app/not-found";
import Congratulation from "@/components/common/Congratulation";
import { getOrderUser } from "@/lib/actions/order.actions";
import { IOrderManage } from "@/types/type";
import { formatMoney } from "@/utils";
import { CheckCircle } from "lucide-react";

interface OrderDetailsPageRootProps {
  params: {
    code: string;
  };
}
const OrderDetailsPageRoot = async ({ params }: OrderDetailsPageRootProps) => {
  const order = (await getOrderUser({ code: params.code })) as IOrderManage;
  if (!order) return <PageNotFound></PageNotFound>;
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-10 bg-white text-center">
      <Congratulation />
      <div className="z-10 max-w-xl w-full bg-gray-100 rounded-2xl shadow-xl p-6 md:p-10 border border-primary">
        <div className="flex flex-col items-center gap-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Cám ơn bạn đã đăng ký khóa học!
          </h1>
          <p className="text-gray-700">
            Cảm ơn{" "}
            <span className="font-medium text-primary text-xl">
              {order?.user?.name}
            </span>{" "}
            đã mua khóa học{" "}
            <strong className="text-primary">{order?.course?.title}</strong>.
          </p>
          <p className="text-gray-700">
            Tổng số tiền là{" "}
            <strong className="text-primary">
              {formatMoney(order?.total as number)} VNĐ
            </strong>
          </p>
          {order?.total === 0 ? (
            <p className="text-gray-700">
              Bạn đã sở hữu khóa học này , hãy vào khu vực học tập để học nhé !
              Mã đơn hàng :{" "}
              <strong className="text-primary">{order?.code}</strong>
            </p>
          ) : (
            <p className="text-gray-700">
              Vui lòng thanh toán theo thông tin bên dưới với nội dung chuyển
              khoản: <strong className="text-primary">{order?.code}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPageRoot;
