import { Github, Globe, Linkedin, Trash2 } from "lucide-react";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { AGGREGATOR, DASHBOARD_ID, PACKAGE_ID } from "../constants";
import { OnchainProfile } from "../hooks/useAllProfilesQuery";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useState } from "react";
import toast from "react-hot-toast";

interface OnchainProfileCardProps {
  profile: OnchainProfile;
  dashboardCreator: string;
}

const OnchainProfileCard: React.FC<OnchainProfileCardProps> = ({ profile, dashboardCreator }) => {
  const { profile: detailedProfile } = useProfileQuery(profile.owner);
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDeveloperClick = (owner: string) => {
    window.location.href = `/profile/${owner}`;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleRemoveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentAccount) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsRemoving(true);
    try {
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.object(DASHBOARD_ID),
          tx.pure.address(currentAccount.address),
          tx.object(profile.id.id),
        ],
        target: `${PACKAGE_ID}::profiles::remove_profile`
      });

      await signAndExecuteTransaction(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            toast.success("Profile removed successfully!");
            // Refresh the page to show updated list
            window.location.reload();
          },
          onError: (error) => {
            console.error("Transaction failed:", error);
            toast.error("Failed to remove profile: " + error.message);
          }
        }
      );
    } catch (err) {
      console.error("Remove profile error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to remove profile";
      toast.error(errorMessage);
    } finally {
      setIsRemoving(false);
    }
  };

  // Check if current user is the dashboard creator
  const canRemove = currentAccount?.address === dashboardCreator;

  return (
    <div
      key={profile.id.id}
      className="group block bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer relative"
      onClick={() => handleDeveloperClick(profile.owner)}
    >
      {/* Remove button - only visible to dashboard creator */}
      {canRemove && (
        <button
          onClick={handleRemoveClick}
          disabled={isRemoving}
          className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove Profile"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}

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