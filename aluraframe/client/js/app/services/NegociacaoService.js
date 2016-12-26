class NegociacaoService {

  constructor() {

    this._http = new HttpService();
  }

  obterNegociacoesDaSemana() {

    return new Promise((resolve, reject) => {

      this._http.get('negociacoes/semana')
        .then(negociacoes => {
          resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
        })
        .catch(erro => {
          console.log(erro);
          reject('Não foi possivel obter as negociacoes da semana');
        })

    });
  
  }

  obterNegociacoesDaSemanaAnterior() {

    return new Promise((resolve, reject) => {

      this._http.get('negociacoes/anterior')
        .then(negociacoes => {
          resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
        })
        .catch(erro => {
          console.log(erro);
          reject('Não foi possivel obter as negociacoes da semana');
        })

    });
  
  }

  obterNegociacoesDaSemanaRetrasada() {

    return new Promise((resolve, reject) => {

      this._http.get('negociacoes/retrasada')
        .then(negociacoes => {
          resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)));
        })
        .catch(erro => {
          console.log(erro);
          reject('Não foi possivel obter as negociacoes da semana');
        })

    });
  
  }

    obterNegociacoes() {
        
        return Promise.all([
            this.obterNegociacoesDaSemana(),
            this.obterNegociacoesDaSemanaAnterior(),
            this.obterNegociacoesDaSemanaRetrasada()
        ]).then(periodos => {

            let negociacoes = periodos
                .reduce((dados, periodo) => dados.concat(periodo), [])
                .map(dado => new Negociacao(new Date(dado.data), dado.quantidade, dado.valor ));

            return negociacoes;
        }).catch(erro => {
            throw new Error(erro);
        });
    }

    cadastra(negociacao) {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adicionada com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel adicionar a negociação');
            });
    }

    lista() {

        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel obter as negociacoes');
            })
    }

    apaga() {
        
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => 'Negociacoes apagadas com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel apagar as negociacoes');
            })
    }

    importa(listaAtual) {

        return this.obterNegociacoes()
            .then(negociacoes => 
                negociacoes.filter(negociacao =>
                    !listaAtual.some(negociacaoExistente => 
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)
                    )
                )
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel buscar negociacoes para importar');
            })            
    }
}