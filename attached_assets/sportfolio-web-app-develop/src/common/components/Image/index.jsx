import './style.css'
const Image = ({
    src = '',
    alt = 'image',
    className = 'w-full',
    ...rest
}) => {
  return (
    <>
    <image src={src} alt={alt} className={className} {...rest} />
    </>
  )
}

export default Image