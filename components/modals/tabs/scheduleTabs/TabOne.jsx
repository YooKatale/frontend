"use client";

import ButtonComponent from "@components/Button";
import { FormatCurr } from "@utils/utils";
import { ChevronRight, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const TabOne = ({ updateTabIndex, data, fetchData }) => {
  const [orderTotal, setOrderTotal] = useState(0);
  const [productTotal, setProductTotal] = useState(0);
  const [Products, setProducts] = useState(data.Products);

  // function to calculate the cart total
  const calcCartTotal = () => {
    let newCartTotal = Products.reduce((a, b) => {
      return a + parseInt(b?.price) * parseInt(b?.quantity);
    }, 0);

    setProductTotal((prevState) => newCartTotal);
    setOrderTotal((prev) =>
      data.scheduleRepeat
        ? newCartTotal * (data.scheduleDays.length * 4)
        : newCartTotal * data.scheduleDays.length
    );
  };

  // function to handle increasing and reducing product quantity
  const IncreaseProductQuantity = (id) => {
    // find the index of the product in the product array
    const currentProductIndex = Products.findIndex(
      (product) => product._id === id
    );

    // Increase product quantity
    let updatedProduct = {
      ...Products[currentProductIndex],
      quantity: Products[currentProductIndex].quantity + 1,
    };

    // update the Products array
    setProducts([
      ...Products.slice(0, currentProductIndex),
      updatedProduct,
      ...Products.slice(currentProductIndex + 1),
    ]);
  };

  const ReduceProductQuantity = (id) => {
    // check if the current product quantity is 1. If true don't reduce else reduce
    // find the index of the product in the product array
    const currentProductIndex = Products.findIndex(
      (product) => product._id === id
    );

    // Reduce product quantity
    let updatedProduct = {
      ...Products[currentProductIndex],
      quantity:
        Products[currentProductIndex].quantity === 1
          ? Products[currentProductIndex].quantity
          : Products[currentProductIndex].quantity - 1,
    };

    // update the Products array
    setProducts([
      ...Products.slice(0, currentProductIndex),
      updatedProduct,
      ...Products.slice(currentProductIndex + 1),
    ]);
  };

  // function to update tab index and set tab one data
  const handleTabOne = () => {
    updateTabIndex(1);
    fetchData({
      Products,
      productTotal,
      orderTotal,
      scheduleDays: data.scheduleDays,
      repeatSchedule: data.scheduleRepeat,
    });
  };

  useEffect(() => {
    calcCartTotal();
  }, [Products]);

  return (
    <div className="py-4">
      <div className="py-4">
        <h3 className="text-lg">
          Note: Delivery schedule runs for 4 weeks (1 month) when you select
          repeat schedule and is automatically cancelled after
        </h3>
      </div>

      <div className="">
        <div className="py-2">
          <h3 className="text-lg">Select quantity for each product</h3>
        </div>

        <div className="py-2 max-h-[300px] grid grid-cols-2 gap-4">
          {Products.map((product, index) => (
            <div
              className="border-2 border-light rounded-md p-2 flex"
              key={index}
            >
              <div className="w-3/5">
                <div className="">
                  <p className="text-lg font-bold text-primary">
                    {product.name}
                  </p>
                  <h3 className="text-base">{product.category}</h3>
                  <p className="text-sm text-gray-600">
                    Quantity: {product.quantity != null && product.quantity !== "" ? `${product.quantity}${product.unit ? ` ${product.unit}` : ""}` : "Not specified"}
                  </p>
                </div>

                <div className="py-2"></div>
              </div>

              <div className="w-2/5">
                <div className="">
                  <p className="text-lg">UGX {FormatCurr(product.price)}</p>
                </div>

                <div className="py-3">
                  <div className="flex border-[1.8px] rounded-md w-fit justify-center h-[2.5rem]">
                    <div className="cursor-pointer px-2 pt-2">
                      <Minus
                        size={22}
                        className="cursor-pointer"
                        onClick={() => ReduceProductQuantity(product._id)}
                      />
                    </div>

                    <div className="px-2 py-1">
                      <p className="text-lg font-bold">{product?.quantity}</p>
                    </div>

                    <div className="cursor-pointer px-2 pt-2">
                      <Plus
                        size={22}
                        className="cursor-pointer"
                        onClick={() => IncreaseProductQuantity(product._id)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="py-2">
        <div className="mb-2">
          <h3 className="text-lg">
            Products Total:{" "}
            <span className="font-bold text-primary">
              UGX {FormatCurr(productTotal)}
            </span>
          </h3>
        </div>

        <div className="mb-2">
          <h3 className="text-lg">
            Total {"("}
            {data.scheduleRepeat ? "4 weeks" : "1 week"}
            {")"} :{" "}
            <span className="font-bold text-primary">
              UGX {FormatCurr(orderTotal)}
            </span>
          </h3>
        </div>
      </div>

      <div className="p-2 flex justify-end">
        <div className="w-fit" onClick={handleTabOne}>
          <ButtonComponent
            icon={<ChevronRight size={20} />}
            text={"next"}
            type={"button"}
            size={"regular"}
          />
        </div>
      </div>
    </div>
  );
};

export default TabOne;
