"use client";
import {
  Box,
  Checkbox,
  Flex,
  Grid,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import ButtonComponent from "@components/Button";
import TabOne from "@components/modals/tabs/scheduleTabs/TabOne";
import TabThree from "@components/modals/tabs/scheduleTabs/TabThree";
import TabTwo from "@components/modals/tabs/scheduleTabs/TabTwo";
import { Input } from "@components/ui/input";
import { ThemeColors } from "@constants/constants";
import {
  useNewScheduleMutation,
  useProductsGetMutation,
} from "@slices/productsApiSlice";
import { FormatCurr } from "@utils/utils";
import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import React from "react";

const ScheduleDelivery = () => {
  const [Order, setOrder] = useState({
    deliveryProducts: [],
    scheduleDays: [],
    scheduleTime: "",
    repeatSchedule: false,
  });
  const [deliveryProducts, setDeliveryProducts] = useState([]);
  const [scheduleDays, setScheduleDays] = useState([]);
  const [scheduleTime, setScheduleTime] = useState("");
  const [repeatSchedule, setRepeatSchedule] = useState(false);
  const [Products, setProducts] = useState([]);
  const [SearchProducts, setSearchProducts] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [tabOneData, setTabOneData] = useState({});
  const [tabTwoData, setTabTwoData] = useState({});
  const [scheduleFor, setScheduleFor] = useState("products");
  const [appointmentType, setAppointmentType] = useState("online");
  const [isLoading, setIsLoading] = useState(false);

  const [fetchProducts] = useProductsGetMutation();

  // chakra functions for controlling modal display
  const { onOpen, onClose, isOpen } = useDisclosure();

  const { userInfo } = useSelector((state) => (state?.auth) ?? { userInfo: null });
  const router = useRouter();
  const [createSchedule] = useNewScheduleMutation();
  const chakraToast = useToast();

  if (!userInfo) router.push("/signin");

  const handleDataFetch = async () => {
    const res = await fetchProducts().unwrap();

    if (res?.status && res?.status == "Success") {
      setProducts(res?.data);
      setSearchProducts(res?.data);
    }
  };

  // function to handle removing or adding items from the deliveryProducts state
  const handleAddingRemovingProducts = (arr, item, action) => {
    let output = arr;

    // logic to add an item
    if (action == "add") {
      if (output.findIndex((value) => value._id == item.id) == -1) {
        let productArray = Products.filter((product) => product._id == item.id);

        productArray.length > 0
          ? output.push({ ...productArray[0], quantity: 1 })
          : (output = output);
      }
    }

    // logic to remove an item
    if (action == "remove") {
      output = output.filter((value) => value._id !== item.id);
    }

    return output;
  };

  // function to handle removing or adding items from the scheduleDays state
  const handleAddingRemovingItems = (arr, item, action) => {
    let output = arr;

    // logic to add an item
    if (action == "add") {
      if (output.findIndex((value) => value == item) == -1) {
        output.push(item);
      }
    }

    // logic to remove an item
    if (action == "remove") {
      output = output.filter((value) => value !== item);
    }

    return output;
  };

  // function to handle populating selected products for delivery data
  const handleSelectedProducts = (e) => {
    setDeliveryProducts(
      handleAddingRemovingProducts(
        deliveryProducts,
        {
          name: e.target.name,
          id: e.target.getAttribute("data-target"),
        },
        e.target.checked ? "add" : "remove"
      )
    );
  };

  // function to handle populating days of delivery data
  const handleScheduleDays = (e) => {
    setScheduleDays(
      handleAddingRemovingItems(
        scheduleDays,
        e.target.value,
        e.target.checked ? "add" : "remove"
      )
    );
  };

  // function to handle populating repeat delivery data
  const handleDeliveryRepeat = (e) => {
    setRepeatSchedule(e.target.checked ? e.target.checked : false);
  };

  // function to handle populating order
  const handleScheduleDeliveryOrder = () => {
    // check if delivery days array is empty and throw an error
    if (scheduleDays.length <= 0) {
      return chakraToast({
        title: "Error",
        description: "Please select days for delivery",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }

    // check if delivery products array is empty and throw an error
    if (deliveryProducts.length <= 0) {
      return chakraToast({
        title: "Error",
        description: "Please select products for delivery",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }

    // call function to display the modal form
    onOpen();
  };

  // function to check if product has already been selected before someone searched for it
  const checkIfSelected = () => {
    const Inputs = [
      ...document.querySelectorAll("input[checkbox].product-checkbox"),
    ];

    for (const input of Inputs) {
      console.log(input);
      for (const product of deliveryProducts) {
        input.getAttribute("data-target").toString() === product.id.toString()
          ? (input.checked = true)
          : (input.checked = false);
      }
    }
  };

  // function to handle searching for products within the products array
  const handleSearch = async (value) => {
    if (value == "" || !value) return setSearchProducts(Products);

    let SearchedProducts = [];

    for (const product of Products) {
      product.name.toString().toLowerCase().indexOf(value.toLowerCase()) >= 0
        ? SearchedProducts.push(product)
        : (SearchedProducts = SearchedProducts);
    }

    setSearchProducts(SearchedProducts);

    checkIfSelected();
  };

  const DaysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  // fetch product categories
  useEffect(() => {
    handleDataFetch();
  }, []);

  // function to handle checking out appointment schedule
  const handleAppointmentCheckout = async () => {
    if (appointmentType === "")
      return chakraToast({
        title: "Error",
        description: "Please select appointment Type",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    if (scheduleDays == [])
      return chakraToast({
        title: "Error",
        description: "Please select appointment days",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    if (scheduleTime == "")
      return chakraToast({
        title: "Error",
        description: "Please select appointment time",
        status: "error",
        duration: 5000,
        isClosable: false,
      });

    // create order
    try {
      setIsLoading((prevState) => (prevState ? false : true));

      // calculate total
      const orderTotal =
        appointmentType == "online"
          ? 60000 * (scheduleDays.length * repeatSchedule ? 4 : 1)
          : 120000 * (scheduleDays.length * repeatSchedule ? 4 : 1);

      const res = await createSchedule({
        user: userInfo,
        products: {
          appointmentType,
        },
        scheduleDays,
        scheduleTime,
        repeatSchedule,
        scheduleFor: scheduleFor == "products" ? "delivery" : scheduleFor,
        order: {
          payment: { paymentMethod: "", transactionId: "" },
          deliveryAddress: "NAN",
          specialRequests: "NAN",
          orderTotal,
        },
      }).unwrap();

      if (res.status == "Success") {
        chakraToast({
          description: `Your ${appointmentType} appointment with a nutritionist/dietitian has been requested for ${scheduleDays[0]} at ${scheduleTime}. Please proceed to checkout to confirm your appointment`,
          status: "success",
          duration: 3000,
          isClosable: false,
        });

        router.push(`/payment/${res.data.Order}`);
      }
    } catch (err) {
      chakraToast({
        title: "Error",
        description: err.data?.message
          ? err.data?.message
          : err.data || err.error,
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    } finally {
      // set loading to be false
      setIsLoading((prevState) => (prevState ? false : true));
    }
  };

  return (
    <>
      <div>
        <div className="flex">
          <div className="lg:p-8 p-2 m-auto lg:w-4/5 w-[97%]">
            <div className="py-4 border-b-2 border-light">
              <h4 className="text-3xl font-light">
                Schedule{" "}
                {scheduleFor == "products" ? "Delivery" : "Appointment"}
              </h4>
              {scheduleFor == "appointment" && (
                <h2 className="mb-2 text-lg">
                  Make an appointment with a nutritionist/dietitian
                </h2>
              )}

              <div className="py-2 flex gap-4">
                <button
                  onClick={() => setScheduleFor((prev) => (prev = "products"))}
                  type="button"
                  className={`outline-none py-2 px-4 ${
                    scheduleFor == "products"
                      ? "text-white bg-primary"
                      : "text-[#000] bg-transparent"
                  } border-[1.8px] border-primary rounded-md`}
                >
                  Schedule Delivery
                </button>

                <button
                  onClick={() =>
                    setScheduleFor((prev) => (prev = "appointment"))
                  }
                  type="button"
                  className={`outline-none py-2 px-4 ${
                    scheduleFor == "appointment"
                      ? "text-white bg-primary"
                      : "text-[#000] bg-transparent"
                  } border-[1.8px] border-primary rounded-md`}
                >
                  Schedule Appointment
                </button>
              </div>
            </div>

            {scheduleFor === "products" && (
              <div className="py-4 lg:max-h-[300px] max-h-[200px] overflow-y-auto">
                <div>
                  <h3 className="text-lg">Select Products</h3>
                </div>

                <div className="py-2 relative">
                  <Input
                    name="product-search"
                    placeholder="Search for product by name or category"
                    className="pl-8 w-3/4"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                  <Search className="absolute top-4 left-2" size={20} />
                </div>

                {SearchProducts.length > 0 ? (
                  <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                    {SearchProducts.map((product, key) => (
                      <div className="py-2" key={key}>
                        <input
                          type="checkbox"
                          name={product.name}
                          value={product.name}
                          className="product-checkbox mr-4 cursor-pointer"
                          data-target={product._id}
                          onChange={handleSelectedProducts}
                        />
                        {product.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </div>
            )}

            {scheduleFor === "appointment" && (
              <div className="py-4">
                <div>
                  <h3 className="text-lg">Appointment Type</h3>
                </div>
                <div className="py-2">
                  <select
                    placeholder="Select appointment type"
                    name="appointmentType"
                    id="appointmentType"
                    className="border-[1.8px] py-2 px-2 rounded-md cursor-pointer"
                    onChange={(e) => setAppointmentType(e.target.value)}
                  >
                    <option className="p-2 cursor-pointer" value="online">
                      60 mins Online @ UGX{FormatCurr(60000)}
                    </option>
                    <option className="p-2 cursor-pointer" value="physical">
                      60 mins Physical meet @ UGX{FormatCurr(120000)}
                    </option>
                  </select>
                </div>
              </div>
            )}

            <div className="py-4">
              <div>
                <h3 className="text-lg capitalize">
                  Select{" "}
                  {scheduleFor === "products" ? "Delivery" : "Appointment"} Days
                </h3>
              </div>

              <div>
                <div className="grid grid-cols-3 lg:grid-cols-7 gap-4">
                  {DaysOfWeek.map((day, index) => (
                    <div className="py-2" key={index}>
                      <input
                        type="checkbox"
                        name={day.toLowerCase()}
                        value={day.toLowerCase()}
                        onChange={handleScheduleDays}
                        className="mr-4 cursor-pointer"
                      />
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="py-4">
              <div>
                <h3 className="text-lg capitalize">
                  {scheduleFor === "products" ? "Delivery" : "Appointment"} Time
                </h3>
              </div>

              <div className="py-2 w-1/5">
                <select
                  placeholder="Choose time"
                  name="scheduleTime"
                  id="scheduleTime"
                  className="border-[1.8px] py-2 px-2 rounded-md cursor-pointer"
                  onChange={(e) => setScheduleTime(e.target.value)}
                >
                  <option>Choose time</option>
                  <option value="7 AM - 8 AM">7 AM - 8 AM</option>
                  <option value="8 AM - 9 AM">8 AM - 9 AM</option>
                  <option value="10 AM - 11 AM">10 AM - 11 AM</option>
                  <option value="12 PM - 1 PM">12 PM - 1 PM</option>
                  <option value="2 PM - 3 PM">2 PM - 3 PM</option>
                  <option value="4 PM - 5 PM">4 PM - 5 PM</option>
                  <option value="6 PM - 7 PM">6 PM - 7 PM</option>
                </select>
              </div>
            </div>

            <div className="py-4">
              <div>
                <h3 className="h3 text-lg">Repeat Schedule</h3>
              </div>

              <div className="py-2">
                <div className="py-2">
                  <input
                    type="checkbox"
                    name="repeatSchedule"
                    onChange={handleDeliveryRepeat}
                    className="mr-4 cursor-pointer"
                  />
                  Every week
                </div>
              </div>
            </div>

            <div className="py-4">
              <div
                className="max-w-[10rem]"
                onClick={() =>
                  scheduleFor == "products"
                    ? handleScheduleDeliveryOrder()
                    : handleAppointmentCheckout()
                }
              >
                <ButtonComponent
                  type={"button"}
                  text={"Schedule"}
                  size={"regular"}
                  icon={isLoading && <Loader2 />}
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={"4xl"}
            padding={"1rem 0"}
          >
            <ModalOverlay />
            <ModalContent padding={"3rem 1rem"}>
              <ModalCloseButton size={"lg"} color={ThemeColors.darkColor} />
              <Box>
                {tabIndex == 0 ? (
                  <TabOne
                    updateTabIndex={setTabIndex}
                    fetchData={setTabOneData}
                    data={{
                      Products: deliveryProducts,
                      scheduleRepeat: repeatSchedule,
                      scheduleDays,
                    }}
                  />
                ) : tabIndex == 1 ? (
                  <TabTwo
                    updateTabIndex={setTabIndex}
                    fetchData={setTabTwoData}
                  />
                ) : tabIndex == 2 ? (
                  <TabThree
                    data={{ ...tabOneData, ...tabTwoData, scheduleTime }}
                    updateTabIndex={setTabIndex}
                  />
                ) : (
                  ""
                )}
              </Box>
            </ModalContent>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default ScheduleDelivery;
