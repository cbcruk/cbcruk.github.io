type MaybeDate = ConstructorParameters<DateConstructor>[0]

export type Props = {
  ctime: MaybeDate
  mtime: MaybeDate
}
