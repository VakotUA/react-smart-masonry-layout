import React from 'react'
import Masonry from '../../src'

interface ISource {
  value: number
  index: number
}

const renderChild = (item: any) => (
  <div
    className="child-element"
    style={{
      height: item.value,
      width: '100%',
      backgroundColor: 'lightgray',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '32px',
      fontWeight: 'bolder',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    }}
  >
    {item.index}
  </div>
)
const initialSource: ISource[] = [
  { value: 100, index: 0 },
  { value: 200, index: 1 },
  { value: 300, index: 2 },
  { value: 400, index: 3 },
]
const responsiveSource: ISource[] = [
  { value: 100, index: 0 },
  { value: 200, index: 1 },
  { value: 300, index: 2 },
  { value: 400, index: 3 },
  { value: 500, index: 4 },
  { value: 600, index: 5 },
  { value: 100, index: 6 },
  { value: 200, index: 7 },
  { value: 300, index: 8 },
  { value: 400, index: 9 },
  { value: 500, index: 10 },
  { value: 600, index: 11 },
]
const breakpoints = { 300: 2, 600: 3, 900: 4, 1200: 5, 1500: 6 }

describe('Masonry layout component', () => {
  beforeEach(() => {
    cy.viewport(1080, 720)
  })

  it('renders without crashing', () => {
    cy.mount(<Masonry gutter={10} source={[]} render={() => null} />)
  })

  it('handle data', () => {
    cy.mount(<Masonry gutter={10} source={initialSource} render={renderChild} />)

    // virtual container empty
    cy.get('.masonry-virtual-container').should('exist').should('be.empty')

    // real container exist
    cy.get('.masonry-container').should('exist').should('not.be.empty')

    // columns count is 1
    cy.get('.masonry-column').should('exist').should('have.length', 1)

    // items count is initialSource.length
    cy.get('.masonry-item').should('exist').should('have.length', initialSource.length)

    // items content equals to initialSource
    cy.get('.child-element').each(($child, index) => {
      $child.text() === String(initialSource[index].index)
    })
  })

  it('handle breakpoints', () => {
    cy.mount(
      <Masonry
        gutter={10}
        breakpoints={breakpoints}
        source={responsiveSource}
        render={renderChild}
      />
    )

    // virtual container empty
    cy.get('.masonry-virtual-container').should('exist').should('be.empty')

    // real container exist
    cy.get('.masonry-container').should('exist').should('not.be.empty')

    // columns count is equal to breapoint
    Object.entries(breakpoints).forEach((breakpoint) => {
      // breakpoint + 1 + scrollWidth (17px) + 2 * body.margin (8px)
      cy.viewport(parseInt(breakpoint[0]) + 1 + 17 + 16, 720)

      cy.get('.masonry-column').should('exist').should('have.length', breakpoint[1])
    })
  })
})
