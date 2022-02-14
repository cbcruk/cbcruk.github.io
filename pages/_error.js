// @ts-check
import Layout from '../components/Layout'

/**
 *
 * @param {import('next/error').ErrorProps} props
 */
function Error({ statusCode }) {
  return (
    <Layout title="">
      <h1 className="prose prose-xl">
        {statusCode
          ? `서버에서  오류가 발생했습니다.`
          : '클라이언트에서 오류가 발생했습니다.'}
      </h1>
    </Layout>
  )
}

/**
 *
 * @param {import('next').NextPageContext} props
 */
Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
