import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const API_BASE_URL =
  "https://todo-list-app-server-znwp.onrender.com/list/login";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      setLoading(true);
      const values = await form.validateFields();

      if (!values.name || !values.password) {
        setError("Please fill in both fields: Name and Password.");
        return;
      }

      const response = await axios.post(API_BASE_URL, values);

      if (response.status === 200) {
        localStorage.setItem("userData", JSON.stringify(response.data));

        message.success("Login successful!");
        navigate("/list");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ArrowLeftOutlined
        style={{
          position: "absolute",
          top: 50,
          left: 50,
          fontSize: "42px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/register")}
      />
      <div
        className="login-container"
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          Login
        </Title>

        {error && (
          <Card
            title="Error"
            style={{
              marginBottom: "20px",
              borderRadius: "8px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
            }}
          >
            <p>{error}</p>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          name="login_form"
          onFinish={handleLogin}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input you name, this is required to login",
              },
            ]}
          >
            <Input
              style={{ width: "20rem", fontSize: "1rem", height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message:
                  "Please input your password, this is required to login",
              },
            ]}
          >
            <Input.Password
              style={{ width: "20rem", fontSize: "1rem", height: "3rem" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{
                width: "100%",
                fontSize: "1.2rem",
                height: "3rem",
                borderRadius: "5px",
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>

        <div className="register-link" style={{ textAlign: "center" }}>
          <p>Don't have an account?</p>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
