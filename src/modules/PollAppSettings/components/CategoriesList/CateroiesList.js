import React, { Fragment, useState } from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import CloseIcon from '@material-ui/icons/Close';
import Grid from '@material-ui/core/Grid';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import DragHandleIcon from '@material-ui/icons/DragHandle';

import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';
import arrayMove from 'array-move';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 560,
    margin: '10px 0 0 10px',
    backgroundColor: theme.palette.background.paper,
  },
}));

const DragHandle = sortableHandle(() => <DragHandleIcon className="drag-hanler" />);

const CategoryInput = ({ onChange, handleClose, value }) => {
  return (
    <Fragment>
      <Grid item container style={{ width: '100%' }}
        direction="row"
        justify="center"
        alignItems="flex-end"
      >
        <Grid xs={11} >
          <TextField id="standard-basic" onChange={onChange} autoFocus={true} value={value} fullWidth />
        </Grid>
        <Grid xs={1}>
          <CloseIcon id="close-new-category-input" onClick={() => handleClose()} />
        </Grid>
      </Grid>
    </Fragment>
  )
}

const ListInput = ({ value, startInput, hanldeClose, handleInput, handleNewSave, handleSaveEdit, edit }) => {
  const hanldeSaveClick = (value) => {
    edit ? handleSaveEdit() : handleNewSave(value)
  }
  return (
    <ListItem key={'hgj12g3hg2'} role={undefined} dense>
      <ListItemIcon className="city-list-item-icon">
        <Checkbox
          edge="start"
          checked={true}
          disableRipple
          inputProps={{ 'aria-labelledby': 'new-category' }}
        />
      </ListItemIcon>
      <ListItemText id={'new-category'} primary={
        <CategoryInput onChange={(e) => handleInput(e)} value={value} handleClose={hanldeClose} />
      } secondary={edit ? "Отредактируйте тип НП" : "Введите тип населенного пункта"} />
      <ListItemSecondaryAction>
        <IconButton edge="end" disabled={!startInput} onClick={() => hanldeSaveClick(value)}>
          <SaveIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const SortableItem = sortableElement(({ category, labelId, handleChangeActive, handleEditCat, handleCategoryDelete }) => (
  <ListItem key={category.id} role={undefined} dense button={false} >
    <ListItemIcon className="city-list-item-icon">
      <Checkbox
        edge="start"
        checked={category.active}
        disableRipple
        onClick={() => handleChangeActive(category)}
        inputProps={{ 'aria-labelledby': labelId }}
      />
      <DragHandle />
    </ListItemIcon>
    <ListItemText className="category-list-title" id={labelId} primary={category.title} />
    <ListItemSecondaryAction>
      <Fragment>
        <IconButton edge="end" onClick={() => handleEditCat(category)}>
          <EditIcon />
        </IconButton>
        <IconButton edge="end" onClick={() => handleCategoryDelete(category.id)} >
          <DeleteIcon />
        </IconButton>
      </Fragment>
    </ListItemSecondaryAction>
  </ListItem>
))

const SortableContainer = sortableContainer(({ children }) => {
  const classes = useStyles();
  return (
    <List className={classes.root} >
      {children}
    </List>
  )
})

const CategoriesList = ({ categories, handleChangeActive, saveNewSort, handleCategoryDelete, handleEdit, handleNewSave }) => {
  const [newCat, setNewCat] = useState(false)
  const [startInput, setStartInput] = useState(false)
  const [value, setValue] = useState('')
  const [edit, setEdit] = useState(false)

  const handleInput = (e) => {
    const val = e.currentTarget.value
    setStartInput(true)
    setValue(val)
  }

  const handleEditCat = (category) => {
    setValue(category.title)
    setEdit(category.id)
  }

  const handleSaveClick = () => {
    handleNewSave(value)
    setValue('')
    setStartInput(false)
    setNewCat(false)
  }

  const handleEditSave = () => {
    handleEdit({
      id: edit,
      title: value
    })
    setStartInput(false)
    setValue('')
    setEdit(false)
  }

  const hanldeClose = () => {
    if (edit) {
      setEdit(false)
    } else {
      setNewCat(false)
    }
    setValue('')
    setStartInput(false)
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newArray = arrayMove(categories, oldIndex, newIndex)
      let deltaArray = []
      const newOrder = newArray.reduce((acum, val, index) => {
        if (val.order === index + 1) {
          acum.push(val)
        } else {
          deltaArray.push({
            id: val.id,
            order: index + 1
          })
          acum.push({ ...val, order: index + 1 })
        }
        return acum
      }, [])
      saveNewSort({
        newOrder,
        deltaArray
      })
    }
  }

  return (
    <Fragment>
      <Grid container
        direction="column"
        justify="flex-start"
        alignItems="flex-start"
      >
        <div className="categories-add-zone">
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => setNewCat(true)}
          >
            Добавить
        </Button>
        </div>
        <div>
          <SortableContainer onSortEnd={onSortEnd} useDragHandle>
            {newCat &&
              <ListInput value={value} hanldeClose={hanldeClose} handleInput={handleInput} handleNewSave={handleSaveClick} />
            }
            {categories.map((category, index) => {
              const labelId = `checkbox-list-label-${category}`;
              return (
                <Fragment>
                  {edit === category.id ?
                    <ListInput
                      key="223dskjhflaskjh"
                      startInput={startInput}
                      value={value}
                      hanldeClose={hanldeClose}
                      edit={edit}
                      handleInput={handleInput}
                      handleSaveEdit={handleEditSave}
                      handleNewSave={handleSaveClick}
                    />
                    :
                    <SortableItem
                      key={`item-${category.id}`}
                      index={index}
                      category={category}
                      labelId={labelId}
                      handleChangeActive={handleChangeActive}
                      handleEditCat={handleEditCat}
                      handleCategoryDelete={handleCategoryDelete}
                    />
                  }
                </Fragment>
              );
            })}
          </SortableContainer>
        </div>
      </Grid>
    </Fragment>
  );
}
export default CategoriesList
