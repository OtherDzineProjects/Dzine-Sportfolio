'use client'

import React from 'react'
import { InputGroup, Input, InputRightElement, Button, Box, useColorModeValue } from '@chakra-ui/react'
import './style.css'
const SearchBar = () => {

    const bg = useColorModeValue('gray.100', 'gray.900')

    return (
        <div className='px-[200px] mt-[-50px] z-10 w-full'>
        <Box bg={bg} p={10}  boxShadow='xl' minW={'100%'} rounded='lg'>
            <InputGroup size='lg' h='62px'>
                <Input
                    pr='4.5rem'
                    type='text'
                    placeholder='Search here...'
                    h='62px'
                />
                <InputRightElement p='5px' w='150px' h='54px'>
                    <Button variant={'outline'} colorScheme={'blue'} rounded={'lg'} size='lg' h='50px' mt='6px' w='200px'>
                        Search
                    </Button>
                </InputRightElement>
            </InputGroup>
        </Box>
        </div>
    )
}

export default SearchBar