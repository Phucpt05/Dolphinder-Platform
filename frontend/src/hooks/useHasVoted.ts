import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import type { DynamicFieldInfo } from "@mysten/sui/client";

interface AddressFieldName {
  type: "address";
  value: string;
}

export const useHasVoted = (projectId: string, currentAddress?: string) => {
  const queryClient = useQueryClient();
  
  const { data: projectData, isPending, error, isSuccess } = useSuiClientQuery(
    "getObject", {
      id: projectId,
      options: {
        showContent: true,
      }
    },
    {
      enabled: !!projectId,
    }
  );

  const votersTableId = projectData?.data?.content?.dataType === "moveObject"
    ? (projectData.data.content.fields as {
        id: { id: string };
        owner: string;
        title: string;
        technologies: string[];
        description: string;
        github_link: string;
        youtube_link: string;
        img_prj_blods_id: string;
        voters: { fields: { id: { id: string } } };
        vote_count: number;
      }).voters?.fields?.id?.id
    : null;

  // Query the dynamic fields of the voters table
  const { data: votersData } = useSuiClientQuery(
    "getDynamicFields", {
      parentId: votersTableId!,
    },
    {
      enabled: !!votersTableId && !!currentAddress,
    }
  );

  const hasVoted = votersData?.data?.some((field: DynamicFieldInfo) => {
    const fieldName = field.name as AddressFieldName;
    console.log("Checking field:", field.name, "against current address:", currentAddress);
    return field.name.type === "address" && fieldName.value === currentAddress;
  }) || false;
  
  console.log("Has voted result:", hasVoted, "for address:", currentAddress);

  const refetch = () => {
    return queryClient.invalidateQueries({ queryKey: ["getObject", projectId] });
  };

  return {
    hasVoted,
    isLoading: isPending,
    error,
    refetch,
    isSuccess
  };
};