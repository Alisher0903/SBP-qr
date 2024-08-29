import {
    Avatar,
    Button,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue,
    useColorMode,
    Modal,
    ModalOverlay,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    ModalBody,
    ModalCloseButton,
    Grid,
    ModalHeader,
    InputRightElement,
    InputGroup,
    IconButton,
    ModalContent,
    useDisclosure,
} from "@chakra-ui/react";
import {SidebarResponsive} from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import React, {useEffect, useState} from "react";
import {IoMdMoon, IoMdSunny} from "react-icons/io";
import {FaBell, FaEye, FaEyeSlash, FaUserEdit} from "react-icons/fa";
import routes from "routes";
import {Link, useNavigate} from "react-router-dom";
import {NotificationStore} from "contexts/state-management/notification/notificationStore";
import {AppStore} from "contexts/state-management";
import {globalGetFunction} from "contexts/logic-function/globalFunktion";
import {terminal_notification_count} from "contexts/api";
import {seller_notification_count} from "contexts/api";
import {admin_notification_count} from "contexts/api";
import {user_edit} from "contexts/api";
import {globalPutFunction} from "contexts/logic-function/globalFunktion";
import {userGetMe} from "contexts/logic-function/globalFunktion";

export default function HeaderLinks(props) {
    const {countData, setCountData} = NotificationStore();
    const {getMeeData, setGetMeeData} = AppStore();
    const {secondary} = props;
    const {isOpen, onOpen, onClose} = useDisclosure();
    const navigate = useNavigate();
    const {colorMode, toggleColorMode} = useColorMode();
    const inputTextColor = useColorModeValue('gray.800', 'white');
    const navbarIcon = useColorModeValue("gray.400", "white");
    const menuIcon = useColorModeValue("#1B255A", "white");
    let menuBg = useColorModeValue("white", "navy.800");
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("#E6ECFA", "rgba(135, 140, 189, 0.3)");
    const shadow = useColorModeValue(
        "14px 17px 40px 4px rgba(112, 144, 176, 0.18)",
        "14px 17px 40px 4px rgba(112, 144, 176, 0.06)"
    );

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const role = localStorage.getItem("ROLE");

    const initialValue = {
        firstName: "",
        lastName: "",
        filial_code: "",
        email: "",
        inn: "",
        phone: "",
        password: ""
    }

    // State to manage form values and validation
    const [showPassword, setShowPassword] = useState(false);
    const [formValues, setFormValues] = useState(initialValue);
    const [editLoading, setEditLoading] = useState(false);
    const [response, setResponse] = useState('');

    const [formErrors, setFormErrors] = useState(initialValue);

    const resetValue = () => {
        setFormValues(initialValue);
        setFormErrors(initialValue);
    };

    useEffect(() => {
        globalGetFunction({
            url: role === "ROLE_TERMINAL" ? terminal_notification_count : role === "ROLE_SELLER" ? seller_notification_count : role === "ROLE_SUPER_ADMIN" ? admin_notification_count : "",
            setData: setCountData
        })
    }, [])

    useEffect(() => {
        if (response) {
            const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000
            localStorage.setItem('tokenExpiry', expiryTime.toString())
            localStorage.setItem('token', response)
            setResponse('')
            onClose()
        }
    }, [response])

    const routePush = (id) => document.getElementById(id).click();

    const handleChange = (e, index) => {
        const {name, value} = e.target;
        // Handle changes for other inputs
        setFormValues({...formValues, [name]: value});

        // Simple validation example
        const errors = {};
        if (name === "phone" && (!/^\+?\d*$/.test(value) || value.length !== 13)) {
            errors.phone = "Phone number must be exactly 13 characters long and only contain numbers.";
        } else if (name === "firstName") {
            if (value.trim() === '') {
                errors[name] = `${name} is required`;
            }
        } else if (name === "lastName") {
            if (value.trim() === '') {
                errors[name] = `${name} is required`;
            }
        } else if (name === "email") {
            if (value.trim() === '') {
                errors[name] = `${name} is required`;
            }
        } else if (role !== "SUPER_ADMIN" || role === "SELLER" || role === "TERMINAL") {
            if (value.trim() === '' && name !== "email") {
                errors[name] = `${name} is required`;
            }
        }
        setFormErrors({...formErrors, ...errors});
    };

    const handleSave = () => {
        const errors = {};

        Object.keys(formValues).filter((item) => item !== "phones"
        ).forEach(key => {
            if (key === "phone" && (!/^\+?\d*$/.test(formValues[key]) || formValues[key].length !== 13)) {
                errors.phone = "Phone number must be exactly 13 characters long and only contain numbers.";
            } else if (key === "firstName") {
                if (formValues[key].trim() === '') {
                    errors[key] = `${key} is required`;
                }
            } else if (key === "lastName") {
                if (formValues[key].trim() === '') {
                    errors[key] = `${key} is required`;
                }
            } else if (key === "email") {
                if (formValues[key].trim() === '') {
                    errors[key] = `${key} is required`;
                }
            } else if (role !== "ROLE_SUPER_ADMIN" || role === "ROLE_SELLER" || role === "ROLE_TERMINAL") {
                if (formValues[key].trim() === '' && key !== "email") {
                    errors[key] = `${key} is required`;
                }
            }
        });

        if (Object.keys(errors).length === 0) {
            globalPutFunction({
                url: `${user_edit}`,
                putData: {
                    firstName: formValues.firstName,
                    lastName: formValues.lastName,
                    email: formValues.email,
                    phone: formValues.phone,
                    filial_code: formValues.filial_code ? formValues.filial_code : null,
                    inn: formValues.inn ? formValues.inn : null,
                    password: formValues.password ? formValues.password : null
                },
                setLoading: setEditLoading,
                getFunction: userGetMe({setData: setGetMeeData}),
                setResponse
            })
            resetValue();
        } else setFormErrors(errors);
    }

    return (
        <>
            <Link to={"/seller/notification"} id="seller_push"></Link>
            <Link to={"/admin/notification"} id="admin_push"></Link>
            <Link to={"/terminal/notification"} id="terminal_push"></Link>
            <Flex
                w={{sm: "100%", md: "auto"}}
                alignItems="center"
                flexDirection="row"
                bg={menuBg}
                flexWrap={secondary ? {base: "wrap", md: "nowrap"} : "unset"}
                p="10px"
                borderRadius="30px"
                boxShadow={shadow}
            >
                <SidebarResponsive routes={routes}/>
                <Flex
                    w={{sm: "100%", md: "auto"}}
                    alignItems="center"
                    justifyContent={"end"}
                    flexDirection="row"
                    //   bg={menuBg}
                    flexWrap={secondary ? {base: "wrap", md: "nowrap"} : "unset"}
                >
                    <Button
                        position={"relative"}
                        variant="no-hover"
                        bg="transparent"
                        p="0px"
                        ms="10px"
                        minW="unset"
                        minH="unset"
                        h="22px"
                        w="max-content"
                        onClick={() => {
                            if (role === "ROLE_TERMINAL") routePush("terminal_push");
                            else if (role === "ROLE_SELLER") routePush("seller_push");
                            else if (role === "ROLE_SUPER_ADMIN") routePush("admin_push");
                        }}
                    >
                        <div
                            hidden={+countData === 0}
                            style={{
                                backgroundColor: "red",
                                position: "absolute",
                                color: "#fff",
                                fontSize: "10px",
                                padding: "3px",
                                borderRadius: "50%",
                                width: "17px",
                                height: "17px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                top: "-3px",
                            }}
                        >
                            {" "}
                            <span>{+countData > 9 ? "9+" : countData}</span>{" "}
                        </div>
                        <Icon me="15px" h="22px" w="22px" color={navbarIcon} as={FaBell}/>
                    </Button>
                    <Button
                        variant="no-hover"
                        bg="transparent"
                        p="0px"
                        minW="unset"
                        minH="unset"
                        h="22px"
                        w="max-content"
                        onClick={toggleColorMode}
                    >
                        <Icon
                            me="15px"
                            h="22px"
                            w="22px"
                            color={navbarIcon}
                            as={colorMode === "light" ? IoMdMoon : IoMdSunny}
                        />
                    </Button>
                    <Menu>
                        <MenuButton p="0px">
                            <Avatar
                                _hover={{cursor: "pointer"}}
                                color="white"
                                bg="#11047A"
                                size="sm"
                                w="40px"
                                h="40px"
                            />
                        </MenuButton>
                        <MenuList
                            boxShadow={shadow}
                            p="0px"
                            mt="10px"
                            borderRadius="20px"
                            bg={menuBg}
                            border="none"
                            // boxSize={"sm"}
                        >
                            <Flex
                                borderBottom="1px solid"
                                borderColor={borderColor}
                                justifyContent={"space-between"}
                                w="100%"
                                mb="0px"
                                px={"20px"}
                                py={"10px"}
                                gap={"30px"}
                            >
                                <Text
                                    fontSize="sm"
                                    fontWeight="700"
                                    color={textColor}
                                >
                                    👋&nbsp; Hey,{" "}
                                    {getMeeData
                                        ? getMeeData.firstName + " " + getMeeData.lastName
                                        : "User"}
                                </Text>
                                <Button
                                    variant="no-hover"
                                    bg="transparent"
                                    p="0px"
                                    minW="unset"
                                    minH="unset"
                                    h="22px"
                                    w="max-content"
                                    textColor={navbarIcon}
                                    onClick={onOpen}
                                >
                                    <FaUserEdit color={menuIcon} size={20}/>
                                </Button>
                            </Flex>

                            <Flex flexDirection="column" p="10px">
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        First name:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.firstName
                                            ? getMeeData.firstName
                                            : "no data"}
                                    </Text>
                                </MenuItem>
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        Last name:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.lastName
                                            ? getMeeData.lastName
                                            : "no data"}
                                    </Text>
                                </MenuItem>
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        Phone:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.phone
                                            ? getMeeData.phone
                                            : "no data"}
                                    </Text>
                                </MenuItem>
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        Email:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.email
                                            ? getMeeData.email
                                            : "no data"}
                                    </Text>
                                </MenuItem>
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        Inn:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.inn ? getMeeData.inn : "no data"}
                                    </Text>
                                </MenuItem>
                                <MenuItem
                                    bg={menuBg}
                                    // _hover={{bg: 'none'}}
                                    _focus={{bg: "none"}}
                                    borderRadius="8px"
                                    px="14px"
                                    display={"flex"}
                                    gap={"20px"}
                                    justifyContent={"space-between"}
                                >
                                    <Text fontSize="sm" fontWeight={"800"}>
                                        Filial:{" "}
                                    </Text>
                                    <Text fontSize="sm">
                                        {getMeeData && getMeeData.filial_code
                                            ? getMeeData.filial_code
                                            : "no data"}
                                    </Text>
                                </MenuItem>

                                <MenuItem
                                    // _hover={{bg: 'none'}}
                                    bg={menuBg}
                                    _focus={{bg: "none"}}
                                    color="red.400"
                                    borderRadius="8px"
                                    px="14px"
                                    onClick={() => {
                                        sessionStorage.removeItem("pathname");
                                        localStorage.removeItem("ROLE");
                                        localStorage.removeItem("token");
                                        localStorage.removeItem("tokenExpiry");
                                        navigate("/auth/sign-in");
                                    }}
                                >
                                    <Text fontSize="md" fontWeight={"800"}>
                                        Log out
                                    </Text>
                                </MenuItem>
                            </Flex>
                        </MenuList>
                    </Menu>
                </Flex>
            </Flex>
            <Modal
                size={"3xl"}
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={() => {
                    onClose();
                    resetValue();
                }}
            >
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create terminal</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody pb={6}>
                        <Grid templateColumns='repeat(2, 1fr)' gap={6} px={5}>

                            <FormControl mt={4} isInvalid={!!formErrors.firstName}>
                                <FormLabel>First name</FormLabel>
                                <Input
                                    name="firstName"
                                    ref={initialRef}
                                    placeholder="Enter the terminal name"
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                    color={inputTextColor}
                                />
                                {formErrors.firstName &&
                                    <Text color="red.500" fontSize="sm">{formErrors.firstName}</Text>}
                            </FormControl>
                            <FormControl mt={4} isInvalid={!!formErrors.lastName}>
                                <FormLabel>Last name</FormLabel>
                                <Input
                                    name="lastName"
                                    placeholder="Enter the terminal lastName"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                    color={inputTextColor}
                                />
                                {formErrors.lastName &&
                                    <Text color="red.500" fontSize="sm">{formErrors.lastName}</Text>}
                            </FormControl>
                            <FormControl mt={4} isInvalid={!!formErrors.email}>
                                <FormLabel>Email</FormLabel>
                                <Input
                                    name="email"
                                    placeholder="Enter the terminal filial code"
                                    value={formValues.email}
                                    onChange={handleChange}
                                    color={inputTextColor}
                                />
                                {formErrors.email && <Text color="red.500" fontSize="sm">{formErrors.email}</Text>}
                            </FormControl>
                            <FormControl mt={4} isInvalid={!!formErrors.phone}>
                                <FormLabel>Phone number</FormLabel>
                                <Input
                                    name="phone"
                                    placeholder="Enter the terminal phone number"
                                    value={formValues.phone}
                                    onChange={handleChange}
                                    color={inputTextColor}
                                />
                                {formErrors.phone && <Text color="red.500" fontSize="sm">{formErrors.phone}</Text>}
                            </FormControl>
                            {role !== "ROLE_SUPER_ADMIN" &&
                                <>
                                    <FormControl mt={4} isInvalid={!!formErrors.inn}>
                                        <FormLabel>Inn</FormLabel>
                                        <Input
                                            name="inn"
                                            placeholder="Enter the terminal inn"
                                            value={formValues.inn}
                                            onChange={handleChange}
                                            color={inputTextColor}
                                        />
                                        {formErrors.inn && <Text color="red.500" fontSize="sm">{formErrors.inn}</Text>}
                                    </FormControl>
                                    <FormControl mt={4} isInvalid={!!formErrors.filial_code}>
                                        <FormLabel>Filial code</FormLabel>
                                        <Input
                                            name="filial_code"
                                            placeholder="Enter the terminal filial_code"
                                            value={formValues.filial_code}
                                            onChange={handleChange}
                                            color={inputTextColor}
                                        />
                                        {formErrors.filial_code &&
                                            <Text color="red.500" fontSize="sm">{formErrors.filial_code}</Text>}
                                    </FormControl>
                                </>
                            }
                            <FormControl mt={4} isInvalid={!!formErrors.password}>
                                <FormLabel>Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter the terminal password"
                                        value={formValues.password}
                                        onChange={handleChange}
                                        color={inputTextColor}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            icon={showPassword ? <FaEyeSlash/> : <FaEye/>}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="sm"
                                            aria-label="Toggle Password Visibility"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {formErrors.password &&
                                    <Text color="red.500" fontSize="sm">{formErrors.password}</Text>}
                            </FormControl>
                        </Grid>
                    </ModalBody>
                    <ModalFooter display={"flex"} gap={"10px"}>
                        <Button
                            colorScheme="red" onClick={() => {
                            onClose();
                            resetValue();
                        }}>Cancel</Button>
                        <Button colorScheme="blue" onClick={handleSave}>
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

HeaderLinks.propTypes = {
    variant: PropTypes.string,
    fixed: PropTypes.bool,
    secondary: PropTypes.bool,
    onOpen: PropTypes.func,
};
