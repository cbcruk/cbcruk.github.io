import type { Page } from 'astro'
import {
  Pagination,
  PaginationLabel,
  PaginationLink,
  PaginationLinkGroup,
} from './PaginationPrimitive'

export function PaginationDefault(page: Page) {
  return (
    <Pagination>
      <PaginationLabel>
        {`${page.lastPage} 중 ${page.currentPage}페이지`}
      </PaginationLabel>
      <PaginationLinkGroup>
        {page.url.prev && (
          <PaginationLink href={page.url.prev}>이전 페이지</PaginationLink>
        )}
        {page.url.next && (
          <PaginationLink href={page.url.next}>다음 페이지</PaginationLink>
        )}
      </PaginationLinkGroup>
    </Pagination>
  )
}
