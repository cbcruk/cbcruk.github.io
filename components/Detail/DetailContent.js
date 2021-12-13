import clsx from 'clsx'
import { getHtml } from './utils'
import useFootnoteLabel from './useFootnoteLabel'
import styles from './Detail.module.css'

function DetailContent({ body, className = '' }) {
  const handleClick = useFootnoteLabel()

  return (
    <div
      className={clsx([
        styles.content,
        'overflow-hidden max-w-none p-4 bg-gray-900 rounded-md prose prose-sm dark:prose-dark',
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
