import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { DASHBOARD_ID, PACKAGE_ID } from "../constants";


const { networkConfig, useNetworkVariable } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            dashboardID: DASHBOARD_ID,
            packageID: PACKAGE_ID
        }
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {
            dashboardID: DASHBOARD_ID,
            packageID: PACKAGE_ID
        }
    },
});

export { networkConfig, useNetworkVariable }