import React, { useEffect, useRef, useState } from 'react'

import './style.css'

export interface Props extends Omit<React.HTMLProps<HTMLDivElement>, 'ref'> {
  source: any[]
  render: (item: any) => React.ReactNode
  breakpoints?: Record<number, number>
  gutter?: string | number
}

const Masonry: React.FC<Props> = ({
  source,
  render,
  breakpoints,
  gutter,
  className,
  style,
  ...other
}) => {
  const [data, setData] = useState<any[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)

  const [columnsCount, setColumnsCount] = useState<number>(0)
  const [columns, setColumns] = useState<Array<Array<any>>>([])

  const virtualRefs = useRef<Array<HTMLDivElement | null>>([])

  const [virtualData, setVirtualData] = useState<any[]>([])
  const [virtualItemsHeight, setVirtualItemsHeight] = useState<number[]>([])

  /**
   * Setup containerWidth updates listener (updates every 300ms)
   */
  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(
        containerRef.current?.getBoundingClientRect().width || 0
      )
    }

    const resizeTimeout = window.setInterval(handleResize, 300)

    return () => {
      clearTimeout(resizeTimeout)
    }
  }, [])

  /**
   * Update columnsCount
   */
  useEffect(() => {
    const updateColumnsCount = () => {
      if (containerWidth <= 0) return

      if (!breakpoints || !Object.keys(breakpoints).length) {
        setColumnsCount(1)
        return
      }

      const sortedBreakpoints = Object.entries(breakpoints).sort(
        (a, b) => parseInt(a[0]) - parseInt(b[0])
      )
      const newColumnsCount = sortedBreakpoints.map(breakpoint =>
        parseInt(breakpoint[0]) < containerWidth ? breakpoint[1] : 1
      )

      setColumnsCount(Math.max(...newColumnsCount))
    }

    updateColumnsCount()
  }, [containerWidth, breakpoints])

  /**
   * Update virtualItemsHeight
   */
  useEffect(() => {
    if (!virtualData.length) return

    const newVirtualItemsHeight: number[] = [
      ...virtualRefs.current.map(ref => ref?.offsetHeight || 0),
    ]

    setVirtualItemsHeight(newVirtualItemsHeight)
    setVirtualData([])
    virtualRefs.current = []
  }, [virtualData])

  /**
   * Update data
   */
  useEffect(() => {
    setData(source)
    setVirtualItemsHeight([])
    setVirtualData(source)
  }, [source])

  /**
   * Update columns content
   */
  useEffect(() => {
    const updateColumns = () => {
      if (data.length !== virtualItemsHeight.length) {
        return
      }

      if (columnsCount <= 0) {
        setColumns([])
        return
      }

      const newColumns = Array(columnsCount).fill([])
      const columnsHeight = Array(columnsCount).fill(0)

      data.forEach((item, index) => {
        const minColumnHeight = Math.min(...columnsHeight)
        const minColumnIndex = columnsHeight.findIndex(
          height => height === minColumnHeight
        )
        const columnIndex = Math.max(
          Math.min(minColumnIndex, columnsCount - 1),
          0
        )

        if (!newColumns[columnIndex]) return

        newColumns[columnIndex] = [...newColumns[columnIndex], item]
        columnsHeight[columnIndex] += virtualItemsHeight[index]
      })

      setColumns(newColumns)
    }

    updateColumns()
  }, [data, columnsCount, virtualItemsHeight])

  return (
    <React.Fragment>
      <div className="masonry-virtual-container">
        {virtualData.map((item, index) => (
          <div
            key={index}
            ref={itemElement => (virtualRefs.current[index] = itemElement)}
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
          <div
            key={columnIndex}
            className="masonry-column"
            style={{ rowGap: gutter }}
          >
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
