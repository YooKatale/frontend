"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
} from "@components/ui/table";
import { DB_URL } from "@config/config";

const Invoice = () => {
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  console.log(orderData);

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

    fetchUserOrders();
  }, [userInfo._id]);

  return (
    <div className="p-4">
      <div>
        <p className="text-xl font-semibold mb-4">Invoice</p>
      </div>
      <div>
        <p className="text-xl mb-4">Company Name: Yookatale</p>
        <p className="text-xl mb-4">
          Address: Clock Tower, Kampala, Naguru (U)
        </p>
        <p className="text-xl mb-4">Email: info@yookatale.com</p>
      </div>
      <div>
        <p className="text-xl font-semibold mb-4">Bill To:</p>
        <p className="text-xl mb-4">
          Name: {userInfo.firstname} {userInfo.lastname}
        </p>
        <p className="text-xl mb-4">Address: {userInfo.address}</p>
        <p className="text-xl mb-4">Name: {userInfo.phone}</p>
        <p className="text-xl mb-4">Name: {userInfo.email}</p>
        <p></p>
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : orderData && orderData.length > 0 ? (
        <Table>
          <TableCaption>Order Details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Address 1</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orderData.map((order, index) => (
              <TableRow key={index}>
                <TableCell>Invoice {index + 1}</TableCell>
                <TableCell>
                  <ul>
                    {order.products.map((product, productIndex) => (
                      <div>
                        <li key={productIndex}>{product.name}</li>
                        <li key={productIndex}>{product.price}</li>
                      </div>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>{order.productItems}</TableCell>
                <TableCell>{order.total}</TableCell>
                <TableCell>{order.deliveryAddress.address1}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-gray-600">No invoices found.</p>
      )}
    </div>
  );
};

export default Invoice;
