class Programm{
    constructor(commands){
        this.commands = commands[0];
    }

    register_vars(dict){
        for (const command of this.commands) {
            command[0].register_vars(dict);
        }
        return dict;
    }

    run(dict){
        for (const command of this.commands) {
            command[0].run(dict);
        }
    }
}

class Identifier{
    constructor(identifier){
        this.identifier = identifier;
    }

    register_vars(dict){
        dict[this.identifier] = 0;
        return dict;
    }

    run(dict){
        return dict[this.identifier];
    }
}

class Number{
    constructor(value){
        this.value = value;
    }

    register_vars(dict){
        return dict;
    }

    run(dict){
        return parseFloat(this.value);
    }
}

class Binary{
    constructor(left, right){
        this.left = left;
        this.right = right;
    }

    register_vars(dict){
        this.left.register_vars(dict);
        this.right.register_vars(dict);
        return dict;
    }
}

class Assignment extends Binary{
    run(dict){
        dict[this.left.identifier] = this.right.run(dict);
    }
}

class Sum extends Binary{
    run(dict){
        return this.left.run(dict) + this.right.run(dict);
    }
}

class Sub extends Binary{
    run(dict){
        return this.left.run(dict) - this.right.run(dict);
    }
}

class Mul extends Binary{
    run(dict){
        return this.left.run(dict) * this.right.run(dict);
    }
}

class Div extends Binary{
    run(dict){
        return this.left.run(dict) / this.right.run(dict);
    }
}

module.exports = {
    Programm: Programm,
    Identifier: Identifier,
    Number: Number,
    Assignment: Assignment,
    Sum: Sum,
    Sub: Sub,
    Mul: Mul,
    Div: Div
}

