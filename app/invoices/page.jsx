"use client";
import * as React from "react"
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import numeral from "numeral"
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
import Image from "next/image";
import { Card, Col, Row } from "antd";


const Invoice = () => {
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);
  const [shippingfee, setShippingFee]= useState(0.05);
  const [collectionfee, setCollectionFee]= useState(0.03);
  const [fixedfee, setFixedFee]= useState(500);
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
    <div align="center" className="p-4">
      <Row style={{justifyContent: "center"}}>
        <Col span={18}>
      <Card
       hoverable
      >
      
      
      <div className="h-24 w-26 mr-4" style={{position:'relative'}}>
            <Image
              src={"/assets/icons/logo1.png"}
              alt="Logo"
              //fill={true}
              className="object-contain"
              width={100}
              height={100}
              
            />
          </div>
      <div align="center" style={{alignContent:'flex-end'}}>
        {/* <p className="text-xl mb-4">Company Name: Yookatale</p> */}
        <p className="text-xl mb-3 font-semibold">Yookatale (U) Ltd</p>
        {/* <p className="text-xl mb-4">
          Address: Clock Tower, Kampala, Naguru (U)
        </p> */}
        <p className="text-l mb-3">
          Clock Tower, Kampala, Naguru (U)
        </p>
        {/* <p className="text-xl mb-4">Email: info@yookatale.com</p> */}
        <p className="text-l mb-3">info@yookatale.com</p>
        <p className="text-l font-semibold mt-8 mb-8" style={{fontSize:17, fontWeight:'600'}}>INVOICE</p>
      </div>
      <div style={{backgroundColor:"#D9D9D9", padding:12, borderRadius:12, marginBottom:12}}>
        <p className="text-l font-semibold mb-2">Bill To:</p>
        {/* <p className="text-xl mb-4">
          Name: {userInfo.firstname} {userInfo.lastname}
        </p>
        <p className="text-xl mb-4">Address: {userInfo.address}</p>
        <p className="text-xl mb-4">Name: {userInfo.phone}</p>
        <p className="text-xl mb-4">Name: {userInfo.email}</p>
        <p></p> */}
        <p className="text-l mb-2">
          {userInfo.firstname} {userInfo.lastname} - {userInfo.address}.
        </p>
        <p className="text-l mb-2">{userInfo.phone} | {userInfo.email}</p>
        
        <p></p>
      </div>
      {isLoading ? (
        <p className="text-gray-600">Loading...</p>
      ) : orderData && orderData.length > 0 ? (
        // <Table>
        //   <TableCaption>Order Details</TableCaption>
        //   <TableHeader>
        //     <TableRow>
        //       <TableHead>Invoice</TableHead>
        //       <TableHead>Item</TableHead>
        //       <TableHead>Quantity</TableHead>
        //       <TableHead>Total</TableHead>
        //       <TableHead>Address 1</TableHead>
        //       <TableHead>Date</TableHead>
        //     </TableRow>
        //   </TableHeader>

        //   <TableBody>
        //     {orderData.map((order, index) => (
        //       <TableRow key={index}>
        //         <TableCell>Invoice {index + 1}</TableCell>
        //         <TableCell>
        //           <ul>
        //             {order.products.map((product, productIndex) => (
        //               <div key={productIndex}>
        //                 <li>{product.name}</li>
        //                 <li>{numeral(product.price).format(',')}</li>
        //               </div>
        //             ))}
        //           </ul>
        //         </TableCell>
        //         <TableCell>{order.productItems}</TableCell>
        //         <TableCell>{numeral(order.total).format(',')}</TableCell>
        //         <TableCell>{order.deliveryAddress.address1}</TableCell>
        //         <TableCell>
        //           {new Date(order.createdAt).toLocaleString()}
        //         </TableCell>
        //       </TableRow>
        //     ))}
        //   </TableBody>
        // </Table>
      
        <Table>
        {/* <TableCaption>Invoice Details</TableCaption> */}
          <TableHeader>
             <TableRow>
               <TableHead><th>Item</th></TableHead>
               <TableHead><th>Details / Decscription</th></TableHead>
              
               <TableHead><th>Total (UGX)</th></TableHead>
              
             </TableRow>
           </TableHeader>
        <TableBody>
          {orderData.map((invoice, index) => (
            <React.Fragment key={index}>
              
                    {invoice.products.map((product, productIndex) => (
                      <>
                      <TableRow key={productIndex}>
                       
                          <TableCell>
                            <ul>
                              <li style={{ paddingBottom: 12 }}><strong>Invoice {index + 1},</strong>
                                &nbsp;<span>Date - {new Date(invoice.createdAt).toLocaleDateString()}</span>
                              </li>
                              <li>{product.name} <br></br>Qty - {invoice.productItems}<br></br>
                                Ship to : {invoice.deliveryAddress.address1}
                              </li>
                            </ul>
                          </TableCell>
                        
                          <TableCell>
                            <ul>
                              <li style={{ paddingBottom: 2 }}>Market price - UGX {numeral(product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>Commission (15%) - {numeral(0.15 * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>Shipping Fee - {numeral(shippingfee * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>Collection Fee - {numeral(collectionfee * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>Fixed Fee - {numeral(fixedfee).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>Total Marketplace Fee </li>
                              <li style={{ paddingBottom: 2 }}> GST on Marketplace Fee </li>
                              <li style={{ paddingBottom: 2 }}> Total Marketplace Fee + GST</li>
                              <li style={{ paddingBottom: 2 }}> Net Realisation</li>
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li style={{ paddingBottom: 2 }}>{numeral(product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral(0.15 * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral(shippingfee * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral(collectionfee * product.price).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral(fixedfee).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + (fixedfee))).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral((0.18) * ((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + fixedfee))).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral(((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + fixedfee)) +
                                ((0.18) * ((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + fixedfee)))).format(',')}</li>
                              <li style={{ paddingBottom: 2 }}>{numeral((product.price) - (((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + fixedfee)) +
                                ((0.18) * ((0.15 * product.price) + ((shippingfee * product.price) + (collectionfee * product.price) + fixedfee))))).format(',')}</li>
                            </ul>
                          </TableCell>
                       </TableRow>
                        <TableRow>
                          <TableCell></TableCell>
                          <TableCell>
                            <ul>
                              <li style={{ fontSize: 15, fontWeight: '400' }}>Amount Payable</li>
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li style={{ fontSize: 15, fontWeight: '400' }}>UGX {numeral(invoice.total).format(',')}</li>
                            </ul>
                          </TableCell>
                        </TableRow>
                        {index == orderData.length - 1 && <><TableRow>
                          <TableCell>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li style={{ fontSize: 15, fontWeight: '700' }}>Total Amount Payable For all Invoices</li>
                            </ul>
                          </TableCell>
                          <TableCell>
                            <ul>
                              <li style={{ fontSize: 15, fontWeight: '700' }}>UGX {numeral(orderData.reduce((sum, invoice) => sum + invoice.total, 0)).format(',')}</li>
                            </ul>
                          </TableCell>
                        </TableRow>
                        <TableRow></TableRow>
                        </>
                        }
                       </>
                     ))}
              {/* {index < orderData.length - 1 && <TableRow><TableCell colSpan="2"><hr /></TableCell></TableRow>} */}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    
      ) : (
        <p className="text-gray-600">No invoices found.</p>
      )}
      </Card>
      </Col>
      </Row>
    </div>
   
  );
};

export default Invoice;
