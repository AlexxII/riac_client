import React, { useEffect, useState } from 'react'
import { FixedSizeGrid } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import VirtCell from '../VirtCell'

const COLUMN_WIDTH = 280;
const ROW_HEIGHT = 180;
const GUTTER_SIZE = 10;

const V = ({ data, selectPool, setSelectPool, showDetails, updateSingle }) => {
  const theme = useTheme();
  const [lastSelectedIndex, setLastSelectedIndex] = useState()

  const handleSelect = (inData) => {
    if (inData.event.nativeEvent.shiftKey) {
      let ar = []
      if (inData.index + 1 > lastSelectedIndex) {
        ar = data.slice(lastSelectedIndex, inData.index + 1)
      } else {
        ar = data.slice(inData.index, lastSelectedIndex)
      }
      const rr = ar.filter(obj => !selectPool.includes(obj.id)).map(obj => obj.id)
      setSelectPool(prevState => ([
        ...prevState,
        ...rr
      ]))
      setLastSelectedIndex(inData.index)
      return
    }
    setLastSelectedIndex(inData.index)
    if (inData.event.nativeEvent.ctrlKey) {
      if (selectPool.includes(inData.id)) {
        const n = selectPool.filter(id => {
          return id !== inData.id
        })
        setSelectPool(n)
        return
      } else {
        setSelectPool(prevState => ([
          ...prevState,
          inData.id
        ]))
        return
      }
    }
    // при простом клике мышью
    if (selectPool.includes(inData.id)) {
      if (selectPool.length > 1) {
        setSelectPool([inData.id])
        return
      }
      setSelectPool([])
    } else {
      setSelectPool([inData.id])
    }
  }


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
    const visibleStartIndex = visibleRowStartIndex * config.columns + visibleColumnStartIndex;
    const visibleStopIndex = visibleRowStopIndex * config.columns + visibleColumnStopIndex;
    infiniteOnItemsRendered({
      visibleStartIndex,
      visibleStopIndex,
    });
  };

  const loadMoreItems = () => {
    console.log('Нужно отрисовать');
  }

  const isItemLoaded = true

  const count = 600

  if (!config) return 'Загрузка'

  const renderCell = ({ rowIndex, columnIndex, style }) => {
    const item = data[rowIndex * config.columns + columnIndex]
    return (
      <div
        style={{
          ...style,
          left: style.left + GUTTER_SIZE,
          top: style.top + GUTTER_SIZE,
          width: style.width - GUTTER_SIZE,
          height: style.height - GUTTER_SIZE
        }}
      >
        <VirtCell
          key={rowIndex * config.columns + columnIndex}
          respondent={item}
          index={rowIndex * config.columns + columnIndex}
          show={showDetails}
          edit={updateSingle}
          selected={item ? selectPool.includes(item.id) : false}
          select={handleSelect}
          count={selectPool.length}
        />
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