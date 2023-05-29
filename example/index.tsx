import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Masonry from '../src'

import './style.css'

interface IData {
  value: number
  index: number
}

const App = () => {
  const headerStyle: React.CSSProperties = {
    width: '100%',
    height: 64,
    position: 'sticky',
    left: 0,
    top: 0,
    backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  }
  const buttonStyle: React.CSSProperties = {
    width: 72,
    height: 36,
    borderRadius: 6,
  }
  const masonryStyle: React.CSSProperties = {
    maxWidth: '2800px',
    marginInline: 'auto',
    padding: 10,
  }

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

  const getData = (length: number): IData[] => {
    return Array(length)
      .fill(null)
      .map((_, index) => ({
        value: Math.random() * (500 - 200) + 200,
        index: index + data.length,
      }))
  }

  const [data, setData] = React.useState<IData[]>([])

  React.useEffect(() => {
    setData(getData(16))
  }, [])

  const handleAdd = () => setData(prev => [...prev, ...getData(8)])
  const handleClear = () => setData([])

  return (
    <React.Fragment>
      <header style={headerStyle}>
        <button style={buttonStyle} onClick={handleAdd}>
          Add
        </button>
        |
        <button style={buttonStyle} onClick={handleClear}>
          Clear
        </button>
      </header>

      <Masonry
        gutter={10}
        breakpoints={breakpoint}
        style={masonryStyle}
        source={data}
        render={childRender}
        className="masonry-layout"
      />
    </React.Fragment>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
