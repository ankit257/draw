import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Explore from '../components/Explore'
import { withRouter } from 'react-router-dom'
import { resetErrorMessage } from '../actions'
// var Modernizr = require("modernizr");


let map = [];
let paths = [];
let touchSupported;
let drawBool = false;
let canvas;
let ctx;
let reqAnimFrameId;
let highlightedPathIndex;
// if(Modernizr){
// 	touchSupported = Modernizr.touch;	
// }


class CanvasPage extends Component{
	static propTypes = {
	    // Injected by React Redux
	    errorMessage: PropTypes.string,
	    resetErrorMessage: PropTypes.func.isRequired,
	    inputValue: PropTypes.string.isRequired,
	    // Injected by React Router
	    children: PropTypes.node
	}
	componentWillMount(props){
		this.state = {
			x : 24, 
			y : 18,
			play: false
		}
	}
	constructor(props){
		super(props);
		if (touchSupported) {
			this.mouseDownEvent = "touchstart";
			this.mouseMoveEvent = "touchmove";
			this.mouseUpEvent = "touchend";
		}
		else {
			this.mouseDownEvent = "mousedown";
			this.mouseMoveEvent = "mousemove";
			this.mouseUpEvent = "mouseup";
		}
	}
	componentDidMount(){
		canvas = document.getElementById('canvas');
		ctx = canvas.getContext('2d');
		canvas.style.background = '#000';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.moveTo(0,0);
		for (var i = 0; i < this.state.x; i++) {
			map[i] = [];
			for (var j = 0; j < this.state.y; j++) {
				ctx.moveTo(i*30+10, j*30+10);
				ctx.arc(i*30+10, j*30+10, 5, 0, Math.PI*2, true);
		        ctx.fillStyle = '#333';
		        ctx.fill();
			    map[i][j] = 0;	
			   }
			}
		this.setState({map : map})
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
	drawMap(){
		canvas.style.background = '#000';
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.moveTo(0,0);
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				ctx.moveTo(i*30+10, j*30+10);
				if(map[i][j] === 0){
					ctx.fillStyle = '#333';	
				}else{
					ctx.fillStyle = '#3370d4';
				}
				ctx.beginPath();
				ctx.arc(i*30+10, j*30+10, 5, 0, Math.PI*2, true);
				ctx.closePath();
				ctx.fill();
		   }
		}
	}
	canvasClicked(evt){
		let canvasCoords = evt.target.getBoundingClientRect();
		let left = evt.clientX - canvasCoords.x - 10;
		let top = evt.clientY - canvasCoords.y - 10;
		if(left%30 < 5 && top%5 < 5){
			let m = parseInt(left/30);
			let n = parseInt(top/30);
			// if(map[m][n] === 1){
			// 	map[m][n] = 0;
			// }else{
			map[m][n] = 1;
			// }
			this.drawMap();
		}
	}
	playAnim(){
		this.drawPaths()
	}
	pathHighlight(index){
		highlightedPathIndex = index;
	}
	splicePath(index){
		paths.splice(index, 1);
		// this.setState({paths : paths});
	}
	makeToolbar(){
		let pathsToRender = [];
		let that = this;
		return (
			<div>
				<ul className="list-group">
	 				{Array.isArray(paths) && paths.map((path, index) => (
	 					<li className="list-group-item justify-content-between">
	 						<span onClick={that.pathHighlight(null, index)}>path: {index + 1}</span> 
	 						<span className="badge badge-default badge-pill" onClick={that.splicePath(null, index)}>X</span>
	 					</li>
	 				))}
	 			</ul>
				<button type="button" className="btn btn-outline-primary" onClick={this.playAnim.bind(this)}>
					<span className="fa fa-play"></span>
				</button>
			</div>
		)
	}
	initDraw(e){
		drawBool = true;
		let evt = e;
		if(e.touches){
			evt = e.touches[0];
		}
		let x = evt.clientX - evt.target.getBoundingClientRect().left;
		let y = evt.clientY - evt.target.getBoundingClientRect().top;
		paths.push([{x:x, y:y}]);
	}
	stopDraw(){
		drawBool = false;
		this.setState({map : map});
	}
	updatePath(x,y){
		let path = paths[paths.length-1];
		let lastCoords = path[path.length-1];
		// if(Math.abs(lastCoords.x - x) >3 || Math.abs(lastCoords.y - y) > 3){
			path.push({x:x, y:y});		
		// }
	}
	drawPaths(){
		let timeStart = Date.now();
		function animate() {
			let timeNow = Date.now();
			let cv = 0;
			canvas.style.background = '#000';
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (var i = 0; i < paths.length; i++) {
				for (var j = 0; j < paths[i].length; j++) {
					cv++;
					ctx.moveTo(0,0);
					const {x, y} = paths[i][j];
					ctx.moveTo(x, y);
					ctx.fillStyle = '#3370d4';
					ctx.beginPath();
					ctx.arc(x, y, 5, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
					if((timeNow - timeStart)/20 < cv){
						break;
					}
				}
			}
		  requestAnimationFrame(animate);
		}
		animate(); 
	}
	draw(touch, e){
		debugger
		if(drawBool){
			let evt = e;
			if(touch){
				evt = e.touches[0];
			}
			let x = evt.clientX - evt.target.getBoundingClientRect().left;
			let y = evt.clientY - evt.target.getBoundingClientRect().top;
			this.updatePath(x, y);
			ctx.moveTo(0,0);
			ctx.moveTo(x, y);
			ctx.fillStyle = '#3370d4';
			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		}
	}
	render() {
		const { children, inputValue } = this.props;
		return (
	      <div className="site-wrapper-inner">
	        <div className="cover-container">
	          <div className="masthead clearfix">
	            <div className="inner">
	              <h3 className="masthead-brand text-center width-100">Alphabets Creator</h3>
	            </div>
	          </div>
	          </div>
	          <div className="container-fluid">
		          <div className="row">
		            <div className="col-md-8">
		            	<canvas id="canvas" className="canvas" height="480" width="650" 
		            			onClick={this.canvasClicked.bind(this)}
		            			onMouseDown={this.initDraw.bind(this)}
		            			onMouseMove={this.draw.bind(this, false)}
		            			onMouseUp={this.stopDraw.bind(this)}
		            			onTouchStart={this.initDraw.bind(this)}
		            			onTouchMove={this.draw.bind(this, true)}
		            			onTouchEnd={this.stopDraw.bind(this)}
		            			/>
		            </div>
		            <div className="col-md-4">
		            	<div className="toolbar">
		            	{this.makeToolbar.call(this)}
		            	</div>
		            </div>
		          </div>
	          </div>
			<div className="cover-container">
	          <div className="mastfoot">
	            <div className="inner">
	              <p>v1.0</p>
	            </div>
	          </div>

	        </div>

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
})(CanvasPage))