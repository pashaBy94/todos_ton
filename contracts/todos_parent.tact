import "@stdlib/deploy";
import "@stdlib/ownable";
import "./messages";
import "./todos_child";

contract TodosParent with Deployable, Ownable {
    owner: Address;
    count: Int as uint256;
    init() {
        self.owner = sender();
        self.count = 0;
    }
    receive(msg: Todo){
        self.count = self.count + 1;
        let initChild: StateInit = initOf TodosChild(myAddress(), self.count);
        send(SendParameters{
            to: contractAddress(initChild),
            body: SetTodo{text: msg.text}.toCell(),
            mode: SendIgnoreErrors,
            value: ton("0.2"),
            code: initChild.code,
            data: initChild.data
        });
        self.reply(NewTodoResponse{numTodo: self.count}.toCell());
    }
    receive(msg: CompleteTodo){
        self.requireOwner();
        require(msg.number <= self.count,"Todo does not exist!");
        send(SendParameters{
            to: contractAddress(initOf TodosChild(myAddress(), msg.number)),
            value: 0,
            body: InternalCompleted{excess: sender()}.toCell(),
            mode: SendIgnoreErrors + SendRemainingValue
        });
    }
    get fun count(): Int{
        return self.count;
    }
    get fun todoAddress(numb: Int): Address{
        return contractAddress(initOf TodosChild(myAddress(), numb));
    }
}
