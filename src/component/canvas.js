import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import html2canvas from 'html2canvas'
import '../resource/style/canvas.css'
import axios from 'axios'
import SweetAlert from "react-bootstrap-sweetalert";
import {
  Button,
  Col,
} from 'react-bootstrap'

class Canvas extends Component{

  canvas = null
  ctx = null
  constructor(props) {
    super(props)

    this.state={
      isDown: false,
      previousPointX:'',
      previousPointY:'',
      sweetAlertMessage: null,
    }
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleSave = this.handleSave.bind(this)
    this.handleOpenBtClick = this.handleOpenBtClick.bind(this)
    this.fileInput = React.createRef()
  }

  componentDidMount() {
    this.canvas = ReactDOM.findDOMNode(this.refs.canvas)
    this.ctx = this.canvas.getContext("2d")
  }

  componentDidUpdate(){
  }

  downloadURI(uri, name) {
    var link = document.createElement('a')
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  handleUpload = () => {
    var self = this;
    var canvasPromise  = html2canvas(document.body, {
        useCORS: true
    });
    canvasPromise.then(function() {
    const dataURL = self.canvas.toDataURL();
    axios.post('http://localhost:81/uploadApi/upload.php', { image : dataURL }, {'Content-Type' : 'application/json'})
      .then(res => {
          if(res.status == 'success'){
            self.setState({sweetAlertMessage : <SweetAlert success title='Picture is uploaded Successfuly!' onConfirm = {self.closeAlert}/>})
          } else {
            self.setState({sweetAlertMessage : <SweetAlert success title='Picture is uploaded Failed!' onConfirm = {self.closeAlert}/>})
          }
      });
    }); 
  }

  closeAlert = () =>{
    this.setState({sweetAlertMessage : null})
  }

  handleSave = () => {
    var self = this;
    var canvasPromise  = html2canvas(document.body, {
      useCORS: true
    })
    canvasPromise.then(function() {
      const dataURL = self.canvas.toDataURL()
      self.downloadURI(dataURL, 'name.png')
    })
  }

  handleOpenBtClick = () => {
    this.fileInput.current.click()
  }

  onChangeFile = (e) => {
    var self = this;
    if(!!e){
      self.canvas = ReactDOM.findDOMNode(this.refs.canvas)
      self.ctx = this.canvas.getContext("2d")
      var img = new Image()
      img.crossOrigin = "Anonymous"
      if(!!e.target.files[0]){
        img.src = URL.createObjectURL(e.target.files[0])
        img.onload = function() {
          self.canvas.width = img.width;
          self.canvas.height = img.height;
          self.ctx.drawImage(img, 0, 0, img.width,  img.height)
        }
      }
    }
  }

  handleMouseMove(event){

  }

  handleMouseUp(event){
    this.setState({
        isDown: false
    });
    if(this.state.isDown){
      var x = event.offsetX
      var y = event.offsetY

      if(!!x && !!y){

        this.ctx.beginPath();
        this.ctx.lineWidth = 3;
  
        this.ctx.moveTo(this.state.previousPointX,this.state.previousPointY);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }
  }

  handleMouseDown(event){
    let self = this
    self.setState({
      isDown: true,
      previousPointX:event.offsetX,
      previousPointY:event.offsetY
    },()=>{       
      /*var x = event.offsetX
      var y = event.offsetY
      if(!!x && !!y){
        self.ctx.moveTo(x,y)
        self.ctx.save()
        self.ctx.stroke()
      }*/
    })
  }

  render() {
    return (
      <div>
        {this.state.sweetAlertMessage}
        <Col className = 'canvas-pane'  ref = {this.canvasDom}>
          <canvas className="canvas" ref="canvas"            		
            onMouseDown={
              e => {
                let nativeEvent = e.nativeEvent
                this.handleMouseDown(nativeEvent)
              }
            }
            onMouseMove={
              e => {
                let nativeEvent = e.nativeEvent
                this.handleMouseMove(nativeEvent)
              }
            }    
            onMouseUp={
              e => {
                let nativeEvent = e.nativeEvent
                this.handleMouseUp(nativeEvent)
              }
            }
          />
        </Col>
        
        <div className = 'bt-group'>
          <div className = 'each-button'>
            <input type="file" ref={this.fileInput} style={{display:"none"}} onChange = {this.onChangeFile}/>
            <Button variant="dark" onClick={this.handleOpenBtClick}>Open</Button>
          </div>
          
          <div className = 'each-button'>
            <Button variant="dark" onClick={this.handleSave}>
                Save
            </Button>
          </div>

          <div className = 'each-button'>
            <Button variant="dark" onClick={this.handleUpload}>
                Upload
            </Button>
          </div>

          
        </div>
      </div>    
    );
  }
}


export default Canvas