
interface CertificateCardProps {
  certificate: {
    id: string;
    title: string;
    organization: string;
    issueDate: string;
    expiryDate?: string;
    verifyLink?: string;
    imageUrl?: string;
    owner?: string; // Added owner field from blockchain
  };
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = certificate.expiryDate ? new Date(certificate.expiryDate) < new Date() : false;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex h-28">
        {/* Left side - Certificate Image (wider) */}
        <div className="w-36 h-28 flex-shrink-0">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Right side - Certificate Information (narrower) */}
        <div className="w-32 p-2 flex flex-col justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold text-white mb-1 line-clamp-1 leading-tight">{certificate.title}</h3>
            <p className="text-xs text-blue-400 mb-1 truncate">{certificate.organization}</p>

            <div className="text-xs">
              <p className="text-gray-400 text-xs">
                {formatDate(certificate.issueDate)}
              </p>
              {certificate.expiryDate && (
                <p className={`${isExpired ? 'text-red-400' : 'text-green-400'} text-xs`}>
                  {isExpired ? 'Expired' : 'Valid'}: {formatDate(certificate.expiryDate)}
                </p>
              )}
            </div>
          </div>

          {certificate.verifyLink && (
            <a
              href={certificate.verifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs mt-1 transition-colors"
            >
              Verify
              <svg className="w-2.5 h-2.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateCard;