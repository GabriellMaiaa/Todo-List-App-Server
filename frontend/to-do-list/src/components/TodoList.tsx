import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, List, Typography, message } from "antd";
import RegisterModal from "./RegisterModal";

const { Title } = Typography;

interface Task {
  id: string;
  task: string;
  description: string;
}

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list";

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ task: "", description: "" });
  const [isRegisterOpen, setIsRegisterOpen] = useState(false); // Controla o modal de registro

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/user`) // Endpoint para obter o usuário autenticado
      .then((response) => {
        if (response.data?.id) {
          setUserId(response.data.id);
          fetchTasks(response.data.id);
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const fetchTasks = (id: string) => {
    axios
      .get(`${API_BASE_URL}/task/user/${id}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  };

  const handleCreateTask = async () => {
    if (!newTask.task || !newTask.description || !userId) {
      console.error("Missing task details or user ID.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/task/create`, {
        task: newTask.task,
        description: newTask.description,
        userId: userId,
      });

      if (response.status === 201) {
        setIsModalOpen(false);
        setNewTask({ task: "", description: "" });
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleRegister = () => {
    setIsRegisterOpen(true); // Abre o modal de registro
  };

  return (
    <div>
      <Title level={2}>Todo List</Title>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create Task
      </Button>
      <Button
        type="default"
        onClick={handleRegister}
        style={{ marginLeft: 10 }}
      >
        Register User
      </Button>

      {/* Modal de Criação de Tarefa */}
      <Modal
        title="Create Task"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateTask}
      >
        <Input
          placeholder="Task Title"
          value={newTask.task}
          onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
        />
        <Input
          placeholder="Task Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          style={{ marginTop: 10 }}
        />
      </Modal>

      {/* Modal de Registro de Usuário */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />

      <List
        itemLayout="horizontal"
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item>
            <List.Item.Meta title={task.task} description={task.description} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default TodoList;
