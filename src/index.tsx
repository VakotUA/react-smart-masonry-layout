import React, { useEffect, useRef, useState } from 'react'
import './styles.css'

// Render steps should looks like
// 4 loops is my best, IDK how to make it better
//
// 0 - prepare virtualData components on columnsCount or source change
// 1 - render virtualData components
// 2 - prepare columns based on virtualData components and clear virtualData
// 3 - render columns and render empty virtualData

export interface Props<T> extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  source: T[]
  render: (item: T) => React.ReactNode
  breakpoints?: Record<number, number>
  gutter?: string | number
}

/**
 * Render data from source array as `Masonry` layout columns with height control
 * @param {T[]} source data source array
 * @param {(item: T) => React.ReactNode} render children components render function
 * @param {Record<number, number>} [breakpoints] `{ [width]: columns }` pairs for adaptive design
 * @param {string | number} [gutter] gap between columns and components (any css gap value, such as `10`, `'1em'`, `'10px'`)
 * @param {Omit<React.HTMLProps<HTMLDivElement>, 'ref'>} [...other] other `<div />` params such as `style` or `className` (except of `ref`)
 * @returns `React.JSX.Element` that represents Masonry layout
 * @example
 * <Masonry
 *   source={Array(20).fill(null)}
 *   render={(item) => <div className='child'>Children {item}</div>}
 *   breakpoints={{
 *     600: 3, // 3 columns at width > 600px
 *     1200: 4, // 4 columns at width > 1200px
 *   }}
 *   gutter={10}
 *   {...otherDivParams}
 * />
 */
const Masonry = <T,>({
  source,
  render,
  breakpoints,
  gutter,
  className,
  style,
  ...other
}: Props<T>): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  const [columnsCount, setColumnsCount] = useState<number>(0)
  const [columns, setColumns] = useState<Array<Array<T>>>([])

  const [virtualData, setVirtualData] = useState<T[] | null>(null)
  const virtualRefs = useRef<Array<HTMLDivElement | null>>([])

  /**
   * Update columnsCount
   */
  useEffect(() => {
    const handleResize = () => {
      if (!breakpoints || !Object.keys(breakpoints).length) {
        setColumnsCount(1)
        return
      }

      const sortedBreakpoints = Object.entries(breakpoints).sort(
        (a, b) => parseInt(a[0]) - parseInt(b[0])
      )
      const newColumnsCount = sortedBreakpoints.map((breakpoint) =>
        parseInt(breakpoint[0]) < (containerRef.current?.offsetWidth || 0) ? breakpoint[1] : 1
      )

      setColumnsCount(Math.max(...newColumnsCount))
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoints])

  /**
   * Prepare columns and clear virtualData
   */
  useEffect(() => {
    const updateColumns = () => {
      if (columnsCount <= 0) {
        setColumns([])
        return
      }
      if (virtualData === null) return

      const newColumns = Array(columnsCount).fill([])
      const columnsHeight = Array(columnsCount).fill(0)

      const minColumnIndex = (): number => {
        const minHeight = Math.min(...columnsHeight)
        const minIndex = columnsHeight.findIndex((h) => h === minHeight)
        return Math.max(Math.min(minIndex, columnsCount - 1), 0)
      }

      virtualData.forEach((item, index) => {
        const columnIndex = minColumnIndex()
        const itemHeight = virtualRefs.current[index]?.offsetHeight || 0
        newColumns[columnIndex] = [...newColumns[columnIndex], item]
        columnsHeight[columnIndex] += itemHeight
      })

      setColumns(newColumns)
      setVirtualData(null)
    }

    updateColumns()
  }, [virtualData, columnsCount])

  /**
   * Prepare virtualData
   */
  useEffect(() => {
    setVirtualData(source)
  }, [columnsCount, source])

  return (
    <React.Fragment>
      <div className="masonry-virtual-container">
        {virtualData?.map((item, index) => (
          <div
            key={index}
            ref={(itemElement) => (virtualRefs.current[index] = itemElement)}
            className="masonry-virtual-item"
            // add gutter size to item height
            style={{ paddingBottom: gutter || 0 }}
          >
            {render(item)}
          </div>
        ))}
      </div>

      <div
        className={`masonry-container${className ? ` ${className}` : ''}`}
        style={{ ...style, columnGap: gutter }}
        {...other}
        ref={containerRef}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="masonry-column" style={{ rowGap: gutter }}>
            {column.map((item, index) => (
              <div key={index} className="masonry-item">
                {render(item)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </React.Fragment>
  )
}

export default Masonry
