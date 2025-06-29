import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogCloseButton,
    Button
} from 'common';
import './style.css';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAlertDialog } from 'pages/common/slice';
import { AlertIcon, Close, InfoIcon, SuccessIcon } from 'assets/InputIcons';
import { colors } from 'utils/colors';

const handleIcons = (type) =>{
    switch(type){
        case 'success':
            return <SuccessIcon width="100" height="100" color={colors.success} />
        case 'error':
            return <Close width="100" height="100" color={colors.secondary} />
        case 'warning':
            return <AlertIcon width="100" height="100" color={colors.warning} />
        case 'info':
            return <InfoIcon width="100" height="100" color={colors.info} />
        default:
            return <InfoIcon width="100" height="100" color={colors.info} />
    }
}

const CustomAlertDialog = () => {

    const cancelRef = useRef()
    const dispatch = useDispatch();

    const alertDialog = useSelector((state) => state.common.alertDialog)
    return (
        <AlertDialog
            motionPreset='slideInBottom'
            leastDestructiveRef={cancelRef}
            onClose={() => dispatch(setAlertDialog({ open: false }))}
            isOpen={alertDialog?.open}
            allowPinchZoom
            closeOnEsc={false}
            closeOnOverlayClick={false}
            blockScrollOnMount
            isCentered
        >
            <AlertDialogOverlay />

            <AlertDialogContent>
                <AlertDialogHeader>{alertDialog?.title}</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>
                    <div className={`flex justify-${alertDialog?.align}`}>
                    {handleIcons(alertDialog?.type)}
                    </div>
                    <div className={`text-${alertDialog?.align}`}>
                    {alertDialog?.message}
                    </div>
                </AlertDialogBody>
                {alertDialog?.actions &&
                    <AlertDialogFooter>
                        {alertDialog?.actions?.backward &&
                            <Button ref={cancelRef} onClick={alertDialog?.actions?.backward?.action} variant={alertDialog?.actions?.backward?.variant}>
                                {alertDialog?.actions?.backward?.text}
                            </Button>
                        }
                        {alertDialog?.actions?.forward &&
                            <Button colorScheme='red' ml={3} onClick={alertDialog?.actions?.forward?.action} variant={alertDialog?.actions?.backward?.variant}>
                                {alertDialog?.actions?.forward?.text}
                            </Button>
                        }
                    </AlertDialogFooter>
                }
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CustomAlertDialog;