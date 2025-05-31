// frontend/src/components/TeamDashboardWizard.jsx
import React, { useState, useEffect } from 'react';
import StepWizard from 'react-step-wizard';
import { Box, Spinner } from '@chakra-ui/react';
import StageStep from './StageStep';
import axios from 'axios';

const TeamDashboardWizard = ({ config, teamId }) => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy danh sách stage hiện hành từ backend,
  // không cần truyền teamId trong query vì backend sử dụng session.
  const fetchStages = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/team/current-stages',
        config
      );
      setStages(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  const handleAdvance = () => {
    console.log("Advancing stage for team (from session):", teamId);
    // Bạn có thể tích hợp thêm các API cập nhật trạng thái nếu cần.
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <StepWizard>
        {stages.map((stage, index) => (
          <StageStep
            key={stage.stageId}
            stage={stage}
            teamId={teamId}  // Nếu cần hiển thị hoặc sử dụng teamId trên client, bạn vẫn có thể truyền qua props.
            isStageOne={index === 0}
            recordStartTime={() => {
              console.log("Record start time for team (from session):", teamId);
            }}
            onAdvance={handleAdvance}
            config={config}
            // Sử dụng trường open_code_verified từ API để xác định trạng thái đã xác thực.
            initialVerified={stage.open_code_verified}
          />
        ))}
      </StepWizard>
    </Box>
  );
};

export default TeamDashboardWizard;
