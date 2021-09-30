import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";
import { useAlert } from "react-alert";

import {
  GovernanceRegistryListItem,
  GovernanceWidgetHeader,
} from "@web-ui/components";
import { IRegistryListWidgetParams } from "@web-ui/interfaces";
import { useStoreContext, useLayoutContext } from "@web-ui/contexts";
import { Registry } from "@hypernetlabs/objects";

const RegistryListWidget: React.FC<IRegistryListWidgetParams> = ({
  onRegistryEntryListNavigate,
}: IRegistryListWidgetParams) => {
  const alert = useAlert();
  const { coreProxy } = useStoreContext();
  const { setLoading } = useLayoutContext();
  const [registries, setRegistries] = useState<Registry[]>([]);

  useEffect(() => {
    coreProxy
      .getRegistries(1, 10)
      .map((registries) => {
        setRegistries(registries);
      })
      .mapErr(handleError);
  }, []);

  const handleError = (err?: Error) => {
    setLoading(false);
    alert.error(err?.message || "Something went wrong!");
  };

  return (
    <Box>
      <GovernanceWidgetHeader label="Registries" />
      {registries.map((registry, index) => (
        <GovernanceRegistryListItem
          key={registry.name}
          number={(registries.length - index).toString()}
          title={registry.name}
          fieldWithValueList={[
            {
              fieldTitle: "Symbol",
              fieldValue: registry.symbol,
            },
            {
              fieldTitle: "Address",
              fieldValue: registry.address,
            },
            {
              fieldTitle: "Registrar Addresses",
              fieldValue: registry.registrarAddresses.join("-"),
            },
            {
              fieldTitle: "Number of Entries",
              fieldValue: registry.numberOfEntries.toString(),
            },
          ]}
          buttonLabel="View Registry Entries"
          onViewDetailsClick={() =>
            onRegistryEntryListNavigate &&
            onRegistryEntryListNavigate(registry.name)
          }
        />
      ))}
    </Box>
  );
};

export default RegistryListWidget;
