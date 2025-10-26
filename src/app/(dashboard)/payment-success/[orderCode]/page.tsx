"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  ArrowRight,
  Download,
  Play,
  Clock,
  Award
} from "lucide-react";
import { toast } from "react-toastify";
import { formatMoney } from "@/utils";
import Image from "next/image";
import { getOrderForPayment } from "@/lib/actions/order.actions";
import Link from "next/link";

interface OrderData {
  _id: string;
  code: string;
  amount: number;
  total: number;
  status: string;
  course: {
    _id: string;
    title: string;
    image: string;
    slug: string;
  };
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const PaymentSuccessPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const result = await getOrderForPayment({ code: orderCode });
        
        if (result.success && result.data) {
          setOrderData(result.data);
        } else {
          toast.error(result.message || "Không tìm thấy đơn hàng");
          router.push("/");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderCode) {
      fetchOrderData();
    }
  }, [orderCode, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy đơn hàng</h1>
          <Button onClick={() => router.push("/")}>
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cảm ơn bạn đã mua khóa học. Bạn có thể bắt đầu học ngay bây giờ.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-5 h-5" />
                Khóa học của bạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <Image
                  src={orderData.course.image || "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                  alt={orderData.course.title}
                  width={120}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">
                    {orderData.course.title}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      Truy cập trọn đời
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      <Award className="w-3 h-3 mr-1" />
                      Đã mua
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button asChild className="w-full h-12 bg-primary hover:bg-primary/90">
                  <Link href={`/${orderData.course.slug}/lesson`}>
                    <Play className="w-4 h-4 mr-2" />
                    Bắt đầu học ngay
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full">
                  <Link href="/study">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Xem tất cả khóa học
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết đơn hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mã đơn hàng:</span>
                  <span className="font-mono font-semibold">{orderData.code}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Ngày mua:</span>
                  <span>{new Date(orderData.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Trạng thái:</span>
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Hoàn thành
                  </Badge>
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Tổng thanh toán:</span>
                  <span className="text-primary">
                    {formatMoney(orderData.total)} đ
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  Những gì bạn nhận được:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• Truy cập trọn đời khóa học</li>
                  <li>• Tài liệu và source code</li>
                  <li>• Hỗ trợ từ cộng đồng</li>
                  <li>• Chứng chỉ hoàn thành</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Cần hỗ trợ? Liên hệ với chúng tôi qua email hoặc chat
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/my-orders">
                Xem đơn hàng của tôi
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/my-certificates">
                Chứng chỉ của tôi
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
