import React from 'react';
import LinkIcon from '../assets/link.svg';
import '../style/IDCont.css';
import '../style/Button.css';

interface Props{
    id: string
}

const IDCont = ({id}: Props) => {

    const onBtnClick = () => {
        navigator.clipboard.writeText(id)
        .then(() => {
          })
          .catch((err) => {
            console.log(err.message);
          });
    }

    return (
        <div className="id-container">
            <button className="clean-btn" onClick={onBtnClick}><img src={LinkIcon} alt="Link icon"/><p className="unique-id">{id}</p></button> 
        </div>
       
    );
}

export default IDCont;