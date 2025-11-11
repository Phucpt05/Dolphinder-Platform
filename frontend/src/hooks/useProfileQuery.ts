import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useNetworkVariable } from "../config/networkConfig";
import { SuiObjectResponse } from "@mysten/sui/client";
import { useQueryClient } from "@tanstack/react-query";

export const useProfileQuery = (targetAddress: string) => {
  const dashboardID = useNetworkVariable("dashboardID");
  const queryClient = useQueryClient();

  // Query dashboard to get list of verified profiles
  const { data: dashboardData, isPending: isDashboardPending, error: dashboardError } = useSuiClientQuery(
    "getObject", {
    id: dashboardID,
    options: {
      showContent: true,
    }
  }
  );

  const profileIds = dashboardData?.data?.content?.dataType === "moveObject"
    ? (dashboardData.data.content.fields as { verified_profiles: string[] }).verified_profiles
    : [];

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

  const profileData = profilesData?.reduceRight<SuiObjectResponse | undefined>((found, profile) => {
    if (found) return found; // Already found a match
    if (profile.data?.content?.dataType !== "moveObject") return undefined;
    const fields = profile.data.content.fields as { owner: string };
    return fields.owner === targetAddress ? profile : undefined;
  }, undefined);

  const profile = profileData?.data?.content?.dataType === "moveObject"
    ? profileData.data.content.fields as {
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
    : null;

  const refetch = () => {
    // Invalidate all queries to ensure fresh data
    return queryClient.invalidateQueries();
  };

  return {
    profile,
    isLoading: isDashboardPending || (profileIds.length > 0 && isProfilesPending),
    error: dashboardError || profilesError,
    profileIds,
    isProfileFound: !!profile,
    refetch,
  };
};