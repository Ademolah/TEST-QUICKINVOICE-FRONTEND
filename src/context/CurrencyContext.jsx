import React, { createContext, useState, useContext, useEffect } from "react";

// Supported currencies
const currencies = {
  NGN: { symbol: "₦", code: "NGN" },
  GBP: { symbol: "£", code: "GBP" },
  USD: { symbol: "$", code: "USD" },
  EUR: { symbol: "€", code: "EUR" }
};

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    // Load from localStorage if user had previously selected one
    return localStorage.getItem("currency") || "NGN";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const switchCurrency = (code) => {
    if (currencies[code]) {
      setCurrency(code);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, switchCurrency, ...currencies[currency] }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);

















