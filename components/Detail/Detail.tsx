import { Issue } from '@octokit/graphql-schema'
import DetailContent from './DetailContent'
import useNewWindow from './useNewWindow'
import { match } from 'ts-pattern'

type Props = {
  body: Issue['body']
  comments: Issue[]
}

function Detail({ body, comments }: Props) {
  useNewWindow()

  return (
    <>
      <DetailContent className="mt-4" body={body} />
      {match(comments.length)
        .with(0, () => null)
        .otherwise(() => {
          return (
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
          )
        })}
    </>
  )
}

export default Detail
