import React, { Component } from 'react';
import ReactGA from 'react-ga';
import ProgressBar from './ProgressBar/ProgressBar';
import './App.css';

ReactGA.initialize('UA-110404351-1');
ReactGA.pageview(window.location.pathname + window.location.search);
class App extends Component {
  constructor(props){
    super(props);
    this.state = ({
      loading:false,
      votos:{
        alianza: 0,
        nacional: 0,
        total: 0
      },
      mer:{
        procesado:0,
        noProcesado: 0
      },
      lastUpdate: ''
    });
    this.handleClick = this.handleClick.bind(this);
  }
  render() {
    const votos = this.state.votos;
    const loading = this.state.loading;
    const mer = this.state.mer;
    const lastUpdate = this.state.lastUpdate;
    const porcentajeProcesado = mer.procesado/(mer.procesado + mer.noProcesado)*100 || 0
    const viewData =
    <div>
        <ProgressBar
          titleBar="MER Procesados"
          leftPercent={porcentajeProcesado}
          leftText={`${parseFloat(porcentajeProcesado).toFixed(2)}% (${mer.procesado})`}
          rightPercent={100-porcentajeProcesado}
          rightText={`${mer.noProcesado}`}
        />
        <ProgressBar
          titleBar="Votos Procesados"
          leftPercent={100*votos.alianza/votos.total}
          leftText={`Nasralla: ${parseFloat(100*votos.alianza/votos.total).toFixed(4)}% (${votos.alianza})`}
          rightPercent={100*votos.nacional/votos.total}
          rightText={`JOH: ${parseFloat(100*votos.nacional/votos.total).toFixed(4)}% (${votos.nacional})`}
        />
        <p>Diferencia: {votos.alianza-votos.nacional} ({parseFloat((votos.alianza-votos.nacional)/votos.total*100).toFixed(4)}%)</p>
        <p>UltimaActualizacion: {lastUpdate}</p>
    </div>

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Nasralla | JOH | Diferencia</h1>
        </header>
        <h2>Haz click en actualizar para traer los datos</h2>
        {votos.total > 0?viewData:''}
        <div>{loading?<pre>Cargando...</pre>:''}</div>
        <button className="button" onClick={this.handleClick}>Actualizar</button>
        <p>Cada vez que se da click en actualizar se descargan 504 kilobytes de información, 
            tenga en cuenta esto si usa datos (2 clicks es casi 1 mega)
        </p>
        <p className="App-intro">
          Bienvenidos a la Version 0.1.5
        </p>
      </div>
    );
  }
  handleClick() {
    this.setState({
      loading:true
    });
    let getDate = () => fetch("https://api.tse.hn/prod/General/Snapshot/0",{
      method:"GET"
    }).then((response) => response.json());

    let getData = () => fetch ("https://api.tse.hn/prod/ResultadoPresidente/Nacional/0",{
        method:"GET"
    }).then((response) => response.json());

    let getActas = () => fetch ("https://api.tse.hn/prod/General/CargaElectoral0/1", {
      method:"GET"      
    }).then((response) => response.json());
    Promise.all([getDate(), getData(), getActas()]).then(([date, data, mer]) => {
      
      let votosNacional = 0, votosAlianza = 0, totalVotos = 0;
      let lista = data.Lista;
      lista.forEach((data)=>{
          if(data.Partido === "PARTIDO NACIONAL DE HONDURAS")
              votosNacional += data.Votos;
          if(data.Partido === "LIBRE-PINU")
              votosAlianza += data.Votos;
          totalVotos += data.Votos;
      });
      /*let diferencia = votosAlianza - votosNacional;
      const porcentajeAlianza = parseFloat(votosAlianza/totalVotos*100).toFixed(4);
      const porcentajeNacional = parseFloat(votosNacional/totalVotos*100).toFixed(4);
      const porcentajeDiferencia = parseFloat(porcentajeAlianza - porcentajeNacional).toFixed(4);
      const MERProc = mer.MERProcesadas;
      const MERNoProc = mer.MERNoProcesadas;
      const porcentajeProc = parseFloat(MERProc/(MERProc+MERNoProc)*100).toFixed(4);
      const porcentajeNoProc = parseFloat(MERNoProc/(MERProc+MERNoProc)*100).toFixed(4);
      /*let imprimir = "\nNasralla:\t" + votosAlianza + "\t" + porcentajeAlianza + "%\n"
      + "JOH:\t\t" + votosNacional+ "\t" + porcentajeNacional + "%\n"
      + "Diferencia:\t"+ diferencia + "\t"+ porcentajeDiferencia+"%\n"
      + "Total de Votos:\t" + totalVotos +"\n"
      + "MER Procesadas:\t\t" + MERProc + "\t"+ porcentajeProc + "%\n"
      + "MER No Procesadas:\t" + MERNoProc + "\t" + porcentajeNoProc + "%\n"
      + "Ultima Actualización: " + lastUpdate + "\n"
      ;*/
      ReactGA.event({
        action:'Click a actualizar'
      })
      this.setState({
        loading:false,
        votos:{
          alianza: votosAlianza,
          nacional: votosNacional,
          total: totalVotos
        },
        mer:{
          procesado:mer.MERProcesadas,
          noProcesado: mer.MERNoProcesadas
        },
        lastUpdate: date.FecLocalLarga
      });
    }, (err) => {
      this.setState({loading:false});
    });
  }
} 

export default App;
