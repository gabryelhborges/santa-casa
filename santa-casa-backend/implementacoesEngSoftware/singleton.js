export default class Singleton {
    #instance;
    //#total=0;
    constructor() {
      //this.#total= this.#total+1;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}