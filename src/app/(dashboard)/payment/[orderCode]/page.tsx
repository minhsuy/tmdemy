"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Smartphone, 
  Wallet, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  Shield,
  Lock
} from "lucide-react";
import { toast } from "react-toastify";
import { formatMoney } from "@/utils";
import Image from "next/image";
import { getOrderForPayment } from "@/lib/actions/order.actions";
import PayPalPayment from "@/components/payment/PayPalPayment";

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  isAvailable: boolean;
}

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

const PaymentPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderCode = params.orderCode as string;
  
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "paypal",
      name: "PayPal",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Thanh toán qua PayPal (USD)",
      isAvailable: true,
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng/Ghi nợ",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Visa, Mastercard, JCB",
      isAvailable: true,
    },
    {
      id: "momo",
      name: "Ví MoMo",
      icon: <Smartphone className="w-6 h-6" />,
      description: "Thanh toán qua ví MoMo",
      isAvailable: true,
    },
    {
      id: "zalopay",
      name: "ZaloPay",
      icon: <Wallet className="w-6 h-6" />,
      description: "Thanh toán qua ZaloPay",
      isAvailable: true,
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Chuyển khoản trực tiếp",
      isAvailable: true,
    },
  ];

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const result = await getOrderForPayment({ code: orderCode });
        
        if (result.success && result.data) {
          setOrderData(result.data);
        } else {
          toast.error(result.message || "Không tìm thấy đơn hàng");
        }
      } catch (error) {
        toast.error("Có lỗi xảy ra khi tải thông tin đơn hàng");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderCode) {
      fetchOrderData();
    }
  }, [orderCode]);

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Thanh toán thành công!");
      
      // Redirect to success page
      router.push(`/payment-success/${orderCode}`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thanh toán");
    } finally {
      setIsProcessing(false);
    }
  };

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
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thanh toán đơn hàng
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Mã đơn hàng: <span className="font-mono font-semibold">{orderData.code}</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Chọn phương thức thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    } ${!method.isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => method.isAvailable && setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary">{method.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{method.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                ))}
                
                {/* PayPal Payment Component */}
                {selectedMethod === "paypal" && orderData && (
                  <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                      Thanh toán PayPal
                    </h4>
                    <PayPalPayment
                      orderData={orderData}
                      onPaymentSuccess={() => {
                        toast.success("Thanh toán PayPal thành công!");
                        router.push(`/payment-success/${orderCode}`);
                      }}
                      onPaymentError={(error) => {
                        console.error("PayPal Error:", error);
                        toast.error("Có lỗi xảy ra khi thanh toán PayPal");
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card className="mt-6">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <Shield className="w-5 h-5" />
                  <span className="font-semibold">Bảo mật thanh toán</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Course Info */}
                <div className="flex gap-4 mb-4">
                  <Image
                    src={orderData.course.image || "https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                    alt={orderData.course.title}
                    width={80}
                    height={60}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold line-clamp-2">
                      {orderData.course.title}
                    </h3>
                    <Badge variant="outline" className="mt-2">
                      <Clock className="w-3 h-3 mr-1" />
                      Truy cập trọn đời
                    </Badge>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Giá gốc:</span>
                    <span className="line-through text-gray-500">
                      {formatMoney(orderData.amount * 1.5)} đ
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Giảm giá:</span>
                    <span className="text-green-600">
                      -{formatMoney(orderData.amount * 0.5)} đ
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Tổng cộng:</span>
                    <span className="text-primary">
                      {formatMoney(orderData.total)} đ
                    </span>
                  </div>
                </div>

                {/* Payment Button */}
                {selectedMethod !== "paypal" && (
                  <Button
                    onClick={handlePayment}
                    disabled={!selectedMethod || isProcessing}
                    className="w-full mt-6 h-12 bg-primary hover:bg-primary/90 text-white font-semibold"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Thanh toán {formatMoney(orderData.total)} đ
                      </>
                    )}
                  </Button>
                )}
                
                {/* PayPal Info */}
                {selectedMethod === "paypal" && (
                  <div className="mt-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      <strong>PayPal:</strong> Sử dụng nút PayPal ở trên để thanh toán bằng USD
                    </p>
                  </div>
                )}

                {/* Payment Info */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Lưu ý:</strong> Sau khi thanh toán thành công, bạn sẽ được chuyển hướng đến khóa học ngay lập tức.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;