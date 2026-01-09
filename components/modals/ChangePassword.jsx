"use client";

import { Label } from "@components/ui/label";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { Loader2, X, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import { useToast } from "@components/ui/use-toast";
import { useState } from "react";
import { DB_URL } from "@config/config";
import axios from "axios";

const ChangePassword = ({ closeModal }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [isLoading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { toast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!passwords.currentPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your current password",
      });
      return;
    }

    if (!passwords.newPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a new password",
      });
      return;
    }

    if (passwords.newPassword.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be at least 6 characters long",
      });
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New passwords do not match",
      });
      return;
    }

    if (passwords.newPassword === passwords.currentPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "New password must be different from current password",
      });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please login to change your password",
        });
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `${DB_URL}/auth/change-password`,
        {
          userId: userInfo?._id,
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        },
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
          description: "Password changed successfully. Redirecting to login...",
        });

        // Clear form
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        closeModal(false);
        
        // Redirect to signin after password change
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem("token");
            localStorage.removeItem("userInfo");
            window.location.href = '/signin';
          }
        }, 1500);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: err.response?.data?.message || err.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="p-8 flex bg-black bg-opacity-50 justify-center items-center fixed z-50 top-0 left-0 right-0 bottom-0">
        <div className="m-auto w-full max-w-md p-6 bg-white overflow-y-auto rounded-lg shadow-xl relative">
          <div
            className="absolute top-4 right-4 cursor-pointer hover:bg-gray-100 rounded-full p-1 transition-colors"
            onClick={() => closeModal(false)}
          >
            <X size={24} />
          </div>
          
          <div className="pt-4 pb-6">
            <h2 className="text-center text-2xl font-semibold text-gray-800">Change Password</h2>
            <p className="text-center text-sm text-gray-500 mt-2">
              Enter your current password and choose a new one
            </p>
          </div>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                Current Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  id="currentPassword"
                  placeholder="Enter current password"
                  value={passwords.currentPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, currentPassword: e.target.value })
                  }
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                New Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  placeholder="Enter new password (min. 6 characters)"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, newPassword: e.target.value })
                  }
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirm New Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Re-enter new password"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirmPassword: e.target.value })
                  }
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
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
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="animate-spin mr-2" size={18} />}
                Change Password
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> After changing your password, you'll be logged out and need to sign in again with your new password.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
