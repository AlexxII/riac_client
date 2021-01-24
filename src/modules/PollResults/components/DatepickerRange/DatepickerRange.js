import React, { useState } from 'react'

import Button from '@material-ui/core/Button';

import MultipleDatesPicker from '@randex/material-ui-multiple-dates-picker'

const DatepickerRange = () => {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <Button onClick={() => setOpen(!open)}>
        Select Dates
      </Button>
      <MultipleDatesPicker
        open={open}
        selectedDates={[]}
        onCancel={() => setOpen(false)}
        onSubmit={dates => console.log('selected dates', dates)}
      />
    </div>
  )
}
export default DatepickerRange