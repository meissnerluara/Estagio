import BotaoVoltar from '../../components/BotaoVoltar';

export default function SobreProjeto() {
  return (
    <div className="container-sobre">
      <BotaoVoltar />

      <div className="card">
        <h1 className="titulosobreoprojeto text-center">Sobre o Projeto</h1>
        <p className="explicacaosobreoprojeto">
          Edite aqui a explicação sobre o projeto
        </p>
      </div>
    </div>
  );
}