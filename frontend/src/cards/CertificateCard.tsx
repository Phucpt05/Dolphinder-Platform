
interface CertificateCardProps {
  certificate: {
    id: string;
    title: string;
    organization: string;
    issueDate: string;
    expiryDate?: string;
    verifyLink?: string;
    imageUrl?: string;
    owner?: string; 
  };
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isExpired = certificate.expiryDate ? new Date(certificate.expiryDate) < new Date() : false;

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full sm:w-36 h-48 sm:h-32 flex-shrink-0">
          {certificate.imageUrl ? (
            <img
              src={certificate.imageUrl}
              alt={certificate.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 p-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h3
              className="text-sm font-bold text-white leading-tight overflow-hidden"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {certificate.title}
            </h3>
            <p className="text-sm text-blue-400 truncate">{certificate.organization}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              <span className="text-gray-400">
                Issued: {formatDate(certificate.issueDate)}
              </span>
              {certificate.expiryDate && (
                <span className={`${isExpired ? 'text-red-400' : 'text-green-400'}`}>
                  {isExpired ? 'Expired' : 'Valid'}: {formatDate(certificate.expiryDate)}
                </span>
              )}
            </div>
          </div>

          {certificate.verifyLink && (
            <a
              href={certificate.verifyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mt-2 transition-colors self-start"
            >
              Verify Certificate
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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