import React from 'react'
import { createRoot } from 'react-dom/client'

// i'll add some in future, i promise (^-^)
describe('it', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div')
    const root = createRoot(div)
    root.render(<></>)
    root.unmount()
  })
})
