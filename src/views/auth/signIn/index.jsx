import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
// Chakra imports
import {
    Box,
    Button,
    // Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import { HSeparator } from "components/separator/Separator";
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/auth.png";
// import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { sliceNumber } from "../../../contexts/allRequest";
import axios from "axios";
import {
    user_sendCode
} from "../../../contexts/api";
import { consoleClear, toastMessage } from "../../../contexts/toast-message";
import { useNavigate } from "react-router-dom";
import { AppStore } from "contexts/state-management";
import { useTranslation } from "react-i18next";

const defVal = { phone: '', password: '' }

function SignIn() {
    const navigate = useNavigate()
    const { setPhonenumber, phonenumber } = AppStore()
    const [auth, setAuth] = useState({ phone: '', password: '' });
    const [roles, setRoles] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const { t } = useTranslation()

    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");

    useEffect(() => {
        if (roles === 'ROLE_SUPER_ADMIN') {
            toast.success('You have successfully logged in')
            navigate('/admin/dashboard')
            sessionStorage.setItem('pathname', 'Dashboard')
            setAuth(defVal)
        } else if (roles === 'ROLE_SELLER') {
            toast.success('You have successfully logged in')
            navigate('/seller/dashboard')
            sessionStorage.setItem('pathname', 'Dashboard')
            setAuth(defVal)
        } else if (roles === 'ROLE_TERMINAL') {
            toast.success('You have successfully logged in')
            navigate('/terminal/payment')
            sessionStorage.setItem('pathname', 'Terminal dashboard')
            setAuth(defVal)
        }
    }, [roles]);

    const authLogin = async () => {
        setLoading(true)
        try {
            const { data } = await axios.post(user_sendCode, {
                phone: `+998${phonenumber}`,
            })
            if (data?.error?.code) {
                setLoading(false)
                toastMessage(data.error.code)
            } else {
                setLoading(false)
              
            }
        } catch (err) {
            setLoading(false)
        }
    }

    function checkKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            document.querySelector('button[type="submit"]').click();
        }
    }

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex
                maxW={{ base: "100%", md: "max-content" }}
                w='100%'
                mx={{ base: "auto", lg: "0px" }}
                me='auto'
                h='100%'
                alignItems='start'
                justifyContent='center'
                mb={{ base: "30px", md: "60px" }}
                px={{ base: "25px", md: "0px" }}
                mt={{ base: "40px", md: "14vh" }}
                flexDirection='column'>
                <Box me='auto'>
                    <Heading color={textColor} fontSize='36px' mb='10px'>
                        {t('signIn')}
                    </Heading>
                    <Text
                        mb='10px'
                        ms='4px'
                        color={textColorSecondary}
                        fontWeight='400'
                        fontSize='md'>
                        {t('signInDesc')}
                    </Text>
                </Box>
                <Flex
                    zIndex='2'
                    direction='column'
                    w={{ base: "100%", md: "500px" }}
                    maxW='100%'
                    background='transparent'
                    borderRadius='15px'
                    mx={{ base: "auto", lg: "unset" }}
                    me='auto'
                    mb={{ base: "20px", md: "auto" }}
                >
                    <Flex align='center' mb='30px'>
                        <HSeparator />
                       
                        <HSeparator />
                    </Flex>
                    <FormControl>
                        <FormLabel
                            display='flex'
                            ms='4px'
                            fontSize='sm'
                            fontWeight='500'
                            color={textColor}
                            mb='8px'>
                            {t('enterYourPhoneNumber')}<Text color={brandStars}>*</Text>
                        </FormLabel>
                        <InputGroup display={"flex"} alignItems={"center"}>
                            <InputLeftElement mt={1}>
                                <Text
                                fontSize='sm'
                                fontWeight='500'>+998</Text>
                            </InputLeftElement>
                            <Input
                                isRequired={true}
                                variant='auth'
                                fontSize='sm'
                                ms={{ base: "0px", md: "0px" }}
                                type='number'
                                placeholder='-- --- -- --'
                                mb='24px'
                                fontWeight='500'
                                size='lg'
                                value={phonenumber}
                                onKeyDown={checkKeyPress}
                                onChange={e => setPhonenumber(e.target.value)}
                            />

                        </InputGroup>
                       <NavLink onClick={() => {
                        if (sliceNumber(phonenumber))  authLogin()
                        else toast.error(t('checkData'))
                       }} to={sliceNumber(phonenumber) ? '/auth/check-code' : ""}>
                        <Button
                            fontSize='sm'
                            variant='brand'
                            fontWeight='500'
                            w='100%'
                            h='50'
                            mb='24px'
                            type='submit'
                            
                        >{loading ? t('loading') : t('continue')}</Button>
                       </NavLink>
                    </FormControl>
                    <Flex
                        flexDirection='column'
                        justifyContent='center'
                        alignItems='start'
                        maxW='100%'
                        mt='0px'>
                        <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
                        {t("notRegistered")}
                            <NavLink to='/auth/sign-up'>
                                <Text
                                    color={textColorBrand}
                                    as='span'
                                    ms='5px'
                                    fontWeight='500'>
                                   {t("leaveRequestFor")}
                                </Text>
                            </NavLink>
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </DefaultAuth>
    );
}

export default SignIn;
