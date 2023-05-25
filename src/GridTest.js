import GridLayout from 'react-grid-layout';
import React, { Component } from 'react';

class MyFirstGrid extends React.Component {
  render() {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
      {i: 'a', x: 0, y: 12, w: 4, h: 1},
      {i: 'b', x: 4, y: 0, w: 4, h: 1,},
      {i: 'c', x: 8, y: 0, w: 4, h: 1}
    ];
    return (
      <GridLayout margin={[2,0]} className="layout" layout={layout} cols={12} rowHeight={window.innerHeight} width={window.innerWidth}>
        <div key="a" style={{backgroundColor:'gray'}} isResizable={true} resizeHandles={['s','w', 'e', 'n','sw','nw','se','ne']}>a</div>
        <div key="b" style={{backgroundColor:'red'}}>b</div>
        <div key="c" style={{backgroundColor:'gray'}}>c</div>
      </GridLayout>
    )
  }
}
export default MyFirstGrid
