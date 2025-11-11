import { useSuiClientQuery } from "@mysten/dapp-kit";
import { useQueryClient } from "@tanstack/react-query";
import { useAllProfilesQuery } from "./useAllProfilesQuery";

export const useAllProjectsQuery = () => {
  const queryClient = useQueryClient();
  const { profiles, isLoading: isProfilesLoading, error: profilesError } = useAllProfilesQuery();

  const allProjectIds = profiles?.reduce<string[]>((acc, profile) => {
    if (profile.list_projects && profile.list_projects.length > 0) {
      acc.push(...profile.list_projects);
    }
    return acc;
  }, []) || [];

  const { data: projectsData, isPending: isProjectsPending, error: projectsError, isSuccess } = useSuiClientQuery(
    "multiGetObjects", {
    ids: allProjectIds,
    options: {
      showContent: true,
    }
  },
    {
      enabled: allProjectIds.length > 0,
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
  }).filter((project): project is NonNullable<typeof project> => project !== null) || [];

  const sortedProjects = [...projects].sort((a, b) => b.vote_count - a.vote_count);

  const refetch = () => {
    return queryClient.invalidateQueries();
  };

  return {
    projects: sortedProjects,
    isLoading: isProfilesLoading || (allProjectIds.length > 0 && isProjectsPending),
    error: profilesError || projectsError,
    refetch,
    isSuccess
  };
};