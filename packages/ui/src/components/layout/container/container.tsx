/** @jsx h */
import { ComponentChildren, h, JSX } from 'preact'

import { Props } from '../../../types'
import styles from './container.css'

export interface ContainerProps {
  children: ComponentChildren
  space?: ContainerSpace
}
export type ContainerSpace =
  | 'extraSmall'
  | 'small'
  | 'medium'
  | 'large'
  | 'extraLarge'

export function Container({
  space = 'small',
  ...rest
}: Props<HTMLDivElement, ContainerProps>): JSX.Element {
  return <div {...rest} class={styles[space]} />
}
