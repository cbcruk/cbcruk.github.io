// @ts-check
import DetailContent from './DetailContent'
import useNewWindow from './useNewWindow'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').Issue['body']} props.body
 * @param {import('@octokit/graphql-schema').Issue['comments']['nodes']} props.comments
 */
function Detail({ body, comments }) {
  const hasComment = comments.length > 0

  useNewWindow()

  return (
    <>
      <DetailContent className="mt-4" body={body} />

      {hasComment && (
        <div className="mt-10">
          <h2>📝 추가로 메모 했어요</h2>
          <div className="prose prose-sm prose-dark max-w-none mt-4">
            {comments.map((comment) => (
              <DetailContent
                key={comment.databaseId}
                className="mt-4"
                body={comment.bodyHTML}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default Detail
