import { Loader, Minus, Plus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import ButtonComponent from "./Button";
import { Box } from "@chakra-ui/react";

const CartCard = ({
  cart,
  ReduceProductQuantity,
  IncreaseProductQuantity,
  handleDeleteCartItem,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const imgSrc =
    typeof cart?.images === "string"
      ? cart.images
      : Array.isArray(cart?.images) && cart.images.length
      ? cart.images[0]
      : null;
  const showImage = imgSrc && !imgError;

  return (
    <div className="py-4 border-[1.9px] border-light lg:my-0 my-4 rounded-md">
      <div className="flex justify-between lg:flex-row flex-col">
        <div className="lg:w-[60%] w-full">
          <div className="flex">
            <Box
              className="w-1/5 flex-shrink-0"
              position="relative"
              aspectRatio={1}
              minW="80px"
              maxW="120px"
              bg="gray.100"
              borderRadius="md"
              overflow="hidden"
            >
              {showImage ? (
                <Image
                  src={imgSrc}
                  alt={cart?.name || "Product"}
                  fill
                  className="object-contain"
                  sizes="120px"
                  onError={() => setImgError(true)}
                />
              ) : (
                <Box
                  w="full"
                  h="full"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="xs"
                  color="gray.500"
                >
                  No image
                </Box>
              )}
            </Box>

            <div className="w-4/5 pl-4">
              <div className="">
                <h3 className="text-2xl font-medium">{cart?.name}</h3>
              </div>

              <div className="">
                <h3 className="text-base font-bold text-[#7c7c7c]">
                  {cart?.category} -{" "}
                  <span className="text-black">
                    {cart?.type == "bulk" && cart?.type}
                  </span>
                </h3>
              </div>
            </div>
          </div>
          <div
            className="py-4 px-4"
            onClick={() => {
              setIsLoading((prev) => (prev ? false : true));
              handleDeleteCartItem(cart?.cartId);

              setTimeout(() => {
                setIsLoading((prev) => (prev ? false : true));
              }, 1500);
            }}
          >
            <ButtonComponent
              text={"Delete"}
              type={"button"}
              size={"regular"}
              icon={isLoading ? <Loader size={20} /> : <Trash size={20} />}
            />
          </div>
        </div>

        <div className="lg:w-[40%] w-full flex lg:py-0 py-4">
          <div className="px-2">
            <div className="flex border-[1.8px] rounded-md w-fit justify-center h-[2.5rem]">
              <div className="cursor-pointer px-2 pt-2">
                <Minus
                  size={22}
                  className="cursor-pointer"
                  onClick={() => ReduceProductQuantity(cart.cartId)}
                />
              </div>

              <div className="px-2 py-1">
                <p className="text-lg font-bold">{cart?.quantity}</p>
              </div>

              <div className="cursor-pointer px-2 pt-2">
                <Plus
                  size={22}
                  className="cursor-pointer"
                  onClick={() => IncreaseProductQuantity(cart.cartId)}
                />
              </div>
            </div>
          </div>

          <div className="mx-4 py-2">
            <h3 className="text-lg font-medium">UGX {cart?.price}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
