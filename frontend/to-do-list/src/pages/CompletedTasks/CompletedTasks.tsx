import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, message, Modal } from "antd";
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./CompletedTasks.css";

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list/task";

const CompletedTasks: React.FC = () => {
  const [tasks, setTasks] = useState<
    {
      id: string;
      task: string;
      description: string | null;
      completed: boolean;
    }[]
  >([]);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const token = userData?.token;
  const userId = userData?.userId;

  useEffect(() => {
    if (!token) {
      message.error("User not authenticated!");
      navigate("/login");
      return;
    }

    const fetchCompletedTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          const completedTasks = response.data.filter((task) => task.completed);
          setTasks(completedTasks);
        } else {
          console.error("Unexpected response format:", response.data);
          message.error("Invalid task data.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        message.error("Failed to load tasks.");
      }
    };

    fetchCompletedTasks();
  }, [userId, token, navigate]);

  const handleDeleteTask = (taskId: string) => {
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      onOk: async () => {
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
      },
    });
  };

  const handleRestoreTask = async (taskId: string) => {
    try {
      // Fazendo a requisição para restaurar a tarefa
      await axios.patch(
        `${API_BASE_URL}/completed/${taskId}`,
        { completed: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Remover a task restaurada da lista de concluídas
      setTasks(tasks.filter((task) => task.id !== taskId));

      message.success("Task restored!");
    } catch (error) {
      console.error("Error restoring task:", error);
      message.error("Failed to restore task.");
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
        onClick={() => navigate("/list")}
      />
      <div className="completed-tasks-container">
        <h2>Visualize your completed tasks here</h2>

        {tasks.length > 0 && (
          <p>
            Here you can <strong>delete</strong> and <strong>restore</strong>{" "}
            your completed tasks to your list
          </p>
        )}

        <div>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <Card
                key={task.id}
                className="task-card completed"
                actions={[
                  <DeleteOutlined
                    key="delete"
                    onClick={() => handleDeleteTask(task.id)}
                    style={{ marginRight: "8px" }}
                  />,
                  <ReloadOutlined
                    key="restore"
                    onClick={() => handleRestoreTask(task.id)}
                    style={{
                      color: "#007bff",
                      marginRight: "8px",
                    }}
                  />,
                ]}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    style={{ marginRight: 10 }}
                  />
                  <span
                    style={{
                      textDecoration: "line-through",
                      fontSize: "1.1rem",
                    }}
                  >
                    {task.task}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#888",
                    marginLeft: "28px",
                  }}
                >
                  {task.description || "No description"}
                </span>
              </Card>
            ))
          ) : (
            <p>No completed tasks found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;
