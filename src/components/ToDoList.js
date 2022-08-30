import { useEffect, useState } from "react";
import {storageAvailable, createTodos, getItem, createUser} from "./localStorageApi";

 
const buttons = ['All', 'Active', 'Completed']
export default function ToDoList() {
    const today = new Date().toLocaleDateString();
    const [username, setUsername] = useState('')
    const [todos, setTodos] = useState([]);
    const [isActive, setIsActive] = useState(buttons[0]);

    useEffect(() => {
        setUsername(getItem('username'));
        if(!JSON.parse(getItem(today))) {
            console.log('error');
        } else {
            setTodos(JSON.parse(getItem(today)))
        }
    }, [today]);

    const addTodoHandler = (e) => {
        e.preventDefault();
        if (storageAvailable('localStorage')) {
            let task = e.currentTarget.task.value;
            let todo = {task, completed: false, id: 0}
            if(!JSON.parse(getItem(today))) {
                createTodos(today, [todo])
                setTodos(JSON.parse(getItem(today)));
            } else {
                let newData = JSON.parse(getItem(today));
                newData.push({task, completed: false, id: newData.length});
                createTodos(today, newData);
                setTodos(newData);
            }
            e.currentTarget.reset();
          }
          else {
            alert('Local storage not available')
          }
    }

    const createUserHandler = (e) => {
        e.preventDefault();
        createUser(e.currentTarget.username.value);
        setUsername(getItem('username'));
    }
    const deleteTodoHandler = (id) => {
        let newData = JSON.parse(getItem(today));
        newData.splice(id, 1);
        newData.map((v, i) => v.id = i)
        createTodos(today, newData);
        setTodos(JSON.parse(getItem(today)));
    }

    const triggerCompleteHanler = (id) => {
        let completedTask = { ...todos[id], completed: !todos[id].completed }
        let newData = JSON.parse(getItem(today));
        newData.splice(id, 1, completedTask);
        createTodos(today, newData);
        setTodos(JSON.parse(getItem(today)));
    }

    return (
        <>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                                <h1 className="title">To Do App</h1>
                        {username ? 
                        <div className="col col-xl-10">
                                <h3 className="greetings">Hello, {username ? username : ''}!</h3>
                            <div className="card">
                                <div className="card-body p-5">
                                    <form className="d-flex justify-content-center align-items-center mb-4" onSubmit={(e) => addTodoHandler(e)}>
                                        <div className="form-outline flex-fill">
                                            <textarea 
                                                name="task"
                                                type="text" 
                                                id="form2" 
                                                required 
                                                className="form-control typing-demo" 
                                                placeholder="What do you need to do today?" 
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-info ms-2">Add</button>
                                    </form>
                                    <ul className="nav nav-tabs mb-4 pb-2" id="ex1" role="tablist">
                                            {buttons.map(x => (
                                                <li className="nav-item" role="presentation">
                                                    <button 
                                                    className={"nav-link" + (isActive === x ? " isActive" : '')} 
                                                    role="tab"
                                                    aria-selected="true"
                                                    onClick={(e) => setIsActive(e.currentTarget.textContent)}
                                                    >{x}</button>
                                                </li>
                                            ))}
                                        
                                    </ul>
                                    <div className="tab-content" id="ex1-content">
                                        <div className="tab-pane fade show d-block" role="tabpanel">
                                            <ul className="list-group mb-0">
                                                {
                                                    todos.length > 0 && isActive === 'All' ? todos.map((todo) => (
                                                        <li className="list-group-item d-flex align-items-center border-0 mb-2 rounded"  key={todo?.id}>
                                                            
                                                            <input className="form-check-input me-3"  type="checkbox" onChange={() => triggerCompleteHanler(todo.id)} checked={todo?.completed} value={todo?.completed} />
                                                            {todo?.completed ? <s>{todo?.task}</s> : todo?.task}
                                                            <button className="btn btn-danger ms-3 p-1.2" onClick={() => deleteTodoHandler(todo.id)}>X</button>
                                                        </li>
                                                    ))
                                                : todos.length > 0 && isActive === 'Active' ? todos.filter(x => x.completed === false).map((todo) =>(
                                                    <li className="list-group-item d-flex align-items-center border-0 mb-2 rounded" key={todo?.id}>

                                                        <input className="form-check-input me-3" type="checkbox" onChange={() => triggerCompleteHanler(todo.id)} checked={todo?.completed} value={todo?.completed} />
                                                        {todo?.completed ? <s>{todo?.task}</s> : todo?.task}
                                                        <button className="btn btn-danger ms-3 p-1.2" onClick={() => deleteTodoHandler(todo.id)}>X</button>
                                                    </li>
                                                )) : todos.length > 0 && isActive === 'Completed' ? todos.filter(x => x.completed === true).map((todo) =>(
                                                    <li className="list-group-item d-flex align-items-center border-0 mb-2 rounded" key={todo?.id}>

                                                        <input className="form-check-input me-3" type="checkbox" onChange={() => triggerCompleteHanler(todo.id)} checked={todo?.completed} value={todo?.completed} />
                                                        {todo?.completed ? <s>{todo?.task}</s> : todo?.task}
                                                        <button className="btn btn-danger ms-3 p-1.2" onClick={() => deleteTodoHandler(todo.id)}>X</button>
                                                    </li>)) : 'No todos yet'}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="col col-xl-10">
                             <h4 className="greetings">Enter username:</h4>
                            <div className="card">
                                <div className="card-body">
                                    <form className="d-flex justify-content-center align-items-center mb-4" onSubmit={(e) => createUserHandler(e)}>
                                        <div className="form-outline flex-fill">
                                            <input 
                                                name="username"
                                                type="text" 
                                                id="form2" 
                                                required 
                                                className="form-control" 
                                                placeholder="anon" 
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-info ms-2">Enter</button>
                                    </form>
                                </div>
                            </div>
                        </div>}
                        
                    </div>
                </div>
            </section>
        </>
    );
}