import clsx from 'clsx'
import { getHtml } from './utils'
import useFootnoteLabel from './useFootnoteLabel'
import styles from './Detail.module.css'
import { Issue } from '@octokit/graphql-schema'

type Props = {
  body: Issue['body']
} & JSX.IntrinsicElements['div']

function DetailContent({ body, className = '' }: Props) {
  const handleClick = useFootnoteLabel()

  return (
    <div
      className={clsx([
        styles.content,
        'overflow-hidden max-w-none p-4 bg-gray-900 rounded-md prose prose-sm prose-dark',
        className,
      ])}
      dangerouslySetInnerHTML={{
        __html: getHtml(body),
      }}
      onClick={handleClick}
    />
  )
}

export default DetailContent
