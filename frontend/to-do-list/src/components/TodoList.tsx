// src/components/TodoList.tsx
import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Input, List, Typography } from "antd";

const { Title } = Typography;

interface Task {
  id: string;
  task: string;
  description: string;
}

const TodoList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ task: "", description: "" });

  useEffect(() => {
    // Fetch tasks from the backend
    axios
      .get(
        "http://localhost:3000/task/user/02887485-a4c8-43c9-b069-9670e8b869c2"
      )
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleCreateTask = async () => {
    try {
      // Verificar se os campos não estão vazios
      if (!newTask.task || !newTask.description) {
        console.error("Task or description is missing.");
        return;
      }

      // Enviar a nova tarefa para o backend
      const response = await axios.post("http://localhost:3000/task", {
        task: newTask.task,
        description: newTask.description,
        userId: "02887485-a4c8-43c9-b069-9670e8b869c2",
      });

      // Verifica se a resposta do backend foi bem-sucedida
      if (response.status === 201) {
        setIsModalOpen(false);
        setNewTask({ task: "", description: "" });
        // Refaz a requisição para buscar todas as tasks
        const tasksResponse = await axios.get(
          "http://localhost:3000/task/user/02887485-a4c8-43c9-b069-9670e8b869c2"
        );
        setTasks(tasksResponse.data);
      }
    } catch (error) {
      console.error("Error creating task:", error);
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
        visible={isModalOpen}
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
