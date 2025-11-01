import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./shared/Button";
import AvatarUpload from "./upload-handle/AvatarUpload";
import { ProfileData, WalrusResponse } from "../types";
import { AGGREGATOR, DASHBOARD_ID, PACKAGE_ID } from "../constants";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "./providers/ToastProvider";

interface EditProfileFormProps {
  initialData?: ProfileData;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ initialData, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<ProfileData>(
    initialData || {
      name: "",
      username: "",
      github: "",
      linkedin: "",
      bio: "",
      slushwallet: "",
      ava_blod_id: "",
    }
  );
  
  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute, reset } = useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleAvatarUpload = (data: { info: WalrusResponse; mediaType: string }) => {
    // Get blob ID from the correct path in the response
    const blobId = data.info.newlyCreated?.blobObject?.blobId || "";
    const avatarUrl = `${AGGREGATOR}/v1/${blobId}`;
    setFormData(prev => ({
      ...prev,
      ava_blod_id: blobId,
      avatar: avatarUrl
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      error("Please connect your wallet first");
      return;
    }

    if (!formData.ava_blod_id) {
      error("Please upload an avatar first");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const tx = new Transaction();
      
      tx.moveCall({
        arguments: [
          tx.object(DASHBOARD_ID),
          tx.pure.string(formData.name || ""),
          tx.pure.string(formData.username || ""),
          tx.pure.string(formData.github || ""),
          tx.pure.string(formData.linkedin || ""),
          tx.pure.string(formData.bio || ""),
          tx.pure.string(formData.slushwallet || ""),
          tx.pure.string(formData.ava_blod_id),
        ],
        target: `${PACKAGE_ID}::profiles::verify_profile`
      });

      await signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            console.log("Profile transaction successful, calling onSuccess");
            success("Profile created successfully!");
            onClose();
            reset();
            onSuccess?.();
          },
          onError: (transactionError: Error) => {
            console.error("Transaction failed:", transactionError);
            error("Transaction failed: " + transactionError.message);
          }
        }
      );
    } finally {
      console.log("Profile form data: ", formData);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className="bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Username</label>
              <input
                type="text"
                name="github"
                value={formData.github}
                onChange={handleInputChange}
                placeholder="username"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Avatar</label>
            <AvatarUpload
              onUpload={handleAvatarUpload}
              currentAvatar={formData.ava_blod_id}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !currentAccount || !formData.ava_blod_id}
            >
              {isSubmitting ? "Creating Profile..." : "Create Profile"}
            </Button>
            <Button
              type="button"
              className="bg-gray-600 text-white hover:bg-gray-700"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditProfileForm;