"use client";
import { createNewOrder } from "@/lib/actions/order.actions";
import { IUser } from "@/types/type";
import { createOrderCode } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import CouponForm from "./CouponForm";
import { Button } from "@/components/ui/button";
import { CreditCard, ShoppingCart } from "lucide-react";

const LinkToErrolCourse = ({
  user,
  courseId,
  price,
}: {
  user: any | null | undefined;
  courseId: string;
  price: number;
}) => {
  const router = useRouter();
  const [priceAfterCoupon, setPriceAfterCoupon] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponId, setCouponId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleErrolCourse = async (price: number, paymentType: 'order' | 'online') => {
    if (!user) {
      toast.error("Vui lòng đăng nhập để thực hiện chức năng này !");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const code = createOrderCode();
      const finalPrice = priceAfterCoupon > 0 ? priceAfterCoupon : price;
      
      const res = await createNewOrder({
        user: user?._id,
        course: courseId,
        code,
        amount: finalPrice,
        total: finalPrice,
        coupon: couponId,
      });

      if (!res.success) {
        Swal.fire({
          text: `Đơn hàng của bạn đã được tạo ! Xem đơn hàng bạn đã mua ?`,
          title: "Xem đơn hàng",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Đồng ý",
        }).then(async (result) => {
          if (result.isConfirmed) {
            router.push(`/order/${res.data.code}`);
          }
        });
      } else {
        toast.success(res.message);
        
        if (paymentType === 'online') {
          // Redirect to payment gateway
          toast.info("Chuyển hướng đến trang thanh toán...");
          router.push(`/payment/${code}`);
        } else {
          router.push(`/order/${code}`);
        }
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {price > 0 ? (
        <div>
          <CouponForm
            courseId={courseId}
            priceAfterCoupon={priceAfterCoupon}
            setPriceAfterCoupon={setPriceAfterCoupon}
            price={price}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            setCouponId={setCouponId}
          />
          
          {/* Payment Buttons */}
          <div className="space-y-3 mt-6">
            {/* Online Payment Button */}
            <Button
              onClick={() => handleErrolCourse(price, 'online')}
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              {isLoading ? "Đang xử lý..." : "Thanh toán online"}
            </Button>
            
            {/* Order Button */}
            <Button
              onClick={() => handleErrolCourse(price, 'order')}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all duration-200"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {isLoading ? "Đang xử lý..." : "Mua ngay"}
            </Button>
          </div>
          
          {/* Payment Info */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Thanh toán online:</strong> Thanh toán ngay bằng thẻ ngân hàng, ví điện tử
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              <strong>Mua ngay:</strong> Tạo đơn hàng và thanh toán sau
            </p>
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">PayPal</span>
              <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">Visa</span>
              <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">Mastercard</span>
              <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">MoMo</span>
              <span className="text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">ZaloPay</span>
            </div>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => handleErrolCourse(price, 'order')}
          disabled={isLoading}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-200"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isLoading ? "Đang xử lý..." : "Nhận khóa học miễn phí"}
        </Button>
      )}
    </div>
  );
};

export default LinkToErrolCourse;
