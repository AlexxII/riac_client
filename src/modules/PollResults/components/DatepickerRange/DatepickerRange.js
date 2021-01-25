import React, { useState } from 'react'

import Button from '@material-ui/core/Button';

const DatepickerRange = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(!open)}>
        Select Dates
      </Button>
    </div>
  )
}
export default DatepickerRange