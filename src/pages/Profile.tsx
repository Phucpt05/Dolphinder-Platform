import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileCard from "../components/ProfileCard";
import ProjectCard from "../components/ProjectCard";
import CertificateCard from "../components/CertificateCard";
import AddProjectForm from "../components/AddProjectForm";
import AddCertificateForm from "../components/AddCertificateForm";
import { Button } from "../components/shared/Button";
import { useProfileQuery } from "../hooks/useProfileQuery";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { useCertificateQuery } from "../hooks/useCertificateQuery";
import SimpleSilk from "../components/SimpleSilk";

const Profile = () => {
  const currentAccount = useCurrentAccount();
  const { address } = useParams<{ address: string }>();
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showAddCertificateForm, setShowAddCertificateForm] = useState(false);
  const [profileId, setProfileId] = useState<string>("");
  
  // Get profile data which includes list of project IDs
  const { profile, refetch: refetchProfile } = useProfileQuery(address || "");
  
  // Get project IDs from profile
  const projectIds = profile?.list_projects || [];
  
  // Fetch projects using the project IDs
  const { projects, isLoading: isProjectsLoading, refetch: refetchProjects } = useProjectQuery(projectIds);
  
  // Get certificate IDs from profile
  const certificateIds = profile?.list_certificates || [];
  
  // Fetch certificates using the certificate IDs
  const { certificates, isLoading: isCertificatesLoading, refetch: refetchCertificates } = useCertificateQuery(certificateIds);


  if (!address) {
    return (
      <div className="max-w-6xl mt-20 mx-auto text-white text-center">
        <p>No address provided</p>
      </div>
    );
  }

  const isOwner = currentAccount?.address === address;

  return (
    <div className="relative min-h-screen pt-16">
      <SimpleSilk />
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Information Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Developer Profile
            </h1>
            <p className="text-xl text-white/80 mb-2">
              On-chain developer showcase & credentials
            </p>
            <p className="text-white/60">
              {projects.length + certificates.length} projects and certificates
            </p>
          </div>

          <div className="flex justify-center">
            <ProfileCard
              address={address}
              isOwner={isOwner}
              onProfileIdChange={setProfileId}
            />
          </div>
        </motion.section>

        {/* Projects Section - Card Grid Style like Developers */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              💻 Projects Showcase
            </h2>
            <p className="text-white/60 mb-6">
              Built with passion and deployed on-chain
            </p>
            {isOwner && projects.length > 0 && (
              <Button
                onClick={() => setShowAddProjectForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                + Add New Project
              </Button>
            )}
          </div>

          {projectIds.length > 0 && isProjectsLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <p className="text-white/60">Loading amazing projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                project && (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-8">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan-400/30">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No Projects Yet</h3>
                <p className="text-white/60 mb-6">
                  Showcase your amazing work and let the world see what you've built!
                </p>
                {isOwner && (
                  <Button
                    onClick={() => setShowAddProjectForm(true)}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
                  >
                    Launch Your First Project
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.section>

        {/* Certificates Section - List/Timeline Style */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4 text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              🏆 Professional Certifications
            </h2>
            <p className="text-white/60 mb-6">
              Verified credentials and achievements
            </p>
            {isOwner && certificates.length > 0 && (
              <Button
                onClick={() => setShowAddCertificateForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                + Add Certificate
              </Button>
            )}
          </div>

          {certificateIds.length > 0 && isCertificatesLoading ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">Loading certificates...</p>
          </div>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              certificate && <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No certificates yet</p>
            {isOwner && (
              <Button
                onClick={() => setShowAddCertificateForm(true)}
                className="mt-6 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg"
              >
                Add Your First Certificate
              </Button>
            )}
          </div>
        )}
        </motion.section>

        {/* Modals */}
        <AnimatePresence>
          {showAddProjectForm && (
            <AddProjectForm
              onClose={() => setShowAddProjectForm(false)}
              profileId={profileId}
              onSuccess={() => {
                console.log("AddProjectForm onSuccess called, refetching data");
                refetchProfile();
                refetchProjects();
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showAddCertificateForm && (
            <AddCertificateForm
              onClose={() => setShowAddCertificateForm(false)}
              profileId={profileId}
              onSuccess={() => {
                console.log("AddCertificateForm onSuccess called, refetching data");
                refetchProfile();
                refetchCertificates();
              }}
            />
          )}
        </AnimatePresence>
      </div>
      </div>
    </div>
  );
};

export default Profile;