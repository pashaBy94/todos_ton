message SetTodo{
    text: String;
}

message Todo {
    text: String;
}
message NewTodoResponse{
    numTodo: Int;
}
message CompleteTodo{
    number: Int;
}
message InternalCompleted{
    excess: Address;
}