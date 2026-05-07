import React, { useEffect, useState } from "react";
import { getRelatedArticles, RelatedArticlesResponse } from "../../../api/newsService";

type Article = {
  id: number;
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

interface Props {
  articleId: number;
}

const RelatedArticles: React.FC<Props> = ({ articleId }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRelatedArticles(articleId)
      .then((data: RelatedArticlesResponse) => setArticles(data.related))
      .finally(() => setLoading(false));
  }, [articleId]);

  if (loading) return <p>Đang tải bài liên quan...</p>;
  if (!articles.length) return <p>Không có bài liên quan.</p>;

  return (
    <ul>
      {articles.map(a => (
        <li key={a.id}>
          <a href={a.link}>{a.title}</a> - {a.source} ({a.pubDate})
        </li>
      ))}
    </ul>
  );
};

export default RelatedArticles;