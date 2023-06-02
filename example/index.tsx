import React from 'react'
import ReactDOM from 'react-dom/client'
import Masonry from '../src' // replace with "import Masonry from 'react-smart-masonry-layout'"
import './styles.css'

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
    minWidth: 72,
    height: 36,
    borderRadius: 6,
  }
  // (item: any) => React.ReactNode
  const childRender = (item: IData) => (
    <div className="render-child" style={{ height: item.value }}>
      {item.index}
    </div>
  )

  // key:   container width in px breakpoint
  // value: collumns count
  const breakpoints = {
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

  const getData = (length: number, startIndex: number): IData[] => {
    return Array(length)
      .fill(null)
      .map((_, index) => ({
        value: Math.random() * (500 - 200) + 200,
        index: index + startIndex,
      }))
  }

  const [data, setData] = React.useState<IData[]>(getData(16, 0))

  const handleAdd = () => setData((prev) => [...prev, ...getData(8, prev.length)])
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
        breakpoints={breakpoints}
        source={data}
        render={childRender}
        className="masonry-layout"
      />
    </React.Fragment>
  )
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />)
