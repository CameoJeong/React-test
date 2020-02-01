import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import html2canvas from 'html2canvas'

class Mycanvas extends Component{

    ctx = null
    canvas = null
    constructor(props) {
        super(props);
        this.state={
            isDown: false,
            previousPointX:'',
            previousPointY:'',
            location:'',
            imgUrl : '',
        }
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.fileInput = React.createRef();
    }

    componentDidMount() {
        var self = this;
        self.canvas = ReactDOM.findDOMNode(this.refs.canvas);
        self.ctx = this.canvas.getContext("2d");
    }

    componentDidUpdate(){
        this.init()
    }

    init = () => {
        var self = this
        var img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = this.state.imgUrl
        img.onload = function() {
            self.ctx.drawImage(img,0,0);
        }
    }

    downloadURI(uri, name) {
        var link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleUpload = () => {
        alert('Upload');
    }

    handleSave = () => {
        var self = this;
        var canvasPromise  = html2canvas(document.body, {
            useCORS: true
        });
        canvasPromise.then(function() {
            document.body.appendChild(self.canvas);
            const dataURL = self.canvas.toDataURL();
            self.downloadURI(dataURL, 'name.png')
        });   
    }

    handleClick = (e) => {
        this.setState({imgUrl:URL.createObjectURL(e.target.files[0])})
    }

    handleMouseMove(event){

    }

    handleMouseUp(event){
        this.setState({
            isDown: false
        });
        if(this.state.isDown){
            var x = event.offsetX;
            var y = event.offsetY;

            this.ctx.lineWidth = 1;
            this.ctx.strokeStyle = "";

            this.ctx.moveTo(this.state.previousPointX,this.state.previousPointY);
            this.ctx.lineTo(x,y);
            this.ctx.stroke();
            this.ctx.closePath();
        }
    }

    handleMouseDown(event){
        console.log(event);    
        this.setState({
            isDown: true,
            previousPointX:event.offsetX,
            previousPointY:event.offsetY
        },()=>{       
            var x = event.offsetX;
            var y = event.offsetY;
            console.log(x,y);
            this.ctx.moveTo(x,y);
            this.ctx.save();
            this.ctx.stroke();
        })
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
                
                <input type="file" id="file" ref={this.fileInput} onChange = { this.handleClick }/>

                <button onClick={this.handleUpload}>
                    Upload
                </button>
                
                <button onClick={this.handleSave}>
                    Save
                </button>
            </div>    
        );
    }
}


ReactDOM.render(<Mycanvas />, document.getElementById('root'));