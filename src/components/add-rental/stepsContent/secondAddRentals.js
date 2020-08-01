import React, {Component} from 'react';

export default class SecondAddRental extends Component{

    render(){
        const { values, handleChange } = this.props;
        return(     
                <div className="rental__form__content">
                    <input placeholder="Кол-во комнат" onChange={this.props.handleChangeNum('rooms')} defaultValue={values.rooms}></ input>
                    <input placeholder="Этаж" onChange={this.props.handleChangeNum('floor')} defaultValue={values.floor}></ input>
                    <input placeholder="Цена" onChange={this.props.handleChangeNum('cost')} defaultValue={values.cost}></input>
                    <div className="rental__form__btns">
                    <button onClick={this.props.prevStep}>Назад</button>
                        <button onClick={this.props.nextStep}>Дальше</button>
                    </div>
                </div>  
        )
    }}