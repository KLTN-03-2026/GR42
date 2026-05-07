import RelatedNews from "./RelatedNews";

function ArticlePage() {
  const currentId = 123; 
  return (
    <div>
      <h1>Tiêu đề bài báo chính</h1>
      <p>Nội dung...</p>

      <hr />

      <RelatedNews articleId={currentId} />
    </div>
  );
}