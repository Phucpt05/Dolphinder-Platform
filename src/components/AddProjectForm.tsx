import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./shared/Button";
import { ProjectFormData, WalrusResponse } from "../types";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID, AGGREGATOR } from "../constants";
import AvatarUpload from "./upload-handle/AvatarUpload";
import { useToast } from "./providers/ToastProvider";

interface AddProjectFormProps {
  onClose: () => void;
  profileId: string;
  onSuccess?: () => void;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ onClose, profileId, onSuccess }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    youtubeLink: "",
    img_prj_blods_id: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleProjectImageUpload = (data: { info: WalrusResponse; mediaType: string }) => {
    // Get blob ID from the correct path in the response
    const blobId = data.info.newlyCreated?.blobObject?.blobId || "";
    const imageUrl = `${AGGREGATOR}/v1/${blobId}`;
    setFormData(prev => ({
      ...prev,
      img_prj_blods_id: blobId,
      imageUrl: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const tx = new Transaction();
      
      // Convert technologies string to array of strings for the Move function
      const technologiesArray = formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech);
      
      tx.moveCall({
        arguments: [
          tx.object(profileId),
          tx.pure.string(formData.title),
          tx.pure.vector("string", technologiesArray),
          tx.pure.string(formData.description),
          tx.pure.string(formData.githubLink),
          tx.pure.string(formData.youtubeLink),
          tx.pure.string(formData.img_prj_blods_id),
        ],
        target: `${PACKAGE_ID}::profiles::create_project_showcase`
      });

      await signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            console.log("Project transaction successful, calling onSuccess");
            success("Project created successfully!");
            onClose();
            // Call the parent onSuccess callback to refetch data
            onSuccess?.();
          },
          onError: (transactionError: Error) => {
            console.error("Transaction failed:", transactionError);
            error("Transaction failed: " + transactionError.message);
          }
        }
      );
    } finally {
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
        <h2 className="text-2xl font-bold text-white mt-0">Add New Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Project Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Technologies (comma-separated)</label>
            <input
              type="text"
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="React, TypeScript, Tailwind CSS"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between gap-5">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1">GitHub Link</label>
              <input
                type="url"
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="https://github.com/username/repo"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-300 mb-1">YouTube Link</label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Project Image</label>
            <AvatarUpload
              onUpload={handleProjectImageUpload}
              currentAvatar={formData.img_prj_blods_id}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !currentAccount || !formData.img_prj_blods_id}
            >
              {isSubmitting ? "Creating Project..." : "Add Project"}
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

export default AddProjectForm;