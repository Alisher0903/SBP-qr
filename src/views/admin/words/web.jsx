// Chakra imports
import {
    Button,
    Flex,
    Input,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
import { globalPutFunction } from "contexts/logic-function/globalFunktion";
import { words_put } from "contexts/api";

function WebWords(props) {
    const { item = {}, getFunction, ...rest } = props;

    // State to hold input values
    const [inputValues, setInputValues] = useState({
        description: item.description || "",
        key: item.key || "",
        uz: item.uz || "",
        ru: item.ru || "",
    });

    // Chakra Color Mode
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const navbarIcon = useColorModeValue("#1B255A", "white");

    // Handle input change
    const handleInputChange = (field, value) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [field]: value,
        }));
    };

    // Reset inputs to default values from item
    const resetInputs = () => {
        setInputValues({
            description: item.description || "",
            key: item.key || "",
            uz: item.uz || "",
            ru: item.ru || "",
        });
    };

    return (
        <Card border={"2px"} borderColor={"#422AFB"} {...rest} p="14px" mb={10}>
            <Flex
                gap={5}
                align="center"
                justifyContent="center"
                alignItems="center"
                mb={7}
                direction={{ base: "column", md: "row" }}
            >
                <Flex
                    gap={5}
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                >
                    <Text color={brandStars}>Description</Text>
                    <Input
                        isRequired
                        variant="outline"
                        fontSize="sm"
                        placeholder="-- --- -- --"
                        fontWeight="500"
                        size="lg"
                        value={inputValues.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                </Flex>
                <Flex
                    gap={5}
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                >
                    <Text color={brandStars}>Key</Text>
                    <Input
                        isRequired
                        variant="outline"
                        fontSize="sm"
                        placeholder="-- --- -- --"
                        fontWeight="500"
                        size="lg"
                        value={inputValues.key}
                        onChange={(e) => handleInputChange("key", e.target.value)}
                    />
                </Flex>
            </Flex>
            <Flex
                gap={5}
                align="center"
                justifyContent="center"
                alignItems="center"
                direction={{ base: "column", md: "row" }}
            >
                <Flex
                    gap={5}
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                >
                    <Text color={brandStars}>UZ</Text>
                    <Input
                        isRequired
                        variant="outline"
                        fontSize="sm"
                        placeholder="-- --- -- --"
                        fontWeight="500"
                        size="lg"
                        value={inputValues.uz}
                        onChange={(e) => handleInputChange("uz", e.target.value)}
                    />
                </Flex>
                <Flex
                    gap={5}
                    width="100%"
                    justifyContent="center"
                    alignItems="center"
                    direction={{ base: "column", md: "row" }}
                >
                    <Text color={brandStars}>Ru</Text>
                    <Input
                        isRequired
                        variant="outline"
                        fontSize="sm"
                        placeholder="-- --- -- --"
                        fontWeight="500"
                        size="lg"
                        value={inputValues.ru}
                        onChange={(e) => handleInputChange("ru", e.target.value)}
                    />
                </Flex>
                <Flex>
                    <Button
                        onClick={resetInputs}
                        variant="no-hover"
                        bg="transparent"
                    >
                        <BiReset color={navbarIcon} size={23} />
                    </Button>
                    <Button
                        onClick={() => {
                            globalPutFunction({
                                url: words_put,
                                putData: {
                                    id: item.id,
                                    key: inputValues.key,
                                    uz: inputValues.uz,
                                    ru: inputValues.ru,
                                    description: inputValues.description
                                },
                                getFunction: getFunction
                            })
                        }}
                        variant="no-hover"
                        bg="transparent"
                    >
                        <FaEdit color={navbarIcon} size={23} />
                    </Button>
                </Flex>
            </Flex>
        </Card>
    );
}

export default WebWords;
