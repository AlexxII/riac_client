import React from 'react'

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const CategoryCard = ({ category }) => {

  return (
    <FormControlLabel id="selectall-checkbox"
      control={
        <Checkbox
          checked={category.active}
          color="primary"
        />
      }
      label={category.title}
    />
  )
}

export default CategoryCard

