import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";

export const useCertificateQuery = (certificateIds: string[]) => {
  const queryClient = useQueryClient();
  // Query certificates using their IDs
  const { data: certificatesData, isPending, error } = useSuiClientQuery(
    "multiGetObjects", {
    ids: certificateIds,
    options: {
      showContent: true,
    }
  },
    {
      enabled: certificateIds.length > 0,
    }
  );

  // Transform the blockchain data to match our UI format
  const certificates = certificatesData?.map((certificate) => {
    if (certificate.data?.content?.dataType !== "moveObject") return null;
    
    const fields = certificate.data.content.fields as {
      id: { id: string };
      owner: string;
      title: string;
      organization: string;
      date: string;
      expiry_date: string;
      verify_link: string;
      img_cer_blods_id: string;
    };

    return {
      id: fields.id.id,
      owner: fields.owner,
      title: fields.title,
      organization: fields.organization,
      issueDate: fields.date,
      expiryDate: fields.expiry_date,
      verifyLink: fields.verify_link,
      img_cer_blods_id: fields.img_cer_blods_id,
      imageUrl: fields.img_cer_blods_id ? `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${fields.img_cer_blods_id}` : undefined,
    };
  }).filter(Boolean) || [];

  const refetch = () => {
    // Invalidate all queries to ensure fresh data
    return queryClient.invalidateQueries();
  };

  return {
    certificates,
    isLoading: isPending,
    error,
    refetch,
  };
};