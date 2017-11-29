import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = ({
        data: 'Haz click en actualizar para traer los datos.'
    });
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    const datos = this.state.data;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Nasralla | JOH | Diferencia</h1>
        </header>
        <pre>
            {datos}
        </pre>
        <button className="button" onClick={this.handleClick}>Actualizar</button>
        <p>Cada vez que se da click en actualizar se descargan 504 kilobytes de información, 
            tenga en cuenta esto si usa datos (2 clicks es casi 1 mega)
        </p>
        <p className="App-intro">
          Bienvenidos a la Version 0.1.0
        </p>
      </div>
    );
  }
  handleClick() {
    this.setState({data:"Loading......."});
    let getDate = () => fetch("https://api.tse.hn/prod/General/Snapshot/0",{
      method:"GET"
    }).then((response) => response.json());
    let getData = () =>
    fetch ("https://api.tse.hn/prod/ResultadoPresidente/Nacional/0",{
        method:"GET"
    }).then((response) => response.json());
    Promise.all([getDate(), getData()]).then(([date, data]) => {
        let votosNacional = 0, votosAlianza = 0, totalVotos = 0;
        let lastUpdate = "";
        lastUpdate = date.FecLocalLarga;
        let lista = data.Lista;
        lista.forEach((data)=>{
            if(data.Partido === "PARTIDO NACIONAL DE HONDURAS")
                votosNacional += data.Votos;
            if(data.Partido === "LIBRE-PINU")
                votosAlianza += data.Votos;
            totalVotos += data.Votos;
        });
        let diferencia = votosAlianza - votosNacional;
        const porcentajeAlianza = parseFloat(votosAlianza/totalVotos*100).toFixed(4);
        const porcentajeNacional = parseFloat(votosNacional/totalVotos*100).toFixed(4)
        const porcentajeDiferencia = parseFloat(porcentajeAlianza - porcentajeNacional).toFixed(4);
        let imprimir = "\nNasralla:\t" + votosAlianza + "\t" + porcentajeAlianza + "%\n" +
        "JOH:\t\t" + votosNacional+ "\t" + porcentajeNacional + "%\n" +
        "Diferencia:\t"+ diferencia + "\t"+ porcentajeDiferencia+"%\n" +
        "Total de Votos:\t" + totalVotos +"\n" +
        lastUpdate;
        this.setState({data:imprimir});
    }, (err) => {
      this.setState({data:err});
    });
  }
} 

export default App;
