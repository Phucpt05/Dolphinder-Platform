import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Button } from "./shared/Button";
import EditProfileForm from "./EditProfileForm";
import { AnimatePresence } from "framer-motion";
import { ProfileData } from "../types";
import { useProfileQuery } from "../hooks/useProfileQuery";
import LoadingSpinner from "./shared/LoadingSpinner";
import { AGGREGATOR } from "../constants";
import { Copy } from "lucide-react";

interface ProfileCardProps {
  address: string;
  isOwner: boolean;
  profileData?: ProfileData;
  onProfileIdChange?: (profileId: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ address, isOwner, onProfileIdChange }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const { profile, isLoading, error, isProfileFound, refetch } = useProfileQuery(address);
  
  
  console.log("Profile data from blockchain:", profile);
  
  // Notify parent component when profile ID is available
  useEffect(() => {
    if (profile?.id?.id && onProfileIdChange) {
      onProfileIdChange(profile.id.id);
    }
  }, [profile?.id?.id, onProfileIdChange]);
  
  // If no profile found, show default values
  const profileData = profile || {
    name: "",
    username: "",
    github: "",
    linkedin: "",
    bio: "",
    slushwallet: address,
    ava_image_blod_id: "",
  };

  const uiProfile = {
    name: profileData.name,
    username: profileData.username,
    github: profileData.github,
    linkedin: profileData.linkedin,
    bio: profileData.bio,
    slushwallet: profileData.slushwallet,
    ava_blod_id: profileData.ava_image_blod_id,
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 mb-8 flex items-center justify-center" style={{ minHeight: '300px' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="text-center text-red-400">
          <p>Error loading profile: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  // Handle case when profile is null (not found)
  if (!isLoading && !isProfileFound) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <div className="text-center">
          <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-gray-400 text-5xl">
              {address.slice(0, 2).toUpperCase()}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile Not Found</h2>
          <p className="text-gray-400 mb-6">
            {isOwner
              ? "You haven't created a profile yet. Create your profile to get started!"
              : "This user hasn't created a profile yet."
            }
          </p>
          {isOwner && (
            <Button onClick={() => setShowEditForm(true)}>
              Create Profile
            </Button>
          )}
        </div>
        
        <AnimatePresence>
          {showEditForm && (
            <EditProfileForm
              initialData={{
                name: "",
                username: "",
                github: "",
                linkedin: "",
                bio: "",
                slushwallet: address,
                ava_blod_id: "",
              }}
              onClose={() => setShowEditForm(false)}
              onSuccess={() => refetch()}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 rounded-xl p-6 mb-8 relative w-full"
      >
        {isOwner && (
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setShowEditForm(true)}
              className="px-3 py-1 text-sm"
            >
              {uiProfile.name ? "Edit Profile" : "Create Profile"}
            </Button>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <div className="w-40 h-40 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
              {uiProfile.ava_blod_id ? (
                <img src={`${AGGREGATOR}/v1/blobs/${uiProfile.ava_blod_id}`} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-gray-400 text-5xl">
                  {uiProfile.name?.charAt(0).toUpperCase() || address.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          <div className="flex-grow">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {uiProfile.name || "No name set"}
              </h1>
              <p className="text-gray-400 mb-4">@{uiProfile.username || "username"}</p>
              
              <div className="space-y-2 mb-4">
                {uiProfile.github && (
                  <p className="text-gray-300">
                    <span className="font-medium">GitHub:</span>{" "}
                    <a href={`https://github.com/${uiProfile.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {uiProfile.github}
                    </a>
                  </p>
                )}
                {uiProfile.linkedin && (
                  <p className="text-gray-300">
                    <span className="font-medium">LinkedIn:</span>{" "}
                    <a href={uiProfile.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {uiProfile.linkedin}
                    </a>
                  </p>
                )}
                {uiProfile.bio && (
                  <p className="text-gray-300">
                    <span className="font-medium">Bio:</span> {uiProfile.bio}
                  </p>
                )}
              </div>
    
              <div className="bg-gray-700 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Slush Wallet Address</p>
                    <p className="font-mono text-sm text-white">{address}</p>
                  </div>
                  <button
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title = {copied ? "Copied!" : "Copy to clipboard"}
                    onClick={handleCopyAddress}
                  >
                    <Copy className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showEditForm && (
          <EditProfileForm
            initialData={uiProfile}
            onClose={() => setShowEditForm(false)}
            onSuccess={() => refetch()}
          />
        )}
      </AnimatePresence>
    </>
  );
};
export default ProfileCard;