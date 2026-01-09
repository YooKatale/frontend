"use client";

import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Loader2, X } from "lucide-react";
import { useSelector } from "react-redux";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";
import { DB_URL } from "@config/config";
import axios from "axios";

const UpdateAccount = ({ closeModal }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    firstname: userInfo?.firstname || "",
    lastname: userInfo?.lastname || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
  });

  const { toast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please login to update your profile",
        });
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `${DB_URL}/users/${userInfo?._id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "Success") {
        toast({
          title: "Success",
          description: "Account updated successfully. Refreshing page...",
        });
        
        // Update localStorage with new user data
        const updatedUserInfo = { ...userInfo, ...userData };
        localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
        
        closeModal(false);
        
        // Refresh page after 1 second
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: err.response?.data?.message || err.message || "Failed to update account",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8 flex bg-black bg-opacity-50 justify-center items-center fixed z-50 top-0 left-0 right-0 bottom-0">
        <div className="m-auto w-full max-w-2xl p-6 bg-white overflow-y-auto rounded-lg shadow-xl relative">
          <div
            className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
            onClick={() => closeModal(false)}
          >
            <X size={24} />
          </div>
          
          <div className="pt-4 pb-6">
            <h2 className="text-center text-2xl font-semibold text-gray-800">Update Account Details</h2>
            <p className="text-center text-sm text-gray-500 mt-2">
              Update your personal information
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstname" className="text-sm font-medium text-gray-700">
                  First Name *
                </Label>
                <Input
                  type="text"
                  id="firstname"
                  placeholder="Enter first name"
                  value={userData.firstname}
                  onChange={(e) =>
                    setUserData({ ...userData, firstname: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastname" className="text-sm font-medium text-gray-700">
                  Last Name *
                </Label>
                <Input
                  type="text"
                  id="lastname"
                  placeholder="Enter last name"
                  value={userData.lastname}
                  onChange={(e) =>
                    setUserData({ ...userData, lastname: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email *
                </Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </Label>
                <Input
                  type="tel"
                  id="phone"
                  placeholder="Enter phone number"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData({ ...userData, phone: e.target.value })
                  }
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                Address
              </Label>
              <Input
                type="text"
                id="address"
                placeholder="Enter delivery address"
                value={userData.address}
                onChange={(e) =>
                  setUserData({ ...userData, address: e.target.value })
                }
                className="mt-1"
              />
            </div>

            <div className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => closeModal(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
                Update Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateAccount;
