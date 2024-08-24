export const code = `import React, { ComponentProps, FC, ReactNode } from 'react'

function Spinner() {
  return (
    <span className="absolute inset-0 flex items-center justify-center">
      \`<Spinner />\`
    </span>
  )
}

type LabelProps = ComponentProps<'span'>

function Label({ children, ...rest }: LabelProps) {
  return <span {...rest}>{children}</span>
}

type LoadingButtonProps = ComponentProps<'button'> & {
  children: FC | ReactNode
}

/**
 * @description 버튼이 비활성화되었을 때 로딩 스피너를 표시할 수 있는 버튼 컴포넌트입니다. 이 컴포넌트는 children 속성으로 함수나 React 노드를 받을 수 있으며, 버튼이 비활성화되면 스피너가 표시되고, 텍스트는 보이지 않게 됩니다.
 */
function LoadingButton({
  disabled,
  className,
  children,
  ...rest
}: LoadingButtonProps) {
  return (
    <button {...rest} className={\`\${className} relative\`} disabled={disabled}>
      {typeof children === 'function' ? (
        children({})
      ) : (
        <>
          {disabled && <Spinner />}
          <Label className={disabled ? 'invisible' : ''}>{children}</Label>
        </>
      )}
    </button>
  )
}

LoadingButton.Spinner = Spinner
LoadingButton.Label = Label`
