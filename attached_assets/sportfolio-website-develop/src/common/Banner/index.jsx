/* eslint-disable @next/next/no-img-element */
import React from 'react'

const HeaderBanner = ({ url = '', alt = "image" }) => {
    return (
        <div className='inner-page-header'>
            <img
                src={url}
                alt={alt}
            />
        </div>
    )
}

export default HeaderBanner