import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    Spinner,
    Alert,
    AlertIcon,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stages, setStages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Cấu hình để gửi cookie phiên (session cookie)
    const config = { withCredentials: true };

    // Hàm load dữ liệu stages từ backend
    const fetchStages = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/admin/stages', config);
            setStages(response.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error fetching stages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStages();
    }, []);

    // Hàm logout: gọi endpoint logout và điều hướng về trang login
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:5000/api/logout', {}, config);
            // Nếu bạn đang sử dụng một flag trong localStorage cho client-side route protection, hãy xoá nó
            localStorage.removeItem('adminLoggedIn');
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <Box p={4}>
            <Heading mb={4}>Admin Dashboard</Heading>
            <Button colorScheme="red" mb={4} onClick={handleLogout}>
                Logout
            </Button>
            <Tabs variant="enclosed" isFitted>
                <TabList mb="1em">
                    <Tab>Stages</Tab>
                    <Tab>Questions</Tab>
                    <Tab>Team Routes</Tab>
                    <Tab>Assignments</Tab>
                </TabList>
                <TabPanels>
                    {/* Tab Stages */}
                    <TabPanel>
                        {loading ? (
                            <Spinner />
                        ) : error ? (
                            <Alert status="error">
                                <AlertIcon />
                                {error}
                            </Alert>
                        ) : (
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>ID</Th>
                                        <Th>Stage Number</Th>
                                        <Th>Stage Name</Th>
                                        <Th>Description</Th>
                                        <Th>Open Code</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {stages.map((stage) => (
                                        <Tr key={stage.stage_id}>
                                            <Td>{stage.stage_id}</Td>
                                            <Td>{stage.stage_number}</Td>
                                            <Td>{stage.stage_name}</Td>
                                            <Td>{stage.description}</Td>
                                            <Td>{stage.open_code}</Td>
                                            <Td>
                                                <Button size="sm" colorScheme="blue" mr={2}>
                                                    Edit
                                                </Button>
                                                <Button size="sm" colorScheme="red">
                                                    Delete
                                                </Button>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </TabPanel>
                    {/* Tab Questions */}
                    <TabPanel>
                        <Box>Questions management section – to be implemented similarly.</Box>
                    </TabPanel>
                    {/* Tab Team Routes */}
                    <TabPanel>
                        <Box>Team Routes management section – to be developed as needed.</Box>
                    </TabPanel>
                    {/* Tab Assignments */}
                    <TabPanel>
                        <Box>Assignments management section – read-only display.</Box>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    );
};

export default AdminDashboard;
