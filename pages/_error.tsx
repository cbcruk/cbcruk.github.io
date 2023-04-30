import { ErrorProps } from 'next/error'
import Layout from '../components/Layout'
import { NextPageContext } from 'next'

function Error({ statusCode }: ErrorProps) {
  return (
    <Layout>
      <h1 className="prose prose-xl">
        {statusCode
          ? `서버에서  오류가 발생했습니다.`
          : '클라이언트에서 오류가 발생했습니다.'}
      </h1>
    </Layout>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
