import React from "react";
import axios from "axios";
import API from "../api";
import { Box, Button } from "@chakra-ui/react";

function TestSession() {
  const login = async () => {
    try {
      const res = await API.post(
        `/api/test-login`,
        {},
        { withCredentials: true }
      );
      console.log("Login response:", res.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const verify = async () => {
    try {
      const res = await API.get(`/api/test-verify`, {
        withCredentials: true,
      });
      console.log("Verify response:", res.data);
    } catch (error) {
      console.error("Verify error:", error);
    }
  };

  return (
    <Box m={10}>
      <Button colorScheme="green" width="full" onClick={login}>
        Test Login
      </Button>
      <Button colorScheme="blue" width="full" onClick={verify}>
        Test Verify
      </Button>
    </Box>
  );
}

export default TestSession;
