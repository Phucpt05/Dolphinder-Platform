import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";

export const useProjectQuery = (projectIds: string[]) => {
  const queryClient = useQueryClient();
  const { data: projectsData, isPending, error, isSuccess } = useSuiClientQuery(
    "multiGetObjects", {
    ids: projectIds,
    options: {
      showContent: true,
    }
  },
    {
      enabled: projectIds.length > 0,
    }
  );

  const projects = projectsData?.map((project) => {
    if (project.data?.content?.dataType !== "moveObject") return null;
    
    const fields = project.data.content.fields as {
      id: { id: string };
      owner: string;
      title: string;
      technologies: string[];
      description: string;
      github_link: string;
      youtube_link: string;
      img_prj_blods_id: string;
      vote_count: number;
    };

    return {
      id: fields.id.id,
      owner: fields.owner,
      title: fields.title,
      description: fields.description,
      technologies: fields.technologies,
      githubLink: fields.github_link,
      youtubeLink: fields.youtube_link,
      img_prj_blods_id: fields.img_prj_blods_id,
      imageUrl: fields.img_prj_blods_id ? `https://aggregator.walrus-testnet.walrus.space/v1/blobs/${fields.img_prj_blods_id}` : undefined,
      vote_count: fields.vote_count
    };
  }).filter(Boolean) || [];

  const refetch = () => {
    // Invalidate all queries to ensure fresh data
    return queryClient.invalidateQueries();
  };

  return {
    projects,
    isLoading: isPending,
    error,
    refetch,
    isSuccess
  };
};