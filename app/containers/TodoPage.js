import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Explore from '../components/Explore'
import { withRouter } from 'react-router-dom'
import { resetErrorMessage } from '../actions'

class TodoPage extends Component{
	static propTypes = {
	    // Injected by React Redux
	    errorMessage: PropTypes.string,
	    resetErrorMessage: PropTypes.func.isRequired,
	    inputValue: PropTypes.string.isRequired,
	    // Injected by React Router
	    children: PropTypes.node
	}
	componentWillMount(props){
		console.log(props);
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
	render() {
		const { children, inputValue } = this.props;
		return (
		  <div>
		    LOLOLOL
		  </div>
		)
	}

}
const mapStateToProps = (state, ownProps) => ({
  errorMessage: state.errorMessage,
  inputValue: ownProps.location.pathname.substring(1)
})

export default withRouter(connect(mapStateToProps, {
  resetErrorMessage
})(TodoPage))