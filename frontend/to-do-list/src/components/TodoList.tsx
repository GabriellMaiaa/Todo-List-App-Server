import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, List, Typography } from "antd";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Primeiro, obtemos o ID do usuário
    axios
      .get(`${API_BASE_URL}/user`)
      .then((response) => {
        if (response.data?.id) {
          setUserId(response.data.id);
          fetchTasks(response.data.id);
        }
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  const fetchTasks = async (id: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/task/user/${id}`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.task || !newTask.description || !userId) {
      console.error("Missing task details or user ID.");
      return;
    }

    setLoading(true);

    try {
      console.log("Enviando requisição para criar tarefa...");

      const response = await axios.post(`${API_BASE_URL}/task/create`, {
        task: newTask.task,
        description: newTask.description,
        userId: userId,
      });

      console.log("Resposta da API:", response);

      if (response.status === 201) {
        console.log("Tarefa criada com sucesso!");
        setIsModalOpen(false);
        setNewTask({ task: "", description: "" });
        fetchTasks(userId);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Todo List</Title>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create Task
      </Button>

      <Modal
        title="Create Task"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleCreateTask}
        confirmLoading={loading} // Desabilita o botão enquanto carrega
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
