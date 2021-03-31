import React from 'react'
import {
  CellMeasurer,
  CellMeasurerCache,
  createMasonryCellPositioner,
  WindowScroller,
  Masonry
} from 'react-virtualized';

const cache = new CellMeasurerCache({
  defaultHeight: 250,
  defaultWidth: 200,
  fixedWidth: true,
});

const cellPositioner = createMasonryCellPositioner({
  cellMeasurerCache: cache,
  columnCount: 10,
  columnWidth: 100,
  spacer: 10,
});

function cellRenderer({ index, key, parent, style }) {
  return (
    <CellMeasurer cache={cache} index={index} key={key} parent={parent}>
      <div style={style}>
        <h4>Текст</h4>
      </div>
    </CellMeasurer>
  );
}

const VirtMasonry = () => {
  return (
    <WindowScroller>
      {({ height, isScrolling, onChildScroll, scrollTop }) => (
        <Masonry
          autoHeight={true}
          cellCount={400}
          cellMeasurerCache={cache}
          cellPositioner={cellPositioner}
          cellRenderer={cellRenderer}
          overscanByPixels={true}
          height={height}
          width={800}
        />
      )}
    </WindowScroller>
  )
}

export default VirtMasonry