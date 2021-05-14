import { IHypernetCore } from "@hypernetlabs/objects";
import React, { createContext, useContext } from "react";

import { IViewUtils } from "@web-ui/interfaces";

interface IStore {
  proxy: IHypernetCore;
  viewUtils: IViewUtils;
}

interface IStoreProps {
  children: React.ReactNode;
  proxy: IHypernetCore;
  viewUtils: IViewUtils;
}

const StoreContext = createContext<IStore>(undefined!);

export function StoreProvider({ proxy, viewUtils, children }: IStoreProps) {
  const initialState: IStore = {
    proxy,
    viewUtils,
  };

  return (
    <StoreContext.Provider value={initialState}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => useContext(StoreContext);
