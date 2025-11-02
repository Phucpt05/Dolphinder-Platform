import SimpleSilk from "../components/react-bits/SimpleSilk";
import { useAllProjectsQuery } from "../hooks/useAllProjectsQuery";
import ProjectCard from "../cards/ProjectCard";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const Showcase: React.FC = () => {
  const { projects, isLoading, error } = useAllProjectsQuery();

  return (
    <div className="relative min-h-screen pt-20">
      <SimpleSilk />
      <div className="relative z-10 px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">Project Showcase</h1>
        <p className="mb-8 text-white/80">Discover amazing projects from our community</p>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">Error loading projects: {error.message}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">No projects found. Be the first to add one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Showcase;
