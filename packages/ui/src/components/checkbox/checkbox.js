/** @jsx h */
import { h } from 'preact'
import '../../scss/base.scss'
import styles from './checkbox.scss'

export function Checkbox ({ children, name, onChange, value, ...rest }) {
  function handleChange (event) {
    onChange(event.target.checked === true, name)
  }

  return (
    <label class={styles.label}>
      <input
        {...rest}
        class={styles.input}
        type='checkbox'
        checked={value === true}
        onChange={handleChange}
      />
      <div class={styles.text}>{children}</div>
    </label>
  )
}
