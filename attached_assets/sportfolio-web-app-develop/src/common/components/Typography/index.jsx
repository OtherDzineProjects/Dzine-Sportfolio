import { Heading, Text } from '@chakra-ui/react';
import PropTypes from 'prop-types';
const Typography = ({
  text = '',
  color = '#242A2D',
  type = 'paragraph',
  size = 'xl',
  weight='400',
  ...rest
}) => {
  if (type === 'paragraph') {
    return <Text fontSize={size} style={{ color: color, fontWeight: weight }}>{text}</Text>;
  }
  return <Heading as={type} size={size} {...rest} style={{ color: color, fontWeight: weight }}>
    {text}
  </Heading>;
};

Typography.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string
};

export default Typography;