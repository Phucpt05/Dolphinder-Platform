import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Linkedin, Globe, Copy } from "lucide-react";
import { getDeveloperByUsername, type Dev } from "../data/loadDevs";
import { useEffect, useState } from "react";
import SimpleSilk from "../components/react-bits/SimpleSilk";

const DeveloperDetail: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [developer, setDeveloper] = useState<Dev | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDeveloper = async () => {
      if (!username) return;
      
      try {
        const dev = await getDeveloperByUsername(username);
        setDeveloper(dev);
      } catch (error) {
        console.error("Error loading developer:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [username]);

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/developers");
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white">Loading developer profile...</div>
      </div>
    );
  }

  if (!developer) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Developer not found</h1>
          <button
            onClick={handleGoBack}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Go back to Developers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-16">
      <SimpleSilk />
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-white/60 bg-black/10 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Developers</span>
        </button>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8 text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
              <img
                src={developer.avatar || `https://github.com/${developer.username}.png`}
                alt={developer.name}
                className="w-32 h-32 rounded-full border-4 border-white/20"
                loading="lazy"
              />
            </div>

            {/* Info */}
            <h1 className="text-3xl font-bold mb-2">{developer.name}</h1>
            <p className="text-xl text-white/60 mb-6">@{developer.username}</p>
            
            {developer.bio && (
              <p className="text-white/70 mb-8 leading-relaxed">
                {developer.bio}
              </p>
            )}

            {/* Social Links */}
            <div className="flex justify-center space-x-4 mb-8">
              <a 
                href={developer.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
              >
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
             
              {developer.linkedin && (
                <a 
                  href={developer.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                  <span>LinkedIn</span>
                </a>
              )}
             
              {developer.website && (
                <a 
                  href={developer.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <Globe className="w-5 h-5" />
                  <span>Website</span>
                </a>
              )}
            </div>

            {/* Wallet Address (if available) */}
            {developer.slushWallet && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-sm font-semibold text-white/80 mb-2">Wallet Address</h3>
                <div className="flex items-center justify-between bg-black/20 rounded-lg p-3">
                  <code className="font-mono text-sm text-white/70 break-all">
                    {developer.slushWallet}
                  </code>
                  <button
                    onClick={() => handleCopyToClipboard(developer.slushWallet!)}
                    className="ml-3 p-1 hover:bg-white/10 rounded transition-colors"
                    title={copied ? "Copied!" : "Copy to clipboard"}
                  >
                    <Copy className="h-4 w-4 text-white/60" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DeveloperDetail;
