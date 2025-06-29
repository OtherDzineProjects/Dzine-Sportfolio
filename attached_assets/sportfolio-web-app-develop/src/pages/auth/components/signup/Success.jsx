import { SuccessIcon } from "assets/InputIcons"
import { Typography, Button } from "common"
import { PATH_SIGNIN } from "common/constants"
import { colors } from "utils/colors"
import { reRoute } from "utils/reRoutes"

const Success = () => {

    const handleAccess = () =>{
        reRoute(PATH_SIGNIN)
    }

  return (
    <div className="w-full p-10">
        <div className='w-full text-center mt-10'>
            <SuccessIcon color={colors.primary} width='100' height='100' style={{margin: 'auto'}} />
        </div>
        <div className='w-full text-center mt-5'>
       <Typography type='h2' text="Success" size='2xl' color={colors.primary} />
       </div>
       <div className='w-full text-center mt-5 mb-10'>
       <Typography type='paragraph' text={`Hi, Your Sportfolio account successfully created, Please login and update your profile.`} color={colors.textDark} />
    </div>
    <div className='w-full text-center mt-5 mb-10'>
    <Button onClick={()=>handleAccess()} size="lg" variant='solid' className='mt-5' colorScheme='primary'>
                   Login
          </Button>
    </div>
    </div>
  )
}

export default Success