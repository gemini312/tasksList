import React, { useEffect, useState } from 'react'
import { Route, useParams } from 'react-router-dom'
import axios from 'axios'
import CategoryList from './categoryList'
import CategoryView from './categoryView'
import './main.scss'

const Home = () => {
  const [categories, setCategories] = useState([])
  const { category, sort } = useParams()
  const [taskList, setTaskList] = useState([])
  const [newCategory, setNewCategory] = useState('')
  const [alert, setAlert] = useState('')

  const addCategory = (categoryName) => {
    axios.post(`/api/v1/tasks/${categoryName}`)
    setNewCategory(categoryName)
    console.log('addCategory')
  }
  const updateStatus = (status, id) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { status })
    const updateTasks = taskList.map((el) => (el.taskId === id ? { ...el, status } : el))
    setTaskList(updateTasks)
    console.log('updateStatus')
  }

  const taskNameUpdate = (title, status, id) => {
    axios.patch(`/api/v1/tasks/${category}/${id}`, { title, status })
    const updateTasksName = taskList.map((el) => (el.taskId === id ? { ...el, title, status } : el))
    setTaskList(updateTasksName)
    console.log('taskNameUpdate')
  }
  const deleteCategory = (name) => {
    axios.delete(`/api/v1/tasks/${name}`)
    const updatedCategoryList = categories.map((el) => el)
    setNewCategory(updatedCategoryList)
    console.log('deleteCategory')
  }
  const taskDelete = (id) => {
    axios.delete(`/api/v1/tasks/${category}/${id}`)
    const deleteTask = taskList.filter((el) => el.taskId !== id)
    setTaskList(deleteTask)
    console.log('taskDelete')
  }
  const alertMessage = (message) => {
    setAlert(message)
    setTimeout(() => {
      setAlert('')
    }, 3000)
    console.log('alertMessage')
  }
  const addTasks = (tasksName) => {
    if (tasksName) {
      axios.post(`/api/v1/tasks/${category}`, { title: tasksName })
      setTaskList([...taskList, { title: tasksName }])
    } else {
      alertMessage('Enter Task name!')
    }
    console.log('addTasks')
  }

  useEffect(() => {
    axios('/api/v1/tasks/').then(({ data }) => setCategories(data))
    console.log('1')
  }, [newCategory])

  useEffect(() => {
    if (typeof category !== 'undefined') {
      axios(`/api/v1/tasks/${category}`).then(({ data }) => setTaskList(data))
    }
    console.log('2')
  }, [category])

  useEffect(() => {
    if (typeof sort !== 'undefined') {
      axios(`/api/v1/tasks/${category}/${sort}`).then(({ data }) => setTaskList(data))
    }
    console.log('3')
  }, [sort, category])
  return (
    <div>
      <div className="containerBg flex items-center justify-center h-screen">
        <div className="boox text-black border shadow-lg p-5">
          <Route
            exact
            path="/"
            component={() => (
              <CategoryList
                categories={categories}
                addCategory={addCategory}
                deleteCategory={deleteCategory}
              />
            )}
          />
          <Route
            exact
            path="/:category"
            component={() => (
              <CategoryView
                category={category}
                taskList={taskList}
                addTasks={addTasks}
                updateStatus={updateStatus}
                taskNameUpdate={taskNameUpdate}
                taskDelete={taskDelete}
                alert={alert}
                deleteCategory={deleteCategory}
              />
            )}
          />
          <Route
            exact
            path="/:category/:sort"
            component={() => (
              <CategoryView
                category={category}
                taskList={taskList}
                addTasks={addTasks}
                updateStatus={updateStatus}
                taskNameUpdate={taskNameUpdate}
                taskDelete={taskDelete}
                alert={alert}
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}

export default Home
