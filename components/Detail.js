function Detail({ body, comments }) {
  const hasComment = comments.length > 0

  return (
    <>
      <div
        className="mt-6 prose prose-sm dark:prose-dark"
        dangerouslySetInnerHTML={{ __html: body }}
      ></div>

      {hasComment && (
        <div className="mt-6">
          <h2>코멘트</h2>
          <div className="prose prose-sm dark:prose-dark mt-4">
            {comments.map((comment) => (
              <div
                key={comment.databaseId}
                className="border-t border-dashed  border-gray-300 dark:border-gray-500 mt-4 text-xs"
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
