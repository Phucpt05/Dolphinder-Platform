import { motion } from "framer-motion";
import { useState } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { PACKAGE_ID } from "../constants";
import { useToast } from "../components/providers/ToastProvider";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    technologies: string[];
    githubLink?: string;
    youtubeLink?: string;
    imageUrl?: string;
    owner?: string; 
    vote_count?: number; 
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute, reset } = useSignAndExecuteTransaction();
  const { success, error } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async () => {
    if (!currentAccount) {
      error("Please connect your wallet first");
      return;
    }

    setIsVoting(true);

    try {
      const tx = new Transaction();
      tx.moveCall({
        arguments: [
          tx.object(project.id),
          tx.pure.bool(true),
        ],
        target: `${PACKAGE_ID}::profiles::vote`
      });

      await signAndExecute(
        {
          transaction: tx,
        },
        {
          onSuccess: () => {
            success("Vote submitted successfully!");
            reset();
          },
          onError: (transactionError: Error) => {
            console.error("Vote transaction failed:", transactionError);
            error("Vote failed: " + transactionError.message);
          }
        }
      );
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      {project.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
        <p
          className="text-gray-300 mb-4 flex-grow overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-900/50 text-blue-300 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-3">
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                GitHub
              </a>
            )}
            {project.youtubeLink && (
              <a
                href={project.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                YouTube
              </a>
            )}
          </div>
          
          <button
            onClick={handleVote}
            disabled={isVoting || !currentAccount}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={currentAccount ? "Vote for this project" : "Connect wallet to vote"}
          >
            <span className="text-red-400">❤️</span>
            <span className="text-white text-sm">
              {project.vote_count || 10}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;