import React, { Fragment, useState } from 'react';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import LockOpenIcon from '@material-ui/icons/LockOpen';

import ConfirmDialog from '../../../../components/ConfirmDialog';
import UserAddDialog from '../UserAddDialog'
import UserUpdateDialog from '../UserUpdateDialog'
import PassResetDialog from '../PassResetDialog'

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'username', numeric: false, disablePadding: true, label: 'Пользователь', sort: true },
  { id: 'login', numeric: false, disablePadding: false, label: 'Логин', sort: true },
  { id: 'status', numeric: false, disablePadding: false, label: 'Статус', sort: true },
  { id: 'rights', numeric: false, disablePadding: false, label: 'Права', sort: true },
  { id: '', numeric: true, disablePadding: true, label: 'Action', sort: false }
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='center'
            padding={headCell.disablePadding ? 'none' : 'default'}
          >{headCell.sort ? (
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              hideSortIcon={headCell.sort ? false : true}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>

          ) : (<span>{headCell.label}</span>)}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected, deleteDelete, setUserAddOpen } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} выбрано
        </Typography>
      ) : (
          <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
            Пользователи
          </Typography>
        )
      }

      {numSelected > 0 ? (
        <Tooltip title="Удалить">
          <IconButton aria-label="delete" onClick={deleteDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
          <Tooltip title="Добавить пользователя">
            <Button variant="contained" color="primary" onClick={() => setUserAddOpen(true)}>
              Добавить
            </Button>
          </Tooltip>
        )
      }
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const UsersTable = ({ users, addNewUser, deleteUsers, updateUser, resetPassword, selects }) => {
  const classes = useStyles();

  const [deleteDialog, setDeleteDialog] = useState(false)
  const [userAddOpen, setUserAddOpen] = useState(false)
  const [userUpdate, setUserUpdate] = useState(false)
  const [passReset, setPassReset] = useState(false)

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleRowEdit = (_, row) => {
    setUserUpdate(row)
  }

  const handlePassReset = (_, row) => {
    setPassReset(row)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleDelConfirm = () => {
    deleteUsers(selected)
    setDeleteDialog(false)
    setSelected([])
  }

  const saveNewUser = (data) => {
    // TODO: "Нужна заставка ожидания"
    addNewUser(data)
    setUserAddOpen(false)
  }

  const hanleUserUpdate = ({ id, data }) => {
    updateUser({
      id,
      data
    })
  }

  const handlePasswordReset = ({ id, password }) => {
    resetPassword({
      id, password
    })
  }

  return (
    <Fragment>
      <UserAddDialog open={userAddOpen} selects={selects} close={() => setUserAddOpen(false)} saveNewUser={saveNewUser} />
      <UserUpdateDialog data={userUpdate} selects={selects} open={userUpdate} close={() => setUserUpdate(false)} updateUser={hanleUserUpdate} />
      <PassResetDialog data={passReset} open={passReset} close={() => setPassReset(false)} passReset={handlePasswordReset} />
      <ConfirmDialog
        open={deleteDialog}
        confirm={handleDelConfirm}
        close={() => setDeleteDialog(false)}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить пользователей(я)?',
            content: 'Внимание! Это операция не может быть отменена. Часть данных приложения привязаны к учетной записи, будьте внимательны.'
          }
        }
      />
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} deleteDelete={setDeleteDialog} setUserAddOpen={setUserAddOpen} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={users.length}
            />
            <TableBody>
              {stableSort(users, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={(event) => handleClick(event, row.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell align="center" component="th" id={labelId} scope="row" padding="none">
                        {row.username}
                      </TableCell>
                      <TableCell align="center">{row.login}</TableCell>
                      <TableCell align="center">{row.status ? row.status.title : '-'}</TableCell>
                      <TableCell align="center">{row.rights ? row.rights.title : '-'}</TableCell>
                      <TableCell align="center" padding="none">
                        <Tooltip title="Обновить">
                          <IconButton
                            onClick={(event) => handleRowEdit(event, row)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Сбросить пароль">
                          <IconButton
                            onClick={(event) => handlePassReset(event, row)}
                          >
                            <LockOpenIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          labelRowsPerPage="Строк:"
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </Fragment>
  );
}

export default UsersTable