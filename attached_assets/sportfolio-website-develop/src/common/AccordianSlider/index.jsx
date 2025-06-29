'use client'
import React from 'react';
import './style.css';

const AccordionSlider = ({ data = [] }) => {

    return (
        <div class="accordian-carousel">
            <ul>
                {data?.map((item) => (
                    <li key={item?.id} style={{backgroundImage: `url(${item.url})`}}>
                        <div>
                            <a href="#" class="sliderLink">
                                <h2>{item?.title}</h2>
                            </a>
                        </div>
                    </li>
                ))}



            </ul>
        </div>


    );
};

export default AccordionSlider;
