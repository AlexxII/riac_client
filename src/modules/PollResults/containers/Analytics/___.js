import Button from '@material-ui/core/Button';

<Grid
container
direction="column"
justify="space-between"
alignItems="flex-start"
>
<p>
  <Button
    variant="contained"
    color="primary"
    onClick={calc}
  >
    Тест
  </Button>
</p>
<p>
  <Button
    variant="contained"
    color="primary"
    onClick={calcEx}
  >
    Тест - 2
    </Button>
</p>
<p>
  <Button
    variant="contained"
    color="primary"
    onClick={calcExEx}
  >
    Вместе
  </Button>
</p>
</Grid>