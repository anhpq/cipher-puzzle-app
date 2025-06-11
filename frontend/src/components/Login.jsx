// ==================== src/components/Login.jsx ====================
import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Heading,
  useToast,
  VStack,
  Text,
  Container,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Flex,
  Divider
} from "@chakra-ui/react";
import { FaUser, FaLock, FaRocket, FaGamepad } from "react-icons/fa";
import { useNavigate, Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { keyframes } from "@emotion/react";

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { auth, login } = useAuth();

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, cyan.50, teal.50)",
    "linear(to-br, gray.900, gray.800)"
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.200");
  const inputBg = useColorModeValue("gray.50", "gray.700");

  // Redirect if already authenticated
  if (!auth.loading && auth.isAuthenticated) {
    if (auth.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/team" replace />;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(username, password);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top"
      });
      
      // Navigate based on role
      if (result.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/team", { replace: true });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Đăng nhập thất bại";
      
      toast({
        title: "Login failed",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (auth.loading) {
    return (
      <Box
        minH="100vh"
        bgGradient={bgGradient}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Box
            animation={`${pulse} 2s infinite`}
            fontSize="4xl"
            color="white"
          >
            <FaGamepad />
          </Box>
          <Text color="white" fontSize="lg">
            Loading...
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={{ base: 4, md: 8 }}
      px={{ base: 4, md: 6 }}
    >
      <Container maxW="sm" centerContent>
        <Box
          w="full"
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 6, md: 8 }}
          boxShadow="2xl"
          backdropFilter="blur(10px)"
          border="1px solid"
          borderColor={useColorModeValue("white", "whiteAlpha.200")}
          animation={`${fadeIn} 0.6s ease-out`}
          position="relative"
          overflow="hidden"
        >
          {/* Decorative elements */}
          <Box
            position="absolute"
            top="-50px"
            right="-50px"
            w="100px"
            h="100px"
            borderRadius="full"
            bg="cyan.100"
            opacity="0.4"
            animation={`${float} 3s ease-in-out infinite`}
          />
          <Box
            position="absolute"
            bottom="-30px"
            left="-30px"
            w="60px"
            h="60px"
            borderRadius="full"
            bg="teal.100"
            opacity="0.4"
            animation={`${float} 4s ease-in-out infinite reverse`}
          />

          <VStack spacing={6} position="relative" zIndex={1}>
            {/* Logo and Title */}
            <VStack spacing={3}>
              <Box
                p={4}
                borderRadius="full"
                bg="cyan.500"
                color="white"
                fontSize="2xl"
                animation={`${float} 2s ease-in-out infinite`}
                boxShadow="0 4px 20px rgba(6, 182, 212, 0.3)"
              >
                <FaRocket />
              </Box>
              <Heading
                size="lg"
                textAlign="center"
                color="gray.700"
                fontWeight="bold"
              >
                Welcome to the Game
              </Heading>
              <Text fontSize="sm" color={textColor} textAlign="center">
                Sign in to start your adventure
              </Text>
            </VStack>

            <Divider />

            {/* Login Form */}
            <Box as="form" onSubmit={handleSubmit} w="full">
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    Team Name
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaUser color="gray" />
                    </InputLeftElement>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your team name"
                      disabled={isLoading}
                      autoComplete="username"
                      size="lg"
                      bg={inputBg}
                      border="none"
                      borderRadius="xl"
                      _focus={{
                        boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.3)",
                        bg: "white"
                      }}
                      _placeholder={{ color: "gray.400" }}
                    />
                  </InputGroup>
                </FormControl>
                
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="medium" color={textColor}>
                    Password
                  </FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <FaLock color="gray" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      autoComplete="current-password"
                      size="lg"
                      bg={inputBg}
                      border="none"
                      borderRadius="xl"
                      _focus={{
                        boxShadow: "0 0 0 3px rgba(6, 182, 212, 0.3)",
                        bg: "white"
                      }}
                      _placeholder={{ color: "gray.400" }}
                    />
                  </InputGroup>
                </FormControl>
                
                {auth.error && (
                  <Alert
                    status="error"
                    borderRadius="xl"
                    fontSize="sm"
                    animation={`${fadeIn} 0.3s ease-out`}
                  >
                    <AlertIcon />
                    {auth.error}
                  </Alert>
                )}
                
                <Button
                  type="submit"
                  size="lg"
                  width="full"
                  isDisabled={!username || !password || isLoading}
                  isLoading={isLoading}
                  loadingText="Signing in..."
                  bg="cyan.500"
                  color="white"
                  borderRadius="xl"
                  _hover={{
                    bg: "cyan.600",
                    transform: "translateY(-2px)",
                    boxShadow: "0 8px 25px rgba(6, 182, 212, 0.4)"
                  }}
                  _active={{
                    transform: "translateY(0)"
                  }}
                  transition="all 0.2s"
                  fontWeight="semibold"
                  py={6}
                  boxShadow="0 4px 15px rgba(6, 182, 212, 0.2)"
                >
                  Sign In
                </Button>
              </VStack>
            </Box>
            
            {/* Helper Text */}
            <VStack spacing={2}>
              <Text fontSize="xs" color={textColor} textAlign="center">
                Use your team name as both username and password
              </Text>
              <Flex align="center" justify="center" gap={2}>
                <Box w={2} h={2} borderRadius="full" bg="teal.400" />
                <Text fontSize="xs" color="teal.500" fontWeight="medium">
                  Ready to start the challenge
                </Text>
              </Flex>
            </VStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;