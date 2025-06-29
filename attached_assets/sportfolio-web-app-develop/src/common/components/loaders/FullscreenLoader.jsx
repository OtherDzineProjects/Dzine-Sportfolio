import { Progress } from 'common'

const FullscreenLoader = ({
    text = 'loading...', height = '50vh'
}) => {
  return (
    <div className='w-full h-full'>
        <div className='w-[400px] h-[200px] mx-auto' style={{marginTop: `calc(${height} - 100px )`}}>
        <Progress size='xs' isIndeterminate />
        <div className='text-center p-10'>
            {text}
        </div>
        </div>
    </div>
  )
}

export default FullscreenLoader