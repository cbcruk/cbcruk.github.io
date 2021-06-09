import clsx from 'clsx'
import dayjs from 'dayjs'
import Layout from '../components/Layout'

function About({ data }) {
  const { description, company } = data

  return (
    <Layout title="자기소개">
      <p className="mt-2 whitespace-pre-line text-sm">{description}</p>

      <h2 className="mt-8">다녀본 회사들</h2>
      <ul className="flex flex-col gap-1 mt-2 text-sm">
        {company.map(
          (
            { name, start_date, end_date, is_closure, is_freelancer },
            index
          ) => {
            const range = [start_date, end_date]
              .map((date) => dayjs(date).format('YYYY-MM-DD'))
              .join('~')

            return (
              <li
                key={index}
                className={clsx({
                  'text-gray-500': is_freelancer,
                })}
              >
                <span
                  className={clsx({
                    'line-through': is_closure,
                  })}
                >
                  {is_freelancer && `(계약직) `}
                  {name}
                </span>{' '}
                <span className="text-xs">{range}</span>
              </li>
            )
          }
        )}
      </ul>
    </Layout>
  )
}

export async function getStaticProps() {
  const response = await fetch(process.env.GOOGLE_APPS_SCRIPT_URL)
  const { data } = await response.json()

  return {
    props: {
      data,
    },
  }
}

export default About
