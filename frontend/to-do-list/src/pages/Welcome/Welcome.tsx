import { Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./Welcome.css"; // Importando o CSS

const { Title } = Typography;

const Welcome = () => {
  const navigate = useNavigate();

  // Função para redirecionar ao componente de Register
  const handleGetStarted = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <Title className="title">Welcome to AllYouHaveToDo</Title>
      <Button type="primary" className="button" onClick={handleGetStarted}>
        Get Started
      </Button>
    </div>
  );
};

export default Welcome;
