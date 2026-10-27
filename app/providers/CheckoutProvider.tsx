"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ShippingOption = {
  id: string;
  name: string;
  price: number;
  days: string;
} | null;

type CheckoutContextType = {
  shipping: ShippingOption;
  setShipping: (shipping: ShippingOption) => void;
  address: any;
  setAddress: (address: any) => void;
  resetCheckout: () => void;
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [shipping, setShipping] = useState<ShippingOption>(null);
  const [address, setAddress] = useState<any>(null);

  const resetCheckout = () => {
    setShipping(null);
    setAddress(null);
    // sessionStorage clear karein (agar use kar rahe hain)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("checkout_shipping");
      sessionStorage.removeItem("checkout_address");
    }
  };

  return (
    <CheckoutContext.Provider value={{ shipping, setShipping, address, setAddress, resetCheckout }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
