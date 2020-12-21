import React, { Fragment } from 'react'
import { Box, Typography } from "@material-ui/core";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
  },
}));


const ErrorState = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const PopOver = ({ open }) => {
    return (
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>
          {props.poper &&
            props.poper}
        </Typography>
      </Popover>
    )
  }

  let imageWidth;
  let imageHeight;
  let variant;

  switch (props.size) {
    case "small":
      imageWidth = 40;
      imageHeight = 40;
      variant = "h6";
      break;

    case "medium":
      imageWidth = 60;
      imageHeight = 60;
      variant = "h5";
      break;

    case "large":
      imageWidth = 100;
      imageHeight = 100;
      variant = "h4";
      break;

    default:
      imageWidth = 60;
      imageHeight = 60;
      variant = "h5";
      break;
  }

  if (props.type === "page") {
    return (
      <Fragment>
        <PopOver open={open} />
        <Box
          style={{ transform: "translate(-50%, -50%)" }}
          position="absolute"
          top="50%"
          left="50%"
          textAlign="center"
        >
          {props.image && (
            <Box
              clone
              mb={props.title || props.description ? 2 : 0}
              width={`${imageWidth}%`}
              height={`${imageHeight}%`}
            >
              {props.image}
            </Box>
          )}

          {props.title && (
            <Box mb={!props.description && props.button ? 2 : 0}>
              <Typography variant={variant}>{props.title}</Typography>
            </Box>
          )}

          {props.description && (
            <Box mb={props.button && 2}>
              <Typography variant="body1">{props.description}</Typography>
            </Box>
          )}
          <HelpOutlineIcon
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />

          {props.button && props.button}
        </Box>
      </Fragment>
    );
  }

  if (props.type === "card") {
    return (
      <Fragment>
        <PopOver open={open} />
        <Box padding={props.padding} textAlign="center">
          {props.image && (
            <Box
              clone
              mb={props.title || props.description ? 2 : 0}
              width={`${imageWidth}%`}
              height={`${imageHeight}%`}
            >
              {props.image}
            </Box>
          )}

          {props.title && (
            <Box mb={!props.description && props.button ? 2 : 0}>
              <Typography variant={variant}>{props.title}</Typography>
            </Box>
          )}

          {props.description && (
            <Box mb={props.button && 2}>
              <Typography variant="body1">{props.description}</Typography>
            </Box>
          )}
          <HelpOutlineIcon
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          />

          {props.button && props.button}
        </Box>
      </Fragment>
    );
  }
  return null;
}

const DefaultPoper = () => {
  return(
    <span>Смотрите консоль</span>
  )
}

ErrorState.defaultProps = {
  title: 'Ошибка',
  description: 'Что-то пошло не так',
  poper: <DefaultPoper />,
  type: "page",
  size: "medium",
  padding: 2,
};


export default ErrorState