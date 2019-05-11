import React, {Component} from 'react';
import './css/App.css';
import {analyzeInput} from './RegexFunction';
import {defineSentences} from './configuration/define';

// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      result: ''
    };
  }

  render() {
    const {input, result} = this.state;
    return (
       <div className='App'>
         <header className='App-header' style={{flexDirection: 'row'}}>
           <div style={{
             flex: 1,
             height: '100vh',
             maxHeight: '100vh',
             borderRight: 'solid red'
           }}>
             <div style={{
               height: '50%',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center'
             }}>
               <div style={{
                 width: '100%',
                 height: '50%',
                 marginBottom: '1rem'
               }}>
                                <textarea
                                   style={{flex: 1, height: '100%'}}
                                   name='title'
                                   value={input}
                                   onChange={event => {
                                     this.setState({
                                       input: event.target.value
                                     });
                                   }}/>
               </div>

               <button type='button'
                       className='btn btn-success'
                       onClick={() => {
                         this.setState({
                           result: analyzeInput(input)
                         });
                       }}>
                 Success
               </button>
             </div>

             <div style={{
               height: '50%',
               maxHeight: '50%',
               overflowX: 'scroll'
             }}>
               {Object.keys(defineSentences).map(type =>
                  defineSentences[type].map((value, index) => (
                     <p key={index}>{`${value}`}</p>
                  ))
               )}
             </div>
           </div>
           <span style={{flex: 1}}>
                        {Object.keys(result).map((value, index) => (
                           <p key={index}>{`${value} : ${JSON.stringify(
                              result[value]
                           )}`}</p>
                        ))}
                    </span>
         </header>
       </div>
    );
  }
}

export default App;
