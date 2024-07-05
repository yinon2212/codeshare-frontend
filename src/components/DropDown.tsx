import React, {useState} from 'react';
import '../style/DropDown.css';

interface Props{
    items: any[],
    onClick: (item: any) => void,
    activeTxt?: string
}

interface DDItemProps{
    item: string,
    onClick: () => void,
    className: string, 

}

const DropDownItem = ({item, onClick, className}: DDItemProps) => {
    return (
        <button className={className + " drop-down-item"} onClick={onClick}>{item}</button>
    );
}

const DropDown = ({items, onClick, activeTxt}: Props) => {
    const [activeItem, setActiveItem] = useState(activeTxt ? activeTxt : items[0]);
    const [open, setOpen] = useState(false);

    const onItemClick = (item: any) => {
        setActiveItem(items[item]);
        onClick(item);
        setOpen(false);
    }
    let renderedItems = items.map((item: string, key: any) => {
        return <DropDownItem className={item === activeItem ? 'active' : ''} key={key} item={item} onClick={() => {
            onItemClick(key);
        }} />
    });

    return (
        <div className="drp-down-container">
            <button onClick={() => setOpen(!open)} className="active-item">{activeItem}</button>
            <div style={{display: open ? 'flex' : 'none'}} className="dd-items-cont">
                {renderedItems}
            </div>
            
        </div>
    );

}

export default DropDown;