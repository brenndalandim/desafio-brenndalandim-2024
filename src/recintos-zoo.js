class RecintosZoo {

    constructor(){
        this.biomas = [
            {nome: ["savana"], num: 1, espacoTotal: 10, espacoDisponivel: 7, animais: ["MACACO", "MACACO", "MACACO"]},
            {nome: ["floresta"], num: 2, espacoTotal: 5, espacoDisponivel: 5, animais: []},
            {nome: ["savana", "rio"], num: 3, espacoTotal: 7, espacoDisponivel: 5, animais: ["GAZELA"]},
            {nome: ["rio"], num: 4, espacoTotal: 8, espacoDisponivel: 8, animais: []},
            {nome: ["savana"], num: 5, espacoTotal: 9, espacoDisponivel: 6, animais: ["LEAO"]},
    
        ]

        this.animais = [
            {especie: "LEAO", tamanho: 3, bioma: ["savana"], carnivoro: true},
            {especie: "LEOPARDO", tamanho: 2, bioma: ["savana"], carnivoro: true},
            {especie: "CROCODILO", tamanho: 3, bioma: ["rio"], carnivoro: true},
            {especie: "MACACO", tamanho: 1, bioma: ["savana", "floresta"], carnivoro: false},
            {especie: "GAZELA", tamanho: 2, bioma: ["savana"], carnivoro: false},
            {especie: "HIPOPOTAMO", tamanho: 4,  bioma: ["savana", "rio"], carnivoro: false}
        ]
    }


    analisaRecintos(animal, quantidade) {

        //retorna as informações do animal desejado
        let animalInfo = this.getAnimalInfo(animal)

        if(animalInfo != undefined && quantidade > 0){
            //retorna quais biomas estão de acordo com o animal solicitado (se é carnivoro somente com a mesma especie e se não é carnivoro somente com não carnívoros)
            let possiveisBiomas = this.getBiomasInfo(animalInfo.bioma, animalInfo)
            
            let resultado = this.calcEspaco(possiveisBiomas, animalInfo, quantidade)
    
            return this.formatarResposta(resultado, animalInfo, quantidade)
        } else {
            let erro = {}

            animalInfo === undefined ? erro.erro = "Animal inválido" : erro.erro = "Quantidade inválida"
            return erro
        }
    }

    //pega as informações do animal escolhido
    getAnimalInfo(animal) {
        let resultado = this.animais.filter((e) => {
            return e.especie === animal.toUpperCase()
        })
        return resultado[0]
    }

    //remover biomas repetidos (o hipopotamo repete um bioma, por precaução faz em todas pensando num sistema que pode variar, mas nesse exemplo poderia aplicar somente no if do hipopotamo)
    removerBiomaRepetido(biomas){
        let removeRepetido = new Set(biomas)
        let listaCerta = Array.from(removeRepetido)

        return listaCerta
    }

    //listar bioma adequados ao animal selecionado
    getBiomasInfo(biomaAdequado, animalInfo){
        let resultado = []
        let possiveisBiomas = []

        //filtra quais biomas da lista Biomas são iguais aos que o animal precisa
        biomaAdequado.map(bioma => {
            let filtro = this.biomas.filter((e) => {
                return e.nome.includes(bioma)
            })
                resultado = [...resultado, ...filtro]
            });

        //condições se é carnívoro ou não
        if(animalInfo.carnivoro){
            possiveisBiomas = resultado.filter((bioma) => {
                //sendo carnívoro só pode estar com ele mesmo ou lugar vazio
                return bioma.animais.includes(animalInfo.especie) || bioma.animais.length == 0
            })
        } else {
            //condição do hipopotamo
            if(animalInfo.especie === 'HIPOPOTAMO'){
                possiveisBiomas = resultado.filter((bioma) => {
                    //se não tiver animais pode entrar
                    if(bioma.animais.length === 0){
                        return true
                    } else {
                        //se tiver animais, somente se o bioma for savana e rio
                        if(bioma.nome.includes('savana' && 'rio')){
                            return true
                        } else {
                            return false
                        }
                    }
                })
            } else {
                //não sendo carnívoro precisa filtrar os biomas que não tem animais carnívoros
                possiveisBiomas = resultado.filter((bioma) => {
                    let ehCarnivoro = false
    
                    for (let i of bioma.animais){
                        if (this.getAnimalInfo(i).carnivoro){
                            ehCarnivoro = true
                            break
                        }
                    }
    
                    if (ehCarnivoro){
                        return false
                    } else {
                        return true
                    }
                })
            }
        }

        return this.removerBiomaRepetido(possiveisBiomas)
    }

    //gerar o resultado final dos biomas possíveis para cada animal e quantidade
    calcEspaco(biomas, animalInfo, qtd){

        let tamanhoAnimal = animalInfo.tamanho
        let especieAnimal = animalInfo.especie

        let resultado = biomas.filter((bioma) => {
            let espacoDisponivelBioma = bioma.espacoDisponivel
            let espacoOcupado = 0

            
            if(bioma.animais.length >= 1 && !bioma.animais.includes(especieAnimal)){
                espacoOcupado = tamanhoAnimal * qtd + 1
                if(espacoOcupado <= espacoDisponivelBioma){
                    return true
                } else {
                    return false
                }
            } else if(especieAnimal === 'MACACO' && bioma.animais.length === 0 && qtd === 1){
                return false
            } else {
                espacoOcupado = tamanhoAnimal * qtd
                if(espacoOcupado <= espacoDisponivelBioma){
                    return true
                } else {
                    return false
                }
            }
        })

        return resultado
    }

    //formatar a resposta
    formatarResposta(resultado, animalInfo, qtd){
        if(resultado.length === 0) {
            let erro = {
                erro: "Não há recinto viável"
            }
            return erro

        } else {
            let especieAnimal = animalInfo.especie
            let tamanhoAnimal = animalInfo.tamanho
    
            let resultadoOrdenado = resultado.sort((a,b) => a.num < b.num ? -1 : a.num > b.num ? 1 : 0)
    
            let listaResultadoFormatado = (resultado.length > 1 ? resultadoOrdenado : resultado).map((bioma) => {
                let espacoOcupado = 0
                let espacoLivre = 0
                let espacoTotal = bioma.espacoTotal
    
                if(bioma.animais.length >= 1 && !bioma.animais.includes(especieAnimal)){
                    espacoOcupado = tamanhoAnimal * qtd + 1
                } else {
                    espacoOcupado = tamanhoAnimal * qtd
                }
    
                espacoLivre = bioma.espacoDisponivel - espacoOcupado
    
                return `Recinto ${bioma.num} (espaço livre: ${espacoLivre} total: ${espacoTotal})`
            })
    
            let resultadoFormatado = {
                recintosViaveis: listaResultadoFormatado
            }
    
            return resultadoFormatado
        }
    }
}

export { RecintosZoo as RecintosZoo };