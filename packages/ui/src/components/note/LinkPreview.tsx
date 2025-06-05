import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link2 } from "lucide-react";

interface LinkPreviewProps {
  url: string;
}

const getDomain = (url: string) => {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
};

interface PreviewData {
  title: string;
  description: string;
  image: string;
  url: string;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const { t } = useTranslation();
  const [data, setData] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError(null);
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.status === 'success') {
          setData({
            title: res.data.title,
            description: res.data.description,
            image: res.data.image?.url || '',
            url: res.data.url,
          });
        } else {
          setError('Preview not available');
        }
      })
      .catch(() => setError('Preview not available'))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <div className="text-xs text-muted-foreground mt-2">{t('loading_preview')}</div>;
  if (error || !data) return null;

  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border rounded-xl p-0 bg-background/60 hover:bg-accent/30 transition-colors duration-200 shadow-sm overflow-hidden"
      style={{ textDecoration: 'none' }}
    >
      <div className="flex flex-row items-stretch">
        {data.image && (
          <div className="flex-shrink-0 w-24 h-24 bg-muted overflow-hidden flex items-center justify-center">
            <img
              src={data.image}
              alt={data.title}
              className="object-cover w-full h-full center"
              style={{ minWidth: 64, minHeight: 64 }}
            />
          </div>
        )}
        <div className="flex flex-col justify-between flex-1 min-w-0 p-3">
          <div>
            <div className="text-base text-foreground truncate">
              {data.title}
            </div>
            <div className="text-sm text-muted-foreground truncate mt-1">
              {data.description}
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-blue-500">
            <Link2 className="w-4 h-4 opacity-70 mr-1" />
            <span className="truncate">{getDomain(data.url)}</span>
          </div>
        </div>
      </div>
    </a>
  );
};
