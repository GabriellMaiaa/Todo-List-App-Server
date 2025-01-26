import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list/task";

const List = () => {
  const [tasks, setTasks] = useState<{ id: string; name: string }[]>([]); // Define tasks corretamente
  const [newTask, setNewTask] = useState("");
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token;
  const userId = userData?.id;

  useEffect(() => {
    if (!token) {
      message.error("User not authenticated!");
      navigate("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks); // Supondo que o backend retorna um array [{ id, name }]
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        message.error("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, [userId, token, navigate]);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      message.error("Please enter a task!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { task: newTask.trim(), userId }, // ✅ Correção: Enviar `task`, não `name`
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        setTasks([...tasks, response.data.task]); // Certifique-se que `task` contém { id, task }
        setNewTask("");
        message.success("Task added successfully!");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      message.error("Failed to add task.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(tasks.filter((task) => task.id !== taskId));
      message.success("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete task.");
    }
  };

  const handleEditTask = async (taskId: string, oldTaskName: string) => {
    const newTaskName = prompt("Edit task", oldTaskName);
    if (!newTaskName || newTaskName.trim() === "") return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/update/${taskId}`,
        { name: newTaskName.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setTasks(
          tasks.map((task) =>
            task.id === taskId ? { ...task, name: newTaskName } : task
          )
        );
        message.success("Task updated!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      message.error("Failed to update task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  return (
    <div className="list-container">
      <div className="user-info">
        <div className="user-name">{userData?.name}</div>
        <div className="user-job-title">{userData?.jobTitle}</div>
      </div>

      <Space style={{ marginBottom: 16 }}>
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task"
          style={{ width: 300 }}
        />
        <Button type="primary" onClick={handleAddTask}>
          Add Task
        </Button>
      </Space>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Card
              key={task.id}
              style={{ marginBottom: 16 }}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => handleEditTask(task.id, task.name)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteTask(task.id)}
                />,
              ]}
            >
              <Card.Meta title={task.name} />
            </Card>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>

      <Button type="link" onClick={handleLogout} style={{ marginTop: 16 }}>
        Logout
      </Button>
    </div>
  );
};

export default List;
