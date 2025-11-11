import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";

export interface OnchainProfile {
  id: { id: string };
  owner: string;
  name: string;
  username: string;
  github: string;
  linkedin: string;
  bio: string;
  slushwallet: string;
  ava_image_blod_id: string;
  list_projects: string[];
  list_certificates: string[];
}

export const useAllProfilesQuery = () => {
  const dashboardID = useNetworkVariable("dashboardID");

  const { data: dashboardData, isPending: isDashboardPending, error: dashboardError } = useSuiClientQuery(
    "getObject", {
    id: dashboardID,
    options: {
      showContent: true,
    }
  }
  );

  const dashboardFields = dashboardData?.data?.content?.dataType === "moveObject"
    ? dashboardData.data.content.fields as { verified_profiles: string[]; creator: string }
    : { verified_profiles: [], creator: "" };

  const profileIds = dashboardFields.verified_profiles;
  const dashboardCreator = dashboardFields.creator;


  const { data: profilesData, isPending: isProfilesPending, error: profilesError } = useSuiClientQuery(
    "multiGetObjects", {
    ids: profileIds,
    options: {
      showContent: true,
    }
  },
    {
      enabled: profileIds.length > 0,
    }
  );

  const profiles = profilesData?.reduce<OnchainProfile[]>((acc, profile) => {
    if (profile.data?.content?.dataType === "moveObject") {
      const fields = profile.data.content.fields as unknown as OnchainProfile;
      acc.push(fields);
    }
    return acc;
  }, []) || [];

  return {
    profiles,
    isLoading: isDashboardPending || (profileIds.length > 0 && isProfilesPending),
    error: dashboardError || profilesError,
    profileIds,
    dashboardCreator,
  };
};