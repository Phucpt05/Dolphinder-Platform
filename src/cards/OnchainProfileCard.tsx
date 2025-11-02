import { Github, Globe, Linkedin } from "lucide-react";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { AGGREGATOR } from "../constants";
import { OnchainProfile } from "../hooks/useAllProfilesQuery";

interface OnchainProfileCardProps {
  profile: OnchainProfile;
}

const OnchainProfileCard: React.FC<OnchainProfileCardProps> = ({ profile }) => {
  const { profile: detailedProfile } = useProfileQuery(profile.owner);

  const handleDeveloperClick = (owner: string) => {
    window.location.href = `/profile/${owner}`;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      key={profile.id.id}
      className="group block bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer"
      onClick={() => handleDeveloperClick(profile.owner)}
    >
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={`${AGGREGATOR}/v1/blobs/${profile.ava_image_blod_id}`}
            alt={profile.name}
            className="w-20 h-20 rounded-full border-4 border-white/30 group-hover:border-blue-400/60 transition-all duration-300"
            loading="lazy"
          />
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors text-white">
          {detailedProfile?.name || profile.name}
        </h3>
        <p className="text-sm text-white/80 mb-3">@{detailedProfile?.username || profile.username}</p>

        {(detailedProfile?.bio || profile.bio) && (
          <p className="text-sm text-white/90 mb-4 line-clamp-2">
            {detailedProfile?.bio || profile.bio}
          </p>
        )}

        <div className="flex justify-center space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
          <a
            href={detailedProfile?.github || profile.github}
            target="_blank"
            className="text-white/80 hover:text-white transition-colors"
            onClick={handleLinkClick}
          >
            <Github className="w-4 h-4" />
          </a>
          {(detailedProfile?.linkedin || profile.linkedin) && (
            <a
              href={detailedProfile?.linkedin || profile.linkedin}
              target="_blank"
              className="text-white/80 hover:text-white transition-colors"
              onClick={handleLinkClick}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {(detailedProfile?.slushwallet || profile.slushwallet) && (
            <a
              href={`https://slushpool.com/wallet/${detailedProfile?.slushwallet || profile.slushwallet}`}
              target="_blank"
              className="text-white/80 hover:text-white transition-colors"
              onClick={handleLinkClick}
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnchainProfileCard;