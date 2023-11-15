import React, { createContext } from "react";

export const ARContext = createContext({});

export const useAR = () => {
    const arValue = React.useContext(ARContext);
    return React.useMemo(() => ({ ...arValue }), [arValue]);
  };