import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box
} from 'common';
import './style.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CustomAlert = ({
  status,
  title,
  message,
  variant = 'subtle',
  open = false,
  placement = 'relative'
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [open]);

  return (
    show && (
      <Alert status={status} variant={variant} className={`custom-alert ${placement}`}>
        <AlertIcon />
        <Box>
          <AlertTitle mr={2}>{title}</AlertTitle>
          <AlertDescription>
            {message}
          </AlertDescription>
        </Box>
      </Alert>
    )
  );
};

CustomAlert.propTypes = {
  status: PropTypes.string,
  title: PropTypes.string,
  message: PropTypes.string,
  variant: PropTypes.string,
  open: PropTypes.bool
};

CustomAlert.defaultProps = {
  status: 'error',
  title: 'Error!',
  message: 'Something went wrong!',
  variant: 'subtle',
  open: false
};

export default CustomAlert;