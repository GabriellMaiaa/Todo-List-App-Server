import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import {
  GithubOutlined,
  LinkedinOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import "./Welcome.css";

const { Title } = Typography;

const Welcome = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <Title className="title">Welcome to AllYouHaveToDo</Title>
      <p style={{ marginTop: "-10px", marginBottom: "24px" }}>
        Here is where you can <strong>create</strong> your tasks and{" "}
        <strong>organize yourself</strong> for your days
      </p>
      <Button type="primary" className="button" onClick={handleGetStarted}>
        Get Started
      </Button>

      <div className="icon-container">
        <a
          href="https://github.com/GabriellMaiaa/Todo-List-App-Server"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          title="GitHub Repository"
        >
          <GithubOutlined className="icon" />
        </a>

        <a
          href="https://www.linkedin.com/in/gabriel-maia-dev"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          title="LinkedIn"
        >
          <LinkedinOutlined className="icon" />
        </a>
        <a
          href="/Gabriel_Maia_Fullstack.pdf"
          download="Gabriel_Maia_Fullstack.pdf"
          className="icon-link"
          title="Download CV"
        >
          <DownloadOutlined className="icon" />
        </a>
      </div>
    </div>
  );
};

export default Welcome;
