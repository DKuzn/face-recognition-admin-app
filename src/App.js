// src/App.js
//
// Copyright (C) 2022  Дмитрий Кузнецов
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import axios from "axios";
import strings from "./locals.js";
import './App.css';
import './loading.css';


class PersonAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: null
    };

    if (this.isMobile()) {
      this.width = window.screen.width;
    } else {
      this.width = 500;
    }
  }

  isMobile() {
    return window.matchMedia("only screen and (max-width: 760px)").matches;
  }

  renderLoader() {
    return <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>;
  }

  async sendFile(sourceFrame, name, surname) {
    const data = {
      image: sourceFrame.split(",")[1],
      name: name,
      surname: surname
    };
    await axios.post('/add-person/', data);
    console.log(data)
    this.setState({status: null,});
  }

  onFileChange = () => {
    let reader = new FileReader();
    let imgPreview = document.getElementById("imageFile");
    let file = document.getElementById("fileChooser").files[0];
    reader.readAsDataURL(file);
    reader.onload = function () {
        imgPreview.src = reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  onButtonChooseFileClick = () => {
    this.setState({status: null,});
    let fileChooser = document.getElementById("fileChooser");
    fileChooser.click();
    document.getElementById("inputName").value = '';
    document.getElementById("inputSurname").value = '';
  }

  onButtonSendImageClick = () => {
    this.setState({status: this.renderLoader(),});
    let sourceFrame = document.getElementById("imageFile").src;
    let inputName = document.getElementById("inputName").value;
    let inputSurname = document.getElementById("inputSurname").value;
    this.sendFile(sourceFrame, inputName, inputSurname);
  }

  render() {
    return (
      <div className="App-header">
        <div className="App">
          <div>
           {this.state.status}
          </div>
          <input type="file" id="fileChooser" accept="image/jpeg,image/png" onChange={this.onFileChange}></input>
          <img id="imageFile" width={this.width}/>
          <button className="myButton" id="buttonChooseFIle" onClick={this.onButtonChooseFileClick} disabled={this.buttonDisabled}>{strings.buttonChooseFile}</button>
          <input id="inputName" className="myButton" type="search" placeholder={strings.name}></input>
          <input id="inputSurname" className="myButton" type="search" placeholder={strings.surname}></input>
          <button className="myButton" id="buttonSendFile" onClick={this.onButtonSendImageClick} disabled={this.buttonDisabled}>{strings.buttonSendFile}</button>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  onSelectLangChange = () => {
    let lang = document.getElementById("lang");
    strings.setLanguage(lang.value);
    this.setState({lang: lang.value});
  }

  renderSelectLang = () => {
    let options = [];
    let langs = strings.getAvailableLanguages()
    for (let i = 0; i < langs.length; i++) {
      options.push(<option key={i} value={langs[i]}>{langs[i]}</option>);
    }

    return (
      <select id="lang" className="myButton" onChange={this.onSelectLangChange}>
        {options}
      </select>
    )
  }

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <div className="title">
              <p className="titleMain">{strings.mainTitle}</p>
              {this.renderSelectLang()}
            </div>
            <PersonAdder/>
          </header>
        </div>
    );
  }
}

export default App;
