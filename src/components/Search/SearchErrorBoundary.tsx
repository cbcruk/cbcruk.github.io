import { Component, type ReactNode } from 'react'

type Props = { children: ReactNode }
type State = { error: Error | null }

/**
 * `use` 가 거절된 promise 를 읽으면 가장 가까운 에러 경계로 던진다.
 * 코퍼스를 못 받은 경우가 여기로 온다.
 */
export class SearchErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <p className="p-2 text-xs font-mono rounded-md">
          {this.state.error.message}
        </p>
      )
    }

    return this.props.children
  }
}
