import SimpleSilk from "../components/react-bits/SimpleSilk";
import { useAllProfilesQuery } from "../hooks/useAllProfilesQuery";
import OnchainProfileCard from "../components/OnchainProfileCard";

const DevelopersOnchain: React.FC = () => {
  const { profiles, isLoading, error } = useAllProfilesQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white">Loading onchain developers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white">Error loading onchain developers: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-16">
      <SimpleSilk />
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Onchain Developers
            </h1>
            <p className="text-xl text-white/95 mb-2">
              Verified developers on the Sui blockchain
            </p>
            <p className="text-white/80">
              {profiles.length} talented onchain developers and counting...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <OnchainProfileCard key={profile.id.id} profile={profile} />
            ))}
          </div>

          {profiles.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">
                No onchain developers found yet. Be the first to create your profile!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DevelopersOnchain;