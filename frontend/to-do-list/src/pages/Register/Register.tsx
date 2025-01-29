import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const response = await axios.post(`${API_BASE_URL}/register`, values);

      if (response.status === 201) {
        message.success("User successfully registered!");
        form.resetFields();
      }
    } catch (error) {
      console.error("Registration error:", error);
      message.error("Failed to register user.");
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
        onClick={() => navigate("/")}
      />
      <div
        className="register-container"
        style={{
          maxWidth: "400px",
          margin: "auto",
          padding: "30px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title level={2} style={{ textAlign: "center" }}>
          Register
        </Title>
        <Form
          form={form}
          layout="vertical"
          name="register_form"
          onFinish={handleRegister}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please input your name!" },
              { min: 4, message: "Name must be at least 4 characters!" },
              { max: 64, message: "Name must be at most 64 characters!" },
            ]}
          >
            <Input
              style={{ width: "100%", fontSize: "1rem", height: "3rem" }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 8,
                message: "Password must be at least 8 characters long!",
              },
              {
                pattern: /^(?=.*[a-zA-Z])(?=.*\d)/,
                message: "Password must contain both letters and numbers!",
              },
            ]}
          >
            <Input.Password
              style={{ width: "20rem", fontSize: "1rem", height: "3rem" }}
            />
          </Form.Item>

          <Form.Item label="Job Title" name="jobTitle" rules={[]}>
            <Input
              style={{ width: "100%", fontSize: "1rem", height: "3rem" }}
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
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="login-link" style={{ textAlign: "center" }}>
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
