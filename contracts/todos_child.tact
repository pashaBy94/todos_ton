import "@stdlib/deploy";
import "./messages";

struct TodoDetail{
    completed: Bool;
    numTodo: Int;
    task: String;
}
trait Parent{
    parent: Address;
    fun requiredParent(){
        require(sender() == self.parent,"Only parent");
    }
}

contract TodosChild with Deployable, Parent {
    parent: Address;
    numTodo: Int as uint256;
    completed: Bool = false;
    task: String = "";

    init(parent: Address, numTodo: Int) {
        self.parent = parent;
        self.numTodo = numTodo;
    }

    receive(msg: SetTodo){
        self.requiredParent();
        self.task = msg.text;
    }
    receive(msg: InternalCompleted){
        self.requiredParent();
        self.completed = true;
        send(SendParameters{
            to: msg.excess,
            value: 0,
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }
    get fun details(): TodoDetail{
        return TodoDetail{completed: self.completed, numTodo: self.numTodo, task: self.task};
    }
}
