import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Masonry from '../src'

import './style.css'

interface IData {
  value: number
  index: number
}

const App = () => {
  const masonryStyle = { maxWidth: '2800px', marginInline: 'auto' }

  // any[]
  const initialData: IData[] = Array(32)
    .fill(null)
    .map((_, index) => ({
      value: Math.random() * (500 - 200) + 200,
      index,
    }))

  // (item: any) => React.ReactNode
  const childRender = (item: IData) => (
    <div
      className="render-child"
      key={item.index}
      style={{ height: item.value }}
    >
      {item.index}
    </div>
  )

  // key:   container width in px breakpoint
  // value: collumns count
  const breakpoint = {
    300: 2,
    600: 3,
    900: 4,
    1200: 5,
    1500: 6,
    1600: 7,
    1900: 8,
    2200: 9,
    2500: 10,
  }

  return (
    <Masonry
      gutter={10}
      breakpoints={breakpoint}
      style={masonryStyle}
      source={initialData}
      render={childRender}
      className="masonry-layout"
    />
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
