import { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  "https://todo-list-app-server-znwp.onrender.com/list/login"; // Atualize o endpoint correto para login

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate(); // Navegação para a próxima página após login

  const handleLogin = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Enviar dados para o backend
      const response = await axios.post(API_BASE_URL, values);

      if (response.status === 200) {
        // Armazenar os dados do usuário no localStorage após o login
        localStorage.setItem("userData", JSON.stringify(response.data)); // Supondo que o backend retorne os dados do usuário

        message.success("Login successful!");

        // Redirecionar para a página de tarefas (List)
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
    <div className="login-container">
      <h2>Login</h2>
      <Form
        form={form}
        layout="vertical"
        name="login_form"
        onFinish={handleLogin}
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Login
          </Button>
        </Form.Item>
      </Form>

      <div className="register-link">
        <p>Don't have an account?</p>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Login;
