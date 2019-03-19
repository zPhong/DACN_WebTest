import React, { Component } from 'react';
import './css/App.css';
import {GetInfomation} from './RegexFunction'

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  constructor(props)
  {
     super(props);
     this.state={
       input:'',
       result:'',
     }
  }
  render() {
    const {input,result} = this.state;
    return (
      <div className="App">
        <header className="App-header">
        <div style={{height:'25vh', marginBottom: '4rem'
      }} >
          <input style={{fleX:1, height:'100%' }}  type='text' name='title' value={input} onChange={(event)=>{this.setState({input:event.target.value})}}/>
        </div>
        <button type="button" className="btn btn-success" onClick={()=>{
          this.setState({result : GetInfomation(input)})
        }}>Success</button>
            {Object.keys(result).map((value,index)=>
            (
              <p key={index} >{`${value} : ${result[value]}`}</p>
            ))}
         
        </header>
      </div>
    );
  }
}

export default App;
