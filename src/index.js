import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();

/*class Imagecanvas extends React.Component{
	render(){
		return (
			<img src="1.jpg" width="100" height="50" />
		)
	}
}*/

function onBrowse(){
    alert("JGS");
}

class Mycanvas extends React.Component{
    constructor(props) {
        super(props);
        //added state 
        this.state={
            isDown: false,
            previousPointX:'',
            previousPointY:'',
            location:''
        }
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleBrowse = this.handleBrowse.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    downloadURI(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    handleBrowse = () => {
        alert('Browse');
    }

    handleUpload = () => {
        alert('Upload');
    }

    handleSave = () => {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        const dataURL = canvas.toDataURL();
        this.downloadURI(dataURL, 'stage.png');
        alert('Save');
    }

    render() {
        return (
            <div>    
                <canvas id="canvas" ref="canvas"                 		
                        onMouseDown={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseDown(nativeEvent);
                            }}
                        onMouseMove={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseMove(nativeEvent);
                            }}    
                        onMouseUp={
                            e => {
                                let nativeEvent = e.nativeEvent;
                                this.handleMouseUp(nativeEvent);
                            }}
                />
                <br></br>
                <button onClick={this.handleBrowse}>
                    Browse
                </button>
                <button onClick={this.handleUpload}>
                    Upload
                </button>
                <button onClick={this.handleSave}>
                    Save
                </button>
            </div>    
        );
    }

    handleMouseMove(event){

    }
    handleMouseUp(event){
        this.setState({
            isDown: false
        });
        if(this.state.isDown){
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);
            var x = event.offsetX;
            var y = event.offsetY;
            var ctx = canvas.getContext("2d");

            ctx.lineWidth = 1;
            ctx.strokeStyle = "";

            ctx.moveTo(this.state.previousPointX,this.state.previousPointY);
            ctx.lineTo(x,y);
            ctx.stroke();
            ctx.closePath();
        }
    }

 

    handleMouseDown(event){ //added code here
        console.log(event);    
        this.setState({
            isDown: true,
            previousPointX:event.offsetX,
            previousPointY:event.offsetY
        },()=>{    
            const canvas = ReactDOM.findDOMNode(this.refs.canvas);    
            var x = event.offsetX;
            var y = event.offsetY;
            var ctx = canvas.getContext("2d");
            console.log(x,y);
            ctx.moveTo(x,y);
            // ctx.lineTo(x+1,y+1);
            // ctx.stroke();
        })
    }
    
    componentDidMount() {
        const canvas = ReactDOM.findDOMNode(this.refs.canvas);
        const ctx = canvas.getContext("2d");
        //ctx.fillStyle = 'rgb(200,255,255)';
        //ctx.fillRect(0, 0, 640, 425);
        var img = new Image();
        img.src = 'https://s-media-cache-ak0.pinimg.com/236x/d7/b3/cf/d7b3cfe04c2dc44400547ea6ef94ba35.jpg'
        img.onload = function() {
            ctx.drawImage(img,0,0);
        }
        ctx.closePath();
    }
}


ReactDOM.render(<Mycanvas />, document.getElementById('root'));