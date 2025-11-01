import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "./shared/Button";
import CertificateUpload from "./upload-handle/CertificateUpload";
import { CertificateFormData, WalrusResponse } from "../types";
import { PACKAGE_ID } from "../constants";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useToast } from "./providers/ToastProvider";

interface AddCertificateFormProps {
  onClose: () => void;
  profileId: string;
  onSuccess?: () => void;
}

const AddCertificateForm: React.FC<AddCertificateFormProps> = ({ onClose, profileId, onSuccess }) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    title: "",
    organization: "",
    issueDate: "",
    expiryDate: "",
    verifyLink: "",
    img_cer_blods_id: "",
  });

  const currentAccount = useCurrentAccount();
  const { mutateAsync: signAndExecute, reset } = useSignAndExecuteTransaction();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleCertificateUpload = (data: { info: WalrusResponse; mediaType: string }) => {
    // Get blob ID from the correct path in the response
    console.log("certificateData: ", data)
    const blobId = data.info.newlyCreated?.blobObject?.blobId || "";
    console.log("certificate blobId: ", blobId);
    setFormData(prev => ({
      ...prev,
      img_cer_blods_id: blobId
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      error("Please connect your wallet first");
      return;
    }

    if (!formData.img_cer_blods_id) {
      error("Please upload a certificate image first");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const tx = new Transaction();
      
      tx.moveCall({
        arguments: [
          tx.object(profileId),
          tx.pure.string(formData.organization),
          tx.pure.string(formData.title),
          tx.pure.string(formData.issueDate),
          tx.pure.string(formData.expiryDate),
          tx.pure.string(formData.verifyLink),
          tx.pure.string(formData.img_cer_blods_id),
        ],
        target: `${PACKAGE_ID}::profiles::create_certificate`
      });

      await signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            console.log("Certificate transaction successful, calling onSuccess");
            success("Certificate created successfully!");
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
        <h2 className="text-2xl font-bold text-white mb-6">Add New Certificate</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Certificate Title</label>
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
            <label className="block text-sm font-medium text-gray-300 mb-1">Issuing Organization</label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Expiry Date </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Verification Link</label>
            <input
              type="url"
              name="verifyLink"
              value={formData.verifyLink}
              onChange={handleInputChange}
              placeholder="https://credential-verification.com/verify"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Certificate Image</label>
            <CertificateUpload
              onUpload={handleCertificateUpload}
              currentImage={formData.img_cer_blods_id}
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || !currentAccount || !formData.img_cer_blods_id}
            >
              {isSubmitting ? "Creating Certificate..." : "Add Certificate"}
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

export default AddCertificateForm;