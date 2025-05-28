// frontend/src/components/ContentManagement.jsx
import React, { useState } from 'react';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel, Heading } from '@chakra-ui/react';
import StageForm from './StageForm';
import StageList from './StageList';
import QuestionForm from './QuestionForm';
import QuestionList from './QuestionList';

const ContentManagement = () => {
  const [stageRefreshTrigger, setStageRefreshTrigger] = useState(0);
  const [questionRefreshTrigger, setQuestionRefreshTrigger] = useState(0);

  // Functions to refresh the lists after changes.
  const refreshStages = () => setStageRefreshTrigger((prev) => prev + 1);
  const refreshQuestions = () => setQuestionRefreshTrigger((prev) => prev + 1);

  return (
    <Box p={4}>
      <Heading size="md" mb={4}>Content Management</Heading>
      <Tabs variant="enclosed" isFitted>
        <TabList mb="1em">
          <Tab>Stages</Tab>
          <Tab>Questions</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <StageForm refreshStages={refreshStages} />
            <StageList refreshTrigger={stageRefreshTrigger} />
          </TabPanel>
          <TabPanel>
            <QuestionForm refreshQuestions={refreshQuestions} />
            <QuestionList refreshTrigger={questionRefreshTrigger} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContentManagement;
