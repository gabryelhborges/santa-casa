class Singleton {
    constructor() {
        if (!Singleton.instance) {
            // Se a instância única não existir, cria uma nova
            this._data = "Sou a instância única";
            Singleton.instance = this;
        }
        return Singleton.instance;
    }

    getData() {
        return this._data;
    }
}

class MinhaClasse extends Singleton {
    constructor() {
        super(); // Chama o construtor da classe pai (Singleton)
        // Você pode adicionar inicializações específicas da classe aqui, se necessário
    }
}

// Uso do singleton para MinhaClasse
const instance1 = new MinhaClasse();
const instance2 = new MinhaClasse();

console.log(instance1 === instance2); // Deve imprimir true, indicando que é a mesma instância
console.log(instance1.getData()); // Deve imprimir "Sou a instância única"
console.log(instance2.getData()); // Deve imprimir "Sou a instância única"