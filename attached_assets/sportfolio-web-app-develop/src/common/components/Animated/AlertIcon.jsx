import './style.css';
const AlertIcon = (props) => {

    const { variant = 'success' } = props
    return (
        <div className="galaxy-alert">
            {variant === 'error' &&
                <div className="galaxy-icon galaxy-error scaleWarning animate">
                    <span className="galaxy-x-mark">
                        <span className="galaxy-line galaxy-left animateXLeft"></span>
                        <span className="galaxy-line galaxy-right animateXRight"></span>
                    </span>
                    <div className="galaxy-placeholder"></div>
                    <div className="galaxy-fix"></div>
                </div>
            }
            {variant === 'warning' &&
            <div className="galaxy-icon galaxy-warning scaleWarning animate">
                <span className="galaxy-body pulseWarningIns"></span>
                <span className="galaxy-dot pulseWarningIns"></span>
            </div>
            }
            {variant === 'success' &&
                <div className="galaxy-icon galaxy-success scaleWarning animate">
                    <span className="galaxy-line galaxy-tip animateSuccessTip"></span>
                    <span className="galaxy-line galaxy-long animateSuccessLong"></span>
                    <div className="galaxy-placeholder"></div>
                    <div className="galaxy-fix"></div>
                </div>
            }
        </div>
    )
}

export default AlertIcon;