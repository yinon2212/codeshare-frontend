import React, {useRef, useState, useEffect} from 'react';
import '../App.css';
import Editor from '@monaco-editor/react';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import {files, themes} from '../Globals/files';
import shareIcon from '../assets/Share.svg';
import IDCont from '../components/IDCont';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {socket} from '../socket';
import {URL} from '../Globals/consts';



const Home = () => {
  const [currentEditorLan, setEditorLan] = useState(files[0]);
  const [currentTheme, setCurrentTheme] = useState(themes[0]);
  const [value, setValue] = useState(currentEditorLan.codePreset);
  const [currentID, setCurrentID] = useState<string >("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const params = useParams();
  const editorRef = useRef(null);
  const codeItems = ['html', 'javascript'];

  useEffect(() => {
    if(params.id){
      axios.get('http://127.0.0.1:5000/get-code/' + params.id)
      .then((res: any) => {
        if(res.status === 200){
          let data = res.data[0];
          let editorObj = {
            language: data.lan,
            codePreset: data.code
          }
          setEditorLan(editorObj);
          setValue(editorObj.codePreset);
        }
      })
    }

    socket.connect();

    return () => {
      socket.disconnect();
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);

  useEffect(() => {
    let codeID = currentID !== "" ? currentID : params.id ? params.id : "";
    if(codeID !== ""){
      socket.emit('join_room', codeID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentID]);

  socket.on('recieve_code_changes', ((data: {data: {newCode: string, codeID: string, lan: string}}) => {
    let newData = data.data;
    let editorObj = {
      language: newData.lan,
      codePreset: newData.newCode
    }
    setEditorLan(editorObj);
    setValue(editorObj.codePreset);
  }));

   /*Handle the share button clicks*/
  const onShareBtnClick = () => {
    axios.post(URL + 'share', {code: value, lan: currentEditorLan.language})
      .then((res: any) => {
        setCurrentID(res.data.uniqid);
    })
    .catch((err: any) => {
      throw new Error("Cannot connect to the server! :(");
    });

    setBtnDisabled(true);
  }

   /*Handle editor changes*/
  function handleEditorChange(value: any, event: any) {
    if(params.id || currentID !== ""){
      let id = params.id || currentID;
      let data = {newCode: value, codeID: id, lan: currentEditorLan.language};
      
      socket.emit('change_code', (data));

      setBtnDisabled(false);
    }
    
    setValue(value);
  }

   /*Handle the mount of the editor*/
  function handleEditorDidMount(editor: any, monaco: any) {
    // here is the editor instance
    // you can store it in `useRef` for further usage
    editorRef.current = editor;
  }

   /*Handle the click on the language drop down items*/
  const onEditorLanDDClick = (lan: any) => {
    setEditorLan(files[lan]);
    if(params.id){
      socket.emit('change_code', ({newCode: value, codeID: params.id, lan: files[lan].language}));
    }
  }

  /*Handle the click on the themes drop down items*/
  const onEditorThemeDDClick = (theme: any) => {
    setCurrentTheme(themes[theme]);
  }

  return (
      <div className={currentTheme === 'dark' ? 'dark-theme' : 'light-theme'}>
        <Editor
          height="60vh"
          language={currentEditorLan.language}
          defaultValue={currentEditorLan.codePreset}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          value={value}
          theme={`vs-${currentTheme}`}
        
        />

        <div className="footer-cont">
          <div className="left-cont">
            <DropDown key={currentEditorLan.language} activeTxt={currentEditorLan.language} items={codeItems} onClick={onEditorLanDDClick} />

            <DropDown items={themes} onClick={onEditorThemeDDClick} />
          </div>
          <div className="right-cont">
            {currentID !== "" && <IDCont id={currentID}/>}
            <Button
              text="Share"
              onClick={onShareBtnClick}
              icon={shareIcon}
              disabled={btnDisabled}
            />
          </div>
        </div>
      
      </div>
  );
}

export default Home;
