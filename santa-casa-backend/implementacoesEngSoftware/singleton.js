class Singleton {
    #instance;
    #total=0;
    constructor() {
      total=total+1;
    }

    static getInstance() {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}