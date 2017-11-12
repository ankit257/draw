import fetch from 'isomorphic-fetch'

export const LOADED_TODOS = 'LOADED_TODOS';

export default function loadTodos() {
   return function(dispatch, getState) {
      fetch('http://localhost:3000/api/todos')
      .then(response => response.json(),
      		error => console.log(error))
      .then(json => dispatch({ type: LOADED_TODOS, data: json }))
      // dispatch({ type: LOADED_TODOS, data: {"todos":[{"id":1,"text":"Here is the task 1"},{"id":2,"text":"Go save the world"},{"id":3,"text":"Drink beer"}]} })
  }
}