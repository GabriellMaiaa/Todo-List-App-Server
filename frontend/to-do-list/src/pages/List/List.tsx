import { useState } from "react";
import { Card, Input, Button, message, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const List = () => {
  const [tasks, setTasks] = useState<string[]>([]); // Lista de tarefas
  const [newTask, setNewTask] = useState(""); // Nova tarefa a ser adicionada
  const userData = JSON.parse(localStorage.getItem("userData") || "{}"); // Recupera os dados do usuário do localStorage
  const navigate = useNavigate(); // Para redirecionar para a página de login

  // Função para adicionar uma nova tarefa
  const handleAddTask = () => {
    if (newTask.trim() === "") {
      message.error("Please enter a task!");
      return;
    }
    setTasks([...tasks, newTask.trim()]);
    setNewTask(""); // Limpar o campo de input após adicionar a tarefa
  };

  // Função para excluir uma tarefa
  const handleDeleteTask = (taskToDelete: string) => {
    setTasks(tasks.filter((task) => task !== taskToDelete));
  };

  // Função para editar uma tarefa
  const handleEditTask = (oldTask: string) => {
    const newTask = prompt("Edit task", oldTask);
    if (newTask && newTask.trim() !== "") {
      setTasks(tasks.map((task) => (task === oldTask ? newTask.trim() : task)));
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    localStorage.removeItem("userData"); // Limpar os dados do usuário no localStorage
    navigate("/login"); // Redirecionar para a página de login
  };

  return (
    <div className="list-container">
      {/* Header com as informações do usuário */}
      <div className="user-info">
        <div className="user-name">{userData?.name}</div>
        <div className="user-job-title">{userData?.jobTitle}</div>
      </div>

      {/* Input e botão para adicionar tarefa */}
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

      {/* Lista de tarefas */}
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Card
              key={index}
              style={{ marginBottom: 16 }}
              actions={[
                <EditOutlined
                  key="edit"
                  onClick={() => handleEditTask(task)}
                />,
                <DeleteOutlined
                  key="delete"
                  onClick={() => handleDeleteTask(task)}
                />,
              ]}
            >
              <Card.Meta title={task} />
            </Card>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>

      {/* Logout button */}
      <Button type="link" onClick={handleLogout} style={{ marginTop: 16 }}>
        Logout
      </Button>
    </div>
  );
};

export default List;
