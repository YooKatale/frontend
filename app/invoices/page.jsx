"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@components/ui/table";
import { DB_URL } from "@config/config";
import { ThemeColors } from "@constants/constants";
import Image from "next/image";
import { Card, Col, Row, Spin, Divider, Typography, Tag, Button } from "antd";
import {
  DownloadOutlined,
  PrinterOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const themeBg = `${ThemeColors.primaryColor}12`;
const themeBgLight = `${ThemeColors.primaryColor}08`;

const Invoice = () => {
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const [shippingfee, setShippingFee] = useState(0.05);
  const [collectionfee, setCollectionFee] = useState(0.03);
  const [fixedfee, setFixedFee] = useState(500);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${DB_URL}/products/orders/${userInfo._id}`
        );
        if (response.status === 200) {
          setOrderData(response.data.data.AllOrders);
          setIsLoading(false);
        } else {
          throw new Error("Failed to fetch user orders");
        }
      } catch (error) {
        console.error("Error while fetching user orders:", error);
        setIsLoading(false);
      }
    };

    if (userInfo?._id) {
      fetchUserOrders();
    }
  }, [userInfo?._id]);

  const calculateTotalFees = (price) => {
    const commission = 0.15 * price;
    const shipping = shippingfee * price;
    const collection = collectionfee * price;
    const totalFee = commission + shipping + collection + fixedfee;
    const gst = 0.18 * totalFee;
    const totalWithGst = totalFee + gst;
    const netRealisation = price - totalWithGst;

    return {
      commission,
      shipping,
      collection,
      fixedfee,
      totalFee,
      gst,
      totalWithGst,
      netRealisation,
    };
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    console.log("Download invoice as PDF");
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "green";
      case "pending":
        return "orange";
      case "processing":
        return "cyan";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  return (
    <div
      className="min-h-screen p-4 md:p-6"
      style={{
        background: `linear-gradient(to bottom right, #f9fafb, ${themeBgLight})`,
      }}
    >
      <Row justify="center">
        <Col xs={24} lg={20} xl={18}>
          <Card
            className="shadow-xl border-0 overflow-hidden"
            style={{
              borderRadius: "16px",
              background: "white",
              border: "1px solid #e5e7eb",
            }}
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative w-16 h-16 md:w-20 md:h-20 mr-4 flex-shrink-0">
                  <Image
                    src="/assets/icons/logo1.png"
                    alt="Yookatale Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
                <div>
                  <Title level={2} className="m-0 text-gray-900">
                    Yookatale (U) Ltd
                  </Title>
                  <Text className="text-gray-600">
                    Clock Tower, Kampala, Naguru (U)
                  </Text>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center justify-end gap-2 mb-3">
                  <FileTextOutlined
                    style={{ color: ThemeColors.primaryColor }}
                  />
                  <Title level={3} className="m-0 text-gray-800">
                    INVOICE
                  </Title>
                </div>
                <div className="flex gap-3">
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={handlePrint}
                    className="flex items-center"
                  >
                    Print
                  </Button>
                  <Button
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={handleDownload}
                    className="flex items-center"
                    style={{
                      background: ThemeColors.primaryColor,
                      borderColor: ThemeColors.primaryColor,
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>

            {/* Bill To Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div
                className="p-6 rounded-xl"
                style={{
                  background: `linear-gradient(to right, ${themeBgLight}, ${themeBg})`,
                  border: `1px solid ${ThemeColors.primaryColor}25`,
                }}
              >
                <Title
                  level={4}
                  className="flex items-center gap-2 text-gray-800 mb-4"
                >
                  <UserOutlined
                    style={{ color: ThemeColors.primaryColor }}
                  />
                  Bill To
                </Title>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UserOutlined className="text-gray-500" />
                    <Text strong className="text-gray-800">
                      {userInfo?.firstname} {userInfo?.lastname}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <EnvironmentOutlined className="text-gray-500" />
                    <Text className="text-gray-700">{userInfo?.address}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneOutlined className="text-gray-500" />
                    <Text className="text-gray-700">{userInfo?.phone}</Text>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailOutlined className="text-gray-500" />
                    <Text className="text-gray-700">{userInfo?.email}</Text>
                  </div>
                </div>
              </div>

              <div
                className="p-6 rounded-xl"
                style={{
                  background: `linear-gradient(to right, ${themeBgLight}, ${themeBg})`,
                  border: `1px solid ${ThemeColors.primaryColor}25`,
                }}
              >
                <Title
                  level={4}
                  className="flex items-center gap-2 text-gray-800 mb-4"
                >
                  <ShoppingCartOutlined
                    style={{ color: ThemeColors.primaryColor }}
                  />
                  Company Info
                </Title>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Email:</Text>
                    <Text strong>info@yookatale.com</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">VAT:</Text>
                    <Text strong>18% GST Applied</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text className="text-gray-600">Payment Terms:</Text>
                    <Text strong>Net 15 Days</Text>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoices List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Spin size="large" tip="Loading invoices..." />
              </div>
            ) : orderData && orderData.length > 0 ? (
              <div className="space-y-6">
                {orderData.map((invoice, index) => (
                  <div
                    key={index}
                    className="rounded-xl overflow-hidden"
                    style={{
                      border: `1px solid #e5e7eb`,
                    }}
                  >
                    {/* Invoice Header */}
                    <div
                      className="px-6 py-4 border-b"
                      style={{
                        background: `linear-gradient(to right, #f9fafb, ${themeBgLight})`,
                      }}
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <Title level={4} className="m-0 text-gray-800">
                              Invoice #{index + 1}
                            </Title>
                            <Tag color={getStatusColor(invoice.status)}>
                              {invoice.status || "Completed"}
                            </Tag>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <CalendarOutlined className="text-gray-500" />
                            <Text className="text-gray-600">
                              {new Date(
                                invoice.createdAt
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Text>
                          </div>
                        </div>
                        <div className="text-right">
                          <Text
                            strong
                            className="text-lg text-gray-800"
                            style={{
                              color: ThemeColors.primaryColor,
                            }}
                          >
                            Order Total: UGX{" "}
                            {numeral(invoice.total).format(",")}
                          </Text>
                        </div>
                      </div>
                    </div>

                    {/* Products List */}
                    <div className="p-0">
                      <Table className="border-0">
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">
                              Item
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700">
                              Description
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-right">
                              Total (UGX)
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoice.products?.map((product, productIndex) => {
                            const fees =
                              calculateTotalFees(product.price);

                            return (
                              <React.Fragment key={productIndex}>
                                <TableRow className="hover:bg-gray-50">
                                  <TableCell>
                                    <div className="space-y-2">
                                      <Text
                                        strong
                                        className="text-gray-800 block"
                                      >
                                        {product.name}
                                      </Text>
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <Text className="text-gray-600">
                                            Quantity:
                                          </Text>
                                          <Tag
                                            style={{
                                              background:
                                                ThemeColors.primaryColor,
                                              color: "white",
                                              border: "none",
                                            }}
                                          >
                                            {parseInt(invoice.productItems, 10) || 0}
                                          </Tag>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <EnvironmentOutlined className="text-gray-500 text-sm" />
                                          <Text className="text-gray-600 text-sm">
                                            {invoice.deliveryAddress?.address1}
                                          </Text>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Market price
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(product.price).format(
                                            ","
                                          )}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Commission (15%)
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(fees.commission).format(
                                            ","
                                          )}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Shipping Fee (5%)
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(fees.shipping).format(",")}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Collection Fee (3%)
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(fees.collection).format(
                                            ","
                                          )}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Fixed Fee
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(fees.fixedfee).format(",")}
                                        </Text>
                                      </div>
                                      <Divider className="my-2" />
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Total Marketplace Fee
                                        </Text>
                                        <Text strong>
                                          UGX{" "}
                                          {numeral(fees.totalFee).format(",")}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          GST on Marketplace Fee (18%)
                                        </Text>
                                        <Text>
                                          UGX{" "}
                                          {numeral(fees.gst).format(",")}
                                        </Text>
                                      </div>
                                      <div className="flex justify-between">
                                        <Text className="text-gray-600">
                                          Total Marketplace Fee + GST
                                        </Text>
                                        <Text
                                          strong
                                          style={{
                                            color:
                                              ThemeColors.primaryColor,
                                          }}
                                        >
                                          UGX{" "}
                                          {numeral(
                                            fees.totalWithGst
                                          ).format(",")}
                                        </Text>
                                      </div>
                                      <Divider className="my-2" />
                                      <div
                                        className="p-3 rounded-lg"
                                        style={{
                                          background: themeBgLight,
                                          border: `1px solid ${ThemeColors.primaryColor}25`,
                                        }}
                                      >
                                        <div className="flex justify-between">
                                          <Text className="text-gray-800 font-semibold">
                                            Net Realisation
                                          </Text>
                                          <Text
                                            strong
                                            className="text-lg"
                                            style={{
                                              color:
                                                ThemeColors.secondaryColor,
                                            }}
                                          >
                                            UGX{" "}
                                            {numeral(
                                              fees.netRealisation
                                            ).format(",")}
                                          </Text>
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="space-y-1">
                                      {Object.entries(fees).map(
                                        ([key, value]) => (
                                          <div
                                            key={key}
                                            className="py-1"
                                          >
                                            <Text className="text-gray-700">
                                              {key === "totalWithGst" ||
                                              key === "netRealisation" ? (
                                                <strong>
                                                  {numeral(value).format(
                                                    ","
                                                  )}
                                                </strong>
                                              ) : (
                                                numeral(value).format(",")
                                              )}
                                            </Text>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </React.Fragment>
                            );
                          })}
                        </TableBody>
                      </Table>

                      {/* Invoice Footer */}
                      <div className="bg-gray-50 px-6 py-4 border-t">
                        <div className="flex justify-between items-center">
                          <Text className="text-gray-600">
                            Invoice #{index + 1} Amount Payable
                          </Text>
                          <Title
                            level={4}
                            className="m-0 text-gray-800"
                            style={{
                              color: ThemeColors.primaryColor,
                            }}
                          >
                            UGX{" "}
                            {numeral(invoice.total).format(",")}
                          </Title>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Compact Summary: Grand Total + Stats */}
                <div
                  className="rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                  style={{
                    background: `linear-gradient(to right, ${ThemeColors.primaryColor}, ${ThemeColors.secondaryColor})`,
                  }}
                >
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    <span className="text-white font-semibold text-base">
                      Total Payable:{" "}
                      <span className="font-bold text-lg">
                        UGX{" "}
                        {numeral(
                          orderData.reduce((sum, inv) => sum + inv.total, 0)
                        ).format(",")}
                      </span>
                    </span>
                    <span className="text-white/90 text-sm">
                      {orderData.length} invoices ·{" "}
                      {orderData.reduce(
                        (sum, inv) =>
                          sum + (parseInt(inv.productItems, 10) || 0),
                        0
                      )}{" "}
                      items · Avg UGX{" "}
                      {numeral(
                        orderData.reduce((sum, inv) => sum + inv.total, 0) /
                          orderData.length
                      ).format("0,0")}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-6">
                  <FileTextOutlined
                    className="text-6xl"
                    style={{ color: "#d1d5db" }}
                  />
                </div>
                <Title level={4} className="text-gray-600 mb-2">
                  No invoices found
                </Title>
                <Text className="text-gray-500">
                  You don&apos;t have any invoices yet. Start shopping to
                  generate your first invoice.
                </Text>
              </div>
            )}

            {/* Footer — compact */}
            <Divider className="my-2" />
            <div className="text-center py-2">
              <Text className="text-gray-500 text-sm">
                Thank you for choosing Yookatale · Computer-generated invoice. No signature required.
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .ant-btn,
          .ant-tag,
          .ant-divider:last-child {
            display: none !important;
          }
          .ant-card {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Invoice;
