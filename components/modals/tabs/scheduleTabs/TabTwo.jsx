"use client";

import { useToast } from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@slices/authSlice";

const TabTwo = ({ updateTabIndex, fetchData }) => {
  const { userInfo } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState({
    address1: "",
    address2: "",
  });
  const [specialRequests, setSpecialRequests] = useState({
    peeledFood: false,
    moreInfo: "",
  });
  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    gender: "",
  });

  const chakraToast = useToast();

  // function to handle populating delivery adddress data
  const handleDeliveryDataChange = (e) => {
    setDeliveryAddress({ ...deliveryAddress, [e.target.name]: e.target.value });
  };

  // function to handle populating special requests data
  const handleSpecialRequestDataChange = (e) => {
    e.target.name == "peeledFood"
      ? setSpecialRequests({
          ...specialRequests,
          [e.target.name]: e.target.checked,
        })
      : setSpecialRequests({
          ...specialRequests,
          [e.target.name]: e.target.value,
        });
  };

  const handleTabTwoData = () => {
    if (deliveryAddress.address1 == "" && deliveryAddress.address2 == "")
      return chakraToast({
        title: "Error",
        description: "Please enter a delivery address",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    fetchData({
      deliveryAddress,
      specialRequests,
      personalInfo: userInfo,
    });

    updateTabIndex(2);
  };

  return (
    <>
      <div>
        <div>
          <div>
            <h3 className="text-lg font-bold">Delivery Details</h3>
          </div>

          <div className="py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="py-2">
                <label className="text-lg" htmlFor="address1">
                  Address 1
                </label>
                <textarea
                  className="h-full w-full border-2 border-light rounded-md p-2"
                  name="address1"
                  id="address1"
                  placeholder="Delivery address"
                  value={deliveryAddress.address1}
                  onChange={handleDeliveryDataChange}
                ></textarea>
              </div>

              <div className="py-2">
                <label className="text-lg" htmlFor="address2">
                  Address 2
                </label>
                <textarea
                  className="h-full w-full border-2 border-light rounded-md p-2"
                  name="address2"
                  id="address2"
                  placeholder="Delivery address"
                  value={deliveryAddress.address2}
                  onChange={handleDeliveryDataChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="py-4">
            <div>
              <h3 className="text-lg font-bold">Choose where applicable</h3>
            </div>

            <div className="py-2">
              <div className="grid lg:grid-cols-5 grid-cols-3 gap-4">
                <div className="py-2">
                  <input
                    type="checkbox"
                    name="peeledFood"
                    value={specialRequests.peeledFood}
                    onChange={handleSpecialRequestDataChange}
                    className="mr-4"
                  />{" "}
                  Peel Food
                </div>
              </div>

              <div className="py-2">
                <label className="text-lg" htmlFor="moreInfo">
                  Any other information
                </label>

                <textarea
                  className="min-h-[100px] w-full border-2 border-light rounded-md my-2"
                  name="moreInfo"
                  id="moreInfo"
                  placeholder=""
                  value={specialRequests.moreInfo}
                  onChange={handleSpecialRequestDataChange}
                ></textarea>
              </div>
            </div>
          </div>

          <div className="py-2">
            <div className="flex justify-between">
              <div onClick={() => updateTabIndex(0)}>
                <ButtonComponent
                  type={"button"}
                  text={"back"}
                  icon={<ChevronLeft size={20} />}
                  size={"default"}
                />
              </div>

              <div
                onClick={() => {
                  handleTabTwoData();
                }}
              >
                <ButtonComponent
                  type={"button"}
                  text={"next"}
                  icon={<ChevronRight size={20} />}
                  size={"default"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TabTwo;
