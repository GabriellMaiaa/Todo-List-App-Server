import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, message, Modal, Dropdown, Menu } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  LogoutOutlined,
  SearchOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./List.css";

const API_BASE_URL = "https://todo-list-app-server-znwp.onrender.com/list/task";

const List = () => {
  const [tasks, setTasks] = useState<
    {
      id: string;
      task: string;
      description: string | null;
      completed: boolean;
    }[]
  >([]);
  const [newTask, setNewTask] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [editTaskId, setEditTaskId] = useState<string | null>(null);
  const [editTaskName, setEditTaskName] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
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

    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(response.data)) {
          const nonCompletedTasks = response.data.filter(
            (task) => !task.completed
          );
          setTasks(nonCompletedTasks);
          setFilteredTasks(nonCompletedTasks);
        } else {
          console.error("Unexpected response format:", response.data);
          message.error("Invalid task data.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        message.error("Failed to load tasks.");
      }
    };

    fetchTasks();
  }, [userId, token, navigate]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredTasks(tasks);
    } else {
      setFilteredTasks(
        tasks.filter((task) =>
          task.task.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, tasks]);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      message.error("Please enter a task!");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        { task: newTask.trim(), description: newDescription.trim(), userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201 && response.data) {
        const newTaskItem = response.data;
        setTasks([...tasks, newTaskItem]);
        setFilteredTasks([...tasks, newTaskItem]);
        setNewTask("");
        setNewDescription("");
        setIsModalOpen(false);
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
      setFilteredTasks(filteredTasks.filter((task) => task.id !== taskId));
      message.success("Task deleted!");
    } catch (error) {
      console.error("Error deleting task:", error);
      message.error("Failed to delete task.");
    }
  };

  const handleEditTask = (
    taskId: string,
    oldTaskName: string,
    oldDescription: string
  ) => {
    setEditTaskId(taskId);
    setEditTaskName(oldTaskName);
    setEditDescription(oldDescription);
    setIsEditModalOpen(true);
  };

  const handleSaveEditTask = async () => {
    if (!editTaskName.trim()) return;

    try {
      const response = await axios.put(
        `${API_BASE_URL}/edit/${editTaskId}`,
        { task: editTaskName.trim(), description: editDescription.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId
              ? { ...task, task: editTaskName, description: editDescription }
              : task
          )
        );
        setFilteredTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editTaskId
              ? { ...task, task: editTaskName, description: editDescription }
              : task
          )
        );
        setIsEditModalOpen(false);
        setEditTaskId(null);
        setEditTaskName("");
        setEditDescription("");
        message.success("Task updated!");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      message.error("Failed to update task.");
    }
  };

  const handleToggleCompletion = async (taskId: string) => {
    try {
      const taskToUpdate = tasks.find((task) => task.id === taskId);

      if (!taskToUpdate) {
        console.error("Task not found!");
        return;
      }

      const updatedCompleted = !taskToUpdate.completed;

      setTasks((prevTasks) =>
        prevTasks
          .map((task) =>
            task.id === taskId ? { ...task, completed: updatedCompleted } : task
          )
          .filter((task) => !updatedCompleted || task.id !== taskId)
      );

      await axios.patch(
        `${API_BASE_URL}/completed/${taskId}`,
        { completed: updatedCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(updatedCompleted ? "Task completed!" : "Task restored!");
    } catch (error) {
      console.error("Error toggling task completion:", error);
      message.error("Failed to toggle task completion.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="container">
      <div className="header">
        <div className="logout-container">
          <div
            className="logout-container"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <div>
              <Button
                type="link"
                style={{
                  marginLeft: 32,
                  position: "absolute",
                  top: "60px",
                  left: 0,
                  fontSize: "1.2rem",
                }}
                icon={<SearchOutlined />}
                onClick={() => setIsSearchModalOpen(true)}
              >
                Search
              </Button>

              <Button
                type="link"
                style={{
                  marginLeft: 32,
                  position: "absolute",
                  top: "130px",
                  left: 0,
                  fontSize: "1.2rem",
                }}
                onClick={() => navigate("/completed")}
              >
                <FileTextOutlined />
                Completed Tasks page
              </Button>

              <Dropdown overlay={menu} placement="bottomRight">
                <Button
                  type="link"
                  style={{
                    marginLeft: 32,
                    position: "absolute",
                    top: "200px",
                    left: 0,
                    fontSize: "1.2rem",
                  }}
                  icon={<LogoutOutlined />}
                >
                  Logout
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <h2>Create your tasks here</h2>
        <p style={{ marginTop: "-12px" }}>
          Your tasks will appear below and when completed will go to a completed
          page
        </p>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          + Add Task
        </Button>
      </div>

      <Modal
        title="Search Task"
        open={isSearchModalOpen}
        onCancel={() => setIsSearchModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsSearchModalOpen(false)}>
            Cancel
          </Button>,
        ]}
      >
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search task"
          allowClear
        />
      </Modal>

      <Modal
        title="Create New Task"
        open={isModalOpen}
        onOk={handleAddTask}
        onCancel={() => setIsModalOpen(false)}
      >
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Task Name"
          style={{ marginBottom: 8 }}
        />
        <Input
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Task Description"
        />
      </Modal>

      <Modal
        title="Edit Task"
        open={isEditModalOpen}
        onOk={handleSaveEditTask}
        onCancel={() => setIsEditModalOpen(false)}
      >
        <Input
          value={editTaskName}
          onChange={(e) => setEditTaskName(e.target.value)}
          placeholder="Task Name"
          style={{ marginBottom: 8 }}
        />
        <Input
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          placeholder="Task Description"
        />
      </Modal>

      <div
        style={{
          maxHeight: "520px",
          overflowY: "auto",
          marginTop: "8rem",
          paddingRight: "10px",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
        }}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              className={`task-card ${task.completed ? "completed" : ""}`}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() =>
                    handleEditTask(task.id, task.task, task.description || "")
                  }
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteTask(task.id)}
                />,
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleCompletion(task.id)}
                  style={{ marginRight: 10 }}
                />
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
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
          <p>No tasks found</p>
        )}
      </div>
    </div>
  );
};

export default List;
