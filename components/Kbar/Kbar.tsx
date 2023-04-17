import clsx from 'clsx'
import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
  useMatches,
  KBarResults,
  ActionImpl,
} from 'kbar'
import { useRouter } from 'next/router'
import React, { ReactNode } from 'react'
import { actions } from './constants'

type Props = {
  action: ActionImpl
  active: boolean
  currentRootActionId: ReturnType<typeof useMatches>['rootActionId']
}

const ResultItem = React.forwardRef<HTMLDivElement, Props>(
  ({ action, active, currentRootActionId }, ref) => {
    const ancestors = React.useMemo(() => {
      if (!currentRootActionId) {
        return action.ancestors
      }

      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      )

      return action.ancestors.slice(index + 1)
    }, [action.ancestors, currentRootActionId])

    return (
      <div
        ref={ref}
        className={clsx([
          'flex items-center justify-between p-4 border-l-2 border-transparent hover:border-gray-100 hover:bg-gray-800 transition cursor-pointer',
          {
            'border-gray-100': active,
            'bg-gray-800': active,
          },
        ])}
      >
        <div className="flex items-center gap-2 font-sm">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <React.Fragment key={ancestor.id}>
                    <span className="opacity-50 mr-2">{ancestor.name}</span>
                    <span className="mr-2">&rsaquo;</span>
                  </React.Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span className="font-sm">{action.subtitle}</span>
            )}
          </div>
        </div>

        {action.shortcut?.length ? (
          <div aria-hidden className="grid gap-1">
            {action.shortcut.map((sc) => (
              <kbd key={sc} className="px-2 rounded-sm text-xs bg-gray-900">
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    )
  }
)
ResultItem.displayName = 'ResultItem'

function RenderResults() {
  const { results, rootActionId } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => {
        if (typeof item === 'string') {
          return <div className="p-2 text-sm uppercase opacity-50">{item}</div>
        }

        return (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId}
          />
        )
      }}
    />
  )
}

type KbarProps = {
  children: ReactNode
}

export function Kbar({ children }: KbarProps) {
  const router = useRouter()

  return (
    <KBarProvider
      options={{
        enableHistory: true,
      }}
      actions={actions({
        onPerform(url) {
          router.push(url)
        },
      })}
    >
      <KBarPortal>
        <KBarPositioner>
          <KBarAnimator className="overflow-hidden w-full max-w-lg rounded-md shadow bg-gray-900">
            <KBarSearch className="w-full px-4 py-3 bg-gray-900 outline-0 text-md" />
            <RenderResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  )
}
