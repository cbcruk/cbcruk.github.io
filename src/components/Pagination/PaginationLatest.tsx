import {
  Pagination,
  PaginationLink,
  PaginationLinkGroup,
} from './PaginationPrimitive'

export function PaginationLatest() {
  return (
    <Pagination>
      <PaginationLinkGroup>
        <PaginationLink href="/memos/1">전체 보기</PaginationLink>
      </PaginationLinkGroup>
    </Pagination>
  )
}
