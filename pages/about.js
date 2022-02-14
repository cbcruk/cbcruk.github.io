// @ts-check
import clsx from 'clsx'
import dayjs from 'dayjs'
import { HighlightLinks } from '../components/HighlightLinks'
import Layout from '../components/Layout'

/**
 *
 * @param {object} props
 * @param {import('$lib/types').About} props.about
 * @param {import('$lib/types').Links} props.links
 */
function About({ about, links }) {
  const { description, company } = about

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

      <h2 className="mt-8">링크</h2>
      <HighlightLinks>
        {links.map((link) => {
          return (
            <li key={link.name}>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gray-800 transition ease-out"
              >
                {link.name}
              </a>
            </li>
          )
        })}
      </HighlightLinks>
    </Layout>
  )
}

export async function getStaticProps() {
  const types = ['about', 'links']
  const [about, links] = await Promise.all(
    types.map((type) =>
      fetch(`${process.env.GOOGLE_APPS_SCRIPT_URL}?type=${type}`)
        .then((response) => response.json())
        .then(({ data }) => data)
    )
  )

  return {
    props: {
      about,
      links,
    },
  }
}

export default About
