import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Explore from '../components/Explore'
import { withRouter } from 'react-router-dom'
import loadTodos from '../actions/loadtodos';

class App extends Component{
	static propTypes = {
	    errorMessage: PropTypes.string,
	    todos: PropTypes.array,
	    dispatch: PropTypes.func.isRequired
	}
	async componentWillMount(props){
		const { dispatch } = this.props
		dispatch(loadTodos());
	}
	handleDismissClick = e => {
		this.props.resetErrorMessage();
		e.preventDefault();
	}
	handleChange = nextValue => {
		console.log(nextValue);
	}
	renderErrorMessage() {
		const { errorMessage } = this.props
		if (!errorMessage) {
		  return null
		}
		return (
		  <p style={{ backgroundColor: '#e99', padding: 10 }}>
		    <b>{errorMessage}</b>
		    {' '}
		    <button onClick={this.handleDismissClick}>
		      Dismiss
		    </button>
		  </p>
		)
	}
	renderTodos(todos){
		let c = []
		for (let key in todos){
			if(key !== 'todos'){
				c.push(<p key={todos[key].id}>
						<a href={`/todo/${todos[key].id}`}>{todos[key].text}</a>
					</p>)
			}
		}
		return(
			<div>{c}</div>
		)
	}
	render() {
		var that = this;
		const { todos, inputValue } = that.props;
		if(todos && todos.length > 0){
			return (
			  <div>
			    <Explore value={inputValue}
			             onChange={that.handleChange} />
			    <hr />
			    {that.renderErrorMessage()}
			    {that.renderTodos(todos)}
			  </div>
			)	
		}else{
			return null;
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	const todos = state.todos;
  	const errorMessage = state.errorMessage;
  	const inputValue = ownProps.location.pathname.substring(1);
	return {
		todos,
		errorMessage,
		inputValue	
	}
}
export const resetErrorMessage = () => ({
    type: RESET_ERROR_MESSAGE
})
export default withRouter(connect(mapStateToProps)(App))