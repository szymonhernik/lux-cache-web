import { ReactElement, ReactNode } from 'react';

type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: ReactNode) => ReactElement;
  children: ReactNode;
};

export default function ConditionalWrapper(props: ConditionalWrapperProps) {
  const { condition, wrapper, children } = props;
  return condition ? wrapper(children) : <>{children}</>;
}
