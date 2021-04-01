import React, { useEffect, useState } from 'react'
import { FixedSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const COLUMN_WIDTH = 210;
const ROW_HEIGHT = 180;
const GUTTER_SIZE = 5;

const V = () => {
  const theme = useTheme();

  // Надо разобраться
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [config, setConfig] = useState(null)

  useEffect(() => {
    window.addEventListener('resize', recalcSize)
    return () => {
      window.removeEventListener('resize', recalcSize)
    };
  })

  useEffect(() => {
    recalcSize()
  }, [])

  const recalcSize = () => {
    const width = (document.documentElement.clientWidth || document.body.clientWidth) - (fullScreen ? 0 : 180);
    const height = window.innerHeight - 220;
    const columns = Math.floor((width - 40) / COLUMN_WIDTH);
    setConfig({
      width,
      height,
      columns,
    });
  }

  const onItemsRendered = infiniteOnItemsRendered => ({
    visibleColumnStartIndex,
    visibleColumnStopIndex,
    visibleRowStartIndex,
    visibleRowStopIndex,
  }) => {
    const visibleStartIndex = visibleRowStartIndex * this.state.columns + visibleColumnStartIndex;
    const visibleStopIndex = visibleRowStopIndex * this.state.columns + visibleColumnStopIndex;
    infiniteOnItemsRendered({
      visibleStartIndex,
      visibleStopIndex,
    });
  };

  const loadMoreItems = () => {
    console.log('Нужно отрисовать');
  }

  const isItemLoaded = true

  const count = 1000000

  if (!config) return 'Загрузка'

  const renderCell = ({ rowIndex, columnIndex, style }) => {
    return (
      <div
        style={{
          ...style,
          backgroundColor: 'lightgray',
          left: style.left + GUTTER_SIZE,
          top: style.top + GUTTER_SIZE,
          width: style.width - GUTTER_SIZE,
          height: style.height - GUTTER_SIZE
        }}
      >
        {`${rowIndex} - ${columnIndex}`}
      </div>
    )
  }

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      loadMoreItems={loadMoreItems}
      itemCount={count}
    >
      {({ onItemsRendered, ref }) => (
        <section>
          <FixedSizeGrid
            onItemsRendered={onItemsRendered(onItemsRendered)}
            columnCount={config.columns}
            columnWidth={COLUMN_WIDTH}
            height={config.height}
            rowCount={Math.ceil(count / config.columns)}
            rowHeight={ROW_HEIGHT}
            width={config.width}
            ref={gridRef => {
              gridRef = gridRef;
              ref(gridRef);
            }}
          >
            {renderCell}
          </FixedSizeGrid>
        </section>
      )}
    </InfiniteLoader>
  )
}

export default V