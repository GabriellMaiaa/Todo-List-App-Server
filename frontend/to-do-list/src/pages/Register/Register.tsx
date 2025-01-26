import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Enviar dados para o backend
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
    <div className="register-container">
      <Title level={2}>Register</Title>
      <Form
        form={form}
        layout="vertical"
        name="register_form"
        onFinish={handleRegister}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Job Title"
          name="jobTitle"
          rules={[{ required: true, message: "Please input your job title!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Register
          </Button>
        </Form.Item>
      </Form>

      <div className="login-link">
        <p>Already have an account?</p>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Register;
