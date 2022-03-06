// @ts-check
import clsx from 'clsx'
import { getHtml } from './utils'
import useFootnoteLabel from './useFootnoteLabel'
import styles from './Detail.module.css'

/**
 *
 * @param {object} props
 * @param {import('@octokit/graphql-schema').IssueComment['bodyHTML']} props.body
 * @param {string} props.className
 */
function DetailContent({ body, className = '' }) {
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
    ></div>
  )
}

export default DetailContent
