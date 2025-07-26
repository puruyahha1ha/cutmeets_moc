'use client';

import Link from 'next/link';

interface CatalogHeaderProps {
  title: string;
  subtitle: string;
  description: string;
  breadcrumbPath: string;
  features: Array<{
    icon: string;
    text: string;
  }>;
  type?: 'hair' | 'color' | 'transformation' | 'mens';
  className?: string;
}

export const CatalogHeader = ({
  title,
  subtitle,
  description,
  breadcrumbPath,
  features,
  type = 'hair',
  className = ''
}: CatalogHeaderProps) => {
  const getGradientColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'from-purple-500 to-pink-500';
      case 'transformation':
        return 'from-indigo-500 to-purple-500';
      case 'mens':
        return 'from-blue-600 to-indigo-600';
      default:
        return 'from-pink-500 to-red-500';
    }
  };

  return (
    <div className={className}>
      {/* Hero section */}
      <section className={`bg-gradient-to-r ${getGradientColor(type)} py-12`}>
        <div className="max-w-6xl mx-auto px-4 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-ja font-size-adjust contain-layout">
            {title}
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-6 text-ja">
            {subtitle}
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm flex-wrap gap-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-2">{feature.icon}</span>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="text-sm" aria-label="パンくずリスト">
          <Link 
            href="/" 
            className={`${
              type === 'mens' ? 'text-gray-500 hover:text-blue-500' :
              type === 'color' ? 'text-gray-500 hover:text-purple-500' :
              type === 'transformation' ? 'text-gray-500 hover:text-indigo-500' :
              'text-gray-500 hover:text-pink-500'
            } transition-colors`}
          >
            ホーム
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-800">{breadcrumbPath}</span>
        </nav>
      </div>
    </div>
  );
};

export default CatalogHeader;