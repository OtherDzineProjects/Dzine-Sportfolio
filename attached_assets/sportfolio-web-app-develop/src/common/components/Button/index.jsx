import { Button } from '@chakra-ui/react'
import PropTypes from 'prop-types';
const CustomButton = (props) => {
    const {
        label,
        variant,
        size,
        colorScheme,
        leftIcon,
        rightIcon,
        isLoading,
        loadingText,
        spinner,
        spinnerPlacement,
        isDisabled,
        onClick = () => {},
        ...rest
    } = props
  return (
    <Button
      variant={variant}
      size={size}
      colorScheme={colorScheme}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      isLoading={isLoading}
      loadingText={loadingText}
      spinner={spinner}
      spinnerPlacement={spinnerPlacement}
      isDisabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
        {label}
    </Button>
  )
}

CustomButton.PropTypes = {
  label: PropTypes.string.isRequired,
      variant: PropTypes.string,
      size : PropTypes.string,
      colorScheme: PropTypes.string,
      leftIcon: PropTypes.string,
      rightIcon: PropTypes.string,
      isLoading: false,
      loadingText: 'Submitting',
      spinner: PropTypes.string,
      spinnerPlacement: PropTypes.string,
      isDisabled: false
};

CustomButton.defaultProps = {
      label: '',
      variant: 'primary',
      size : 'xs',
      colorScheme: '',
      leftIcon: '',
      rightIcon: '',
      isLoading: false,
      loadingText: 'Submitting',
      spinner: '',
      spinnerPlacement: '',
      isDisabled: false
};


export default CustomButton