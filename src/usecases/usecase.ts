export interface Usecase<InputDto, UserDto, OutputDto>{
    execute(input: InputDto, user: UserDto): Promise<OutputDto>;
};
