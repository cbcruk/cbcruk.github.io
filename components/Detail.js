function Detail({ body, comments }) {
  const hasComment = comments.length > 0
  const html = body
    .replace(/\[CODEPEN=(.+)\]/g, (_match, p1) => {
      return `<iframe src="https://codepen.io/eunsoolee/embed/${p1}?default-tab=result" loading="lazy"></iframe>`
    })
    .replace(/\[CODESANDBOX=(.+)\]/g, (_match, p1) => {
      return `<iframe src="https://codesandbox.io/embed/${p1}?fontsize=14&theme=dark&view=preview"></iframe>`
    })

  return (
    <>
      <style jsx global>{`
        .prose pre {
          background-color: #212121;
        }

        .prose blockquote {
          color: #e5e7eb;
        }
      `}</style>
      <style jsx>{`
        .Detail-content :global(iframe) {
          width: 100%;
          aspect-ratio: 3/2;
        }
      `}</style>

      <div
        className="Detail-content mt-6 prose prose-sm dark:prose-dark"
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      ></div>

      {hasComment && (
        <div className="mt-6">
          <h2>코멘트</h2>
          <div className="prose prose-sm dark:prose-dark mt-4">
            {comments.map((comment) => (
              <div
                key={comment.databaseId}
                className="border-t border-dashed  border-gray-300 dark:border-gray-500 mt-4"
                dangerouslySetInnerHTML={{ __html: comment.bodyHTML }}
              ></div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Detail
