import { Github, Globe, Linkedin } from "lucide-react";
import { loadDevelopers, type Dev } from "../data/loadDevs";
import { useEffect, useState } from "react";
import SimpleSilk from "../components/react-bits/SimpleSilk";

const Developers: React.FC = () => {
  const [developers, setDevelopers] = useState<Dev[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const devs = await loadDevelopers();
        setDevelopers(devs);
      } catch (error) {
        console.error("Error loading developers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevelopers();
  }, []);

  const handleDeveloperClick = (username: string) => {
    window.location.href = `/${username}`;
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-white">Loading developers...</div>
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
            Welcome to Dolphinder Nation
          </h1>
          <p className="text-xl text-white/95 mb-2">
            The on-chain developer directory & showcases
          </p>
          <p className="text-white/80">
            {developers.length} talented developers and counting...
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {developers.map((dev) => (
            <div
              key={dev.username}
              className="group block bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/10 hover:border-blue-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 cursor-pointer"
              onClick={() => handleDeveloperClick(dev.username)}
            >
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={dev.avatar || `https://github.com/${dev.username}.png`}
                    alt={dev.name}
                    className="w-20 h-20 rounded-full border-4 border-white/30 group-hover:border-blue-400/60 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="text-center">
                <h3 className="font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors text-white">
                  {dev.name}
                </h3>
                <p className="text-sm text-white/80 mb-3">@{dev.username}</p>

                {dev.bio && (
                  <p className="text-sm text-white/90 mb-4 line-clamp-2">
                    {dev.bio}
                  </p>
                )}

                <div className="flex justify-center space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <a
                    href={dev.github}
                    target="_blank"
                    className="text-white/80 hover:text-white transition-colors"
                    onClick={handleLinkClick}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                  {dev.linkedin && (
                    <a
                      href={dev.linkedin}
                      target="_blank"
                      className="text-white/80 hover:text-white transition-colors"
                      onClick={handleLinkClick}
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {dev.website && (
                    <a
                      href={dev.website}
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
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Developers;
