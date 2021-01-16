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

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 500,
    margin: '10px 0 0 10px',
    backgroundColor: theme.palette.background.paper,
  },
}));

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

const CategoriesList = ({ categories, newCat, handleChangeActive, handleCategoryDelete, handleEdit, handleNewSave, close }) => {
  const classes = useStyles();
  const [value, setValue] = useState('')

  const handleInput = (e) => {
    const val = e.currentTarget.value
    if (val !== '') {
      setValue(val)
    }
  }

  const handleEditCat = () => {
    return
  }

  const hanldeClose = () => {
    setValue('')
    close()
  }

  return (
    <List className={classes.root} >
      {newCat &&
        <ListItem key={'hgj12g3hg2'} role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={true}
              disableRipple
              inputProps={{ 'aria-labelledby': 'new-category' }}
            />
          </ListItemIcon>
          <ListItemText id={'new-category'} primary={
            <CategoryInput onChange={(e) => handleInput(e)} value={value} handleClose={hanldeClose} />
          } secondary="Введите тип населенного пункта" />
          <ListItemSecondaryAction>
            <IconButton edge="end" disabled={value === ""}>
              <SaveIcon onClick={() => handleNewSave(value)} />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      }

      {categories.map((category) => {
        const labelId = `checkbox-list-label-${category}`;
        return (
          <ListItem key={category.id} role={undefined} dense button onClick={() => handleChangeActive(category)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={category.active}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText className="category-list-title" id={labelId} primary={category.title} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleEditCat()}>
                <EditIcon />
              </IconButton>
              <IconButton edge="end" onClick={() => handleCategoryDelete(category.id)} >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
export default CategoriesList
